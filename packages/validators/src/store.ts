import { z } from "zod";
import { documentIdSchema, slugSchema } from "./common";

export const createStoreSchema = z.object({
  name: z.string().min(1).max(120),
  slug: slugSchema,
  ownerId: documentIdSchema,
});

export const updateStoreSchema = z.object({
  storeId: documentIdSchema,
  name: z.string().min(1).max(120).optional(),
  slug: slugSchema.optional(),
  status: z.string().min(1).max(64).optional(),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
