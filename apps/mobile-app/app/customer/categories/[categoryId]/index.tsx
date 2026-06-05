import { FlatList, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

export default function CategoryStoresScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  const stores = useQuery(
    api.stores.queries.listPublicStoresByCategory,
    categoryId ? { categoryId: categoryId as Id<"categories"> } : "skip",
  );

  if (stores === undefined) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text>Loading stores...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Stores</Text>

      <FlatList
        data={stores}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingTop: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={{ color: "#666" }}>No stores in this category yet.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/customer/stores/${item._id}`)}
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#666", marginTop: 4 }}>{item.address}</Text>
            <Text style={{ marginTop: 8 }}>
              {item.isOpen ? "Open" : "Closed"}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
