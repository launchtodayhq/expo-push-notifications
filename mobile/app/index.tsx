import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "../hooks/useColorScheme";
import { usePushNotifications } from "../hooks/usePushNotifications";

import * as Notifications from "expo-notifications";
import { supabase } from "@/services/supabase";

export default function PushNotificationDemo() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const iosBlue = "#007AFF";
  const iosDarkBlue = "#0A84FF";

  const permission = usePushNotifications();

  // Register device in database when we get permission and token
  useEffect(() => {
    const registerDeviceInDatabase = async () => {
      if (permission === "granted" && expoPushToken && !isRegistered) {
        try {
          // Check if device is already registered
          const { data: existingDevice, error: queryError } = await supabase
            .from("registered_devices_table")
            .select("*")
            .eq("device_token", expoPushToken)
            .single();

          if (queryError && queryError.code !== "PGRST116") {
            // PGRST116 is "no rows returned" error
            console.error("Error checking device registration:", queryError);
            return;
          }

          if (existingDevice) {
            console.log("Device already registered:", existingDevice);
            setNotificationsEnabled(existingDevice.enabled_notifications);
            setIsRegistered(true);
            return;
          }

          // Insert new device
          const { data, error } = await supabase
            .from("registered_devices_table")
            .insert([
              {
                device_token: expoPushToken,
                enabled_notifications: true,
                device_type: Platform.OS,
              },
            ]);

          if (error) {
            console.error("Error registering device:", error);
            return;
          }

          console.log("Device registered successfully:", data);
          setNotificationsEnabled(true);
          setIsRegistered(true);
        } catch (error) {
          console.error("Unexpected error registering device:", error);
        }
      }
    };

    registerDeviceInDatabase();
  }, [permission, expoPushToken]);

  useEffect(() => {
    async function getDevicePushToken(): Promise<string | null> {
      if (Platform.OS === "ios") {
        const { data: nativeToken } =
          await Notifications.getDevicePushTokenAsync();

        return nativeToken;
      } else {
        // For Android, we'll implement FCM later
        console.log("[Push Notifications] Android not implemented yet");

        return null;
      }
    }

    getDevicePushToken().then((token) => {
      setExpoPushToken(token);
    });
  }, []);

  const toggleNotifications = async () => {
    const newEnabledState = !notificationsEnabled;
    setNotificationsEnabled(newEnabledState);

    // Update the database if we have a token
    if (expoPushToken) {
      try {
        const { error } = await supabase
          .from("registered_devices_table")
          .update({ enabled_notifications: newEnabledState })
          .eq("device_token", expoPushToken);

        if (error) {
          console.error("Error updating notification status:", error);
          // Revert UI state if update failed
          setNotificationsEnabled(notificationsEnabled);
        }
      } catch (error) {
        console.error("Unexpected error updating notification status:", error);
        // Revert UI state if update failed
        setNotificationsEnabled(notificationsEnabled);
      }
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Device Token
          </Text>
          <View
            style={[
              styles.tokenContainer,
              isDarkMode && styles.darkTokenContainer,
            ]}
          >
            <Text
              style={[styles.tokenText, isDarkMode && styles.darkText]}
              selectable={true}
            >
              {expoPushToken}
            </Text>
          </View>
        </View>

        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Notification Settings
          </Text>
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, isDarkMode && styles.darkText]}>
              Enable Push Notifications
            </Text>
            <Switch
              trackColor={{
                false: Platform.OS === "ios" ? "#E9E9EA" : "#767577",
                true:
                  Platform.OS === "ios"
                    ? isDarkMode
                      ? iosDarkBlue
                      : iosBlue
                    : isDarkMode
                    ? "#4d8eff"
                    : "#81b0ff",
              }}
              thumbColor={
                Platform.OS === "ios"
                  ? "#FFFFFF"
                  : notificationsEnabled
                  ? isDarkMode
                    ? iosDarkBlue
                    : iosBlue
                  : "#f4f3f4"
              }
              ios_backgroundColor={isDarkMode ? "#39393D" : "#E9E9EA"}
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
              disabled={permission !== "granted"}
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  darkSection: {
    backgroundColor: "#2a2a2a",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  tokenContainer: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 6,
  },
  darkTokenContainer: {
    backgroundColor: "#3a3a3a",
  },
  tokenText: {
    fontFamily: "SpaceMono",
    fontSize: 14,
    color: "#000",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
    color: "#000",
  },
});
