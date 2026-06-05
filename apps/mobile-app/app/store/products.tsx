import { FlatList, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function StoreProductsScreen() {
  const myStore = useQuery(api.stores.queries.getMyStore);

  const products = useQuery(
    api.products.queries.listMyStoreProducts,
    myStore ? { storeId: myStore._id } : "skip",
  );

  if (myStore === undefined || products === undefined) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text>Loading products...</Text>
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

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Products</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingTop: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={{ color: "#666" }}>No products yet.</Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>

            <Text style={{ marginTop: 4 }}>{item.price.toFixed(3)} BHD</Text>

            <Text style={{ color: "#666", marginTop: 4 }}>
              {item.isAvailable ? "Available" : "Unavailable"}
            </Text>

            <Text style={{ color: "#666" }}>
              {item.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
