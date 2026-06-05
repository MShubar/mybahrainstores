import { getAuthUserId } from "@convex-dev/auth/server";
import { action } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "../_generated/api";
import {
  getTapWebhookUrl,
  requireFrontendUrl,
  requireTapSecretKey,
} from "./helpers";

type TapChargeResponse = {
  id: string;
  transaction?: {
    url?: string;
  };
};

export const createTapCharge = action({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    const order = await ctx.runQuery(api.orders.queries.getById, {
      orderId: args.orderId,
    });

    if (!order) {
      throw new ConvexError("Order not found");
    }

    if (order.customerId !== userId) {
      throw new ConvexError("Forbidden");
    }

    const pendingStatus = await ctx.runQuery(api.settings.queries.getValueByKey, {
      key: "default_payment_status",
    });

    if (order.paymentStatus !== (pendingStatus ?? "pending")) {
      throw new ConvexError("Order is not awaiting payment");
    }

    const provider = await ctx.runQuery(api.settings.queries.getValueByKey, {
      key: "payment_provider",
    });

    if (provider !== "tap") {
      throw new ConvexError("Tap payments are not enabled");
    }

    const customerEmail = await ctx.runQuery(internal.users.queries.getEmailById, {
      userId: order.customerId,
    });

    const secretKey = requireTapSecretKey();
    const frontendUrl = requireFrontendUrl();
    const postUrl = getTapWebhookUrl();

    const response = await fetch("https://api.tap.company/v2/charges/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: order.totalAmount,
        currency: order.currency,
        threeDSecure: true,
        save_card: false,
        description: `Order ${order._id}`,
        statement_descriptor: "RandomStores",
        metadata: {
          orderId: order._id,
        },
        customer: {
          first_name: order.deliveryAddress.fullName,
          email: customerEmail ?? "customer@example.com",
          phone: {
            country_code: "973",
            number: order.deliveryAddress.phone,
          },
        },
        source: {
          id: "src_all",
        },
        redirect: {
          url: `${frontendUrl}/customer/orders/${order._id}`,
        },
        post: {
          url: postUrl,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new ConvexError(`Tap charge failed: ${error}`);
    }

    const charge = (await response.json()) as TapChargeResponse;
    const paymentUrl = charge.transaction?.url;

    if (!paymentUrl) {
      throw new ConvexError("Tap did not return a payment URL");
    }

    await ctx.runMutation(internal.payments.mutations.recordTapChargeCreated, {
      orderId: order._id,
      chargeId: charge.id,
      amount: order.totalAmount,
      currency: order.currency,
    });

    return {
      chargeId: charge.id,
      paymentUrl,
    };
  },
});
