import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function StoreAnalyticsPage() {
  const analytics = useQuery(api.reports.queries.getMyStoreAnalytics);

  if (analytics === undefined) {
    return <div>Loading store analytics...</div>;
  }

  if (!analytics) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Store Analytics</h1>
        <p className="mt-2 text-gray-600">
          Create your store profile first to view analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Analytics</h1>
        <p className="mt-1 text-gray-600">
          Sales and performance summary for {analytics.store.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="mt-2 text-2xl font-bold">
            {analytics.totalRevenue.toFixed(3)} BHD
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Net Earnings</div>
          <div className="mt-2 text-2xl font-bold">
            {analytics.netEarnings.toFixed(3)} BHD
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Commission Paid</div>
          <div className="mt-2 text-2xl font-bold">
            {analytics.commissionPaid.toFixed(3)} BHD
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Avg. Order Value</div>
          <div className="mt-2 text-2xl font-bold">
            {analytics.averageOrderValue.toFixed(3)} BHD
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="mt-2 text-2xl font-bold">{analytics.totalOrders}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Paid Orders</div>
          <div className="mt-2 text-2xl font-bold">{analytics.paidOrders}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Pending Orders</div>
          <div className="mt-2 text-2xl font-bold">
            {analytics.pendingOrders}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Delivered Orders</div>
          <div className="mt-2 text-2xl font-bold">
            {analytics.deliveredOrders}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-bold">Top Products</h2>

        {analytics.topProducts.length === 0 ? (
          <p className="mt-3 text-gray-600">No product sales yet.</p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3">Product</th>
                <th className="p-3">Quantity Sold</th>
                <th className="p-3">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {analytics.topProducts.map((product) => (
                <tr key={product.productId} className="border-b">
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3">{product.quantitySold}</td>
                  <td className="p-3">{product.revenue.toFixed(3)} BHD</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
