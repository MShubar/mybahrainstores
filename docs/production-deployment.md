# Production Deployment (Step 64)

Deploy in this order:

1. GitHub
2. Convex production
3. Website on Vercel
4. Web-app on Vercel
5. Final smoke test

---

## 64A. Commit & push

```bash
git status
git add .
git commit -m "Prepare MVP for production deployment"
git push
```

---

## 64B. Convex production

```bash
npx convex deploy
```

Copy the **production** deployment URL for Vercel:

```
VITE_CONVEX_URL=https://your-prod.convex.cloud
```

Run seeds on production (Convex dashboard → Functions):

1. `settings/mutations:seedDefaultSettings`
2. `categories/mutations:seedDefaultCategories`
3. Promote first admin via `users/mutations:promoteToBackoffice`

---

## 64C. Convex production env vars

```bash
npx convex env set FRONTEND_URL https://your-web-app.vercel.app
# npx convex env set OPENAI_API_KEY your_key_later   # when AI is enabled
# Skip TAP_SECRET_KEY until CR approval
```

**Payments (production):** In backoffice settings, set `mock_payments_enabled` to `false` unless this is a private demo only.

---

## 64D. Website — Vercel project #1

| Setting | Value |
|---------|-------|
| Root Directory | `apps/website` |
| Framework | Vite |
| Install Command | `cd ../.. && pnpm install` |
| Build Command | `pnpm build` |
| Output Directory | `dist` |

**Environment variables:**

| Name | Value |
|------|-------|
| `VITE_CONVEX_URL` | `https://your-prod.convex.cloud` |
| `VITE_WEB_APP_URL` | `https://your-web-app.vercel.app` |

> Note: The codebase uses `VITE_WEB_APP_URL` (not `VITE_APP_URL`) for login/signup links.

---

## 64E. Web-app — Vercel project #2

| Setting | Value |
|---------|-------|
| Root Directory | `apps/web-app` |
| Framework | Vite |
| Install Command | `cd ../.. && pnpm install` |
| Build Command | `pnpm build` |
| Output Directory | `dist` |

**Environment variables:**

| Name | Value |
|------|-------|
| `VITE_CONVEX_URL` | `https://your-prod.convex.cloud` |

After both Vercel URLs are live, update Convex:

```bash
npx convex env set FRONTEND_URL https://your-actual-web-app.vercel.app
```

Update website `VITE_WEB_APP_URL` to match the live web-app URL, then redeploy website.

---

## 64F. Production smoke test

- [ ] Website loads
- [ ] Signup works
- [ ] Login works
- [ ] Backoffice works
- [ ] Categories load
- [ ] Stores load
- [ ] Products load
- [ ] Cart works
- [ ] Checkout creates order
- [ ] Mock payment disabled/enabled as intended
- [ ] Orders visible to customer / store / backoffice

---

## Post-deploy checklist

- [ ] Replace `yourdomain.com` in `apps/website/public/robots.txt` and `sitemap.xml`
- [ ] `mock_payments_enabled = false` for real launch
- [ ] Monthly Convex export scheduled (see `docs/disaster-recovery.md`)
