import { getAuthUserId } from "@convex-dev/auth/server";
import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { getAccountDeletionBlockers } from "./deleteAccountHelpers";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

export const getAccountDeletionStatus = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    const blockers = await getAccountDeletionBlockers(ctx, user);

    return {
      email: user.email ?? null,
      role: user.role ?? null,
      deletedAt: user.deletedAt ?? null,
      ...blockers,
    };
  },
});

export const listBackofficeUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await ctx.db.query("users").collect();
  },
});

export const getEmailById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.email ?? null;
  },
});
