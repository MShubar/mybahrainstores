import type { Doc } from "../_generated/dataModel";
import { requireStoreOwner } from "../shared/permissions";

export function assertCategoryAccess(user: Doc<"users">, store: Doc<"stores"> | null): void {
  if (!store) {
    return;
  }
  requireStoreOwner(user, store);
}
