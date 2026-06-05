import { requireEnv } from "@my-bahrain/config";

export function getWebAppUrl(): string {
  return requireEnv(
    "VITE_WEB_APP_URL",
    import.meta.env.VITE_WEB_APP_URL,
  ).replace(/\/$/, "");
}
