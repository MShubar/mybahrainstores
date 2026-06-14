import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { requireStoreOwner } from "../stores/permissions";
import { getStoreBalanceSummary, getStorePayouts } from "./helpers";

export const listBackofficePayoutOverview = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const stores = await ctx.db.query("stores").collect();

    const rows = await Promise.all(
      stores.map(async (store) => {
        const balance = await getStoreBalanceSummary(ctx, store._id);
        const payouts = await getStorePayouts(ctx, store._id);
        const latestPayout = payouts.sort((a, b) => b.createdAt - a.createdAt)[0];

        return {
          store: {
            _id: store._id,
            name: store.name,
            slug: store.slug,
            commissionRate: store.commissionRate ?? null,
            bankName: store.bankName ?? null,
            iban: store.iban ?? null,
            accountHolderName: store.accountHolderName ?? null,
            payoutInfoStatus: store.payoutInfoStatus ?? "not_submitted",
          },
          balance,
          latestPayoutStatus: latestPayout?.status ?? null,
          payoutCount: payouts.length,
        };
      }),
    );

    return rows
      .filter((row) => row.balance.grossEarnings > 0 || row.payoutCount > 0)
      .sort((a, b) => b.balance.amountOwed - a.balance.amountOwed);
  },
});

export const listBackofficePayouts = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const payouts = await ctx.db.query("payouts").collect();

    const enriched = await Promise.all(
      payouts.map(async (payout) => {
        const store = await ctx.db.get(payout.storeId);
        return {
          ...payout,
          storeName: store?.name ?? "Unknown store",
        };
      }),
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const listMyStorePayouts = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);

    const store = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .first();

    if (!store) {
      return null;
    }

    requireStoreOwner(user, store);

    const payouts = await getStorePayouts(ctx, store._id);
    const balance = await getStoreBalanceSummary(ctx, store._id);

    return {
      store: {
        _id: store._id,
        name: store.name,
        commissionRate: store.commissionRate ?? null,
        bankName: store.bankName ?? null,
        iban: store.iban ?? null,
        accountHolderName: store.accountHolderName ?? null,
        payoutInfoStatus: store.payoutInfoStatus ?? "not_submitted",
      },
      balance,
      payouts: payouts.sort((a, b) => b.createdAt - a.createdAt),
    };
  },
});

export const getStoreBalance = query({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const store = await ctx.db.get(args.storeId);
    if (!store) {
      return null;
    }

    return await getStoreBalanceSummary(ctx, args.storeId);
  },
});
