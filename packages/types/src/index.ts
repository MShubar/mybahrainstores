export type UserRole = "customer" | "store" | "backoffice";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Store = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  categoryIds: string[];
  address: string;
  city: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  isApproved: boolean;
  isOpen: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

export type Product = {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrls: string[];
  price: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type DeliveryAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area?: string;
  latitude?: number;
  longitude?: number;
};

export type Order = {
  id: string;
  customerId: string;
  storeId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryAddress: DeliveryAddress;
  customerNotes?: string;
  storeNotes?: string;
  createdAt: number;
  updatedAt: number;
};

export type Payment = {
  id: string;
  orderId: string;
  customerId: string;
  provider: string;
  providerPaymentId?: string;
  providerCheckoutId?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: number;
  updatedAt: number;
};

export type SettingType = "string" | "number" | "boolean" | "json" | "array";

export type Setting = {
  id: string;
  key: string;
  value: unknown;
  type: SettingType;
  group: string;
  label: string;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  createdAt: number;
  updatedAt: number;
};

export type AuditLog = {
  id: string;
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  createdAt: number;
};