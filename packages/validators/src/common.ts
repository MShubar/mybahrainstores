import { z } from "zod";

export const userRoleSchema = z.enum(["customer", "store", "backoffice"]);

export const documentIdSchema = z.string().min(1);

export const slugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens");

export const currencyCodeSchema = z.string().length(3);

export const positiveAmountSchema = z.number().finite().nonnegative();

export const timestampSchema = z.number().int().positive();
