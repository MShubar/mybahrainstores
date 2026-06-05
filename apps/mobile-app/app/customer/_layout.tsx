import { Stack } from "expo-router";

export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Categories" }} />
      <Stack.Screen name="cart" options={{ title: "Cart" }} />
      <Stack.Screen
        name="categories/[categoryId]/index"
        options={{ title: "Stores" }}
      />
      <Stack.Screen
        name="stores/[storeId]/index"
        options={{ title: "Products" }}
      />
    </Stack>
  );
}
