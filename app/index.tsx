import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, useColorScheme, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function IndexScreen() {
  const colorScheme = useColorScheme();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
      }}
    >
      <ThemedView style={styles.themeview}>
        <ThemedText style={styles.title}>Welcome</ThemedText>
        <ThemedText style={styles.subtitle}>Device Token: ABC123</ThemedText>

        <View style={styles.switchContainer}>
          <ThemedText>Toggle Feature</ThemedText>
          <Switch onValueChange={toggleSwitch} value={isEnabled} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
});
