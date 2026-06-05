import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";

export function requireBackoffice(user: Doc<"users">) {
  if (user.role !== "backoffice") {
    throw new ConvexError("Backoffice access required");
  }
}

export function requireStore(user: Doc<"users">) {
  if (user.role !== "store") {
    throw new ConvexError("Store access required");
  }
}

export function requireCustomer(user: Doc<"users">) {
  if (user.role !== "customer") {
    throw new ConvexError("Customer access required");
  }
}

export function requireRole(
  user: Doc<"users">,
  roles: Array<Doc<"users">["role"]>
) {
  if (!roles.includes(user.role)) {
    throw new ConvexError("Permission denied");
  }
}

export function canManageStore(user: Doc<"users">, store: Doc<"stores">) {
  if (user.role === "backoffice") {
    return true;
  }

  if (user.role === "store" && store.ownerId === user._id) {
    return true;
  }

  return false;
}

export function requireCanManageStore(
  user: Doc<"users">,
  store: Doc<"stores">
) {
  if (!canManageStore(user, store)) {
    throw new ConvexError("You cannot manage this store");
  }
}