import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import colors from "./src/theme/colors";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        id="root"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: "Melodia" }} />
        <Stack.Screen
          name="categories"
          options={{ title: "Instrument families" }}
        />
      </Stack>
    </>
  );
}
