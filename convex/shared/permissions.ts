import { getAuthUserId } from "@convex-dev/auth/server";
import type { UserRole } from "@my-bahrain/types";
import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function getAuthenticatedUser(ctx: Ctx): Promise<Doc<"users"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }

  return await ctx.db.get(userId);
}

export async function getAuthenticatedUserId(ctx: Ctx): Promise<Id<"users"> | null> {
  return await getAuthUserId(ctx);
}

export async function requireAuthenticatedUser(ctx: Ctx): Promise<Doc<"users">> {
  const user = await getAuthenticatedUser(ctx);
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
  return user;
}

export function requireRole(user: Doc<"users">, allowed: readonly UserRole[]): void {
  if (!user.role || !allowed.includes(user.role)) {
    throw new ConvexError("Forbidden");
  }
}

export function requireStoreOwner(user: Doc<"users">, store: Doc<"stores">): void {
  if (user.role === "backoffice") {
    return;
  }
  if (user.role === "store" && store.ownerId === user._id) {
    return;
  }
  throw new ConvexError("Forbidden");
}
