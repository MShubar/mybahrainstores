import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { recordAuditLog } from "../auditLogs/helpers";
import { deleteUserAccount } from "./deleteAccountHelpers";
import { assertNotSelf, now } from "./helpers";

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

export const deleteCurrentUserAccount = mutation({
  args: {
    confirmPhrase: v.literal("DELETE"),
  },
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    await deleteUserAccount(ctx, user);

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "user_account_deleted",
      entity: "users",
      entityId: user._id,
      before: { email: user.email, role: user.role },
      after: { deletedAt: now() },
    });
  },
});

export const deleteUserAccountByAdmin = mutation({
  args: {
    userId: v.id("users"),
    confirmPhrase: v.literal("DELETE"),
  },
  handler: async (ctx, args) => {
    const actor = await requireCurrentUser(ctx);
    requireBackoffice(actor);

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    assertNotSelf(actor._id, args.userId, "You cannot delete your own account from the admin panel");

    await deleteUserAccount(ctx, user);

    await recordAuditLog(ctx, {
      actorId: actor._id,
      action: "user_account_deleted_by_admin",
      entity: "users",
      entityId: args.userId,
      before: { email: user.email, role: user.role },
      after: { deletedAt: now() },
    });
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
