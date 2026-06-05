import type { Doc } from "../_generated/dataModel";
import { requireRole, requireStoreOwner } from "../shared/permissions";

export function requireStoreManager(user: Doc<"users">): void {
  requireRole(user, ["store", "backoffice"]);
}

export { requireStoreOwner };
