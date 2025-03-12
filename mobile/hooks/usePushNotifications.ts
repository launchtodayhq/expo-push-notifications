import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<string | null>(null);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      // First check if we already have permission
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      // If permission is already granted, just set the status and return
      if (existingStatus === "granted") {
        setPermission(existingStatus);
        return;
      }

      // If not granted, request permission
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission not granted for push notifications");
      }

      setPermission(status);
    };

    registerForPushNotifications();
  }, []);

  return permission;
};
