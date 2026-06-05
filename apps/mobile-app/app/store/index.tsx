import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import type { Href } from "expo-router";
import { api } from "../../../../convex/_generated/api";
import { getExpoPushToken } from "../../src/features/push/register-push-token";

export default function StoreHomeScreen() {
  const myStore = useQuery(api.stores.queries.getMyStore);
  const stats = useQuery(api.orders.queries.getMyStoreRevenueStats);
  const registerPushToken = useMutation(
    api.pushNotifications.mutations.registerPushToken,
  );

  useEffect(() => {
    async function register() {
      const result = await getExpoPushToken();

      if (!result) {
        return;
      }

      await registerPushToken(result);
    }

    void register();
  }, [registerPushToken]);

  if (myStore === undefined || stats === undefined) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text>Loading store dashboard...</Text>
      </View>
    );
  }

  if (!myStore) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>Store Dashboard</Text>

        <Text style={{ marginTop: 12, color: "#666" }}>
          Create your store profile from the web dashboard first.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>{myStore.name}</Text>

      <Text>{myStore.isApproved ? "Approved" : "Pending approval"}</Text>
      <Text>{myStore.isOpen ? "Open" : "Closed"}</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 16 }}>
        <Text>Total Revenue</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {(stats?.totalRevenue ?? 0).toFixed(3)} BHD
        </Text>
      </View>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 16 }}>
        <Text>Total Orders</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {stats?.totalOrders ?? 0}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/store/products" as Href)}
        style={{ backgroundColor: "black", padding: 14, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Manage Products
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/store/orders" as Href)}
        style={{ borderWidth: 1, padding: 14, borderRadius: 8 }}
      >
        <Text style={{ textAlign: "center" }}>View Orders</Text>
      </Pressable>
    </View>
  );
}
