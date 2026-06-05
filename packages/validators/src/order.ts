import { z } from "zod";
import { currencyCodeSchema, documentIdSchema, positiveAmountSchema } from "./common";

export const orderLineItemSchema = z.object({
  productId: documentIdSchema,
  quantity: z.number().int().positive().max(999),
});

export const createOrderSchema = z.object({
  storeId: documentIdSchema,
  items: z.array(orderLineItemSchema).min(1),
  currency: currencyCodeSchema,
});

export const updateOrderStatusSchema = z.object({
  orderId: documentIdSchema,
  status: z.string().min(1).max(64),
});

export const orderTotalsSchema = z.object({
  subtotal: positiveAmountSchema,
  tax: positiveAmountSchema,
  deliveryFee: positiveAmountSchema,
  total: positiveAmountSchema,
  currency: currencyCodeSchema,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderTotalsInput = z.infer<typeof orderTotalsSchema>;
