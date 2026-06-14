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
import { internal } from "../_generated/api";
import {
  assertValidBahrainIban,
  assertValidPayoutInfoStatus,
  normalizeIban,
} from "./payoutInfoHelpers";

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

    await ctx.scheduler.runAfter(
      0,
      internal.notifications.mutations.createNotification,
      {
        userId: store.ownerId,
        title: "Store approved",
        message: `${store.name} is now live on the platform.`,
        type: "store_approved",
        entityType: "store",
        entityId: args.storeId,
      },
    );
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

export const updateStoreCommissionRate = mutation({
  args: {
    storeId: v.id("stores"),
    commissionRate: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("Store not found");
    }

    if (
      args.commissionRate !== null &&
      (!Number.isFinite(args.commissionRate) ||
        args.commissionRate < 0 ||
        args.commissionRate > 100)
    ) {
      throw new ConvexError("Commission rate must be between 0 and 100");
    }

    await ctx.db.patch(args.storeId, {
      commissionRate: args.commissionRate ?? undefined,
      updatedAt: now(),
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "store_commission_rate_updated",
      entity: "stores",
      entityId: args.storeId,
      before: { commissionRate: store.commissionRate ?? null },
      after: { commissionRate: args.commissionRate },
    });
  },
});

export const updateMyStorePayoutInfo = mutation({
  args: {
    storeId: v.id("stores"),
    bankName: v.string(),
    iban: v.string(),
    accountHolderName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireStore(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("Store not found");
    }

    requireStoreOwner(user, store);

    const bankName = args.bankName.trim();
    const accountHolderName = args.accountHolderName.trim();
    const iban = normalizeIban(args.iban);

    if (!bankName || !accountHolderName) {
      throw new ConvexError("Bank name and account holder name are required");
    }

    assertValidBahrainIban(iban);

    const timestamp = now();

    await ctx.db.patch(args.storeId, {
      bankName,
      iban,
      accountHolderName,
      payoutInfoStatus: "pending",
      updatedAt: timestamp,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "store_payout_info_submitted",
      entity: "stores",
      entityId: args.storeId,
      after: { bankName, iban, payoutInfoStatus: "pending" },
    });

    return args.storeId;
  },
});

export const updateStorePayoutInfoStatus = mutation({
  args: {
    storeId: v.id("stores"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("Store not found");
    }

    await assertValidPayoutInfoStatus(ctx, args.status);

    if (args.status === "approved") {
      if (!store.bankName || !store.iban || !store.accountHolderName) {
        throw new ConvexError("Store has not submitted payout information");
      }
    }

    const timestamp = now();

    await ctx.db.patch(args.storeId, {
      payoutInfoStatus: args.status,
      updatedAt: timestamp,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "store_payout_info_reviewed",
      entity: "stores",
      entityId: args.storeId,
      before: { payoutInfoStatus: store.payoutInfoStatus ?? null },
      after: { payoutInfoStatus: args.status },
    });

    return args.storeId;
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
