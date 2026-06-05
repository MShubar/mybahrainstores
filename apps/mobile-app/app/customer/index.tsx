import { useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../../convex/_generated/api";
import { getExpoPushToken } from "../../src/features/push/register-push-token";

export default function CustomerHomeScreen() {
  const categories = useQuery(api.categories.queries.listPublic);
  const { signOut } = useAuthActions();
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

  async function logout() {
    await signOut();
    router.replace("/login");
  }

  if (categories === undefined) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Categories</Text>

      <Pressable
        onPress={() => router.push("/customer/cart")}
        style={{
          marginTop: 12,
          backgroundColor: "black",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>View Cart</Text>
      </Pressable>

      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingTop: 16, gap: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/customer/categories/${item._id}`)}
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#666", marginTop: 4 }}>
              {item.description || "View stores"}
            </Text>
          </Pressable>
        )}
      />

      <Pressable
        onPress={logout}
        style={{
          marginTop: 12,
          backgroundColor: "#eee",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ textAlign: "center" }}>Logout</Text>
      </Pressable>
    </View>
  );
}
