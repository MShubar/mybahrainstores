/** Product catalog mutations. */
import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice, requireCanManageStore } from "../auth/permissions";

export const createProduct = mutation({
  args: {
    storeId: v.id("stores"),
    categoryId: v.id("categories"),

    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),

    imageUrls: v.array(v.string()),

    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    stockQuantity: v.optional(v.number()),

    isAvailable: v.boolean(),
    isActive: v.boolean(),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const store = await ctx.db.get(args.storeId);

    if (!store) {
      throw new ConvexError("Store not found");
    }

    requireCanManageStore(user, store);

    const category = await ctx.db.get(args.categoryId);

    if (!category || !category.isActive) {
      throw new ConvexError("Invalid category");
    }

    const existingProducts = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    const duplicate = existingProducts.find(
      (product) => product.slug === args.slug
    );

    if (duplicate) {
      throw new ConvexError("Product slug already exists for this store");
    }

    const now = Date.now();

    return await ctx.db.insert("products", {
      storeId: args.storeId,
      categoryId: args.categoryId,

      name: args.name,
      slug: args.slug,
      description: args.description,

      imageUrls: args.imageUrls,

      price: args.price,
      compareAtPrice: args.compareAtPrice,
      stockQuantity: args.stockQuantity,

      isAvailable: args.isAvailable,
      isActive: args.isActive,

      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),

    categoryId: v.optional(v.id("categories")),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),

    imageUrls: v.optional(v.array(v.string())),

    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    stockQuantity: v.optional(v.number()),

    isAvailable: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new ConvexError("Product not found");
    }

    const store = await ctx.db.get(product.storeId);

    if (!store) {
      throw new ConvexError("Store not found");
    }

    requireCanManageStore(user, store);

    if (args.categoryId) {
      const category = await ctx.db.get(args.categoryId);

      if (!category || !category.isActive) {
        throw new ConvexError("Invalid category");
      }
    }

    if (args.slug && args.slug !== product.slug) {
      const products = await ctx.db
        .query("products")
        .withIndex("by_store", (q) => q.eq("storeId", product.storeId))
        .collect();

      const duplicate = products.find((item) => item.slug === args.slug);

      if (duplicate) {
        throw new ConvexError("Product slug already exists for this store");
      }
    }

    const { productId, ...patch } = args;

    await ctx.db.patch(productId, {
      ...patch,
      updatedAt: Date.now(),
    });

    return productId;
  },
});

export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new ConvexError("Product not found");
    }

    const store = await ctx.db.get(product.storeId);

    if (!store) {
      throw new ConvexError("Store not found");
    }

    requireCanManageStore(user, store);

    await ctx.db.delete(args.productId);

    return args.productId;
  },
});

export const toggleProductAvailable = mutation({
  args: {
    productId: v.id("products"),
    isAvailable: v.boolean(),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new ConvexError("Product not found");
    }

    const store = await ctx.db.get(product.storeId);

    if (!store) {
      throw new ConvexError("Store not found");
    }

    requireCanManageStore(user, store);

    await ctx.db.patch(args.productId, {
      isAvailable: args.isAvailable,
      updatedAt: Date.now(),
    });

    return args.productId;
  },
});

export const toggleProductActive = mutation({
  args: {
    productId: v.id("products"),
    isActive: v.boolean(),
  },

  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const product = await ctx.db.get(args.productId);

    if (!product) {
      throw new ConvexError("Product not found");
    }

    const store = await ctx.db.get(product.storeId);

    if (!store) {
      throw new ConvexError("Store not found");
    }

    requireCanManageStore(user, store);

    await ctx.db.patch(args.productId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return args.productId;
  },
});