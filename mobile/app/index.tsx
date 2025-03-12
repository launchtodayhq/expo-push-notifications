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

export default function PushNotificationDemo() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  // iOS native colors
  const iosBlue = "#007AFF"; // Standard iOS blue
  const iosDarkBlue = "#0A84FF"; // iOS blue for dark mode

  useEffect(() => {
    // We'll implement the actual token registration later
    setExpoPushToken("Loading token...");
  }, []);

  const toggleNotifications = () => {
    setNotificationsEnabled((previousState) => !previousState);
    // We'll implement the actual enabling/disabling of notifications later
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Push Notifications Demo
        </Text>

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
