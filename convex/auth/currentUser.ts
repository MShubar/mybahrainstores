import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function getCurrentUser(ctx: Ctx): Promise<Doc<"users"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }

  return await ctx.db.get(userId);
}

export async function requireCurrentUser(ctx: Ctx): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new ConvexError("Unauthorized");
  }

  if (!user.isActive) {
    throw new ConvexError("User account is inactive");
  }

  return user;
}
