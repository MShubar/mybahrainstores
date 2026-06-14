import { z } from "zod";

export const customerAddressFieldsSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(32),
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  phone: z.string().trim().min(6, "Phone is required").max(24),
  addressLine1: z.string().trim().min(2, "Address is required").max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, "City is required").max(80),
  area: z.string().trim().max(80).optional(),
});

export const createCustomerAddressSchema = customerAddressFieldsSchema.extend({
  setAsDefault: z.boolean().optional(),
});

export const updateCustomerAddressSchema = customerAddressFieldsSchema.extend({
  addressId: z.string().min(1),
});

export type CustomerAddressFieldsInput = z.infer<typeof customerAddressFieldsSchema>;
export type CreateCustomerAddressInput = z.infer<typeof createCustomerAddressSchema>;
