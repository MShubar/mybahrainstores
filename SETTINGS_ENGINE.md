# Settings Engine

Platform configuration lives in the `settings` table. Defaults are defined in code (`convex/settings/defaults.ts`) and seeded into Convex.

## Default keys

| Key | Group | Public |
|-----|-------|--------|
| `currency` | general | yes |
| `tax_percentage` | payments | yes |
| `default_delivery_fee` | delivery | yes |
| `platform_commission_percentage` | payments | no |
| `order_statuses` | orders | yes |
| `payment_statuses` | payments | yes |
| `store_approval_required` | stores | no |
| `maintenance_mode` | system | yes |

## Convex API

| Function | Type | Description |
|----------|------|-------------|
| `settings/queries.getByKey` | query | Full setting row (falls back to defaults) |
| `settings/queries.getValueByKey` | query | Value only |
| `settings/queries.listPublic` | query | All public settings |
| `settings/queries.listAll` | query | Backoffice: all settings |
| `settings/mutations.seedDefaultSettings` | mutation | Insert defaults (idempotent) |
| `settings/mutations.updateByKey` | mutation | Backoffice update |

## Seed (first time)

Convex dashboard: **Functions** → `settings/mutations` → `seedDefaultSettings` → Run.

Or CLI:

```bash
npx convex run settings/mutations:seedDefaultSettings
```

## Rules

- Never hardcode fees, statuses, or feature flags in apps — read from settings
- Validate client input with `@my-bahrain/validators`
- Private settings require backoffice role
