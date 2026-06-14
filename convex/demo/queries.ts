import { query } from "../_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "../auth/currentUser";
import { getSettingValue } from "../settings/helpers";
import {
  DEMO_PASSWORD,
  DEMO_STORE_OWNER_EMAIL,
  DEMO_STORE_NAME,
  isDemoAccountEmail,
} from "../seeds/demoConstants";

export async function areDemoAccountsEnabled(ctx: Parameters<typeof getSettingValue>[0]) {
  return await getSettingValue<boolean>(ctx, "enable_demo_accounts", true);
}

export const getPublicDemoAccess = query({
  args: {},
  handler: async (ctx) => {
    const enabled = await areDemoAccountsEnabled(ctx);

    if (!enabled) {
      return { enabled: false as const };
    }

    return {
      enabled: true as const,
      email: DEMO_STORE_OWNER_EMAIL,
      password: DEMO_PASSWORD,
      storeName: DEMO_STORE_NAME,
      features: [
        "Products",
        "Orders",
        "Analytics",
        "Payouts",
        "Dashboard",
      ] as const,
    };
  },
});

export const isDemoLoginAllowed = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const enabled = await areDemoAccountsEnabled(ctx);
    const normalized = args.email.trim().toLowerCase();

    if (!isDemoAccountEmail(normalized)) {
      return { allowed: true };
    }

    return { allowed: enabled };
  },
});

export const isCurrentUserDemoAccount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return user ? isDemoAccountEmail(user.email) : false;
  },
});
