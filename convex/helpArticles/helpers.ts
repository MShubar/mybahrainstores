import type { MutationCtx } from "../_generated/server";
import { now } from "../shared/helpers";
import { DEFAULT_HELP_ARTICLES } from "./defaults";

export type SeedHelpArticlesResult = {
  inserted: number;
  skipped: number;
  total: number;
};

export async function seedDefaultHelpArticleRecords(
  ctx: MutationCtx,
): Promise<SeedHelpArticlesResult> {
  const timestamp = now();
  let inserted = 0;
  let skipped = 0;

  for (const article of DEFAULT_HELP_ARTICLES) {
    const existing = await ctx.db
      .query("helpArticles")
      .withIndex("by_slug", (q) => q.eq("slug", article.slug))
      .unique();

    if (existing) {
      skipped += 1;
      continue;
    }

    await ctx.db.insert("helpArticles", {
      slug: article.slug,
      title: article.title,
      category: article.category,
      content: article.content,
      isPublished: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    inserted += 1;
  }

  return { inserted, skipped, total: DEFAULT_HELP_ARTICLES.length };
}

export function matchesHelpSearch(
  article: { title: string; category: string; content: string },
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return (
    article.title.toLowerCase().includes(normalized) ||
    article.category.toLowerCase().includes(normalized) ||
    article.content.toLowerCase().includes(normalized)
  );
}
