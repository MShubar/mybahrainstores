import type { DocumentId, Timestamps } from "./common";

export type Order = Timestamps & {
  _id: DocumentId;
  customerId: DocumentId;
  storeId: DocumentId;
  status: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  currency: string;
};

export type OrderTotals = Pick<Order, "subtotal" | "tax" | "deliveryFee" | "total" | "currency">;
