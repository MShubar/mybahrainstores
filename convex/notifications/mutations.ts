import { mutation, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";

export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const notification = await ctx.db.get(args.notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
  },
});

export const createNotification = internalMutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(),

    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      userId: args.userId,

      title: args.title,
      message: args.message,

      type: args.type,

      isRead: false,

      entityType: args.entityType,
      entityId: args.entityId,

      createdAt: Date.now(),
    });
  },
});