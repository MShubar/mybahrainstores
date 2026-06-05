import { FlatList, Pressable, Text, View } from "react-native";
import { useMobileCart } from "../../src/features/cart/cart-store";

export default function MobileCartScreen() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } =
    useMobileCart();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Cart</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={{ paddingTop: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={{ color: "#666" }}>Cart is empty.</Text>
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
            <Text>{item.price.toFixed(3)} BHD</Text>
            <Text>Qty: {item.quantity}</Text>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Pressable
                onPress={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}
              >
                <Text>-</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}
              >
                <Text>+</Text>
              </Pressable>

              <Pressable
                onPress={() => removeItem(item.productId)}
                style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}
              >
                <Text>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={{ borderTopWidth: 1, paddingTop: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Subtotal: {subtotal.toFixed(3)} BHD
          </Text>

          <Pressable
            onPress={clearCart}
            style={{
              marginTop: 12,
              backgroundColor: "black",
              padding: 14,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Clear Cart
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
