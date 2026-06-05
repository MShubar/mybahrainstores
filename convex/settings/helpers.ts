import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { DEFAULT_SETTINGS, type DefaultSetting, type SettingKey, type SettingType } from "./defaults";

type Ctx = QueryCtx | MutationCtx;

export type SeedDefaultSettingsResult = {
  inserted: number;
  skipped: number;
  total: number;
};

export function now(): number {
  return Date.now();
}

export function getDefaultByKey(key: string): DefaultSetting | undefined {
  return DEFAULT_SETTINGS.find((setting) => setting.key === key);
}

export function isKnownSettingKey(key: string): key is SettingKey {
  return DEFAULT_SETTINGS.some((setting) => setting.key === key);
}

export function assertKnownSettingKey(key: string): SettingKey {
  const def = getDefaultByKey(key);
  if (!def) {
    throw new ConvexError(`Unknown setting key: ${key}`);
  }
  return def.key;
}

export function validateValueForType(type: SettingType, value: unknown): void {
  switch (type) {
    case "string":
      if (typeof value !== "string") {
        throw new ConvexError("Setting value must be a string");
      }
      return;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new ConvexError("Setting value must be a finite number");
      }
      return;
    case "boolean":
      if (typeof value !== "boolean") {
        throw new ConvexError("Setting value must be a boolean");
      }
      return;
    case "array":
      if (!Array.isArray(value)) {
        throw new ConvexError("Setting value must be an array");
      }
      return;
    case "json":
      if (value === null || (typeof value !== "object" && typeof value !== "string")) {
        throw new ConvexError("Setting value must be valid JSON");
      }
      return;
  }
}

export function defaultToDocument(
  def: DefaultSetting,
  timestamps: { createdAt: number; updatedAt: number },
): Omit<Doc<"settings">, "_id" | "_creationTime"> {
  return {
    key: def.key,
    value: def.value,
    type: def.type,
    group: def.group,
    label: def.label,
    isPublic: def.isPublic,
    isEditable: def.isEditable,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}

export function resolveSettingValue(
  stored: Doc<"settings"> | null,
  key: string,
): unknown {
  if (stored) {
    return stored.value;
  }
  return getDefaultByKey(key)?.value ?? null;
}

export function listPublicDefaults(): DefaultSetting[] {
  return DEFAULT_SETTINGS.filter((setting) => setting.isPublic);
}

export async function seedDefaultSettingsRecords(
  ctx: MutationCtx,
): Promise<SeedDefaultSettingsResult> {
  const timestamp = now();
  let inserted = 0;
  let skipped = 0;

  for (const def of DEFAULT_SETTINGS) {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", def.key))
      .unique();

    if (existing) {
      skipped += 1;
      continue;
    }

    await ctx.db.insert(
      "settings",
      defaultToDocument(def, { createdAt: timestamp, updatedAt: timestamp }),
    );
    inserted += 1;
  }

  return { inserted, skipped, total: DEFAULT_SETTINGS.length };
}

export async function getSettingValue<T>(
  ctx: Ctx,
  key: string,
  fallback: T
): Promise<T> {
  const setting = await ctx.db
    .query("settings")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();

  if (!setting) {
    return fallback;
  }

  return setting.value as T;
}

export async function requireSettingValue<T>(
  ctx: Ctx,
  key: string
): Promise<T> {
  const setting = await ctx.db
    .query("settings")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();

  if (!setting) {
    throw new ConvexError(`Missing setting: ${key}`);
  }

  return setting.value as T;
}
