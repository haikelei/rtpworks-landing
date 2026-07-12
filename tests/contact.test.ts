import { describe, expect, it, vi } from 'vitest'
import { handleContact } from '../api/contact.js'

const env = {
  FEISHU_APP_ID: 'app-id', FEISHU_APP_SECRET: 'secret', FEISHU_BASE_APP_TOKEN: 'base-token',
  FEISHU_CONVERSATIONS_TABLE_ID: 'table-id', FEISHU_OWNER_OPEN_ID: 'owner-id',
}
const now = Date.parse('2026-07-12T08:00:00Z')
const validPayload = {
  submissionId: '3bbcee0e-bc62-4cb6-9d40-139acb151f30', startedAt: now - 5_000, website: '',
  name: 'Alex Smith', email: 'alex@example.com', company: 'Example Studio', role: 'Founder', market: 'UK',
  need: 'We need help preparing an integration-ready slot build.', support: 'RGS/API integration',
  timeline: '2-4 weeks', stage: 'Existing code or prototype', consent: true,
}

function request(payload = validPayload) {
  return new Request('https://rtpworks.com/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
}

describe('contact endpoint', () => {
  it('rejects invalid submissions before calling Feishu', async () => {
    const fetcher = vi.fn()
    const response = await handleContact(request({ ...validPayload, email: 'invalid' }), env, fetcher, now)
    expect(response.status).toBe(400)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('silently accepts honeypot submissions', async () => {
    const fetcher = vi.fn()
    const response = await handleContact(request({ ...validPayload, website: 'spam.example' }), env, fetcher, now)
    expect(response.status).toBe(200)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('stores the lead before sending the notification', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(Response.json({ code: 0, tenant_access_token: 'tenant-token' }))
      .mockResolvedValueOnce(Response.json({ code: 0, data: { record: { record_id: 'record-1' } } }))
      .mockResolvedValueOnce(Response.json({ code: 0, data: { message_id: 'message-1' } }))
    const response = await handleContact(request(), env, fetcher, now)
    expect(response.status).toBe(200)
    expect(fetcher).toHaveBeenCalledTimes(3)
    expect(String(fetcher.mock.calls[1][0])).toContain('/records?client_token=')
    expect(JSON.parse(fetcher.mock.calls[1][1]?.body as string).fields.Company).toBe('Example Studio')
  })

  it('keeps success when a stored lead notification fails', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(Response.json({ code: 0, tenant_access_token: 'tenant-token' }))
      .mockResolvedValueOnce(Response.json({ code: 0 }))
      .mockResolvedValueOnce(Response.json({ code: 999, msg: 'notification failed' }))
    const response = await handleContact(request(), env, fetcher, now)
    expect(response.status).toBe(200)
  })
})
