import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getCurrentUser, requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { seedDefaultHelpArticleRecords } from "./helpers";

export const seedDefaultHelpArticles = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await seedDefaultHelpArticleRecords(ctx);
  },
});

export const ensureHelpArticlesSeeded = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("helpArticles").take(1);

    if (existing.length > 0) {
      return { inserted: 0, skipped: 0, total: 0, alreadySeeded: true };
    }

    const result = await seedDefaultHelpArticleRecords(ctx);
    return { ...result, alreadySeeded: false };
  },
});

export const trackArticleView = mutation({
  args: {
    slug: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    return await ctx.db.insert("analyticsEvents", {
      userId: user?._id,
      event: "help_article_view",
      entityType: "helpArticle",
      entityId: args.slug,
      metadata: { category: args.category },
      createdAt: Date.now(),
    });
  },
});

export const trackVideoView = mutation({
  args: {
    videoId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    return await ctx.db.insert("analyticsEvents", {
      userId: user?._id,
      event: "help_video_view",
      entityType: "helpVideo",
      entityId: args.videoId,
      metadata: { title: args.title },
      createdAt: Date.now(),
    });
  },
});
