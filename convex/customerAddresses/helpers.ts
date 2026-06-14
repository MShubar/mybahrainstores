import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { requireCurrentUser } from "../auth/currentUser";
import { getSettingValue } from "../settings/helpers";
import { now } from "../shared/helpers";

type Ctx = QueryCtx | MutationCtx;

export type CustomerAddressInput = {
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area?: string;
  latitude?: number;
  longitude?: number;
};

export { now };

export function normalizeAddressLabel(label: string): string {
  return label.trim();
}

export function validateCustomerAddressInput(input: CustomerAddressInput): CustomerAddressInput {
  const label = normalizeAddressLabel(input.label);
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();
  const addressLine1 = input.addressLine1.trim();
  const addressLine2 = input.addressLine2?.trim();
  const city = input.city.trim();
  const area = input.area?.trim();

  if (!label) {
    throw new ConvexError("Address label is required");
  }

  if (label.length > 32) {
    throw new ConvexError("Address label is too long");
  }

  if (fullName.length < 2) {
    throw new ConvexError("Full name is required");
  }

  if (phone.length < 6) {
    throw new ConvexError("Phone number is required");
  }

  if (addressLine1.length < 2) {
    throw new ConvexError("Address line 1 is required");
  }

  if (city.length < 2) {
    throw new ConvexError("City is required");
  }

  return {
    label,
    fullName,
    phone,
    addressLine1,
    addressLine2: addressLine2 || undefined,
    city,
    area: area || undefined,
    latitude: input.latitude,
    longitude: input.longitude,
  };
}

export async function requireCustomerUser(ctx: Ctx) {
  const user = await requireCurrentUser(ctx);

  if (user.role !== "customer") {
    throw new ConvexError("Only customers can manage delivery addresses");
  }

  return user;
}

export async function getOwnedAddress(
  ctx: Ctx,
  userId: Id<"users">,
  addressId: Id<"customerAddresses">,
): Promise<Doc<"customerAddresses">> {
  const address = await ctx.db.get(addressId);

  if (!address || address.userId !== userId) {
    throw new ConvexError("Address not found");
  }

  return address;
}

export async function listAddressesForUser(ctx: Ctx, userId: Id<"users">) {
  const addresses = await ctx.db
    .query("customerAddresses")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  addresses.sort((a, b) => {
    if (a.isDefault !== b.isDefault) {
      return a.isDefault ? -1 : 1;
    }

    return b.updatedAt - a.updatedAt;
  });

  return addresses;
}

export async function getDefaultAddressForUser(ctx: Ctx, userId: Id<"users">) {
  const addresses = await listAddressesForUser(ctx, userId);
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
}

export async function getMaxCustomerAddresses(ctx: Ctx): Promise<number> {
  const max = await getSettingValue<number>(ctx, "max_customer_delivery_addresses", 10);
  return Math.max(1, Math.min(max, 25));
}

export async function clearDefaultAddresses(
  ctx: MutationCtx,
  userId: Id<"users">,
  exceptAddressId?: Id<"customerAddresses">,
) {
  const addresses = await listAddressesForUser(ctx, userId);
  const timestamp = now();

  for (const address of addresses) {
    if (!address.isDefault) {
      continue;
    }

    if (exceptAddressId && address._id === exceptAddressId) {
      continue;
    }

    await ctx.db.patch(address._id, {
      isDefault: false,
      updatedAt: timestamp,
    });
  }
}

export async function assertCanAddAddress(ctx: Ctx, userId: Id<"users">) {
  const addresses = await listAddressesForUser(ctx, userId);
  const max = await getMaxCustomerAddresses(ctx);

  if (addresses.length >= max) {
    throw new ConvexError(`You can save up to ${max} delivery addresses`);
  }
}

export function formatAddressSummary(address: Doc<"customerAddresses">): string {
  const parts = [address.addressLine1, address.area, address.city].filter(Boolean);
  return parts.join(", ");
}
