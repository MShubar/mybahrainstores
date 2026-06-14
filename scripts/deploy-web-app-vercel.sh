#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_APP="$ROOT/apps/web-app"
CONVEX_URL="${VITE_CONVEX_URL:-https://precise-tern-882.convex.cloud}"

cd "$WEB_APP"

echo "Building web-app with VITE_CONVEX_URL=$CONVEX_URL"
VITE_CONVEX_URL="$CONVEX_URL" npx vercel build --prod
npx vercel deploy --prebuilt --prod --yes

echo "Deployed to https://web-app-alpha-tawny.vercel.app"
