/// <reference types="node" />

type ContactPayload = {
  submissionId: string
  startedAt: number
  website?: string
  name: string
  email: string
  company: string
  role: string
  market: string
  need: string
  support: string
  timeline: string
  stage: string
  consent: boolean
}

type ContactEnv = {
  FEISHU_APP_ID?: string
  FEISHU_APP_SECRET?: string
  FEISHU_BASE_APP_TOKEN?: string
  FEISHU_CONVERSATIONS_TABLE_ID?: string
  FEISHU_OWNER_OPEN_ID?: string
}

const MAX_BODY_BYTES = 20_000
const MAX_AGE_MS = 24 * 60 * 60 * 1000
const MIN_COMPLETION_MS = 2_000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const limits: Record<string, number> = {
  name: 120, email: 254, company: 160, role: 120, market: 160,
  need: 4_000, support: 120, timeline: 120, stage: 160,
}

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function parsePayload(value: unknown): ContactPayload | null {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  return {
    submissionId: clean(input.submissionId),
    startedAt: Number(input.startedAt),
    website: clean(input.website),
    name: clean(input.name),
    email: clean(input.email).toLowerCase(),
    company: clean(input.company),
    role: clean(input.role),
    market: clean(input.market),
    need: clean(input.need),
    support: clean(input.support),
    timeline: clean(input.timeline),
    stage: clean(input.stage),
    consent: input.consent === true,
  }
}

function validate(payload: ContactPayload, now: number) {
  if (payload.website) return 'bot'
  if (!UUID_PATTERN.test(payload.submissionId)) return 'Invalid submission identifier.'
  if (!Number.isFinite(payload.startedAt) || now - payload.startedAt < MIN_COMPLETION_MS || now - payload.startedAt > MAX_AGE_MS) {
    return 'Please reload the page and try again.'
  }
  for (const [field, max] of Object.entries(limits)) {
    const value = payload[field as keyof ContactPayload]
    if (typeof value !== 'string' || !value || value.length > max) return `Invalid ${field}.`
  }
  if (!EMAIL_PATTERN.test(payload.email)) return 'Invalid email.'
  if (!payload.consent) return 'Consent is required.'
  return null
}

async function feishuRequest(fetcher: typeof fetch, path: string, init: RequestInit) {
  const response = await fetcher(`https://open.feishu.cn/open-apis/${path}`, init)
  const result = await response.json() as { code?: number; msg?: string; tenant_access_token?: string }
  if (!response.ok || result.code !== 0) {
    throw new Error(`Feishu request failed: ${result.code ?? response.status} ${result.msg ?? response.statusText}`)
  }
  return result
}

export async function handleContact(
  request: Request,
  env: ContactEnv = process.env,
  fetcher: typeof fetch = fetch,
  now = Date.now(),
) {
  if (request.method !== 'POST') return json(405, { success: false, message: 'Method not allowed.' })
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
    return json(413, { success: false, message: 'Request is too large.' })
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json(415, { success: false, message: 'JSON is required.' })
  }

  let payload: ContactPayload | null
  try {
    payload = parsePayload(await request.json())
  } catch {
    return json(400, { success: false, message: 'Invalid request.' })
  }
  if (!payload) return json(400, { success: false, message: 'Invalid request.' })
  const validationError = validate(payload, now)
  if (validationError === 'bot') return json(200, { success: true })
  if (validationError) return json(400, { success: false, message: validationError })

  const requiredEnv = ['FEISHU_APP_ID', 'FEISHU_APP_SECRET', 'FEISHU_BASE_APP_TOKEN', 'FEISHU_CONVERSATIONS_TABLE_ID'] as const
  if (requiredEnv.some((key) => !env[key])) {
    console.error('Contact endpoint is missing required Feishu configuration')
    return json(503, { success: false, message: 'Contact service is temporarily unavailable.' })
  }

  try {
    const tokenResult = await feishuRequest(fetcher, 'auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ app_id: env.FEISHU_APP_ID, app_secret: env.FEISHU_APP_SECRET }),
    })
    const token = tokenResult.tenant_access_token as string
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' }
    const messageSummary = `${payload.support} | ${payload.timeline} | ${payload.stage}\n${payload.need}`

    await feishuRequest(fetcher, `bitable/v1/apps/${env.FEISHU_BASE_APP_TOKEN}/tables/${env.FEISHU_CONVERSATIONS_TABLE_ID}/records?client_token=${payload.submissionId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fields: {
        'Conversation ID': `web_${payload.submissionId}`,
        'Contact ID': payload.email,
        Company: payload.company,
        Channel: 'website_form',
        Address: `${payload.name} <${payload.email}> | ${payload.role} | ${payload.market}`,
        Stage: 'new_inquiry',
        Status: 'new',
        Direction: 'inbound',
        'Message Summary': messageSummary.slice(0, 9_000),
        Qualification: 'pending_agent_review',
        Compliance: 'pending_review',
        'Human Required': 'no',
        'Updated At': new Date(now).toISOString(),
      } }),
    })

    if (env.FEISHU_OWNER_OPEN_ID) {
      try {
        await feishuRequest(fetcher, 'im/v1/messages?receive_id_type=open_id', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            receive_id: env.FEISHU_OWNER_OPEN_ID,
            msg_type: 'text',
            uuid: payload.submissionId,
            content: JSON.stringify({ text: `RTPWorks 新官网咨询\n${payload.company} · ${payload.name} · ${payload.role}\n${payload.support} · ${payload.timeline}\n市场：${payload.market}\n\n${payload.need.slice(0, 1200)}` }),
          }),
        })
      } catch (error) {
        console.error('Lead saved but Feishu notification failed', error)
      }
    }
    return json(200, { success: true })
  } catch (error) {
    console.error('Contact submission failed', error)
    return json(502, { success: false, message: 'We could not save your request. Please use Telegram or email.' })
  }
}

export default {
  fetch(request: Request) {
    return handleContact(request)
  },
}
