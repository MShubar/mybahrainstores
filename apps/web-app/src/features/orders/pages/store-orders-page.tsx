import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
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

export function StoreOrdersPage() {
  const myStore = useQuery(api.stores.queries.getMyStore);

  const orders = useQuery(
    api.orders.queries.listStoreOrders,
    myStore ? { storeId: myStore._id } : "skip"
  );

  const updateOrderStatus = useMutation(api.orders.mutations.updateOrderStatus);

  const [updatingId, setUpdatingId] = useState<Id<"orders"> | null>(null);

  if (myStore === undefined || orders === undefined) {
    return <div>Loading orders...</div>;
  }

  if (!myStore) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-gray-600">
          Create your store profile first before managing orders.
        </p>
      </div>
    );
  }

  async function onStatusChange(
    orderId: Id<"orders">,
    orderStatus: string
  ) {
    setUpdatingId(orderId);

    try {
      await updateOrderStatus({
        orderId,
        orderStatus,
      });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Orders</h1>
        <p className="mt-1 text-gray-600">
          Manage customer orders for {myStore.name}.
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
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-sm text-gray-500">
                  Order #{order._id.slice(-6)}
                </div>

                <div className="mt-2 text-lg font-bold">
                  {order.totalAmount.toFixed(3)} {order.currency}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:w-64">
                <label className="text-sm font-medium">Order Status</label>

                <select
                  className="rounded border p-2"
                  value={order.orderStatus}
                  disabled={updatingId === order._id}
                  onChange={(e) =>
                    onStatusChange(order._id, e.target.value)
                  }
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <span
                  className={`rounded px-2 py-1 text-xs ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <h3 className="font-semibold">Items</h3>

              <div className="mt-3 space-y-2 text-sm">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between"
                  >
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

            <div className="mt-5 grid gap-4 border-t pt-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold">Delivery</h3>

                <div className="mt-2 text-sm text-gray-600">
                  <div>{order.deliveryAddress.fullName}</div>
                  <div>{order.deliveryAddress.phone}</div>
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
                <h3 className="font-semibold">Notes</h3>

                <p className="mt-2 text-sm text-gray-600">
                  {order.customerNotes || "No notes."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}