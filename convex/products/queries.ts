/** Product catalog queries. */
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice, requireCanManageStore } from "../auth/permissions";
import { getAuthenticatedUser } from "../shared/permissions";
import { isPublicProduct } from "./helpers";
import { isPublicStore } from "../stores/helpers";

export const listPublicByStore = query({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);

    if (!store || !store.isApproved || !store.isActive) {
      return [];
    }

    return await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("isAvailable"), true)
        )
      )
      .collect();
  },
});

export const listMyStoreProducts = query({
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
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();
  },
});

export const listBackofficeProducts = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await ctx.db.query("products").collect();
  },
});

export const getById = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);

    if (!product) {
      return null;
    }

    const store = await ctx.db.get(product.storeId);
    if (!store) {
      return null;
    }

    const user = await getAuthenticatedUser(ctx);

    if (user?.role === "backoffice") {
      return product;
    }

    if (user?.role === "store" && store.ownerId === user._id) {
      return product;
    }

    return isPublicStore(store) && isPublicProduct(product) ? product : null;
  },
});

export const getByStoreAndSlug = query({
  args: {
    storeId: v.id("stores"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);

    if (!store || !isPublicStore(store)) {
      return null;
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    const product = products.find((item) => item.slug === args.slug) ?? null;

    if (!product || !isPublicProduct(product)) {
      return null;
    }

    return product;
  },
});

export const searchPublicProducts = query({
    args: {
      search: v.string(),
    },
    handler: async (ctx, args) => {
      const search = args.search.trim().toLowerCase();
  
      if (!search) {
        return [];
      }
  
      const products = await ctx.db
        .query("products")
        .filter((q) =>
          q.and(
            q.eq(q.field("isActive"), true),
            q.eq(q.field("isAvailable"), true),
          ),
        )
        .collect();

      const visibleProducts = [];

      for (const product of products) {
        const store = await ctx.db.get(product.storeId);
        if (!store || !isPublicStore(store)) {
          continue;
        }

        if (
          product.name.toLowerCase().includes(search) ||
          product.slug.toLowerCase().includes(search) ||
          (product.description ?? "").toLowerCase().includes(search)
        ) {
          visibleProducts.push(product);
        }
      }

      return visibleProducts;
    },
  });