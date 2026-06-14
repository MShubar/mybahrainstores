import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getSettingValue } from "../settings/helpers";
import { isPublicProduct } from "../products/helpers";
import { isPublicStore } from "../stores/helpers";

type Ctx = QueryCtx | MutationCtx;

export function slugifyCelebrityName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isPublicCelebrity(celebrity: {
  isActive: boolean;
}): boolean {
  return celebrity.isActive;
}

export async function areCelebritiesEnabled(ctx: Ctx): Promise<boolean> {
  return await getSettingValue<boolean>(ctx, "celebrities_section_enabled", true);
}

export async function getCelebrityBySlugOrThrow(
  ctx: Ctx,
  slug: string,
): Promise<Doc<"celebrities">> {
  const celebrity = await ctx.db
    .query("celebrities")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();

  if (!celebrity || !isPublicCelebrity(celebrity)) {
    throw new ConvexError("Celebrity not found");
  }

  return celebrity;
}

export async function assertUniqueCelebritySlug(
  ctx: Ctx,
  slug: string,
  excludeCelebrityId?: Doc<"celebrities">["_id"],
): Promise<void> {
  const existing = await ctx.db
    .query("celebrities")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();

  if (existing && existing._id !== excludeCelebrityId) {
    throw new ConvexError("A celebrity with this slug already exists");
  }
}

export async function assertPublicProductPick(
  ctx: Ctx,
  productId: Doc<"products">["_id"],
): Promise<Doc<"products">> {
  const product = await ctx.db.get(productId);

  if (!product || !isPublicProduct(product)) {
    throw new ConvexError("Product is not available");
  }

  const store = await ctx.db.get(product.storeId);

  if (!store || !isPublicStore(store)) {
    throw new ConvexError("Product store is not available");
  }

  return product;
}
