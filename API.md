# API

The platform API is implemented as **Convex queries and mutations** in `convex/`.

## Organization

```
convex/
├── schema.ts
├── shared/             # permissions, helpers
├── auth/
├── users/
├── stores/
├── categories/
├── products/
├── orders/
├── payments/
├── analytics/
└── settings/
```

Each domain module contains: `queries.ts`, `mutations.ts`, `helpers.ts`, `validators.ts`, `permissions.ts`.

## Conventions

- One folder per domain (`settings`, `orders`, …)
- Separate `queries.ts` and `mutations.ts` per domain
- Validate all inputs with `convex/values`
- Centralize permission checks in shared helpers

## Client usage

Web and mobile apps call Convex via the generated client:

```ts
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
```

Set `VITE_CONVEX_URL` (web) or Expo env for the deployment URL.

## Settings API

- `settings.queries.getByKey` — read a platform or store-scoped setting by key

See `SETTINGS_ENGINE.md` for configuration keys and behavior.
