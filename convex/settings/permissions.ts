import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { DefaultSetting } from "./defaults";
import { requireRole } from "../shared/permissions";

type ReadableSetting = Pick<Doc<"settings">, "isPublic"> | Pick<DefaultSetting, "isPublic">;

export function assertCanReadSetting(
  setting: ReadableSetting,
  user: Doc<"users"> | null,
): void {
  if (setting.isPublic) {
    return;
  }
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
  requireRole(user, ["backoffice"]);
}

type WritableSetting = Pick<Doc<"settings">, "isEditable"> | Pick<DefaultSetting, "isEditable">;

export function assertCanWriteSetting(user: Doc<"users">, setting: WritableSetting): void {
  requireRole(user, ["backoffice"]);
  if (!setting.isEditable) {
    throw new ConvexError("Setting is not editable");
  }
}
