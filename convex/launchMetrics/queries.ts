import { query } from "../_generated/server";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import {
  getOrderCommissionAmount,
  getOrderStoreAmount,
} from "../commissions/helpers";

export const LAUNCH_TARGETS = {
  stores: 10,
  products: 100,
  customers: 50,
  orders: 20,
} as const;

function progress(current: number, target: number): number {
  if (target <= 0) {
    return 1;
  }
  return Math.min(1, current / target);
}

export const getLaunchMetrics = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const [leads, stores, products, orders, users] = await Promise.all([
      ctx.db.query("storeLeads").collect(),
      ctx.db.query("stores").collect(),
      ctx.db.query("products").collect(),
      ctx.db.query("orders").collect(),
      ctx.db.query("users").collect(),
    ]);

    const approvedStores = stores.filter((store) => store.isApproved);
    const activeProducts = products.filter(
      (product) => product.isActive && product.isAvailable,
    );
    const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
    const gmv = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const commissionRevenue = paidOrders.reduce(
      (sum, order) => sum + getOrderCommissionAmount(order),
      0,
    );
    const storeRevenue = paidOrders.reduce(
      (sum, order) => sum + getOrderStoreAmount(order),
      0,
    );
    const activeCustomers = users.filter(
      (row) =>
        row.role === "customer" &&
        row.isActive !== false &&
        !row.deletedAt,
    ).length;

    const targets = LAUNCH_TARGETS;

    return {
      storeLeads: leads.length,
      storeLeadsPending: leads.filter((lead) =>
        ["pending", "in_review", "approved", "contacted"].includes(lead.status),
      ).length,
      approvedStores: approvedStores.length,
      totalStores: stores.length,
      products: activeProducts.length,
      totalProducts: products.length,
      orders: orders.length,
      paidOrders: paidOrders.length,
      gmv,
      commissionRevenue,
      storeRevenue,
      activeCustomers,
      targets,
      readiness: {
        stores: progress(approvedStores.length, targets.stores),
        products: progress(activeProducts.length, targets.products),
        customers: progress(activeCustomers, targets.customers),
        orders: progress(orders.length, targets.orders),
      },
      launchReady:
        approvedStores.length >= targets.stores &&
        activeProducts.length >= targets.products &&
        activeCustomers >= targets.customers &&
        orders.length >= targets.orders,
    };
  },
});
