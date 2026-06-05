# Architecture

## Overview

My Bahrain Platform is a **pnpm + Turborepo** monorepo. All apps share one Convex backend and internal packages under `@my-bahrain/*`.

## Apps

| App | Path | Purpose |
|-----|------|---------|
| Website | `apps/website` | Public marketing site |
| Web app | `apps/web-app` | Authenticated dashboard for customer, store, and backoffice roles |
| Mobile | `apps/mobile-app` | Expo / React Native client |

## Shared packages

| Package | Path | Responsibility |
|---------|------|----------------|
| `@my-bahrain/ui` | `packages/ui` | Reusable React UI |
| `@my-bahrain/types` | `packages/types` | Cross-app TypeScript types |
| `@my-bahrain/utils` | `packages/utils` | Formatting and helpers |
| `@my-bahrain/validators` | `packages/validators` | Zod schemas (forms + API) |
| `@my-bahrain/config` | `packages/config` | TSConfig presets, Tailwind preset |

## Backend

- **Convex** lives at repo root in `convex/`
- Single deployment serves website, web-app, and mobile-app
- Auth via Convex Auth (to be wired)
- Payments via Polar (to be wired)

## Stack

- **Frontend:** React, Vite, TailwindCSS, TypeScript, React Query, React Hook Form, Zod
- **Mobile:** Expo Router
- **Backend:** Convex
- **Deploy:** Vercel (web), EAS (mobile)

## Roles

- `customer` — browse, order
- `store` — manage catalog and orders
- `backoffice` — platform administration

## Principles

- Feature-based folders inside each app
- No hardcoded business rules — use `settings` table (see `SETTINGS_ENGINE.md`)
- Strict TypeScript across the monorepo
