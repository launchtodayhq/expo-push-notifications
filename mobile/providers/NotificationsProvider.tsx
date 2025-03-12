import React, { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // Listen for incoming notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "Notification received:",
          JSON.stringify(notification.request.content, null, 2)
        );
      });

    // Listen for user interaction with notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Notification response:",
          JSON.stringify(response, null, 2)
        );

        const data = response.notification.request.content.data;

        // Handle navigation or other actions based on notification data
        console.log("Notification data:", JSON.stringify(data, null, 2));
      });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return <>{children}</>;
};
