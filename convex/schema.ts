import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Extended users table (Convex Auth + app profile fields)
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    imageUrl: v.optional(v.string()),
    role: v.optional(
      v.union(v.literal("customer"), v.literal("store"), v.literal("backoffice")),
    ),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_role", ["role"]),

  stores: defineTable({
    ownerId: v.id("users"),

    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),

    logoUrl: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),

    categoryIds: v.array(v.id("categories")),

    address: v.string(),
    city: v.string(),
    area: v.optional(v.string()),

    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),

    isApproved: v.boolean(),
    isOpen: v.boolean(),
    isActive: v.boolean(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_slug", ["slug"])
    .index("by_approved", ["isApproved"])
    .index("by_active", ["isActive"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),

    parentId: v.optional(v.id("categories")),

    isActive: v.boolean(),
    sortOrder: v.number(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"])
    .index("by_parent", ["parentId"]),

  products: defineTable({
    storeId: v.id("stores"),
    categoryId: v.id("categories"),

    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),

    imageUrls: v.array(v.string()),

    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    stockQuantity: v.optional(v.number()),

    isAvailable: v.boolean(),
    isActive: v.boolean(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_category", ["categoryId"])
    .index("by_store_category", ["storeId", "categoryId"])
    .index("by_available", ["isAvailable"])
    .index("by_active", ["isActive"]),

  orders: defineTable({
    customerId: v.id("users"),
    storeId: v.id("stores"),

    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),

    subtotal: v.number(),
    deliveryFee: v.number(),
    taxAmount: v.number(),
    discountAmount: v.number(),
    totalAmount: v.number(),

    currency: v.string(),

    orderStatus: v.string(),
    paymentStatus: v.string(),

    deliveryAddress: v.object({
      fullName: v.string(),
      phone: v.string(),
      addressLine1: v.string(),
      addressLine2: v.optional(v.string()),
      city: v.string(),
      area: v.optional(v.string()),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
    }),

    customerNotes: v.optional(v.string()),
    storeNotes: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_customer", ["customerId"])
    .index("by_store", ["storeId"])
    .index("by_order_status", ["orderStatus"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_store_status", ["storeId", "orderStatus"]),

    payments: defineTable({
      orderId: v.id("orders"),
  
      provider: v.string(),
      providerPaymentId: v.string(),
  
      amount: v.number(),
      currency: v.string(),
  
      status: v.string(),
  
      rawPayload: v.optional(v.any()),
  
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_order", ["orderId"])
      .index("by_provider_payment", ["providerPaymentId"]),

  settings: defineTable({
    key: v.string(),
    value: v.any(),

    type: v.union(
      v.literal("string"),
      v.literal("number"),
      v.literal("boolean"),
      v.literal("array"),
      v.literal("json"),
    ),

    group: v.string(),
    label: v.string(),
    description: v.optional(v.string()),

    isPublic: v.boolean(),
    isEditable: v.boolean(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_group", ["group"])
    .index("by_public", ["isPublic"]),

  auditLogs: defineTable({
    actorId: v.optional(v.id("users")),

    action: v.string(),
    entity: v.string(),
    entityId: v.optional(v.string()),

    before: v.optional(v.any()),
    after: v.optional(v.any()),

    createdAt: v.number(),
  })
    .index("by_actor", ["actorId"])
    .index("by_entity", ["entity"])
    .index("by_action", ["action"]),

  systemLogs: defineTable({
    userId: v.optional(v.id("users")),

    level: v.string(),
    source: v.string(),
    message: v.string(),
    context: v.optional(v.any()),

    createdAt: v.number(),
  })
    .index("by_level", ["level"])
    .index("by_source", ["source"])
    .index("by_user", ["userId"]),

    files: defineTable({
      storageId: v.id("_storage"),
    
      url: v.string(),
    
      uploadedBy: v.id("users"),
    
      entityType: v.optional(v.string()),
      entityId: v.optional(v.string()),
    
      fileName: v.optional(v.string()),
      contentType: v.optional(v.string()),
      size: v.optional(v.number()),
    
      createdAt: v.number(),
    })
      .index("by_uploaded_by", ["uploadedBy"])
      .index("by_entity", ["entityType", "entityId"]),

      notifications: defineTable({
        userId: v.id("users"),
      
        title: v.string(),
        message: v.string(),
      
        type: v.string(),
      
        isRead: v.boolean(),
      
        entityType: v.optional(v.string()),
        entityId: v.optional(v.string()),
      
        createdAt: v.number(),
      })
      .index("by_user", ["userId"])
      .index("by_user_read", ["userId", "isRead"]),

  rateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    windowStart: v.number(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  analyticsEvents: defineTable({
    userId: v.optional(v.id("users")),

    event: v.string(),

    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),

    metadata: v.optional(v.any()),

    createdAt: v.number(),
  })
    .index("by_event", ["event"])
    .index("by_user", ["userId"])
    .index("by_entity", ["entityType", "entityId"]),
});
