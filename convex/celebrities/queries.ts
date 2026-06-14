/** Celebrity queries for customer and backoffice portals. */
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { isPublicProduct } from "../products/helpers";
import { isPublicStore } from "../stores/helpers";
import {
  areCelebritiesEnabled,
  getCelebrityBySlugOrThrow,
  isPublicCelebrity,
} from "./helpers";

export const listPublic = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const enabled = await areCelebritiesEnabled(ctx);
    if (!enabled) {
      return [];
    }

    const celebrities = await ctx.db
      .query("celebrities")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const sorted = celebrities.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
    );
    const visible =
      args.limit !== undefined ? sorted.slice(0, args.limit) : sorted;

    return visible.map((celebrity) => ({
      _id: celebrity._id,
      name: celebrity.name,
      slug: celebrity.slug,
      title: celebrity.title,
      avatarUrl: celebrity.avatarUrl,
      isVerified: celebrity.isVerified,
    }));
  },
});

export const searchPublic = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const enabled = await areCelebritiesEnabled(ctx);
    if (!enabled) {
      return [];
    }

    const search = args.search.trim().toLowerCase();
    if (!search) {
      return [];
    }

    const celebrities = await ctx.db
      .query("celebrities")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return celebrities
      .filter(
        (celebrity) =>
          celebrity.name.toLowerCase().includes(search) ||
          celebrity.slug.toLowerCase().includes(search) ||
          (celebrity.title ?? "").toLowerCase().includes(search),
      )
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      .map((celebrity) => ({
        _id: celebrity._id,
        name: celebrity.name,
        slug: celebrity.slug,
        title: celebrity.title,
        avatarUrl: celebrity.avatarUrl,
        isVerified: celebrity.isVerified,
      }));
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const enabled = await areCelebritiesEnabled(ctx);
    if (!enabled) {
      return null;
    }

    const celebrity = await ctx.db
      .query("celebrities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!celebrity || !isPublicCelebrity(celebrity)) {
      return null;
    }

    return celebrity;
  },
});

export const listPicks = query({
  args: {
    slug: v.string(),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const enabled = await areCelebritiesEnabled(ctx);
    if (!enabled) {
      return { celebrity: null, categories: [], picks: [] };
    }

    const celebrity = await ctx.db
      .query("celebrities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!celebrity || !isPublicCelebrity(celebrity)) {
      return { celebrity: null, categories: [], picks: [] };
    }

    const pickRows = await ctx.db
      .query("celebrityPicks")
      .withIndex("by_celebrity", (q) => q.eq("celebrityId", celebrity._id))
      .collect();

    pickRows.sort((a, b) => a.sortOrder - b.sortOrder);

    const categoryMap = new Map<string, { _id: string; name: string; slug: string }>();
    const picks = [];

    for (const pick of pickRows) {
      const product = await ctx.db.get(pick.productId);
      if (!product || !isPublicProduct(product)) {
        continue;
      }

      if (args.categoryId && product.categoryId !== args.categoryId) {
        continue;
      }

      const category = await ctx.db.get(product.categoryId);
      if (!category?.isActive) {
        continue;
      }

      const store = await ctx.db.get(product.storeId);
      if (!store || !isPublicStore(store)) {
        continue;
      }

      categoryMap.set(category._id, {
        _id: category._id,
        name: category.name,
        slug: category.slug,
      });

      picks.push({
        pickId: pick._id,
        sortOrder: pick.sortOrder,
        product: {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          imageUrls: product.imageUrls,
          categoryId: product.categoryId,
        },
      });
    }

    const categories = Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return {
      celebrity: {
        _id: celebrity._id,
        name: celebrity.name,
        slug: celebrity.slug,
        title: celebrity.title,
        bio: celebrity.bio,
        avatarUrl: celebrity.avatarUrl,
        isVerified: celebrity.isVerified,
      },
      categories,
      picks,
    };
  },
});

export const listBackoffice = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const celebrities = await ctx.db.query("celebrities").collect();
    return celebrities.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
    );
  },
});

export const listBackofficePicks = query({
  args: {
    celebrityId: v.id("celebrities"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const celebrity = await ctx.db.get(args.celebrityId);
    if (!celebrity) {
      return [];
    }

    const picks = await ctx.db
      .query("celebrityPicks")
      .withIndex("by_celebrity", (q) => q.eq("celebrityId", args.celebrityId))
      .collect();

    picks.sort((a, b) => a.sortOrder - b.sortOrder);

    const results = [];

    for (const pick of picks) {
      const product = await ctx.db.get(pick.productId);
      if (!product) {
        continue;
      }

      const category = await ctx.db.get(product.categoryId);

      results.push({
        pickId: pick._id,
        sortOrder: pick.sortOrder,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          categoryName: category?.name ?? "Unknown",
        },
      });
    }

    return results;
  },
});

export const getBackofficeById = query({
  args: {
    celebrityId: v.id("celebrities"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await ctx.db.get(args.celebrityId);
  },
});
