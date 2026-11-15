import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import AuthField from "../components/AuthField";
import Page from "../components/Page";
import { useAuth } from "../storage/AuthContext";
import styles from "../theme/styles";
import colors from "../theme/colors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { register, busy, error } = useAuth();

  async function submit() {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    if (await register({ name, email, password })) router.replace("/");
  }

  function validate() {
    if (name.trim().length < 2) return "Enter your name";
    if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address";
    if (password.length < 8) return "Use at least 8 characters for your password";
    if (password !== confirmPassword) return "The passwords do not match";
    return "";
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Page>
        <View style={{ gap: 9 }}>
          <Text style={styles.eyebrow}>START YOUR COLLECTION</Text>
          <Text style={styles.title}>Create an account.</Text>
          <Text style={styles.muted}>
            Your account and learning progress stay on this device.
          </Text>
        </View>

        <View style={{ gap: 17 }}>
          <AuthField
            label="Name"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <AuthField
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            icon="shield-checkmark-outline"
            secure
            autoComplete="new-password"
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
            {busy ? "Creating account…" : "Create account"}
          </Text>
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}>
          <Text style={styles.muted}>Already registered?</Text>
          <Link href="/login" style={{ color: colors.purple, fontWeight: "700" }}>
            Sign in
          </Link>
        </View>
      </Page>
    </KeyboardAvoidingView>
  );
}
