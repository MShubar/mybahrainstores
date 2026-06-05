import { internalMutation, mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { getSettingValue } from "../settings/helpers";
import { enforceRateLimit } from "../rateLimit/helpers";
import {
  applyOrderPaymentSuccess,
  getPaymentProvider,
  now,
  resolvePaidStatus,
  type TapChargePayload,
} from "./helpers";

export const completeMockPayment = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    if (user.role !== "customer") {
      throw new ConvexError("Only customers can pay for orders");
    }

    await enforceRateLimit(ctx, {
      key: `mock_payment:${user._id}`,
      limit: 10,
      windowMs: 60 * 1000,
    });

    const provider = await getPaymentProvider(ctx);
    if (provider !== "mock") {
      throw new ConvexError("Mock payments are not enabled");
    }

    const mockPaymentsEnabled = await getSettingValue<boolean>(
      ctx,
      "mock_payments_enabled",
      false,
    );

    if (!mockPaymentsEnabled) {
      throw new ConvexError("Mock payments are disabled");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("Order not found");
    }

    if (order.customerId !== user._id) {
      throw new ConvexError("Forbidden");
    }

    const pendingStatus = await getSettingValue<string>(
      ctx,
      "default_payment_status",
      "pending",
    );

    if (order.paymentStatus !== pendingStatus) {
      throw new ConvexError("Order is not awaiting payment");
    }

    const { paidStatus } = await applyOrderPaymentSuccess(ctx, args.orderId);
    const timestamp = now();
    const mockPaymentId = `mock_${args.orderId}_${timestamp}`;

    await ctx.db.insert("payments", {
      orderId: args.orderId,
      provider: "mock",
      providerPaymentId: mockPaymentId,
      amount: order.totalAmount,
      currency: order.currency,
      status: paidStatus,
      rawPayload: {
        simulated: true,
        completedAt: timestamp,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return { orderId: args.orderId, paymentStatus: paidStatus };
  },
});

export const recordTapChargeCreated = internalMutation({
  args: {
    orderId: v.id("orders"),
    chargeId: v.string(),
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("payments")
      .withIndex("by_provider_payment", (q) =>
        q.eq("providerPaymentId", args.chargeId),
      )
      .unique();

    const timestamp = now();
    const pendingStatus = await getSettingValue<string>(
      ctx,
      "default_payment_status",
      "pending",
    );

    if (existing) {
      await ctx.db.patch(existing._id, {
        amount: args.amount,
        currency: args.currency,
        status: pendingStatus,
        updatedAt: timestamp,
      });
      return existing._id;
    }

    return await ctx.db.insert("payments", {
      orderId: args.orderId,
      provider: "tap",
      providerPaymentId: args.chargeId,
      amount: args.amount,
      currency: args.currency,
      status: pendingStatus,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const handleTapWebhook = internalMutation({
  args: {
    orderId: v.id("orders"),
    charge: v.any(),
  },
  handler: async (ctx, args) => {
    const charge = args.charge as TapChargePayload;
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("Order not found for Tap webhook");
    }

    const paymentStatuses = await getSettingValue<string[]>(
      ctx,
      "payment_statuses",
      ["pending", "paid", "failed", "refunded"],
    );

    const capturedStatus = paymentStatuses.find((status) => status === "paid") ?? "paid";
    const failedStatus =
      paymentStatuses.find((status) => status === "failed") ?? "failed";

    const timestamp = now();
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_provider_payment", (q) => q.eq("providerPaymentId", charge.id))
      .unique();

    if (charge.status === "CAPTURED") {
      if (order.paymentStatus === capturedStatus && existingPayment?.status === capturedStatus) {
        return;
      }

      await applyOrderPaymentSuccess(ctx, order._id);

      if (existingPayment) {
        await ctx.db.patch(existingPayment._id, {
          status: capturedStatus,
          rawPayload: charge,
          updatedAt: timestamp,
        });
      } else {
        await ctx.db.insert("payments", {
          orderId: order._id,
          provider: "tap",
          providerPaymentId: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: capturedStatus,
          rawPayload: charge,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      return;
    }

    if (charge.status === "FAILED" || charge.status === "CANCELLED") {
      await ctx.db.patch(order._id, {
        paymentStatus: failedStatus,
        updatedAt: timestamp,
      });

      if (existingPayment) {
        await ctx.db.patch(existingPayment._id, {
          status: failedStatus,
          rawPayload: charge,
          updatedAt: timestamp,
        });
      }
    }
  },
});
