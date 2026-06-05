import { z } from "zod";
import { currencyCodeSchema, documentIdSchema, positiveAmountSchema } from "./common";

export const paymentProviderSchema = z.string().min(1).max(32);

export const createPaymentSchema = z.object({
  orderId: documentIdSchema,
  provider: paymentProviderSchema,
  externalId: z.string().min(1).max(256),
  amount: positiveAmountSchema,
  currency: currencyCodeSchema,
});

export const updatePaymentStatusSchema = z.object({
  paymentId: documentIdSchema,
  status: z.string().min(1).max(64),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
