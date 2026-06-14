import { createAccount } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { internalMutation, internalQuery } from "../_generated/server";
import { calculateOrderCommission } from "../commissions/helpers";
import { getSettingValue } from "../settings/helpers";
import { now } from "../shared/helpers";
import {
  DEMO_CUSTOMER_EMAIL,
  DEMO_CUSTOMER_NAME,
  DEMO_OWNER_NAME,
  DEMO_PASSWORD,
  DEMO_STORE_NAME,
  DEMO_STORE_OWNER_EMAIL,
  DEMO_STORE_SLUG,
  DEMO_TARGET_COMMISSION,
  DEMO_TARGET_NET_EARNINGS,
  DEMO_TARGET_ORDER_COUNT,
  DEMO_TARGET_REVENUE,
} from "./demoConstants";
import { DEMO_ORDER_STATUS_SAMPLES, DEMO_PRODUCTS } from "./demoData";

function roundMoney(amount: number): number {
  return Math.round(amount * 1000) / 1000;
}

export const findUserIdByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    return user && !user.deletedAt ? user._id : null;
  },
});

export const upsertDemoUserProfile = internalMutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("customer"), v.literal("store")),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = now();

    await ctx.db.patch(args.userId, {
      name: args.name,
      email: args.email,
      phone: args.phone,
      role: args.role,
      isActive: true,
      emailVerificationTime: timestamp,
      updatedAt: timestamp,
    });

    return args.userId;
  },
});

export const rebuildDemoStore = internalMutation({
  args: {
    storeOwnerId: v.id("users"),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const timestamp = now();
    const currency = await getSettingValue<string>(ctx, "currency", "BHD");
    const commissionRate = await getSettingValue<number>(
      ctx,
      "default_commission_rate",
      10,
    );

    const electronicsCategory = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", "electronics"))
      .unique();

    if (!electronicsCategory) {
      throw new ConvexError(
        "Electronics category not found. Run categories seed first.",
      );
    }

    let store = await ctx.db
      .query("stores")
      .withIndex("by_slug", (q) => q.eq("slug", DEMO_STORE_SLUG))
      .unique();

    if (!store) {
      const storeId = await ctx.db.insert("stores", {
        ownerId: args.storeOwnerId,
        name: DEMO_STORE_NAME,
        slug: DEMO_STORE_SLUG,
        description: "Demo store for onboarding and sales presentations",
        logoUrl:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&auto=format&fit=crop",
        coverImageUrl:
          "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&auto=format&fit=crop",
        categoryIds: [electronicsCategory._id],
        address: "Manama, Bahrain",
        city: "Manama",
        area: "Seef",
        isApproved: true,
        isOpen: true,
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      store = (await ctx.db.get(storeId))!;
    } else {
      await ctx.db.patch(store._id, {
        ownerId: args.storeOwnerId,
        name: DEMO_STORE_NAME,
        description: "Demo store for onboarding and sales presentations",
        categoryIds: [electronicsCategory._id],
        address: "Manama, Bahrain",
        city: "Manama",
        isApproved: true,
        isOpen: true,
        isActive: true,
        updatedAt: timestamp,
      });
    }

    const existingProducts = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", store._id))
      .collect();

    for (const product of existingProducts) {
      await ctx.db.delete(product._id);
    }

    const productIds: Id<"products">[] = [];

    for (const product of DEMO_PRODUCTS) {
      const productId = await ctx.db.insert("products", {
        storeId: store._id,
        categoryId: electronicsCategory._id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        imageUrls: [product.imageUrl],
        price: product.price,
        stockQuantity: product.stockQuantity,
        isAvailable: true,
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      productIds.push(productId);
    }

    const existingOrders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", store._id))
      .collect();

    for (const order of existingOrders) {
      const payments = await ctx.db
        .query("payments")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .collect();

      for (const payment of payments) {
        await ctx.db.delete(payment._id);
      }

      await ctx.db.delete(order._id);
    }

    const existingPayouts = await ctx.db
      .query("payouts")
      .withIndex("by_store", (q) => q.eq("storeId", store._id))
      .collect();

    for (const payout of existingPayouts) {
      await ctx.db.delete(payout._id);
    }

    const deliveryAddress = {
      fullName: DEMO_CUSTOMER_NAME,
      phone: "+973 3900 0001",
      addressLine1: "Building 12, Road 123",
      addressLine2: "Flat 4B",
      city: "Manama",
      area: "Juffair",
    };

    const paidOrderCount = 130;
    const paidOrderAmounts: number[] = [];
    const baseAmount = roundMoney(DEMO_TARGET_REVENUE / paidOrderCount);

    for (let index = 0; index < paidOrderCount - 1; index += 1) {
      paidOrderAmounts.push(baseAmount);
    }

    const allocated = roundMoney(baseAmount * (paidOrderCount - 1));
    paidOrderAmounts.push(roundMoney(DEMO_TARGET_REVENUE - allocated));

    let paidIndex = 0;

    for (let orderNumber = 1; orderNumber <= DEMO_TARGET_ORDER_COUNT; orderNumber += 1) {
      const isPaid = orderNumber <= paidOrderCount;
      const createdAt = timestamp - orderNumber * 6 * 60 * 60 * 1000;
      const productId = productIds[orderNumber % productIds.length]!;
      const product = DEMO_PRODUCTS[orderNumber % DEMO_PRODUCTS.length]!;

      let subtotal = 0;
      let items: Array<{
        productId: Id<"products">;
        name: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }> = [];

      if (isPaid) {
        const targetTotal = paidOrderAmounts[paidIndex]!;
        paidIndex += 1;
        const quantity = Math.max(1, Math.round(targetTotal / product.price));
        subtotal = roundMoney(product.price * quantity);
        items = [
          {
            productId,
            name: product.name,
            quantity,
            unitPrice: product.price,
            totalPrice: subtotal,
          },
        ];
      } else {
        const quantity = 1 + (orderNumber % 2);
        subtotal = roundMoney(product.price * quantity);
        items = [
          {
            productId,
            name: product.name,
            quantity,
            unitPrice: product.price,
            totalPrice: subtotal,
          },
        ];
      }

      const deliveryFee = isPaid ? 1.5 : 0;
      const taxAmount = 0;
      const discountAmount = 0;
      const totalAmount = roundMoney(subtotal + deliveryFee + taxAmount - discountAmount);

      const commission = isPaid
        ? calculateOrderCommission(totalAmount, commissionRate)
        : null;

      const statusSample =
        DEMO_ORDER_STATUS_SAMPLES[orderNumber % DEMO_ORDER_STATUS_SAMPLES.length]!;

      const orderStatus = isPaid
        ? statusSample === "pending"
          ? "confirmed"
          : statusSample
        : "pending";

      const paymentStatus = isPaid ? "paid" : "pending";

      const orderId = await ctx.db.insert("orders", {
        customerId: args.customerId,
        storeId: store._id,
        items,
        subtotal,
        deliveryFee,
        taxAmount,
        discountAmount,
        totalAmount,
        commissionRate: commission?.commissionRate,
        commissionAmount: commission?.commissionAmount,
        storeAmount: commission?.storeAmount,
        currency,
        orderStatus,
        paymentStatus,
        deliveryAddress,
        customerNotes: `Demo order #${1000 + orderNumber}`,
        createdAt,
        updatedAt: createdAt,
      });

      if (isPaid) {
        await ctx.db.insert("payments", {
          orderId,
          provider: "mock",
          providerPaymentId: `demo-payment-${1000 + orderNumber}`,
          amount: totalAmount,
          currency,
          status: "paid",
          createdAt,
          updatedAt: createdAt,
        });
      }
    }

    const paidOrders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", store._id))
      .collect();

    const paidOnly = paidOrders.filter((order) => order.paymentStatus === "paid");
    const grossRevenue = roundMoney(
      paidOnly.reduce((sum, order) => sum + order.totalAmount, 0),
    );
    const commissionPaid = roundMoney(
      paidOnly.reduce((sum, order) => sum + (order.commissionAmount ?? 0), 0),
    );
    const netEarnings = roundMoney(
      paidOnly.reduce((sum, order) => sum + (order.storeAmount ?? order.totalAmount), 0),
    );

    await ctx.db.insert("payouts", {
      storeId: store._id,
      amount: 1500,
      currency,
      status: "paid",
      orderCount: paidOnly.length,
      notes: "Demo payout batch 1",
      createdAt: timestamp - 14 * 24 * 60 * 60 * 1000,
      updatedAt: timestamp - 10 * 24 * 60 * 60 * 1000,
      paidAt: timestamp - 10 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("payouts", {
      storeId: store._id,
      amount: 500,
      currency,
      status: "paid",
      orderCount: paidOnly.length,
      notes: "Demo payout batch 2",
      createdAt: timestamp - 7 * 24 * 60 * 60 * 1000,
      updatedAt: timestamp - 5 * 24 * 60 * 60 * 1000,
      paidAt: timestamp - 5 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("payouts", {
      storeId: store._id,
      amount: 205,
      currency,
      status: "pending",
      orderCount: paidOnly.length,
      notes: "Demo pending payout",
      createdAt: timestamp - 2 * 24 * 60 * 60 * 1000,
      updatedAt: timestamp - 2 * 24 * 60 * 60 * 1000,
    });

    return {
      storeId: store._id,
      productCount: productIds.length,
      orderCount: paidOrders.length,
      grossRevenue,
      commissionPaid,
      netEarnings,
      targets: {
        revenue: DEMO_TARGET_REVENUE,
        orders: DEMO_TARGET_ORDER_COUNT,
        commission: DEMO_TARGET_COMMISSION,
        netEarnings: DEMO_TARGET_NET_EARNINGS,
      },
    };
  },
});

export async function ensureDemoAccount(
  ctx: Parameters<typeof createAccount>[0],
  args: {
    email: string;
    name: string;
    role: "customer" | "store";
    phone?: string;
  },
): Promise<Id<"users">> {
  const existingId = await ctx.runQuery(
    // @ts-expect-error generated after codegen
    "seeds/demoHelpers:findUserIdByEmail",
    { email: args.email },
  );

  if (existingId) {
    await ctx.runMutation(
      // @ts-expect-error generated after codegen
      "seeds/demoHelpers:upsertDemoUserProfile",
      {
        userId: existingId,
        name: args.name,
        email: args.email,
        role: args.role,
        phone: args.phone,
      },
    );
    return existingId;
  }

  try {
    const { user } = await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.email,
        secret: DEMO_PASSWORD,
      },
      profile: {
        name: args.name,
        email: args.email,
        ...(args.phone ? { phone: args.phone } : {}),
        role: args.role,
        isActive: true,
        emailVerificationTime: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });

    return user._id;
  } catch (error) {
    const fallbackId = await ctx.runQuery(
      // @ts-expect-error generated after codegen
      "seeds/demoHelpers:findUserIdByEmail",
      { email: args.email },
    );

    if (!fallbackId) {
      throw error;
    }

    await ctx.runMutation(
      // @ts-expect-error generated after codegen
      "seeds/demoHelpers:upsertDemoUserProfile",
      {
        userId: fallbackId,
        name: args.name,
        email: args.email,
        role: args.role,
        phone: args.phone,
      },
    );

    return fallbackId;
  }
}
