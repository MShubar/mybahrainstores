import type { UserRole } from "@my-bahrain/types";
import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { requireRole } from "../shared/permissions";

export function requireBackoffice(user: Doc<"users">): void {
  requireRole(user, ["backoffice"]);
}

export function assertSelfOrBackoffice(actor: Doc<"users">, targetUserId: string): void {
  if (actor.role === "backoffice" || actor._id === targetUserId) {
    return;
  }
  throw new ConvexError("Forbidden");
}

export function assertRoleChange(actor: Doc<"users">, nextRole: UserRole): void {
  requireBackoffice(actor);
  if (nextRole === "backoffice" && actor.role !== "backoffice") {
    throw new ConvexError("Forbidden");
  }
}
