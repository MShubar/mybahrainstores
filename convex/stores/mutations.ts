import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { requireStore } from "../auth/permission";
import { now } from "../shared/helpers";
import {
  assertUniqueStoreSlug,
  assertValidCategories,
  isStoreApprovalRequired,
} from "./helpers";
import { requireStoreOwner } from "./permissions";
import { recordAuditLog } from "../auditLogs/helpers";

const storeFields = {
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
  coverImageUrl: v.optional(v.string()),
  categoryIds: v.array(v.id("categories")),
  address: v.string(),
  city: v.string(),
  area: v.optional(v.string()),
  isOpen: v.boolean(),
};

export const createMyStore = mutation({
  args: storeFields,
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireStore(user);

    const existing = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .first();

    if (existing) {
      throw new ConvexError("You already have a store");
    }

    await assertUniqueStoreSlug(ctx, args.slug);
    await assertValidCategories(ctx, args.categoryIds);

    const approvalRequired = await isStoreApprovalRequired(ctx);
    const timestamp = now();

    return await ctx.db.insert("stores", {
      ownerId: user._id,
      name: args.name,
      slug: args.slug,
      description: args.description,
      logoUrl: args.logoUrl,
      coverImageUrl: args.coverImageUrl,
      categoryIds: args.categoryIds,
      address: args.address,
      city: args.city,
      area: args.area,
      isApproved: !approvalRequired,
      isOpen: args.isOpen,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateMyStore = mutation({
  args: {
    storeId: v.id("stores"),
    ...storeFields,
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireStore(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("Store not found");
    }

    requireStoreOwner(user, store);

    if (args.slug !== store.slug) {
      await assertUniqueStoreSlug(ctx, args.slug, store._id);
    }

    await assertValidCategories(ctx, args.categoryIds);

    const { storeId, ...patch } = args;

    await ctx.db.patch(storeId, {
      ...patch,
      updatedAt: now(),
    });

    return storeId;
  },
});

export const approveStore = mutation({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("Store not found");
    }

    await ctx.db.patch(args.storeId, {
      isApproved: true,
      isActive: true,
      updatedAt: now(),
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "store_approved",
      entity: "stores",
      entityId: args.storeId,
      before: { isApproved: store.isApproved, isActive: store.isActive },
      after: { isApproved: true, isActive: true },
    });
  },
});

export const rejectStore = mutation({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("Store not found");
    }

    await ctx.db.patch(args.storeId, {
      isApproved: false,
      updatedAt: now(),
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "store_rejected",
      entity: "stores",
      entityId: args.storeId,
      before: { isApproved: store.isApproved },
      after: { isApproved: false },
    });
  },
});

export const toggleStoreActive = mutation({
  args: {
    storeId: v.id("stores"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("Store not found");
    }

    await ctx.db.patch(args.storeId, {
      isActive: args.isActive,
      updatedAt: now(),
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "store_active_toggled",
      entity: "stores",
      entityId: args.storeId,
      before: { isActive: store.isActive },
      after: { isActive: args.isActive },
    });
  },
});
