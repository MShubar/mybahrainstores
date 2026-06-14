import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getSettingValue } from "../settings/helpers";
import { assertCanRemoveBackofficePrivilege, now } from "./helpers";

type Ctx = QueryCtx | MutationCtx;

const TERMINAL_ORDER_STATUSES = new Set(["delivered", "cancelled"]);

const ANONYMIZED_DELIVERY_ADDRESS = {
  fullName: "Deleted account",
  phone: "",
  addressLine1: "Redacted",
  city: "Redacted",
} as const;

export type AccountDeletionBlockers = {
  blocked: boolean;
  reasons: string[];
};

async function getActiveOrderStatuses(ctx: Ctx): Promise<string[]> {
  const statuses = await getSettingValue<string[]>(ctx, "order_statuses", [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]);

  return statuses.filter((status) => !TERMINAL_ORDER_STATUSES.has(status));
}

export async function getAccountDeletionBlockers(
  ctx: Ctx,
  user: Doc<"users">,
): Promise<AccountDeletionBlockers> {
  const reasons: string[] = [];

  if (user.deletedAt) {
    return { blocked: true, reasons: ["This account has already been deleted."] };
  }

  if (user.role === "backoffice") {
    const remainingAdmins = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "backoffice"))
      .collect();

    const activeOthers = remainingAdmins.filter(
      (admin) =>
        admin._id !== user._id &&
        admin.isActive !== false &&
        !admin.deletedAt,
    );

    if (activeOthers.length === 0) {
      reasons.push("You are the last active backoffice admin.");
    }
  }

  const activeStatuses = await getActiveOrderStatuses(ctx);

  const customerOrders = await ctx.db
    .query("orders")
    .withIndex("by_customer", (q) => q.eq("customerId", user._id))
    .collect();

  const activeCustomerOrders = customerOrders.filter((order) =>
    activeStatuses.includes(order.orderStatus),
  );

  if (activeCustomerOrders.length > 0) {
    reasons.push(
      `You have ${activeCustomerOrders.length} active customer order(s). Complete or cancel them first.`,
    );
  }

  const stores = await ctx.db
    .query("stores")
    .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
    .collect();

  for (const store of stores) {
    const storeOrders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", store._id))
      .collect();

    const activeStoreOrders = storeOrders.filter((order) =>
      activeStatuses.includes(order.orderStatus),
    );

    if (activeStoreOrders.length > 0) {
      reasons.push(
        `Store "${store.name}" has ${activeStoreOrders.length} active order(s).`,
      );
    }
  }

  return {
    blocked: reasons.length > 0,
    reasons,
  };
}

async function deleteAuthRecords(ctx: MutationCtx, userId: Id<"users">): Promise<void> {
  const sessions = await ctx.db
    .query("authSessions")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();

  for (const session of sessions) {
    const refreshTokens = await ctx.db
      .query("authRefreshTokens")
      .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
      .collect();

    for (const token of refreshTokens) {
      await ctx.db.delete(token._id);
    }

    await ctx.db.delete(session._id);
  }

  const accounts = await ctx.db
    .query("authAccounts")
    .filter((q) => q.eq(q.field("userId"), userId))
    .collect();

  for (const account of accounts) {
    await ctx.db.delete(account._id);
  }

  const verificationCodes = await ctx.db.query("authVerificationCodes").collect();
  for (const code of verificationCodes) {
    if (code.accountId && accounts.some((account) => account._id === code.accountId)) {
      await ctx.db.delete(code._id);
    }
  }
}

async function deleteUserOwnedData(ctx: MutationCtx, userId: Id<"users">): Promise<void> {
  const notifications = await ctx.db
    .query("notifications")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  for (const notification of notifications) {
    await ctx.db.delete(notification._id);
  }

  const pushTokens = await ctx.db
    .query("pushTokens")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  for (const pushToken of pushTokens) {
    await ctx.db.delete(pushToken._id);
  }

  const systemLogs = await ctx.db
    .query("systemLogs")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  for (const log of systemLogs) {
    await ctx.db.delete(log._id);
  }

  const analyticsEvents = await ctx.db
    .query("analyticsEvents")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  for (const event of analyticsEvents) {
    await ctx.db.patch(event._id, { userId: undefined });
  }

  const files = await ctx.db
    .query("files")
    .withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", userId))
    .collect();

  for (const file of files) {
    await ctx.db.delete(file._id);
  }
}

async function deactivateOwnedStores(ctx: MutationCtx, userId: Id<"users">): Promise<void> {
  const stores = await ctx.db
    .query("stores")
    .withIndex("by_owner", (q) => q.eq("ownerId", userId))
    .collect();

  const timestamp = now();

  for (const store of stores) {
    await ctx.db.patch(store._id, {
      isActive: false,
      isOpen: false,
      updatedAt: timestamp,
    });

    const products = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", store._id))
      .collect();

    for (const product of products) {
      await ctx.db.patch(product._id, {
        isActive: false,
        isAvailable: false,
        updatedAt: timestamp,
      });
    }
  }
}

async function anonymizeCustomerOrders(ctx: MutationCtx, userId: Id<"users">): Promise<void> {
  const orders = await ctx.db
    .query("orders")
    .withIndex("by_customer", (q) => q.eq("customerId", userId))
    .collect();

  const timestamp = now();

  for (const order of orders) {
    await ctx.db.patch(order._id, {
      deliveryAddress: ANONYMIZED_DELIVERY_ADDRESS,
      customerNotes: undefined,
      updatedAt: timestamp,
    });
  }
}

async function anonymizeUserRecord(ctx: MutationCtx, user: Doc<"users">): Promise<void> {
  const timestamp = now();
  const anonymizedEmail = `deleted-${user._id}@deleted.local`;

  await ctx.db.patch(user._id, {
    name: "Deleted account",
    email: anonymizedEmail,
    phone: undefined,
    image: undefined,
    imageUrl: undefined,
    isActive: false,
    deletedAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function deleteUserAccount(
  ctx: MutationCtx,
  user: Doc<"users">,
): Promise<void> {
  if (user.deletedAt) {
    throw new ConvexError("Account has already been deleted");
  }

  const blockers = await getAccountDeletionBlockers(ctx, user);
  if (blockers.blocked) {
    throw new ConvexError(blockers.reasons.join(" "));
  }

  if (user.role === "backoffice") {
    await assertCanRemoveBackofficePrivilege(ctx, user);
  }

  await deleteUserOwnedData(ctx, user._id);
  await deactivateOwnedStores(ctx, user._id);
  await anonymizeCustomerOrders(ctx, user._id);
  await deleteAuthRecords(ctx, user._id);
  await anonymizeUserRecord(ctx, user);
}
