import type { CustomerAddressFieldsInput } from "@my-bahrain/validators";

export type DeliveryAddressRecord = {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area?: string;
  isDefault: boolean;
  summary?: string;
};

export function deliveryAddressToFormValues(
  address: DeliveryAddressRecord,
): CustomerAddressFieldsInput {
  return {
    label: address.label,
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    area: address.area,
  };
}

export function emptyDeliveryAddressForm(
  defaults: Partial<CustomerAddressFieldsInput> = {},
): CustomerAddressFieldsInput {
  return {
    label: defaults.label ?? "Home",
    fullName: defaults.fullName ?? "",
    phone: defaults.phone ?? "",
    addressLine1: defaults.addressLine1 ?? "",
    addressLine2: defaults.addressLine2 ?? "",
    city: defaults.city ?? "",
    area: defaults.area ?? "",
  };
}

export function parseAddressLabelOptions(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}
