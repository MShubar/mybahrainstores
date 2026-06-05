import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { recordAuditLog } from "../auditLogs/helpers";

export const createCurrentUserProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.optional(v.union(v.literal("customer"), v.literal("store"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    const existing = await ctx.db.get(userId);

    if (!existing) {
      throw new ConvexError("User not found");
    }

    if (existing.email && existing.email !== args.email) {
      throw new ConvexError("Forbidden");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (identity?.email && identity.email !== args.email) {
      throw new ConvexError("Forbidden");
    }

    const role = args.role ?? "customer";

    if (role !== "customer" && role !== "store") {
      throw new ConvexError("Invalid role");
    }

    const now = Date.now();
    const profile = {
      name: args.name,
      email: args.email,
      phone: args.phone,
      image: identity?.pictureUrl ?? existing.image,
      imageUrl: identity?.pictureUrl ?? existing.imageUrl,
      role,
      isActive: true,
      createdAt: existing.createdAt ?? now,
      updatedAt: now,
    };

    await ctx.db.patch(userId, profile);
    return userId;
  },
});

export const promoteToBackoffice = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const actor = await requireCurrentUser(ctx);
    requireBackoffice(actor);

    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(args.userId, {
      role: "backoffice",
      updatedAt: Date.now(),
    });

    await recordAuditLog(ctx, {
      actorId: actor._id,
      action: "user_promoted_to_backoffice",
      entity: "users",
      entityId: args.userId,
      before: { role: user.role },
      after: { role: "backoffice" },
    });

    return args.userId;
  },
});
