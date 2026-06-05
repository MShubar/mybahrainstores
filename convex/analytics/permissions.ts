import type { Doc } from "../_generated/dataModel";
import { requireRole } from "../shared/permissions";

export function requireAnalyticsAccess(user: Doc<"users">): void {
  requireRole(user, ["store", "backoffice"]);
}
