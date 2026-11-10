import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Page from "../components/Page";
import PlayingGuide from "../components/PlayingGuide";
import { FamilyBadge } from "../components/UI";
import instruments from "../data/instruments.json";
import images from "../data/images";
import colors from "../theme/colors";
import styles from "../theme/styles";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const instrument = instruments.find((item) => item.id === id);

  if (!instrument) {
    return (
      <Page>
        <View style={[styles.card, detailStyles.missing]}>
          <Ionicons name="musical-note-outline" size={34} color={colors.purple} />
          <Text style={styles.heading}>Instrument not found</Text>
          <Text style={[styles.muted, { textAlign: "center" }]}>
            This instrument is not in the library.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/explore")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Return to Explore</Text>
          </Pressable>
        </View>
      </Page>
    );
  }

  return (
    <Page>
      <View style={detailStyles.hero}>
        <Text style={detailStyles.heroLabel}>INSTRUMENT PROFILE</Text>
        <Image
          source={images[instrument.id]}
          accessibilityLabel={instrument.name}
          resizeMode="contain"
          style={detailStyles.image}
        />
      </View>

      <View style={detailStyles.intro}>
        <FamilyBadge family={instrument.family} />
        <Text style={detailStyles.name}>{instrument.name}</Text>
        <Text style={styles.muted}>{instrument.description}</Text>
      </View>

      <View style={styles.card}>
        <View style={detailStyles.cardTitle}>
          <Ionicons name="earth-outline" size={22} color={colors.orange} />
          <Text style={styles.heading}>Where it began</Text>
        </View>
        <Text style={styles.muted}>{instrument.origin}</Text>
      </View>

      <View style={detailStyles.partsSection}>
        <Text style={styles.heading}>Main components</Text>
        <View style={styles.row}>
          {instrument.components.map((part, index) => (
            <View key={part} style={detailStyles.part}>
              <Text style={detailStyles.partNumber}>
                {String(index + 1).padStart(2, "0")}
              </Text>
              <Text style={styles.text}>{part}</Text>
            </View>
          ))}
        </View>
      </View>

      <PlayingGuide guide={instrument.playingGuide} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Explore the ${instrument.family} family`}
        onPress={() =>
          router.navigate({
            pathname: "/explore",
            params: { family: instrument.family },
          })
        }
        style={[styles.button, detailStyles.familyButton]}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          Explore the {instrument.family.toLowerCase()} family
        </Text>
        <Ionicons name="arrow-forward" size={18} color={colors.purple} />
      </Pressable>
    </Page>
  );
}

const detailStyles = StyleSheet.create({
  hero: {
    backgroundColor: colors.image,
    borderRadius: 28,
    padding: 24,
  },
  heroLabel: {
    color: "#645A70",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  image: { width: "100%", height: 260, marginTop: 10 },
  intro: { gap: 11 },
  name: {
    color: colors.text,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "800",
    letterSpacing: -1.4,
  },
  cardTitle: { flexDirection: "row", alignItems: "center", gap: 10 },
  partsSection: { gap: 14 },
  part: {
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  partNumber: { color: colors.purple, fontSize: 10, fontWeight: "700" },
  familyButton: { backgroundColor: colors.elevated },
  missing: { alignItems: "center", paddingVertical: 34 },
});
