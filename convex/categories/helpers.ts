import type { MutationCtx } from "../_generated/server";
import { now } from "../shared/helpers";
import { DEFAULT_CATEGORIES } from "./defaults";

export { now, withTimestamps, withUpdatedAt } from "../shared/helpers";

export type SeedDefaultCategoriesResult = {
  inserted: number;
  skipped: number;
  total: number;
};

export async function seedDefaultCategoriesRecords(
  ctx: MutationCtx,
): Promise<SeedDefaultCategoriesResult> {
  const timestamp = now();
  let inserted = 0;
  let skipped = 0;

  for (const category of DEFAULT_CATEGORIES) {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", category.slug))
      .unique();

    if (existing) {
      skipped += 1;
      continue;
    }

    await ctx.db.insert("categories", {
      name: category.name,
      slug: category.slug,
      description: category.description,
      isActive: true,
      sortOrder: category.sortOrder,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    inserted += 1;
  }

  return { inserted, skipped, total: DEFAULT_CATEGORIES.length };
}
