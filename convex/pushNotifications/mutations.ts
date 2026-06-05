import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";

export const registerPushToken = mutation({
  args: {
    token: v.string(),
    platform: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const existing = await ctx.db
      .query("pushTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        userId: user._id,
        platform: args.platform,
        updatedAt: now,
      });

      return existing._id;
    }

    return await ctx.db.insert("pushTokens", {
      userId: user._id,
      token: args.token,
      platform: args.platform,
      createdAt: now,
      updatedAt: now,
    });
  },
});
