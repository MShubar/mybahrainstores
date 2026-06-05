# My Bahrain Platform

Turborepo monorepo for the My Bahrain marketplace: public website, web dashboard, mobile app, and shared Convex backend.

## Structure

```
my-bahrain-platform/
├── apps/
│   ├── website/        # Public marketing website (Vite + React)
│   ├── web-app/        # Customer / store / backoffice dashboard
│   └── mobile-app/     # React Native / Expo app
├── convex/             # Shared backend, database, auth
├── packages/
│   ├── ui/             # Shared UI components
│   ├── types/          # Shared TypeScript types
│   ├── utils/          # Shared helpers
│   ├── validators/     # Zod schemas
│   └── config/         # Shared TS + Tailwind config
├── .cursor/rules/
├── README.md
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
└── SETTINGS_ENGINE.md
```

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+
- [Convex](https://docs.convex.dev/) account (for backend)

## Foundation milestone

See [FOUNDATION.md](./FOUNDATION.md) for the core checklist (auth, roles, settings, types, validators) to complete **before** feature work.

## Setup

```bash
pnpm install
pnpm convex:dev   # link Convex project (first time)
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm typecheck` | Typecheck entire monorepo |
| `pnpm convex:dev` | Run Convex dev server |
| `pnpm convex:deploy` | Deploy Convex functions |

## Apps

| App | Port | Package |
|-----|------|---------|
| Website | 3000 | `@my-bahrain/website` |
| Web app | 3001 | `@my-bahrain/web-app` |
| Mobile | Expo | `@my-bahrain/mobile-app` |

Run a single app:

```bash
pnpm --filter @my-bahrain/website dev
pnpm --filter @my-bahrain/web-app dev
pnpm --filter @my-bahrain/mobile-app dev
```

## Environment

Create `.env.local` at the repo root for Convex. Web app expects:

```
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```
