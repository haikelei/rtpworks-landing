# Email Form Setup

RTPWorks uses Web3Forms for the landing page contact form.

## Why Web3Forms

- Works with static frontend sites.
- No custom backend is required.
- Sends submissions to your email.
- The free plan is enough for early validation.

## Setup Steps

1. Go to `https://web3forms.com/`.
2. Create an access key using `lujialei08@gmail.com`.
3. Create `.env.local` in the project root.
4. Add:

```bash
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

5. Restart the Vite dev server.
6. Submit the form and confirm the email arrives.

## Current Behavior

- If `VITE_WEB3FORMS_ACCESS_KEY` exists, the form sends to Web3Forms.
- If the key is missing, the form stays in local preview mode and shows a setup message.
- The implementation follows Web3Forms' React example: `fetch("https://api.web3forms.com/submit", { method: "POST", body: formData })`.

## Local Testing Note

Automated local tests from Node.js or headless browsers may be blocked by Web3Forms / Cloudflare CORS checks.

If local automated testing shows a CORS error, verify again from a normal browser and from the deployed production domain.

Successful production behavior:

- User submits the form.
- The page shows the success message.
- `lujialei08@gmail.com` receives an email from Web3Forms.

## Production Note

The Web3Forms access key is used in frontend code. This is normal for this service, but it means the key should be treated as a form endpoint key, not as a private backend secret.

For higher-volume production, consider replacing this with a backend API using Resend, SendGrid, or Mailgun.
