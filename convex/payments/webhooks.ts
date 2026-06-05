import { httpAction } from "../_generated/server";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import {
  requireTapSecretKey,
  type TapChargePayload,
  verifyTapHashString,
} from "./helpers";

function getHeader(
  headers: Record<string, string>,
  name: string,
): string | undefined {
  const lower = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lower) {
      return value;
    }
  }
  return undefined;
}

function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

export const tapWebhook = httpAction(async (ctx, request) => {
  const rawBody = await request.text();
  const headerRecord = headersToRecord(request.headers);

  let charge: TapChargePayload;
  try {
    charge = JSON.parse(rawBody) as TapChargePayload;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const secretKey = requireTapSecretKey();
  const hashstring = getHeader(headerRecord, "hashstring");

  if (!(await verifyTapHashString(charge, hashstring, secretKey))) {
    return new Response("Invalid webhook signature", { status: 403 });
  }

  const orderId = charge.metadata?.orderId;
  if (!orderId) {
    return new Response("Missing orderId metadata", { status: 400 });
  }

  try {
    await ctx.runMutation(internal.payments.mutations.handleTapWebhook, {
      orderId: orderId as Id<"orders">,
      charge,
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Tap webhook error:", error);

    await ctx.runMutation(internal.monitoring.mutations.logServerError, {
      message: "Tap webhook processing failed",
      context: {
        orderId,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return new Response("Webhook processing failed", { status: 500 });
  }
});
