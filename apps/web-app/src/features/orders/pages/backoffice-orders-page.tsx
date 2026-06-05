import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

export function BackofficeOrdersPage() {
    const {
        results: orders,
        status,
        loadMore,
      } = usePaginatedQuery(
        api.orders.queries.listBackofficeOrdersPaginated,
        {},
        { initialNumItems: 10 }
      );
  const updateOrderStatus = useMutation(api.orders.mutations.updateOrderStatus);
  const updatePaymentStatus = useMutation(
    api.orders.mutations.updatePaymentStatus
  );

  if (status === "LoadingFirstPage") {
    return <div>Loading orders...</div>;
  }

  async function onOrderStatusChange(
    orderId: Id<"orders">,
    orderStatus: string
  ) {
    await updateOrderStatus({
      orderId,
      orderStatus,
    });
  }

  async function onPaymentStatusChange(
    orderId: Id<"orders">,
    paymentStatus: string
  ) {
    await updatePaymentStatus({
      orderId,
      paymentStatus,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-1 text-gray-600">
          Manage all customer orders across the platform.
        </p>
      </div>

      {orders.length === 0 && (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          No orders yet.
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-sm text-gray-500">
                  Order #{order._id.slice(-6)}
                </div>

                <div className="mt-2 text-xl font-bold">
                  {order.totalAmount.toFixed(3)} {order.currency}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Order Status</label>
                  <select
                    className="mt-1 w-full rounded border p-2"
                    value={order.orderStatus}
                    onChange={(e) =>
                      onOrderStatusChange(order._id, e.target.value)
                    }
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Status</label>
                  <select
                    className="mt-1 w-full rounded border p-2"
                    value={order.paymentStatus}
                    onChange={(e) =>
                      onPaymentStatusChange(order._id, e.target.value)
                    }
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <h3 className="font-semibold">Items</h3>

              <div className="mt-3 space-y-2 text-sm">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      {item.totalPrice.toFixed(3)} {order.currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t pt-4 md:grid-cols-3">
              <div>
                <h3 className="font-semibold">Customer</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <div>{order.deliveryAddress.fullName}</div>
                  <div>{order.deliveryAddress.phone}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Delivery Address</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <div>{order.deliveryAddress.addressLine1}</div>
                  {order.deliveryAddress.addressLine2 && (
                    <div>{order.deliveryAddress.addressLine2}</div>
                  )}
                  <div>
                    {order.deliveryAddress.city}
                    {order.deliveryAddress.area
                      ? `, ${order.deliveryAddress.area}`
                      : ""}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Totals</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {order.subtotal.toFixed(3)} {order.currency}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {order.deliveryFee.toFixed(3)} {order.currency}
                    </span>
                  </div>

                  <div className="flex justify-between font-bold text-black">
                    <span>Total</span>
                    <span>
                      {order.totalAmount.toFixed(3)} {order.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {order.customerNotes && (
              <div className="mt-5 border-t pt-4">
                <h3 className="font-semibold">Customer Notes</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {order.customerNotes}
                </p>
              </div>
            )}
          </div>
        ))}
        {status === "CanLoadMore" && (
  <button
    onClick={() => loadMore(10)}
    className="rounded border px-4 py-2"
  >
    Load More
  </button>
)}
      </div>
    </div>
  );
}