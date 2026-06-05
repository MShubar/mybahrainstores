/** Order queries. */
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice, requireCanManageStore } from "../auth/permissions";
import { buildCustomerOrderTracking } from "./tracking";
import { paginationOptsValidator } from "convex/server";
export const listMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);

    if (user.role !== "customer") {
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", user._id))
      .collect();

    orders.sort((a, b) => b.createdAt - a.createdAt);

    const enriched = await Promise.all(
      orders.map(async (order) => {
        const store = await ctx.db.get(order.storeId);
        const tracking = await buildCustomerOrderTracking(ctx, order);

        return {
          ...order,
          storeName: store?.name ?? "Unknown store",
          trackingSummary: {
            progressPercent: tracking.progressPercent,
            currentStatusLabel: tracking.currentStatusLabel,
            currentPaymentLabel: tracking.currentPaymentLabel,
            isDelivered: tracking.isDelivered,
            isCancelled: tracking.isCancelled,
            isPaid: tracking.isPaid,
          },
        };
      }),
    );

    return enriched;
  },
});

export const listStoreOrders = query({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const store = await ctx.db.get(args.storeId);

    if (!store) {
      throw new Error("Store not found");
    }

    requireCanManageStore(user, store);

    return await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();
  },
});

export const getMyStoreRevenueStats = query({
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
  
      return {
        store,
        totalOrders: orders.length,
        paidOrders: paidOrders.length,
        pendingOrders: orders.filter((order) => order.orderStatus === "pending")
          .length,
        deliveredOrders: orders.filter((order) => order.orderStatus === "delivered")
          .length,
        totalRevenue: paidOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      };
    },
  });
  
export const listBackofficeOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await ctx.db.query("orders").collect();
  },
});
export const listBackofficeOrdersPaginated = query({
    args: {
      paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
      const user = await requireCurrentUser(ctx);
      requireBackoffice(user);
  
      return await ctx.db
        .query("orders")
        .order("desc")
        .paginate(args.paginationOpts);
    },
  });

  export const getBackofficeRevenueStats = query({
    args: {},
  
    handler: async (ctx) => {
      const user = await requireCurrentUser(ctx);
      requireBackoffice(user);
  
      const orders = await ctx.db.query("orders").collect();
  
      const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  
      const totalRevenue = paidOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
  
      const pendingPayments = orders.filter(
        (order) => order.paymentStatus === "pending"
      ).length;
  
      const deliveredOrders = orders.filter(
        (order) => order.orderStatus === "delivered"
      ).length;
  
      return {
        totalOrders: orders.length,
        paidOrders: paidOrders.length,
        pendingPayments,
        deliveredOrders,
        totalRevenue,
      };
    },
  });
export const getById = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const order = await ctx.db.get(args.orderId);

    if (!order) {
      return null;
    }

    if (user.role === "backoffice") {
      return order;
    }

    if (user.role === "customer" && order.customerId === user._id) {
      return order;
    }

    if (user.role === "store") {
      const store = await ctx.db.get(order.storeId);

      if (store && store.ownerId === user._id) {
        return order;
      }
    }

    return null;
  },
});

export const getCustomerTracking = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    if (user.role !== "customer") {
      return null;
    }

    const order = await ctx.db.get(args.orderId);

    if (!order || order.customerId !== user._id) {
      return null;
    }

    const store = await ctx.db.get(order.storeId);
    const tracking = await buildCustomerOrderTracking(ctx, order);

    return {
      order,
      store: store
        ? { _id: store._id, name: store.name, slug: store.slug }
        : null,
      ...tracking,
    };
  },
});