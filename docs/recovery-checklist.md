# Full Recovery Checklist

Use this checklist when recovering the platform after data loss, deployment failure, or infrastructure change.

## Prerequisites

- Access to GitHub repository: [MShubar/mybahrainstores](https://github.com/MShubar/mybahrainstores)
- Access to Convex dashboard
- Access to Vercel dashboard
- Latest database export (if restoring user data)

---

## Steps

- [ ] **1. Clone repository**

  ```bash
  git clone https://github.com/MShubar/mybahrainstores.git
  cd mybahrainstores
  ```

- [ ] **2. Install dependencies**

  ```bash
  pnpm install
  ```

- [ ] **3. Create Convex deployment**

  Create a new project/deployment in the [Convex dashboard](https://dashboard.convex.dev), or link locally:

  ```bash
  npx convex dev
  ```

- [ ] **4. Configure environment variables**

  See [env-template.md](./env-template.md). Minimum for production:

  - `FRONTEND_URL`
  - `TAP_SECRET_KEY`
  - `TAP_WEBHOOK_SECRET` (if used)
  - `OPENAI_API_KEY` (if used)

  Frontend (both Vercel projects):

  - `VITE_CONVEX_URL`

- [ ] **5. Deploy Convex**

  ```bash
  npx convex deploy
  ```

- [ ] **6. Run seeds**

  From Convex dashboard → Functions:

  1. `settings/mutations:seedDefaultSettings`
  2. `categories/mutations:seedDefaultCategories`

  Then create a user via signup and promote to backoffice:

  3. `users/mutations:promoteToBackoffice`

- [ ] **7. Restore database export**

  Import the latest monthly export (users, stores, products, orders, payments, settings) via Convex dashboard if recovering production data.

- [ ] **8. Deploy Vercel projects**

  Two projects from the same repo:

  | Project | Root Directory |
  |---------|----------------|
  | Website | `apps/website` |
  | Web app | `apps/web-app` |

  Build settings: Vite, `pnpm install` (from monorepo root), `pnpm build`, output `dist`.

- [ ] **9. Verify auth**

  - Sign up as customer
  - Sign up as store
  - Backoffice login works for promoted admin

- [ ] **10. Verify orders**

  - Browse stores and products
  - Place a test order
  - Store can update order status
  - Customer sees order tracking

- [ ] **11. Verify payments**

  - Mock payment completes (dev/staging)
  - Tap payment redirect works (production with `TAP_SECRET_KEY`)
  - Webhook endpoint responds (check Convex logs)

---

## Post-recovery

- [ ] Update `FRONTEND_URL` in Convex to match live web-app URL
- [ ] Confirm `mock_payments_enabled` is `false` in production settings
- [ ] Schedule next monthly data export
- [ ] Document incident and recovery time in backoffice audit notes
