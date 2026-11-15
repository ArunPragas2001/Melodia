import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Page from "../components/Page";
import { Button, EmptyState, Heading, Section, Stat } from "../components/UI";
import { useAuth } from "../storage/AuthContext";
import { useLibrary } from "../storage/LibraryContext";
import credits from "../../assets/image-credits.json";
import colors from "../theme/colors";
import styles from "../theme/styles";

export default function ProfileScreen() {
  const [showCredits, setShowCredits] = useState(false);
  const { user, logout, busy, error: authError } = useAuth();
  const { favourites, scores, error: libraryError } = useLibrary();
  const best = scores.length
    ? Math.max(...scores.map((entry) => Math.round((entry.score / entry.total) * 100)))
    : 0;

  async function signOut() {
    if (await logout()) router.replace("/login");
  }

  return (
    <Page>
      <View style={styles.between}>
        <Heading eyebrow="YOUR MUSIC CORNER" title={user?.name || "Profile"} />
        <View style={profileStyles.avatar}>
          <Ionicons name="headset-outline" color={colors.purple} size={30} />
        </View>
      </View>
      <Text style={styles.muted}>{user?.email}</Text>

      <View style={profileStyles.stats}>
        <Stat value={favourites.length} label="FAVOURITES" icon="heart-outline" />
        <Stat value={scores.length} label="QUIZZES" icon="albums-outline" />
        <Stat value={`${best}%`} label="BEST SCORE" icon="trophy-outline" />
      </View>

      <View style={{ gap: 14 }}>
        <Section title="Recent quiz scores" />
        {scores.length ? (
          scores.slice(0, 5).map((result, index) => (
            <View key={`${result.date}-${index}`} style={profileStyles.scoreRow}>
              <View style={profileStyles.scoreIcon}>
                <Ionicons name="musical-notes-outline" color={colors.purple} size={20} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.text, { fontWeight: "700" }]}>Music quiz</Text>
                <Text style={[styles.muted, { fontSize: 11 }]}>
                  {new Date(result.date).toLocaleString()}
                </Text>
              </View>
              <Text style={profileStyles.scoreText}>
                {result.score}/{result.total}
              </Text>
            </View>
          ))
        ) : (
          <EmptyState
            icon="sparkles-outline"
            title="Your first score awaits"
            description="Complete the quiz to add a result to your profile."
            action="Take the quiz"
            onPress={() => router.navigate("/quiz")}
          />
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.between}>
          <Text style={styles.heading}>Offline learning</Text>
          <Ionicons name="cloud-offline-outline" color={colors.green} size={24} />
        </View>
        <Text style={styles.muted}>
          Your account, favourites, and latest 50 quiz scores stay on this device.
          Clearing app data or uninstalling removes them.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: showCredits }}
        onPress={() => setShowCredits((current) => !current)}
        style={[styles.between, { minHeight: 48 }]}
      >
        <Text style={styles.muted}>Image credits and licences</Text>
        <Ionicons
          name={showCredits ? "chevron-up" : "chevron-down"}
          color={colors.muted}
          size={18}
        />
      </Pressable>

      {showCredits
        ? credits.map((credit) => (
            <View key={credit.id} style={styles.card}>
              <Text style={styles.text}>
                {credit.id} · {credit.license}
              </Text>
              <Text style={styles.muted}>{credit.artist}</Text>
              <Text selectable style={styles.muted}>
                {credit.source}
              </Text>
              <Text selectable style={styles.muted}>
                {credit.licenseURL}
              </Text>
              <Text style={styles.muted}>{credit.changes}</Text>
            </View>
          ))
        : null}

      {authError || libraryError ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {authError || libraryError}
        </Text>
      ) : null}
      <Button
        label={busy ? "Signing out…" : "Sign out"}
        icon="log-out-outline"
        secondary
        disabled={busy}
        onPress={signOut}
      />
    </Page>
  );
}

const profileStyles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stats: { flexDirection: "row", gap: 10 },
  scoreRow: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  scoreIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: { color: colors.purple, fontSize: 19, fontWeight: "800" },
});
