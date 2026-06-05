import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import { requireStoreOwner } from "../shared/permissions";

export async function assertProductStoreAccess(
  ctx: { db: { get: (id: Id<"stores">) => Promise<Doc<"stores"> | null> } },
  user: Doc<"users">,
  storeId: Id<"stores">,
): Promise<void> {
  const store = await ctx.db.get(storeId);
  if (!store) {
    throw new ConvexError("Store not found");
  }
  requireStoreOwner(user, store);
}
