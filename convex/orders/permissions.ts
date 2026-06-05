import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { requireRole, requireStoreOwner } from "../shared/permissions";

export function assertOrderReadAccess(
  user: Doc<"users">,
  order: Doc<"orders">,
  store: Doc<"stores">,
): void {
  if (user.role === "backoffice" || order.customerId === user._id) {
    return;
  }
  if (user.role === "store") {
    requireStoreOwner(user, store);
    return;
  }
  throw new ConvexError("Forbidden");
}

export function assertOrderStatusUpdate(user: Doc<"users">, store: Doc<"stores">): void {
  requireRole(user, ["store", "backoffice"]);
  if (user.role === "store") {
    requireStoreOwner(user, store);
  }
}
