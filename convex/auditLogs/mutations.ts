import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const createAuditLog = internalMutation({
  args: {
    actorId: v.optional(v.id("users")),
    action: v.string(),
    entity: v.string(),
    entityId: v.optional(v.string()),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("auditLogs", {
      actorId: args.actorId,
      action: args.action,
      entity: args.entity,
      entityId: args.entityId,
      before: args.before,
      after: args.after,
      createdAt: Date.now(),
    });
  },
});