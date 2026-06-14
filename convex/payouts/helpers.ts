import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getOrderStoreAmount } from "../commissions/helpers";
import { getSettingValue } from "../settings/helpers";
import { now } from "../shared/helpers";

type Ctx = QueryCtx | MutationCtx;

export async function getPayoutStatuses(ctx: Ctx): Promise<string[]> {
  return await getSettingValue<string[]>(ctx, "payout_statuses", [
    "pending",
    "processing",
    "paid",
    "failed",
  ]);
}

export async function assertValidPayoutStatus(
  ctx: Ctx,
  status: string,
): Promise<void> {
  const allowed = await getPayoutStatuses(ctx);
  if (!allowed.includes(status)) {
    throw new ConvexError(`Invalid payout status: ${status}`);
  }
}

export async function getPaidOrdersForStore(
  ctx: Ctx,
  storeId: Id<"stores">,
): Promise<Doc<"orders">[]> {
  const orders = await ctx.db
    .query("orders")
    .withIndex("by_store", (q) => q.eq("storeId", storeId))
    .collect();

  return orders.filter((order) => order.paymentStatus === "paid");
}

export async function getStorePayouts(
  ctx: Ctx,
  storeId: Id<"stores">,
): Promise<Doc<"payouts">[]> {
  return await ctx.db
    .query("payouts")
    .withIndex("by_store", (q) => q.eq("storeId", storeId))
    .collect();
}

export type StoreBalanceSummary = {
  grossEarnings: number;
  paidOut: number;
  reserved: number;
  amountOwed: number;
  paidOrderCount: number;
};

export async function getStoreBalanceSummary(
  ctx: Ctx,
  storeId: Id<"stores">,
): Promise<StoreBalanceSummary> {
  const paidOrders = await getPaidOrdersForStore(ctx, storeId);
  const payouts = await getStorePayouts(ctx, storeId);

  const grossEarnings = paidOrders.reduce(
    (sum, order) => sum + getOrderStoreAmount(order),
    0,
  );

  const paidOut = payouts
    .filter((payout) => payout.status === "paid")
    .reduce((sum, payout) => sum + payout.amount, 0);

  const reserved = payouts
    .filter((payout) => payout.status === "pending" || payout.status === "processing")
    .reduce((sum, payout) => sum + payout.amount, 0);

  const amountOwed = Math.max(0, grossEarnings - paidOut - reserved);

  return {
    grossEarnings,
    paidOut,
    reserved,
    amountOwed,
    paidOrderCount: paidOrders.length,
  };
}

export async function createPayoutRecord(
  ctx: MutationCtx,
  args: {
    storeId: Id<"stores">;
    amount: number;
    currency: string;
    notes?: string;
  },
): Promise<Id<"payouts">> {
  if (!Number.isFinite(args.amount) || args.amount <= 0) {
    throw new ConvexError("Payout amount must be greater than zero");
  }

  const balance = await getStoreBalanceSummary(ctx, args.storeId);

  if (args.amount > balance.amountOwed) {
    throw new ConvexError("Payout amount exceeds amount owed to store");
  }

  const defaultStatus = await getSettingValue<string>(
    ctx,
    "default_payout_status",
    "pending",
  );

  await assertValidPayoutStatus(ctx, defaultStatus);

  const timestamp = now();
  const paidOrders = await getPaidOrdersForStore(ctx, args.storeId);

  return await ctx.db.insert("payouts", {
    storeId: args.storeId,
    amount: args.amount,
    currency: args.currency,
    status: defaultStatus,
    orderCount: paidOrders.length,
    notes: args.notes,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}
