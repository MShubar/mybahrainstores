import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

type OrderFilter = "active" | "completed" | "all";

export function CustomerOrdersPage() {
  const orders = useQuery(api.orders.queries.listMyOrders);
  const [filter, setFilter] = useState<OrderFilter>("active");

  const filteredOrders = useMemo(() => {
    if (!orders) {
      return [];
    }

    if (filter === "all") {
      return orders;
    }

    if (filter === "completed") {
      return orders.filter(
        (order) =>
          order.trackingSummary.isDelivered ||
          order.trackingSummary.isCancelled,
      );
    }

    return orders.filter(
      (order) =>
        !order.trackingSummary.isDelivered &&
        !order.trackingSummary.isCancelled,
    );
  }, [orders, filter]);

  if (orders === undefined) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-1 text-gray-600">
          Track payment and delivery status for all your orders.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
            { key: "all", label: "All" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              filter === tab.key
                ? "bg-black text-white"
                : "border bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="rounded-xl border bg-white p-6">
          <p className="text-gray-600">You do not have any orders yet.</p>
          <Link
            to="/customer"
            className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
          >
            Browse stores
          </Link>
        </div>
      )}

      {orders.length > 0 && filteredOrders.length === 0 && (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          No orders in this view.
        </div>
      )}

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Link
            key={order._id}
            to={`/customer/orders/${order._id}`}
            className="block rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-sm text-gray-500">
                  {order.storeName} · Order #{order._id.slice(-6)}
                </div>

                <div className="mt-1 text-lg font-semibold">
                  {order.trackingSummary.currentStatusLabel}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      order.trackingSummary.isCancelled
                        ? "bg-red-100 text-red-700"
                        : order.trackingSummary.isDelivered
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.trackingSummary.currentStatusLabel}
                  </span>

                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      order.trackingSummary.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    Payment: {order.trackingSummary.currentPaymentLabel}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{order.trackingSummary.progressPercent}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        order.trackingSummary.isCancelled
                          ? "bg-red-500"
                          : "bg-green-600"
                      }`}
                      style={{
                        width: `${order.trackingSummary.progressPercent}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-lg font-bold">
                  {order.totalAmount.toFixed(3)} {order.currency}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                <span className="mt-2 inline-block text-sm font-medium text-gray-900">
                  Track order →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
