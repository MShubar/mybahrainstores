# Bug Fix Sprint

**Sprint rule:** No new features — only fixes exposed by QA ([qa-checklist.md](./qa-checklist.md)).

**Fix order:** 1 Auth/security → 2 Orders/payments → 3 Data loss → 4 Build/types → 5 Routes → 6 UI

## Build verification (63B)

| Command | Result | Date |
|---------|--------|------|
| `npx convex codegen` | ✅ Pass | Sprint start |
| `pnpm build` | ✅ Pass | Sprint start |
| `pnpm --filter @my-bahrain/web-app build` | ✅ Pass | Sprint start |
| `pnpm --filter @my-bahrain/website build` | ✅ Pass | Sprint start |
| `pnpm --filter @my-bahrain/mobile-app build` | ✅ Pass | Sprint start |

---

## Critical

| ID | Bug | Area | Status | Notes |
|----|-----|------|--------|-------|
| C-01 | Web `/login` renders stub instead of real login form | Auth | Fixed | Wired `LoginPage` in `app.tsx` |
| C-02 | Login does not redirect by role after sign-in | Auth | Fixed | Redirect customer/store/backoffice |
| C-03 | In-app notifications never created on order events | Orders | Fixed | `createNotification` on create + status update |

## High

| ID | Bug | Area | Status | Notes |
|----|-----|------|--------|-------|
| H-01 | `/backoffice/users` nav link leads to 404 | Routes | Fixed | Route + users page added |
| H-02 | Backoffice cannot view products list | Routes | Fixed | `/backoffice/products` page added |
| H-03 | Website login/signup links hardcoded to `localhost:5173` | Website | Fixed | Uses `VITE_WEB_APP_URL` env |

## Medium

| ID | Bug | Area | Status | Notes |
|----|-----|------|--------|-------|
| M-01 | Store approved — no in-app notification to owner | Notifications | Fixed | Notification on `approveStore` |
| M-02 | Login page missing error feedback | Auth UI | Fixed | Error state on failed login |
| M-03 | `signup.tsx` debug `console.log` in production path | Web | Fixed | Removed |

## Low

| ID | Bug | Area | Status | Notes |
|----|-----|------|--------|-------|
| L-01 | `robots.txt` / `sitemap.xml` use placeholder `yourdomain.com` | SEO | Open | Set at deploy time |
| L-02 | Mobile customer: no checkout / order history | Mobile | Open | Out of MVP scope — document in QA |
| L-03 | Uncommitted mobile + push changes not on GitHub | Ops | Open | Commit after sprint verification |

---

## Fix log

| ID | Commit / files | Verified |
|----|----------------|----------|
| C-01 | `app.tsx`, `login.tsx` | ☐ Manual Phase 1 |
| C-02 | `login.tsx` | ☐ Manual Phase 1 |
| C-03 | `orders/mutations.ts` | ☐ Manual Phase 11 |
| H-01 | `backoffice-users-page.tsx`, `users/queries.ts`, `app.tsx` | ☐ Manual Phase 1 backoffice |
| H-02 | `backoffice-products-page.tsx`, `app.tsx` | ☐ Manual 61D |
| H-03 | `web-app-url.ts`, website pages | ☐ Manual Phase 14 |
| M-01 | `stores/mutations.ts` | ☐ Manual Phase 11 |
| M-02 | `login.tsx` | ☐ Manual Phase 1 |
| M-03 | `signup.tsx` | ☐ |

---

## 63D — Exit criteria

Move to the next milestone **only when every row below is green**.

| Criterion | Target | Status | Verified |
|-----------|--------|--------|----------|
| Critical bugs open | **0** | ✅ 0 open (C-01–C-03 fixed) | Tracker |
| High bugs open | **0** | ✅ 0 open (H-01–H-03 fixed) | Tracker |
| Build errors | **0** | ✅ `pnpm build` + per-app builds pass | Automated |
| Convex errors | **0** | ✅ `npx convex codegen` + `convex dev` healthy | Automated |
| Auth flow | **Passing** | ⚠️ Code fixed — run smoke test below | Manual |
| Order flow | **Passing** | ⚠️ Code fixed — run smoke test below | Manual |

### Sprint exit: **CONDITIONAL PASS**

Automated gates are clear. Complete the **5-minute smoke test** below, then mark Auth + Order as passing.

### Auth smoke test (~2 min)

1. Open http://localhost:5173/signup → create **customer** account → lands on `/customer`
2. Logout → `/login` → sign in → lands on `/customer`
3. Refresh page → still authenticated
4. Visit `/backoffice` as customer → `/unauthorized`

### Order smoke test (~3 min)

1. As customer: browse store → add to cart → checkout → place order
2. Order appears in `/customer/orders`
3. As store: order in `/store/orders` → move status → customer sees update
4. Pay with mock (if enabled) → `paymentStatus` = paid
5. Check `/notifications` for order + status entries

### When all smoke tests pass

Update this table:

| Auth flow | **Passing** | ✅ | Manual smoke |
| Order flow | **Passing** | ✅ | Manual smoke |

Then commit sprint changes and push to GitHub (closes L-03).
