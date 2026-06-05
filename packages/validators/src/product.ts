import { z } from "zod";
import { currencyCodeSchema, documentIdSchema, positiveAmountSchema, slugSchema } from "./common";

export const createProductSchema = z.object({
  storeId: documentIdSchema,
  categoryId: documentIdSchema.optional(),
  name: z.string().min(1).max(200),
  slug: slugSchema,
  price: positiveAmountSchema,
  currency: currencyCodeSchema,
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema
  .partial()
  .extend({
    productId: documentIdSchema,
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field besides productId must be provided",
  });

export const createCategorySchema = z.object({
  name: z.string().min(1).max(120),
  slug: slugSchema,
  storeId: documentIdSchema.optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
