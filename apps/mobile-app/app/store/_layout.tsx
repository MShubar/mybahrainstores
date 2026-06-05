import { Stack } from "expo-router";

export default function StoreLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Store Dashboard" }} />
      <Stack.Screen name="products" options={{ title: "Products" }} />
      <Stack.Screen name="orders" options={{ title: "Orders" }} />
    </Stack>
  );
}
