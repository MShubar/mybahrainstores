import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireBackoffice } from "../auth/permissions";
import { requireCurrentUser } from "../auth/currentUser";
import { matchesHelpSearch } from "./helpers";

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("helpArticles").collect();
    return articles
      .filter((article) => article.isPublished)
      .sort((a, b) => a.title.localeCompare(b.title));
  },
});

export const listByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("helpArticles")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    return articles
      .filter((article) => article.isPublished)
      .sort((a, b) => a.title.localeCompare(b.title));
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("helpArticles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!article?.isPublished) {
      return null;
    }

    return article;
  },
});

export const searchHelpArticles = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const articles = await ctx.db.query("helpArticles").collect();

    return articles
      .filter((article) => article.isPublished)
      .filter((article) => matchesHelpSearch(article, args.query))
      .sort((a, b) => a.title.localeCompare(b.title));
  },
});

export const getHelpCenterMetrics = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const events = await ctx.db.query("analyticsEvents").collect();
    const tickets = await ctx.db.query("supportTickets").collect();
    const stores = await ctx.db.query("stores").collect();

    const helpArticleViews = events.filter(
      (event) => event.event === "help_article_view",
    ).length;
    const helpVideoViews = events.filter(
      (event) => event.event === "help_video_view",
    ).length;
    const supportTicketsCreated = events.filter(
      (event) => event.event === "support_ticket_created",
    ).length;
    const storesActivated = events.filter(
      (event) => event.event === "store_activated",
    ).length;

    const approvedStores = stores.filter((store) => store.isApproved).length;

    return {
      helpArticleViews,
      helpVideoViews,
      supportTicketsCreated,
      supportTicketsTotal: tickets.length,
      storesActivated,
      approvedStores,
      activationRate:
        stores.length > 0 ? approvedStores / stores.length : 0,
    };
  },
});
