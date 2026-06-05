import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUser } from "../shared/permissions";
import { DEFAULT_SETTINGS } from "./defaults";
import {
  assertKnownSettingKey,
  defaultToDocument,
  getDefaultByKey,
  listPublicDefaults,
  now,
  resolveSettingValue,
} from "./helpers";
import { assertCanReadSetting } from "./permissions";
import { requireBackoffice } from "../auth/permissions";
import { requireCurrentUser } from "../auth/currentUser";

export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    assertKnownSettingKey(args.key);

    const stored = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    const user = await getAuthenticatedUser(ctx);
    const def = getDefaultByKey(args.key)!;

    if (stored) {
      assertCanReadSetting(stored, user);
      return stored;
    }

    assertCanReadSetting(def, user);
    return defaultToDocument(def, { createdAt: 0, updatedAt: 0 });
  },
});

export const getValueByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    assertKnownSettingKey(args.key);

    const stored = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    const user = await getAuthenticatedUser(ctx);
    const def = getDefaultByKey(args.key)!;

    if (stored) {
      assertCanReadSetting(stored, user);
    } else {
      assertCanReadSetting(def, user);
    }

    return resolveSettingValue(stored, args.key);
  },
});

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const stored = await ctx.db
      .query("settings")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .collect();

    const storedKeys = new Set(stored.map((row) => row.key));
    const timestamp = now();
    const fallback = listPublicDefaults()
      .filter((def) => !storedKeys.has(def.key))
      .map((def) => defaultToDocument(def, { createdAt: timestamp, updatedAt: timestamp }));

    return [...stored, ...fallback];
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user || user.role !== "backoffice") {
      return [];
    }

    const stored = await ctx.db.query("settings").collect();
    const storedKeys = new Set(stored.map((row) => row.key));

    const timestamp = now();
    const fallback = DEFAULT_SETTINGS.filter((def) => !storedKeys.has(def.key)).map((def) =>
      defaultToDocument(def, { createdAt: timestamp, updatedAt: timestamp }),
    );

    return [...stored, ...fallback];
  },
});

export const listGrouped = query({
  args: {},
  handler: async (ctx) => {
      const user = await requireCurrentUser(ctx);
      requireBackoffice(user);

    const settings = await ctx.db.query("settings").collect();

    return settings.reduce<Record<string, typeof settings>>((groups, setting) => {
      const groupKey = setting.group;
      const bucket = groups[groupKey] ?? [];
      bucket.push(setting);
      groups[groupKey] = bucket;
      return groups;
    }, {});
  },
});