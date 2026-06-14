import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { recordAuditLog } from "../auditLogs/helpers";
import { getSettingValue } from "../settings/helpers";
import { now } from "../shared/helpers";
import {
  assertValidPayoutStatus,
  createPayoutRecord,
} from "./helpers";

export const createStorePayout = mutation({
  args: {
    storeId: v.id("stores"),
    amount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new ConvexError("Store not found");
    }

    const currency = await getSettingValue<string>(ctx, "currency", "BHD");

    const payoutId = await createPayoutRecord(ctx, {
      storeId: args.storeId,
      amount: args.amount,
      currency,
      notes: args.notes,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "payout_created",
      entity: "payouts",
      entityId: payoutId,
      after: {
        storeId: args.storeId,
        amount: args.amount,
        currency,
      },
    });

    return payoutId;
  },
});

export const markPayoutPaid = mutation({
  args: {
    payoutId: v.id("payouts"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const payout = await ctx.db.get(args.payoutId);
    if (!payout) {
      throw new ConvexError("Payout not found");
    }

    if (payout.status === "paid") {
      return args.payoutId;
    }

    await assertValidPayoutStatus(ctx, "paid");

    const timestamp = now();
    await ctx.db.patch(args.payoutId, {
      status: "paid",
      paidAt: timestamp,
      updatedAt: timestamp,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "payout_marked_paid",
      entity: "payouts",
      entityId: args.payoutId,
      before: { status: payout.status },
      after: { status: "paid", paidAt: timestamp },
    });

    return args.payoutId;
  },
});

export const updatePayoutStatus = mutation({
  args: {
    payoutId: v.id("payouts"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const payout = await ctx.db.get(args.payoutId);
    if (!payout) {
      throw new ConvexError("Payout not found");
    }

    await assertValidPayoutStatus(ctx, args.status);

    const timestamp = now();
    await ctx.db.patch(args.payoutId, {
      status: args.status,
      paidAt: args.status === "paid" ? timestamp : payout.paidAt,
      updatedAt: timestamp,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "payout_status_updated",
      entity: "payouts",
      entityId: args.payoutId,
      before: { status: payout.status },
      after: { status: args.status },
    });

    return args.payoutId;
  },
});
