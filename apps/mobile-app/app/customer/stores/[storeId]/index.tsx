import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { useMobileCart } from "../../../../src/features/cart/cart-store";

export default function StoreProductsScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { addItem } = useMobileCart();

  const store = useQuery(
    api.stores.queries.getById,
    storeId ? { storeId: storeId as Id<"stores"> } : "skip",
  );

  const products = useQuery(
    api.products.queries.listPublicByStore,
    storeId ? { storeId: storeId as Id<"stores"> } : "skip",
  );

  if (store === undefined || products === undefined) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Text>Store not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>{store.name}</Text>
      <Text style={{ color: "#666", marginTop: 4 }}>{store.address}</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingTop: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={{ color: "#666" }}>No products available.</Text>
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
            {item.imageUrls[0] && (
              <Image
                source={{ uri: item.imageUrls[0] }}
                style={{
                  height: 160,
                  width: "100%",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              />
            )}

            <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#666", marginTop: 4 }}>
              {item.description}
            </Text>
            <Text style={{ fontWeight: "bold", marginTop: 8 }}>
              {item.price.toFixed(3)} BHD
            </Text>

            <Pressable
              onPress={() =>
                addItem({
                  productId: item._id,
                  storeId: item.storeId,
                  name: item.name,
                  price: item.price,
                  imageUrl: item.imageUrls[0],
                })
              }
              style={{
                marginTop: 12,
                backgroundColor: "black",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Add to Cart
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
