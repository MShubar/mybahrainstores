import { getAuthUserId } from "@convex-dev/auth/server";
import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";

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

export const getEmailById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.email ?? null;
  },
});
