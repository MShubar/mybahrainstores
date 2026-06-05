import { ConvexError } from "convex/values";
import type { MutationCtx } from "../_generated/server";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export async function enforceRateLimit(
  ctx: MutationCtx,
  options: RateLimitOptions,
): Promise<void> {
  const now = Date.now();

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", options.key))
    .unique();

  if (!existing) {
    await ctx.db.insert("rateLimits", {
      key: options.key,
      count: 1,
      windowStart: now,
      updatedAt: now,
    });
    return;
  }

  if (now - existing.windowStart > options.windowMs) {
    await ctx.db.patch(existing._id, {
      count: 1,
      windowStart: now,
      updatedAt: now,
    });
    return;
  }

  if (existing.count >= options.limit) {
    throw new ConvexError("Too many requests. Please try again later.");
  }

  await ctx.db.patch(existing._id, {
    count: existing.count + 1,
    updatedAt: now,
  });
}
