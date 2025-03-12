import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Switch, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function PushNotificationDemo() {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    // We'll implement the actual token registration later
    setExpoPushToken("Loading token...");
  }, []);

  const toggleNotifications = () => {
    setNotificationsEnabled((previousState) => !previousState);
    // We'll implement the actual enabling/disabling of notifications later
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Push Notifications Demo</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Token</Text>
          <View style={styles.tokenContainer}>
            <Text style={styles.tokenText} selectable={true}>
              {expoPushToken}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Enable Push Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  tokenContainer: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 6,
  },
  tokenText: {
    fontFamily: "SpaceMono",
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
  },
});
