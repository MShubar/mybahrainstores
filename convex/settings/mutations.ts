import { query, mutation } from "../_generated/server";
import {
  assertKnownSettingKey,
  defaultToDocument,
  getDefaultByKey,
  now,
  seedDefaultSettingsRecords,
  validateValueForType,
} from "./helpers";
import { assertCanWriteSetting } from "./permissions";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { recordAuditLog } from "../auditLogs/helpers";
/**
 * Inserts all rows from `defaults.ts` into the `settings` table.
 * Idempotent: existing keys are skipped.
 * Run once from the Convex dashboard (Functions → settings/mutations → seedDefaultSettings).
 */
export const seedDefaultSettings = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await seedDefaultSettingsRecords(ctx);
  },
});

export const updateByKey = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);
    const key = assertKnownSettingKey(args.key);
    const def = getDefaultByKey(key)!;

    validateValueForType(def.type, args.value);

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();

    const editableMeta = existing ?? def;
    assertCanWriteSetting(user, editableMeta);

    const timestamp = now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: timestamp,
      });

      await recordAuditLog(ctx, {
        actorId: user._id,
        action: "setting_updated",
        entity: "settings",
        entityId: key,
        before: { value: existing.value },
        after: { value: args.value },
      });

      return existing._id;
    }

    const settingId = await ctx.db.insert(
      "settings",
      defaultToDocument(
        { ...def, value: args.value },
        { createdAt: timestamp, updatedAt: timestamp },
      ),
    );

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "setting_created",
      entity: "settings",
      entityId: key,
      after: { value: args.value },
    });

    return settingId;
  },
});

export const updateSetting = mutation({
  args: {
    settingId: v.id("settings"),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const setting = await ctx.db.get(args.settingId);

    if (!setting) {
      throw new ConvexError("Setting not found");
    }

    if (!setting.isEditable) {
      throw new ConvexError("Setting is not editable");
    }
    if (setting.type === "number" && typeof args.value !== "number") {
      throw new ConvexError("Setting value must be a number");
    }
    
    if (setting.type === "string" && typeof args.value !== "string") {
      throw new ConvexError("Setting value must be a string");
    }
    
    if (setting.type === "boolean" && typeof args.value !== "boolean") {
      throw new ConvexError("Setting value must be true or false");
    }
    
    if (setting.type === "array" && !Array.isArray(args.value)) {
      throw new ConvexError("Setting value must be an array");
    }

    await ctx.db.patch(args.settingId, {
      value: args.value,
      updatedAt: Date.now(),
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "setting_updated",
      entity: "settings",
      entityId: setting.key,
      before: { value: setting.value },
      after: { value: args.value },
    });

    return args.settingId;
  },
});