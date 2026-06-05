/** Order mutations. */
import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import {
  requireBackoffice,
  requireCanManageStore,
} from "../auth/permissions";
import { getSettingValue } from "../settings/helpers";
import { enforceRateLimit } from "../rateLimit/helpers";
import { recordAuditLog } from "../auditLogs/helpers";
import { internal } from "../_generated/api";

export const createOrder = mutation({
  args: {
    storeId: v.id("stores"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      })
    ),
    deliveryAddress: v.object({
      fullName: v.string(),
      phone: v.string(),
      addressLine1: v.string(),
      addressLine2: v.optional(v.string()),
      city: v.string(),
      area: v.optional(v.string()),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
    }),
    customerNotes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    await enforceRateLimit(ctx, {
      key: `create_order:${user._id}`,
      limit: 10,
      windowMs: 60 * 1000,
    });

    if (user.role !== "customer") {
      throw new ConvexError("Only customers can place orders");
    }

    if (args.items.length === 0) {
      throw new ConvexError("Order must contain at least one item");
    }

    const store = await ctx.db.get(args.storeId);

    if (!store || !store.isApproved || !store.isActive) {
      throw new ConvexError("Store is not available");
    }

    if (!store.isOpen) {
      throw new ConvexError("Store is currently closed");
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);

      if (!product) {
        throw new ConvexError("Product not found");
      }

      if (product.storeId !== args.storeId) {
        throw new ConvexError("All products must belong to the same store");
      }

      if (!product.isActive || !product.isAvailable) {
        throw new ConvexError(`${product.name} is not available`);
      }

      if (
        product.stockQuantity !== undefined &&
        product.stockQuantity < item.quantity
      ) {
        throw new ConvexError(`Not enough stock for ${product.name}`);
      }

      const totalPrice = product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice,
      });

      subtotal += totalPrice;
    }

    // Temporary hardcoded defaults.
    // These should be replaced with settings engine values next.
    const currency = await getSettingValue<string>(ctx, "currency", "BHD");
const deliveryFee = await getSettingValue<number>(
  ctx,
  "default_delivery_fee",
  1.5
);
const taxPercentage = await getSettingValue<number>(
  ctx,
  "tax_percentage",
  0
);

const taxAmount = subtotal * (taxPercentage / 100);
const discountAmount = 0;
const totalAmount = subtotal + deliveryFee + taxAmount - discountAmount;

const orderStatus = await getSettingValue<string>(ctx, "default_order_status", "pending");
const paymentStatus = await getSettingValue<string>(
  ctx,
  "default_payment_status",
  "pending"
);
    const now = Date.now();

    const orderId = await ctx.db.insert("orders", {
      customerId: user._id,
      storeId: args.storeId,
      items: orderItems,

      subtotal,
      deliveryFee,
      taxAmount,
      discountAmount,
      totalAmount,

      currency,
orderStatus,
paymentStatus,

      deliveryAddress: args.deliveryAddress,
      customerNotes: args.customerNotes,
      storeNotes: undefined,

      createdAt: now,
      updatedAt: now,
    });

    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);

      if (product?.stockQuantity !== undefined) {
        await ctx.db.patch(product._id, {
          stockQuantity: product.stockQuantity - item.quantity,
          updatedAt: now,
        });
      }
    }

    await ctx.scheduler.runAfter(0, internal.pushNotifications.actions.notifyUser, {
      userId: store.ownerId,
      title: "New order received",
      body: `Order #${orderId.slice(-6)} — ${totalAmount.toFixed(3)} ${currency}`,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.notifications.mutations.createNotification,
      {
        userId: store.ownerId,
        title: "New order received",
        message: `Order #${orderId.slice(-6)} — ${totalAmount.toFixed(3)} ${currency}`,
        type: "order_created",
        entityType: "order",
        entityId: orderId,
      },
    );

    return orderId;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    orderStatus: v.string(),
    storeNotes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const order = await ctx.db.get(args.orderId);

    if (!order) {
      throw new ConvexError("Order not found");
    }

    const store = await ctx.db.get(order.storeId);

    if (!store) {
      throw new ConvexError("Store not found");
    }

    requireCanManageStore(user, store);

    await ctx.db.patch(args.orderId, {
      orderStatus: args.orderStatus,
      storeNotes: args.storeNotes,
      updatedAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.pushNotifications.actions.notifyUser, {
      userId: order.customerId,
      title: "Order status updated",
      body: `Your order is now ${args.orderStatus}`,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.notifications.mutations.createNotification,
      {
        userId: order.customerId,
        title: "Order status updated",
        message: `Your order is now ${args.orderStatus}`,
        type: "order_status_updated",
        entityType: "order",
        entityId: args.orderId,
      },
    );

    return args.orderId;
  },
});

export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    paymentStatus: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const order = await ctx.db.get(args.orderId);

    if (!order) {
      throw new ConvexError("Order not found");
    }

    await ctx.db.patch(args.orderId, {
      paymentStatus: args.paymentStatus,
      updatedAt: Date.now(),
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "payment_status_updated",
      entity: "orders",
      entityId: args.orderId,
      before: { paymentStatus: order.paymentStatus },
      after: { paymentStatus: args.paymentStatus },
    });

    return args.orderId;
  },
});