# Convex Recovery

## Production

1. Create a new Convex deployment
2. Restore environment variables (see [env-template.md](./env-template.md))
3. Deploy the latest code from GitHub

```bash
pnpm install
npx convex deploy
```

4. Run seed mutations from the Convex dashboard:
   - `settings/mutations:seedDefaultSettings`
   - `categories/mutations:seedDefaultCategories`
5. Restore a database export (if available)
6. Redeploy Vercel projects (see [recovery-checklist.md](./recovery-checklist.md))

## Environment Variables

Required for production:

| Variable | Purpose |
|----------|---------|
| `FRONTEND_URL` | Web app URL for payment redirects and auth callbacks |
| `TAP_SECRET_KEY` | Tap Payments API secret |
| `TAP_WEBHOOK_SECRET` | Tap webhook signature verification (if configured) |
| `OPENAI_API_KEY` | OpenAI integrations (when enabled) |

Set via Convex dashboard or CLI:

```bash
npx convex env set FRONTEND_URL https://your-web-app.vercel.app
npx convex env set TAP_SECRET_KEY <value>
npx convex env set TAP_WEBHOOK_SECRET <value>
npx convex env set OPENAI_API_KEY <value>
```

Never commit real secret values. Document names only.

## Seed Data Recovery

Platform defaults are defined in code and can be recreated on a fresh deployment:

| Data | Source | Seed mutation |
|------|--------|---------------|
| Settings | `convex/settings/defaults.ts` | `seedDefaultSettings` |
| Categories | `convex/categories/defaults.ts` | `seedDefaultCategories` |
| Backoffice user | Manual | Sign up, then run `users/mutations:promoteToBackoffice` |

### Recovery test

```
new Convex deployment
  → run seedDefaultSettings
  → run seedDefaultCategories
  → promote first admin user to backoffice
  → app works
```

If this flow succeeds, baseline recovery is good. User-generated data (stores, products, orders) requires a database export.

## Export Strategy

Before launch, schedule **monthly** Convex data exports for:

- Users
- Stores
- Products
- Orders
- Payments
- Settings

Store exports in one secure location:

- Google Drive
- Dropbox
- AWS S3

Any one provider is fine. Encrypt exports at rest and restrict access to backoffice operators only.

### Export command

Use the Convex dashboard **Export** feature, or CLI when available for your deployment tier.

Label each export with date and environment (`dev`, `staging`, `production`).

## Source Code Backup

All application code lives in GitHub:

**Repository:** [github.com/MShubar/mybahrainstores](https://github.com/MShubar/mybahrainstores)

This protects:

- React apps (`apps/website`, `apps/web-app`)
- Convex backend (`convex/`)
- Schemas, settings defaults, types, and validators

Keep `main` deployable. Push after every meaningful change:

```bash
git add .
git commit -m "Describe the change"
git push
```
