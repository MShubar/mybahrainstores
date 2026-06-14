import type { UserRole } from "@my-bahrain/types";
import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export { now, withTimestamps, withUpdatedAt } from "../shared/helpers";

export const USER_ROLES = ["customer", "store", "backoffice"] as const satisfies readonly UserRole[];

export async function countActiveBackofficeUsers(
  ctx: Ctx,
  excludeUserId?: Id<"users">,
): Promise<number> {
  const users = await ctx.db
    .query("users")
    .withIndex("by_role", (q) => q.eq("role", "backoffice"))
    .collect();

  return users.filter(
    (user) => user.isActive !== false && user._id !== excludeUserId,
  ).length;
}

export function assertNotSelf(
  actorId: Id<"users">,
  targetId: Id<"users">,
  message: string,
): void {
  if (actorId === targetId) {
    throw new ConvexError(message);
  }
}

export async function assertCanRemoveBackofficePrivilege(
  ctx: Ctx,
  target: Doc<"users">,
): Promise<void> {
  if (target.role !== "backoffice" || target.isActive === false) {
    return;
  }

  const remaining = await countActiveBackofficeUsers(ctx, target._id);
  if (remaining === 0) {
    throw new ConvexError("Cannot remove the last active backoffice admin");
  }
}
