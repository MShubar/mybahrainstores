import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { requireRole } from "../shared/permissions";

export function assertPaymentReadAccess(user: Doc<"users">, order: Doc<"orders">): void {
  if (user.role === "backoffice" || order.customerId === user._id) {
    return;
  }
  throw new ConvexError("Forbidden");
}

export function assertPaymentWriteAccess(user: Doc<"users">): void {
  requireRole(user, ["backoffice"]);
}
