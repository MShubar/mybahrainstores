import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type PermissionWithGranted = Notifications.NotificationPermissionsStatus & {
  granted: boolean;
};

export async function getExpoPushToken() {
  if (!Device.isDevice) {
    return null;
  }

  const existingStatus =
    (await Notifications.getPermissionsAsync()) as PermissionWithGranted;

  if (!existingStatus.granted) {
    const requestedStatus =
      (await Notifications.requestPermissionsAsync()) as PermissionWithGranted;

    if (!requestedStatus.granted) {
      return null;
    }
  }

  const token = await Notifications.getExpoPushTokenAsync();

  return {
    token: token.data,
    platform: Platform.OS,
  };
}
