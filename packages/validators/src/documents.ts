import { z } from "zod";
import { settingTypeSchema } from "./settings";

/** Full-document validators aligned with `convex/schema.ts` (forms / API payloads). */

export const createUserProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(["customer", "store"]).optional(),
});

export const storeDocumentSchema = z.object({
  ownerId: z.string(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  categoryIds: z.array(z.string()),
  address: z.string().min(2),
  city: z.string().min(2),
  area: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isApproved: z.boolean(),
  isOpen: z.boolean(),
  isActive: z.boolean(),
});

export const categoryDocumentSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const productDocumentSchema = z.object({
  storeId: z.string(),
  categoryId: z.string(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  isAvailable: z.boolean(),
  isActive: z.boolean(),
});

export const orderItemDocumentSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
});

export const deliveryAddressDocumentSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  addressLine1: z.string().min(2),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  area: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const orderDocumentSchema = z.object({
  customerId: z.string(),
  storeId: z.string(),
  items: z.array(orderItemDocumentSchema).min(1),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  discountAmount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
  currency: z.string().length(3),
  orderStatus: z.string(),
  paymentStatus: z.string(),
  deliveryAddress: deliveryAddressDocumentSchema,
  customerNotes: z.string().optional(),
  storeNotes: z.string().optional(),
});

export const paymentDocumentSchema = z.object({
  orderId: z.string(),
  customerId: z.string(),
  provider: z.string(),
  providerPaymentId: z.string().optional(),
  providerCheckoutId: z.string().optional(),
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
  status: z.string(),
});

export const settingDocumentSchema = z.object({
  key: z.string().min(2),
  value: z.unknown(),
  type: settingTypeSchema,
  group: z.string().min(2),
  label: z.string().min(2),
  description: z.string().optional(),
  isPublic: z.boolean(),
  isEditable: z.boolean(),
});

export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>;
export type StoreDocumentInput = z.infer<typeof storeDocumentSchema>;
export type CategoryDocumentInput = z.infer<typeof categoryDocumentSchema>;
export type ProductDocumentInput = z.infer<typeof productDocumentSchema>;
export type OrderDocumentInput = z.infer<typeof orderDocumentSchema>;
export type PaymentDocumentInput = z.infer<typeof paymentDocumentSchema>;
export type SettingDocumentInput = z.infer<typeof settingDocumentSchema>;
