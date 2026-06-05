/** Category queries. */
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const listBackoffice = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await ctx.db.query("categories").collect();
  },
});

export const getById = query({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);

    if (!category?.isActive) {
      return null;
    }

    return category;
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!category?.isActive) {
      return null;
    }

    return category;
  },
});
