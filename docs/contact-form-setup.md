# Contact Form Setup

RTPWorks sends contact requests to the same Vercel deployment through `POST /api/contact`.

The serverless function validates each request, writes it to the Feishu `Conversations` table, and then sends an internal Feishu notification. Website visitors never interact with Feishu.

## Vercel Environment Variables

Configure these as server-only Production and Preview variables:

```text
FEISHU_APP_ID
FEISHU_APP_SECRET
FEISHU_BASE_APP_TOKEN
FEISHU_CONVERSATIONS_TABLE_ID
FEISHU_OWNER_OPEN_ID
```

Do not prefix them with `VITE_`. Variables with that prefix are bundled into browser code.

After changing variables, redeploy the project. Vercel environment changes do not affect earlier deployments.

## Failure Semantics

- A request succeeds only after the lead is stored in Feishu.
- Notification failure is logged but does not discard a stored lead.
- Invalid, oversized, too-fast, expired, and consent-free submissions are rejected.
- Honeypot submissions receive a generic success response but are not stored.

## Verification

```bash
npm run test
npm run lint
npm run build
```

Production verification must confirm both the browser success state and a new record in Feishu Conversations.
