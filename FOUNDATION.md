# Core foundation milestone

Build this **before** product features.

## Checklist

- [ ] Convex Auth wired (`convex/auth/`)
- [ ] Roles enforced (`customer`, `store`, `backoffice`) via `shared/permissions.ts`
- [x] Settings engine defaults + seed mutation (`convex/settings/`)
- [ ] Run seed: dashboard → `settings/mutations:seedDefaultSettings` (or CLI)
- [ ] Settings backoffice UI for `updateByKey`
- [ ] `@my-bahrain/types` used by website, web-app, mobile-app, and Convex
- [ ] `@my-bahrain/validators` used in forms and Convex handlers
- [ ] Protected routing in `apps/web-app` (role-based layouts)
- [ ] Design system baseline in `@my-bahrain/ui`

## Monorepo map (ignore nested `node_modules`)

```
apps/website | web-app | mobile-app
convex/      → auth, users, stores, categories, products, orders, payments, analytics, settings, shared
packages/    → config, types, validators, utils, ui
```

## Turborepo

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```
