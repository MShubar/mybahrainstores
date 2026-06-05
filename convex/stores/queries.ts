/** Store queries — implement storefront listing here. */
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { getAuthenticatedUser } from "../shared/permissions";
import { isPublicStore } from "./helpers";

export const listPublicStoresByCategory = query({
    args: {
      categoryId: v.id("categories"),
    },
    handler: async (ctx, args) => {
      const stores = await ctx.db
        .query("stores")
        .withIndex("by_approved", (q) => q.eq("isApproved", true))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
  
      return stores.filter((store) =>
        store.categoryIds.includes(args.categoryId)
      );
    },
  });

export const listPublicStores = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("stores")
      .withIndex("by_approved", (q) => q.eq("isApproved", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const listBackofficeStores = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await ctx.db.query("stores").collect();
  },
});

export const getById = query({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);

    if (!store) {
      return null;
    }

    const user = await getAuthenticatedUser(ctx);

    if (user?.role === "backoffice") {
      return store;
    }

    if (user?.role === "store" && store.ownerId === user._id) {
      return store;
    }

    return isPublicStore(store) ? store : null;
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("stores")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!store) {
      return null;
    }

    const user = await getAuthenticatedUser(ctx);

    if (user?.role === "backoffice") {
      return store;
    }

    if (user?.role === "store" && store.ownerId === user._id) {
      return store;
    }

    return isPublicStore(store) ? store : null;
  },
});

export const getMyStore = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);

    if (user.role !== "store") {
      return null;
    }

    return await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .first();
  },
});
export const getMyStoreDashboardStats = query({
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
  
      const products = await ctx.db
        .query("products")
        .withIndex("by_store", (q) => q.eq("storeId", store._id))
        .collect();
  
      const orders = await ctx.db
        .query("orders")
        .withIndex("by_store", (q) => q.eq("storeId", store._id))
        .collect();
  
      const pendingOrders = orders.filter(
        (order) => order.orderStatus === "pending"
      ).length;
  
      const totalRevenue = orders
        .filter((order) => order.paymentStatus === "paid")
        .reduce((sum, order) => sum + order.totalAmount, 0);
  
      return {
        store,
        totalProducts: products.length,
        activeProducts: products.filter((product) => product.isActive).length,
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
      };
    },
  });

  export const searchPublicStores = query({
    args: {
      search: v.string(),
    },
    handler: async (ctx, args) => {
      const search = args.search.trim().toLowerCase();
  
      if (!search) {
        return [];
      }
  
      const stores = await ctx.db
        .query("stores")
        .withIndex("by_approved", (q) => q.eq("isApproved", true))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
  
      return stores.filter((store) => {
        return (
          store.name.toLowerCase().includes(search) ||
          store.slug.toLowerCase().includes(search) ||
          store.city.toLowerCase().includes(search) ||
          store.address.toLowerCase().includes(search) ||
          (store.area ?? "").toLowerCase().includes(search) ||
          (store.description ?? "").toLowerCase().includes(search)
        );
      });
    },
  });