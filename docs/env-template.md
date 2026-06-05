# Environment Variables

Document every environment variable used by the platform.  
**Never commit real secrets.** Only variable names and descriptions belong in this file.

---

## Web App (`apps/web-app`)

Set in Vercel project settings or `apps/web-app/.env.local` for local dev.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CONVEX_URL` | Yes | Convex deployment URL (e.g. `https://your-deployment.convex.cloud`) |

---

## Website (`apps/website`)

Set in Vercel project settings or `apps/website/.env.local` for local dev.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CONVEX_URL` | Yes | Convex deployment URL |
| `VITE_WEB_APP_URL` | Yes | Web app URL for login/signup links |

---

## Backend (Convex)

Set in the Convex dashboard or via `npx convex env set`.

| Variable | Required | Description |
|----------|----------|-------------|
| `FRONTEND_URL` | Yes (prod) | Public web-app URL for redirects and callbacks |
| `TAP_SECRET_KEY` | Yes (Tap payments) | Tap Payments API secret key |
| `TAP_WEBHOOK_SECRET` | Optional | Additional Tap webhook verification secret |
| `OPENAI_API_KEY` | Optional | OpenAI API key for AI features |

### Convex-managed (do not set manually)

These are provided automatically by Convex:

| Variable | Description |
|----------|-------------|
| `CONVEX_DEPLOYMENT` | Active deployment name |
| `CONVEX_URL` | Convex HTTP API URL |
| `CONVEX_SITE_URL` | Convex site / auth domain |

---

## Vercel (production deploys, later)

| Variable | Required | Description |
|----------|----------|-------------|
| `CONVEX_DEPLOY_KEY` | Prod only | Deploy key for Convex production deploys via Vercel |

---

## Local development template

Copy root `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Per-app examples:

- `apps/web-app/.env.example`
- `apps/website/.env.example`

---

## Security rules

1. Never commit `.env`, `.env.local`, or `.env.production`
2. Never paste secrets into GitHub, Vercel comments, or chat
3. Rotate keys immediately if a secret is exposed
4. Use separate Convex deployments for dev and production
