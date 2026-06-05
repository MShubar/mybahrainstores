# Full QA Checklist

Systematic manual testing for the My Bahrain / RandomStores platform.  
**Do not add new features during QA** — test, record results, fix bugs, retest.

---

## How to use this document

1. Test in order (Phase 1 → Phase 16).
2. Mark each item: `☐` not tested · `✅` pass · `❌` fail · `⚠️` partial / blocked
3. Record failures in the **Issue log** at the bottom (steps, expected, actual, screenshot).
4. Retest after fixes before sign-off.

### Test environments

| App | Local command | URL |
|-----|---------------|-----|
| Web app | `pnpm --filter @my-bahrain/web-app dev` | http://localhost:5173 |
| Website | `pnpm --filter @my-bahrain/website dev` | http://localhost:3000 |
| Mobile | `pnpm --filter @my-bahrain/mobile-app dev` | Expo Go (physical device) |
| Convex | `npx convex dev` | Dashboard → Functions / Data |

### Test accounts (create fresh for each run)

| Role | Email pattern | Notes |
|------|---------------|-------|
| Customer | `customer-qa-{date}@test.com` | Signup via `/signup` |
| Store A | `store-a-qa-{date}@test.com` | Signup as store |
| Store B | `store-b-qa-{date}@test.com` | Second store for ownership tests |
| Backoffice | Promote via Convex `users/mutations:promoteToBackoffice` | No public signup |

### Pre-flight (run before Phase 1)

```bash
pnpm install
npx convex dev          # separate terminal
pnpm --filter @my-bahrain/web-app dev
```

- [ ] Convex `seedDefaultSettings` run once
- [ ] Convex `seedDefaultCategories` run once
- [ ] At least one backoffice user promoted

### Known blockers (verify before starting)

Fix these first if still open — they block multiple phases:

| Issue | Affects |
|-------|---------|
| Web `/login` stub in `app.tsx` (not wired to `LoginPage`) | Phases 1, 2, 4–12 |
| `/backoffice/users` route missing | Backoffice QA |
| Website links hardcoded to `localhost:5173` | Phase 14 |
| In-app `notifications` not created on order events | Phase 11 |
| Mobile: no checkout / order history | Phase 15 customer (partial) |

---

## Phase 1 — Authentication

### Customer

- [ ] Signup with valid email
- [ ] Signup with invalid email
- [ ] Signup with duplicate email
- [ ] Login
- [ ] Logout
- [ ] Refresh page
- [ ] Session persists
- [ ] Password validation works

**Where:** Web `/signup`, `/login` · Mobile `/signup`, `/login`

### Store

- [ ] Signup as store
- [ ] Login as store
- [ ] Logout
- [ ] Session persists

### Backoffice

- [ ] Login
- [ ] Logout
- [ ] Session persists

---

## Phase 2 — Authorization

### Customer

Attempt while logged in as customer:

- [ ] `/store/*` → Access denied (`/unauthorized`)
- [ ] `/backoffice/*` → Access denied

### Store

Attempt while logged in as store:

- [ ] `/backoffice/*` → Access denied

### Store ownership

Create **Store A** (Store A owner) and **Store B** (Store B owner).

Verify Store A **cannot**:

- [ ] Edit Store B profile
- [ ] Edit Store B products
- [ ] View Store B orders

**How:** Use Convex dashboard or API to confirm mutations throw permission errors if UI blocks access.

---

## Phase 3 — Categories

**Actor:** Backoffice

- [ ] Create category
- [ ] Edit category
- [ ] Disable category
- [ ] Category appears publicly (website + web customer home)
- [ ] Disabled category disappears publicly

**Where:** `/backoffice/categories` · Public: website `/categories`, web `/customer`

---

## Phase 4 — Stores

**Actor:** Store owner + Backoffice

- [ ] Create store profile
- [ ] Upload logo
- [ ] Upload cover
- [ ] Edit store
- [ ] Submit for approval (if `store_approval_required` is true)
- [ ] Approve store (backoffice)
- [ ] Reject store (backoffice)
- [ ] Approved store visible publicly
- [ ] Rejected store hidden publicly

**Where:** Web `/store` · Backoffice `/backoffice/stores` · Public website store pages

---

## Phase 5 — Products

**Actor:** Store owner

- [ ] Create product
- [ ] Upload image
- [ ] Edit product
- [ ] Disable product (`isAvailable` / `isActive`)
- [ ] Enable product
- [ ] Product appears publicly
- [ ] Disabled product hidden publicly

**Where:** Web `/store/products` · Customer browse `/customer/stores/:id`

---

## Phase 6 — Customer Shopping

**Actor:** Customer (web)

- [ ] Browse categories
- [ ] Browse stores
- [ ] Browse products
- [ ] Search stores (website `/search`)
- [ ] Search products (website `/search`)

---

## Phase 7 — Cart

**Actor:** Customer (web)

- [ ] Add item
- [ ] Add same item twice (quantity increments)
- [ ] Increase quantity
- [ ] Decrease quantity
- [ ] Remove item
- [ ] Clear cart
- [ ] Refresh page — cart persists (in-memory; expect empty after refresh unless persisted)
- [ ] Cart behaves correctly (single-store constraint at checkout)

**Where:** `/customer/cart`

**Note:** Web cart is React context (session-only). Document actual behavior on refresh.

---

## Phase 8 — Orders

**Actor:** Customer + Store + Backoffice

- [ ] Checkout (`/customer/checkout`)
- [ ] Order created
- [ ] Order visible to customer (`/customer/orders`)
- [ ] Order visible to store (`/store/orders`)
- [ ] Order visible to backoffice (`/backoffice/orders`)

---

## Phase 9 — Order Status Flow

**Actor:** Store owner updates status; customer observes.

Test sequence:

```
pending → confirmed → preparing → out_for_delivery → delivered
```

Verify:

- [ ] Customer sees updates (order details + tracking timeline)
- [ ] Store sees updates (`/store/orders`)
- [ ] Notifications created (in-app + push if mobile token registered)

**Where:** Store `/store/orders` · Customer `/customer/orders/:id`

---

## Phase 10 — Payments (Mock)

**Prerequisite:** `mock_payments_enabled = true` in settings.

- [ ] Pay order (Pay Now on order details)
- [ ] Payment record created (`payments` table)
- [ ] Order `paymentStatus` updated to `paid`
- [ ] Revenue dashboard updated (store + backoffice)

**Where:** `/customer/orders/:orderId`

---

## Phase 11 — Notifications

### In-app (`notifications` table + `/notifications`)

- [ ] Order created notification
- [ ] Store approved notification
- [ ] Order confirmed notification
- [ ] Order delivered notification
- [ ] Mark notification read

### Push (mobile, physical device)

- [ ] Push token registered (`pushTokens` table)
- [ ] Push on new order (store owner)
- [ ] Push on status update (customer)

**Note:** In-app notifications require `createNotification` wired to events. Push is wired via `pushNotifications/actions.notifyUser`.

---

## Phase 12 — Analytics

Trigger these events during testing, then check `/backoffice/analytics`:

| Event | How to trigger |
|-------|----------------|
| `signup_completed` | Customer/store signup |
| `store_created` | Create store profile |
| `product_created` | Create product |
| `order_created` | Place order |
| `store_viewed` | Open store as customer |
| `product_viewed` | Open product listing |

- [ ] Analytics page shows counts for triggered events

---

## Phase 13 — File Uploads

**Actor:** Store owner (web)

- [ ] JPG upload
- [ ] PNG upload
- [ ] Large image >5MB blocked (frontend + backend)
- [ ] Non-image blocked
- [ ] Store logo upload
- [ ] Cover upload
- [ ] Product image upload

**Where:** Store dashboard + products pages (`ImageUploadField`)

---

## Phase 14 — Public Website

### Pages

- [ ] Homepage `/`
- [ ] Categories `/categories`
- [ ] Stores `/stores`
- [ ] Category detail `/categories/:id`
- [ ] Store detail `/stores/:id`
- [ ] Search `/search`

### Browsers

Test each critical page on:

- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

### SEO / crawl

- [ ] Page `<title>` and meta description set (`SEO` component)
- [ ] `/robots.txt` loads
- [ ] `/sitemap.xml` loads
- [ ] Login/signup links point to correct web-app URL (not hardcoded localhost in prod)

---

## Phase 15 — Mobile App

**Prerequisite:** Physical device + Expo Go + `EXPO_PUBLIC_CONVEX_URL` in `.env`

### Customer

- [ ] Login
- [ ] Signup
- [ ] Browse categories
- [ ] Browse stores
- [ ] Browse products
- [ ] Add to cart
- [ ] View cart

**Not in mobile MVP:** checkout, order history, order tracking (test on web).

### Store

- [ ] Login
- [ ] View dashboard
- [ ] View products (read-only)
- [ ] View orders
- [ ] Update order status

### Push

- [ ] Notification permission granted
- [ ] Token saved in Convex
- [ ] Notification received on order event

---

## Phase 16 — Performance & Build

### Runtime (manual during all phases)

- [ ] No React console errors (web + mobile)
- [ ] No Convex errors in dashboard logs
- [ ] No unhandled promise rejections

### Automated (run at end)

```bash
pnpm --filter @my-bahrain/website build
pnpm --filter @my-bahrain/web-app build
pnpm --filter @my-bahrain/mobile-app build
```

| Check | Command | Last run |
|-------|---------|----------|
| Website build | `pnpm --filter @my-bahrain/website build` | ✅ Pass |
| Web-app build | `pnpm --filter @my-bahrain/web-app build` | ✅ Pass |
| Mobile build | `pnpm --filter @my-bahrain/mobile-app build` | ✅ Pass |
| Website typecheck | `pnpm --filter @my-bahrain/website typecheck` | ✅ Pass |
| Web-app typecheck | `pnpm --filter @my-bahrain/web-app typecheck` | ✅ Pass |
| Mobile typecheck | `pnpm --filter @my-bahrain/mobile-app typecheck` | ✅ Pass |

- [ ] No TypeScript errors
- [ ] No Vite build errors (website, web-app)
- [ ] No Expo/tsc build errors (mobile-app)

---

## Issue log

| # | Phase | Item | Steps | Expected | Actual | Status |
|---|-------|------|-------|----------|--------|--------|
| 1 | | | | | | |
| 2 | | | | | | |

---

## Sign-off

| Role | Name | Date | Result |
|------|------|------|--------|
| QA | | | ☐ Pass · ☐ Fail |
| Dev | | | Blockers resolved |
| Product | | | MVP approved |

**Minimum for MVP sign-off:** Phases 1–10 pass on web; Phase 14 pass on website; Phase 15 store flow pass on mobile; Phase 16 automated checks pass; no P0 issues open.
