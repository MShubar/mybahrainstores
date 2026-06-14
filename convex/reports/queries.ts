import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import {
  getOrderCommissionAmount,
  getOrderStoreAmount,
} from "../commissions/helpers";

export const getRevenueReport = query({
  args: {
    from: v.optional(v.number()),
    to: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const orders = await ctx.db.query("orders").collect();

    const filteredOrders = orders.filter((order) => {
      if (args.from && order.createdAt < args.from) {
        return false;
      }
      if (args.to && order.createdAt > args.to) {
        return false;
      }
      return true;
    });

    const paidOrders = filteredOrders.filter(
      (order) => order.paymentStatus === "paid",
    );

    const pendingOrders = filteredOrders.filter(
      (order) => order.paymentStatus === "pending",
    );

    const refundedOrders = filteredOrders.filter(
      (order) => order.paymentStatus === "refunded",
    );

    const gmv = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const platformRevenue = paidOrders.reduce(
      (sum, order) => sum + getOrderCommissionAmount(order),
      0,
    );

    const storeEarnings = paidOrders.reduce(
      (sum, order) => sum + getOrderStoreAmount(order),
      0,
    );

    const pendingRevenue = pendingOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    const refundedRevenue = refundedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    return {
      totalOrders: filteredOrders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      refundedOrders: refundedOrders.length,
      gmv,
      platformRevenue,
      storeEarnings,
      pendingRevenue,
      refundedRevenue,
    };
  },
});

export const getMyStoreAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);

    if (user.role !== "store") {
      return null;
    }

    const store = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .first();

    if (!store) {
      return null;
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", store._id))
      .collect();

    const paidOrders = orders.filter((order) => order.paymentStatus === "paid");

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    const commissionPaid = paidOrders.reduce(
      (sum, order) => sum + getOrderCommissionAmount(order),
      0,
    );

    const netEarnings = paidOrders.reduce(
      (sum, order) => sum + getOrderStoreAmount(order),
      0,
    );

    const averageOrderValue =
      paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    const productStats = new Map<
      string,
      {
        productId: string;
        name: string;
        quantitySold: number;
        revenue: number;
      }
    >();

    for (const order of paidOrders) {
      for (const item of order.items) {
        const existing = productStats.get(item.productId);

        if (existing) {
          existing.quantitySold += item.quantity;
          existing.revenue += item.totalPrice;
        } else {
          productStats.set(item.productId, {
            productId: item.productId,
            name: item.name,
            quantitySold: item.quantity,
            revenue: item.totalPrice,
          });
        }
      }
    }

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      store,
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: orders.filter((order) => order.orderStatus === "pending")
        .length,
      deliveredOrders: orders.filter(
        (order) => order.orderStatus === "delivered",
      ).length,
      totalRevenue,
      commissionPaid,
      netEarnings,
      averageOrderValue,
      topProducts,
    };
  },
});
