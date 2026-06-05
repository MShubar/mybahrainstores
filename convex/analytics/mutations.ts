import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "../auth/currentUser";

export const trackEvent = mutation({
  args: {
    event: v.string(),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    return await ctx.db.insert("analyticsEvents", {
      userId: user?._id,
      event: args.event,
      entityType: args.entityType,
      entityId: args.entityId,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});
