/** Category mutations. */
import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { recordAuditLog } from "../auditLogs/helpers";
import { seedDefaultCategoriesRecords } from "./helpers";

/**
 * Inserts default marketplace categories from `defaults.ts`.
 * Idempotent: existing slugs are skipped.
 * Run once from the Convex dashboard (Functions → categories/mutations → seedDefaultCategories).
 */
export const seedDefaultCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await seedDefaultCategoriesRecords(ctx);
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    isActive: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new ConvexError("Category slug already exists");
    }

    const now = Date.now();

    const categoryId = await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      imageUrl: args.imageUrl,
      parentId: args.parentId,
      isActive: args.isActive,
      sortOrder: args.sortOrder,
      createdAt: now,
      updatedAt: now,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "category_created",
      entity: "categories",
      entityId: categoryId,
      after: { name: args.name, slug: args.slug },
    });

    return categoryId;
  },
});

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const category = await ctx.db.get(args.categoryId);

    if (!category) {
      throw new ConvexError("Category not found");
    }

    if (args.slug && args.slug !== category.slug) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
        .unique();

      if (existing) {
        throw new ConvexError("Category slug already exists");
      }
    }

    const { categoryId, ...patch } = args;

    await ctx.db.patch(categoryId, {
      ...patch,
      updatedAt: Date.now(),
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "category_updated",
      entity: "categories",
      entityId: categoryId,
      before: {
        name: category.name,
        slug: category.slug,
        isActive: category.isActive,
      },
      after: patch,
    });

    return categoryId;
  },
});

export const deleteCategory = mutation({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const category = await ctx.db.get(args.categoryId);

    if (!category) {
      throw new ConvexError("Category not found");
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .take(1);

    if (products.length > 0) {
      throw new ConvexError("Cannot delete category with products");
    }

    await ctx.db.delete(args.categoryId);

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "category_deleted",
      entity: "categories",
      entityId: args.categoryId,
      before: { name: category.name, slug: category.slug },
    });

    return args.categoryId;
  },
});

export const toggleCategoryActive = mutation({
  args: {
    categoryId: v.id("categories"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const category = await ctx.db.get(args.categoryId);

    if (!category) {
      throw new ConvexError("Category not found");
    }

    await ctx.db.patch(args.categoryId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "category_active_toggled",
      entity: "categories",
      entityId: args.categoryId,
      before: { isActive: category.isActive },
      after: { isActive: args.isActive },
    });

    return args.categoryId;
  },
});