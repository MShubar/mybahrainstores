/** Customer delivery address mutations. */
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import {
  assertCanAddAddress,
  clearDefaultAddresses,
  getOwnedAddress,
  now,
  requireCustomerUser,
  validateCustomerAddressInput,
} from "./helpers";

const addressFields = {
  label: v.string(),
  fullName: v.string(),
  phone: v.string(),
  addressLine1: v.string(),
  addressLine2: v.optional(v.string()),
  city: v.string(),
  area: v.optional(v.string()),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
};

export const create = mutation({
  args: {
    ...addressFields,
    setAsDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireCustomerUser(ctx);
    await assertCanAddAddress(ctx, user._id);

    const validated = validateCustomerAddressInput(args);
    const timestamp = now();
    const shouldSetDefault = args.setAsDefault ?? true;
    const existing = await ctx.db
      .query("customerAddresses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const isDefault = shouldSetDefault || existing.length === 0;

    if (isDefault) {
      await clearDefaultAddresses(ctx, user._id);
    }

    return await ctx.db.insert("customerAddresses", {
      userId: user._id,
      ...validated,
      isDefault,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    addressId: v.id("customerAddresses"),
    ...addressFields,
  },
  handler: async (ctx, args) => {
    const user = await requireCustomerUser(ctx);
    const address = await getOwnedAddress(ctx, user._id, args.addressId);
    const validated = validateCustomerAddressInput(args);

    await ctx.db.patch(address._id, {
      ...validated,
      updatedAt: now(),
    });

    return address._id;
  },
});

export const remove = mutation({
  args: {
    addressId: v.id("customerAddresses"),
  },
  handler: async (ctx, args) => {
    const user = await requireCustomerUser(ctx);
    const address = await getOwnedAddress(ctx, user._id, args.addressId);
    const wasDefault = address.isDefault;

    await ctx.db.delete(address._id);

    if (!wasDefault) {
      return null;
    }

    const remaining = await ctx.db
      .query("customerAddresses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (remaining.length === 0) {
      return null;
    }

    const nextDefault = remaining.sort((a, b) => b.updatedAt - a.updatedAt)[0]!;

    await ctx.db.patch(nextDefault._id, {
      isDefault: true,
      updatedAt: now(),
    });

    return nextDefault._id;
  },
});

export const setDefault = mutation({
  args: {
    addressId: v.id("customerAddresses"),
  },
  handler: async (ctx, args) => {
    const user = await requireCustomerUser(ctx);
    const address = await getOwnedAddress(ctx, user._id, args.addressId);
    const timestamp = now();

    await clearDefaultAddresses(ctx, user._id, address._id);

    await ctx.db.patch(address._id, {
      isDefault: true,
      updatedAt: timestamp,
    });

    return address._id;
  },
});
