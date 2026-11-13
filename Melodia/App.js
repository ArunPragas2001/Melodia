import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/storage/AuthContext";
import { LibraryProvider } from "./src/storage/LibraryContext";
import colors from "./src/theme/colors";

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <AppNavigation />
      </LibraryProvider>
    </AuthProvider>
  );
}

function AppNavigation() {
  const { user, ready } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const onAccountScreen = segments[0] === "login" || segments[0] === "register";

  useEffect(() => {
    if (!ready) return;
    if (!user && !onAccountScreen) router.replace("/login");
    if (user && onAccountScreen) router.replace("/");
  }, [onAccountScreen, ready, router, user]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <StatusBar style="light" />
        <ActivityIndicator color={colors.purple} accessibilityLabel="Loading account" />
      </View>
    );
  }

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
        <Stack.Screen name="search" options={{ title: "Search instruments" }} />
        <Stack.Screen name="details" options={{ title: "Instrument details" }} />
        <Stack.Screen name="login" options={{ title: "Sign in" }} />
        <Stack.Screen name="register" options={{ title: "Create account" }} />
      </Stack>
    </>
  );
}
