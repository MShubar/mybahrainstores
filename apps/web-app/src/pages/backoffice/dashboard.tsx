import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function BackofficeDashboardPage() {
  const stats = useQuery(api.orders.queries.getBackofficeRevenueStats);

  if (stats === undefined) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Backoffice Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Platform overview and revenue summary.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="mt-2 text-2xl font-bold">
            {stats.totalRevenue.toFixed(3)} BHD
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="mt-2 text-2xl font-bold">{stats.totalOrders}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Paid Orders</div>
          <div className="mt-2 text-2xl font-bold">{stats.paidOrders}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Pending Payments</div>
          <div className="mt-2 text-2xl font-bold">{stats.pendingPayments}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Delivered</div>
          <div className="mt-2 text-2xl font-bold">{stats.deliveredOrders}</div>
        </div>
      </div>
    </div>
  );
}