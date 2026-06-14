import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getSettingValue } from "../settings/helpers";

type Ctx = QueryCtx | MutationCtx;

export type OrderCommission = {
  commissionRate: number;
  commissionAmount: number;
  storeAmount: number;
};

function roundMoney(amount: number): number {
  return Math.round(amount * 1000) / 1000;
}

export async function getDefaultCommissionRate(ctx: Ctx): Promise<number> {
  const configured = await getSettingValue<number>(ctx, "default_commission_rate", 10);

  if (typeof configured === "number" && Number.isFinite(configured)) {
    return configured;
  }

  const legacy = await getSettingValue<number>(
    ctx,
    "platform_commission_percentage",
    10,
  );

  return typeof legacy === "number" && Number.isFinite(legacy) ? legacy : 10;
}

export async function resolveStoreCommissionRate(
  ctx: Ctx,
  store: Pick<Doc<"stores">, "commissionRate">,
): Promise<number> {
  if (
    store.commissionRate !== undefined &&
    Number.isFinite(store.commissionRate)
  ) {
    return store.commissionRate;
  }

  return await getDefaultCommissionRate(ctx);
}

export function calculateOrderCommission(
  totalAmount: number,
  commissionRate: number,
): OrderCommission {
  const commissionAmount = roundMoney(totalAmount * (commissionRate / 100));
  const storeAmount = roundMoney(totalAmount - commissionAmount);

  return {
    commissionRate,
    commissionAmount,
    storeAmount,
  };
}

export function getOrderCommissionAmount(order: Doc<"orders">): number {
  return order.commissionAmount ?? 0;
}

export function getOrderStoreAmount(order: Doc<"orders">): number {
  return order.storeAmount ?? order.totalAmount;
}
