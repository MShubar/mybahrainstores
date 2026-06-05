import { FlatList, Pressable, Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function StoreOrdersScreen() {
  const myStore = useQuery(api.stores.queries.getMyStore);

  const orders = useQuery(
    api.orders.queries.listStoreOrders,
    myStore ? { storeId: myStore._id } : "skip",
  );

  const updateOrderStatus = useMutation(api.orders.mutations.updateOrderStatus);

  if (myStore === undefined || orders === undefined) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (!myStore) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text>Create your store first.</Text>
      </View>
    );
  }

  async function nextStatus(orderId: Id<"orders">, currentStatus: string) {
    const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
    const next = ORDER_STATUSES[currentIndex + 1];

    if (!next) {
      return;
    }

    await updateOrderStatus({
      orderId,
      orderStatus: next,
    });
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingTop: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={{ color: "#666" }}>No orders yet.</Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: "#ddd",
              gap: 8,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Order #{item._id.slice(-6)}
            </Text>

            <Text>
              {item.totalAmount.toFixed(3)} {item.currency}
            </Text>
            <Text>Status: {item.orderStatus}</Text>
            <Text>Payment: {item.paymentStatus}</Text>

            <Text style={{ marginTop: 8, fontWeight: "600" }}>Items</Text>

            {item.items.map((orderItem: Doc<"orders">["items"][number]) => (
              <Text key={orderItem.productId}>
                {orderItem.name} × {orderItem.quantity}
              </Text>
            ))}

            <Pressable
              onPress={() => nextStatus(item._id, item.orderStatus)}
              style={{
                marginTop: 12,
                backgroundColor: "black",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Move to Next Status
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
