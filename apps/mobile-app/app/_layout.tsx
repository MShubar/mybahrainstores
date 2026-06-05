import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { AppConvexProvider } from "../src/providers/convex-provider";
import { MobileCartProvider } from "../src/features/cart/cart-store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <AppConvexProvider>
      <MobileCartProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "RandomStores" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
          <Stack.Screen name="customer" options={{ headerShown: false }} />
          <Stack.Screen name="store" options={{ headerShown: false }} />
        </Stack>
      </MobileCartProvider>
    </AppConvexProvider>
  );
}
