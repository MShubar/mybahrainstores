import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { resolveSettingValue } from "../settings/helpers";

type Ctx = QueryCtx | MutationCtx;

export { now, withTimestamps, withUpdatedAt } from "../shared/helpers";

export function isPublicStore(store: {
  isApproved: boolean;
  isActive: boolean;
}): boolean {
  return store.isApproved && store.isActive;
}

export async function isStoreApprovalRequired(ctx: Ctx): Promise<boolean> {
  const stored = await ctx.db
    .query("settings")
    .withIndex("by_key", (q) => q.eq("key", "store_approval_required"))
    .unique();

  const value = resolveSettingValue(stored, "store_approval_required");
  return value === true;
}

export async function assertUniqueStoreSlug(
  ctx: Ctx,
  slug: string,
  excludeStoreId?: Id<"stores">,
): Promise<void> {
  const existing = await ctx.db
    .query("stores")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();

  if (existing && existing._id !== excludeStoreId) {
    throw new ConvexError("Store slug already exists");
  }
}

export async function assertValidCategories(
  ctx: Ctx,
  categoryIds: Id<"categories">[],
): Promise<void> {
  for (const categoryId of categoryIds) {
    const category = await ctx.db.get(categoryId);
    if (!category?.isActive) {
      throw new ConvexError("One or more categories are invalid");
    }
  }
}
