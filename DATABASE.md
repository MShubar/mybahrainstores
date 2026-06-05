# Database

Schema is defined in `convex/schema.ts` and deployed with Convex.

## Tables

| Table | Purpose |
|-------|---------|
| `users` | Accounts with role (`customer`, `store`, `backoffice`) |
| `stores` | Merchant storefronts |
| `categories` | Product categories (platform or per-store) |
| `products` | Catalog items |
| `orders` | Customer orders |
| `payments` | Payment records (Polar / provider refs) |
| `settings` | Dynamic configuration (platform + per-store) |

All documents include `createdAt` and `updatedAt` timestamps.

## Indexes

- `users.by_email`
- `stores.by_slug`, `stores.by_owner`
- `categories.by_slug`
- `products.by_store`, `products.by_slug`
- `orders.by_customer`, `orders.by_store`
- `payments.by_order`
- `settings.by_key`, `settings.by_key_scope`

## Status and enums

Order status, store status, and feature flags are **not** hardcoded in schema strings long-term — values are validated against entries in the `settings` table at runtime.
