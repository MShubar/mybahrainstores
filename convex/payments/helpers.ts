import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { getSettingValue } from "../settings/helpers";
import { now } from "../shared/helpers";

export { now, withTimestamps, withUpdatedAt } from "../shared/helpers";

export async function getPaymentProvider(ctx: MutationCtx): Promise<string> {
  return await getSettingValue<string>(ctx, "payment_provider", "mock");
}

export async function resolvePaidStatus(ctx: MutationCtx): Promise<string> {
  const paymentStatuses = await getSettingValue<string[]>(
    ctx,
    "payment_statuses",
    ["pending", "paid", "failed", "refunded"],
  );
  return paymentStatuses.find((status) => status === "paid") ?? "paid";
}

export async function resolveConfirmedOrderStatus(ctx: MutationCtx): Promise<string> {
  const orderStatuses = await getSettingValue<string[]>(
    ctx,
    "order_statuses",
    ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
  );
  return orderStatuses.find((status) => status === "confirmed") ?? "confirmed";
}

export async function applyOrderPaymentSuccess(
  ctx: MutationCtx,
  orderId: Id<"orders">,
): Promise<{ paidStatus: string; confirmedStatus: string }> {
  const order = await ctx.db.get(orderId);
  if (!order) {
    throw new ConvexError("Order not found");
  }

  const paidStatus = await resolvePaidStatus(ctx);
  const confirmedStatus = await resolveConfirmedOrderStatus(ctx);
  const timestamp = now();

  await ctx.db.patch(orderId, {
    paymentStatus: paidStatus,
    orderStatus: confirmedStatus,
    updatedAt: timestamp,
  });

  return { paidStatus, confirmedStatus };
}

const THREE_DECIMAL_CURRENCIES = new Set(["BHD", "KWD", "OMR", "JOD"]);

export type TapChargePayload = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  metadata?: {
    orderId?: string;
  };
  reference?: {
    gateway?: string;
    payment?: string;
  };
  transaction?: {
    created?: string;
  };
};

export function formatTapAmount(amount: number, currency: string): string {
  const decimals = THREE_DECIMAL_CURRENCIES.has(currency.toUpperCase()) ? 3 : 2;
  return amount.toFixed(decimals);
}

export function buildTapHashString(charge: TapChargePayload): string {
  const amount = formatTapAmount(charge.amount, charge.currency);
  const gatewayReference = charge.reference?.gateway ?? "";
  const paymentReference = charge.reference?.payment ?? "";
  const created = charge.transaction?.created ?? "";

  return (
    `x_id${charge.id}` +
    `x_amount${amount}` +
    `x_currency${charge.currency}` +
    `x_gateway_reference${gatewayReference}` +
    `x_payment_reference${paymentReference}` +
    `x_status${charge.status}` +
    `x_created${created}`
  );
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyTapHashString(
  charge: TapChargePayload,
  postedHashString: string | undefined,
  secretKey: string,
): Promise<boolean> {
  if (!postedHashString) {
    return false;
  }

  const expected = await hmacSha256Hex(secretKey, buildTapHashString(charge));
  return expected === postedHashString;
}

export function getTapWebhookUrl(): string {
  const siteUrl = process.env.CONVEX_SITE_URL;
  if (!siteUrl) {
    throw new ConvexError("CONVEX_SITE_URL is not configured");
  }
  return `${siteUrl.replace(/\/$/, "")}/tap/webhook`;
}

export function requireTapSecretKey(): string {
  const secret = process.env.TAP_SECRET_KEY;
  if (!secret) {
    throw new ConvexError("TAP_SECRET_KEY is not configured");
  }
  return secret;
}

export function requireFrontendUrl(): string {
  const url = process.env.FRONTEND_URL;
  if (!url) {
    throw new ConvexError("FRONTEND_URL is not configured");
  }
  return url.replace(/\/$/, "");
}
