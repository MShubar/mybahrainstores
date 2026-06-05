import { z } from "zod";

export const settingKeySchema = z.enum([
  "currency",
  "tax_percentage",
  "default_delivery_fee",
  "platform_commission_percentage",
  "order_statuses",
  "payment_statuses",
  "store_approval_required",
  "maintenance_mode",
  "default_order_status",
  "default_payment_status",
  "payment_provider",
  "minimum_order_amount",
  "max_cart_items",
  "store_auto_approval",
  "mock_payments_enabled",
]);

export const paymentProviderSchema = z.enum(["mock", "tap"]);

export const settingTypeSchema = z.enum(["string", "number", "boolean", "array", "json"]);

export const getSettingByKeySchema = z.object({
  key: settingKeySchema,
});

export const updateSettingByKeySchema = z.object({
  key: settingKeySchema,
  value: z.unknown(),
});

export const orderStatusesSettingValueSchema = z
  .array(z.string().min(1).max(64))
  .min(1);

export const paymentStatusesSettingValueSchema = z
  .array(z.string().min(1).max(64))
  .min(1);

export const currencySettingValueSchema = z.string().length(3);

export const taxPercentageSettingValueSchema = z.number().finite().min(0).max(100);

export const deliveryFeeSettingValueSchema = z.number().finite().nonnegative();

export const platformCommissionSettingValueSchema = z.number().finite().min(0).max(100);

export type SettingKey = z.infer<typeof settingKeySchema>;
export type GetSettingByKeyInput = z.infer<typeof getSettingByKeySchema>;
export type UpdateSettingByKeyInput = z.infer<typeof updateSettingByKeySchema>;
