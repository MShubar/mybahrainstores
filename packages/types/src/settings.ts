import type { Timestamps } from "./common";

export type SettingType = "string" | "number" | "boolean" | "array" | "json";

export type PaymentProvider = "mock" | "tap";

export type SettingKey =
  | "currency"
  | "tax_percentage"
  | "default_delivery_fee"
  | "platform_commission_percentage"
  | "order_statuses"
  | "payment_statuses"
  | "store_approval_required"
  | "maintenance_mode"
  | "default_order_status"
  | "default_payment_status"
  | "payment_provider"
  | "minimum_order_amount"
  | "max_cart_items"
  | "store_auto_approval"
  | "mock_payments_enabled";

export type SettingGroup =
  | "general"
  | "payments"
  | "delivery"
  | "orders"
  | "stores"
  | "system";

export type Setting = Timestamps & {
  _id: string;
  key: SettingKey;
  value: unknown;
  type: SettingType;
  group: SettingGroup;
  label: string;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
};

export type PublicSetting = Pick<
  Setting,
  "key" | "value" | "type" | "group" | "label" | "isPublic" | "isEditable"
>;
