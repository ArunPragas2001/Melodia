import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import AuthField from "../components/AuthField";
import Page from "../components/Page";
import { useAuth } from "../storage/AuthContext";
import styles from "../theme/styles";
import colors from "../theme/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, busy, error } = useAuth();

  async function submit() {
    if (!email.trim() || !password) {
      setFormError("Enter your email and password");
      return;
    }

    setFormError("");
    if (await login(email, password)) router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Page>
        <View style={{ gap: 9 }}>
          <Text style={styles.eyebrow}>WELCOME BACK</Text>
          <Text style={styles.title}>Sign in to Melodia.</Text>
          <Text style={styles.muted}>
            Continue learning with your saved collection and quiz history.
          </Text>
        </View>

        <View style={{ gap: 17 }}>
          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoComplete="email"
          />
          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            secure
            autoComplete="current-password"
          />
        </View>

        {formError || error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {formError || error}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={submit}
          style={[styles.button, busy && { opacity: 0.55 }]}
        >
          <Text style={styles.buttonText}>
            {busy ? "Signing in…" : "Sign in"}
          </Text>
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}>
          <Text style={styles.muted}>New to Melodia?</Text>
          <Link href="/register" style={{ color: colors.purple, fontWeight: "700" }}>
            Create an account
          </Link>
        </View>
      </Page>
    </KeyboardAvoidingView>
  );
}
