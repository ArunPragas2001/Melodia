import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../theme/colors";
import styles from "../theme/styles";

export default function PlayingGuide({ guide }) {
  if (!guide) return null;

  return (
    <View style={guideStyles.section}>
      <View style={guideStyles.intro}>
        <Text style={styles.eyebrow}>YOUR FIRST NOTES</Text>
        <Text style={styles.heading}>How to play</Text>
        <Text style={styles.muted}>
          Start slowly and work through one step at a time.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={guideStyles.titleRow}>
          <Ionicons name="options-outline" size={21} color={colors.purple} />
          <Text style={styles.heading}>Before you begin</Text>
        </View>
        <Text style={styles.muted}>{guide.setup}</Text>
      </View>

      <View style={styles.card}>
        {guide.method.map((step, index) => (
          <View key={step.title} style={guideStyles.step}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <View style={guideStyles.stepRow}>
              <View style={guideStyles.number}>
                <Text style={guideStyles.numberText}>{index + 1}</Text>
              </View>
              <View style={guideStyles.stepText}>
                <Text style={[styles.text, guideStyles.strong]}>
                  {step.title}
                </Text>
                <Text style={styles.muted}>{step.instruction}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.card, guideStyles.practice]}>
        <Text style={[styles.eyebrow, { color: colors.purple }]}>PRACTICE</Text>
        <Text style={styles.heading}>{guide.practice.title}</Text>
        <View style={guideStyles.titleRow}>
          <Ionicons name="time-outline" size={18} color={colors.purple} />
          <Text style={[styles.muted, { flex: 1 }]}>
            {guide.practice.tempo}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          accessibilityLabel="Practice pattern"
          style={guideStyles.pattern}
        >
          <Text selectable style={guideStyles.patternText}>
            {guide.practice.pattern}
          </Text>
        </ScrollView>
        <Text style={styles.muted}>{guide.practice.legend}</Text>
        {guide.practice.steps.map((instruction, index) => (
          <View key={instruction} style={guideStyles.instruction}>
            <Text style={guideStyles.listNumber}>{index + 1}.</Text>
            <Text style={[styles.text, { flex: 1 }]}>{instruction}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <Text style={[styles.text, { color: colors.green }]}>
          Goal: {guide.practice.goal}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={guideStyles.titleRow}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={21}
            color={colors.orange}
          />
          <Text style={styles.heading}>Demonstration</Text>
        </View>
        <Text selectable style={styles.text}>
          {guide.demonstration}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={guideStyles.titleRow}>
          <Ionicons name="bulb-outline" size={22} color={colors.orange} />
          <Text style={styles.heading}>Beginner tip</Text>
        </View>
        <Text style={styles.muted}>{guide.tip}</Text>
      </View>
    </View>
  );
}

const guideStyles = StyleSheet.create({
  section: { gap: 22 },
  intro: { gap: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  step: { gap: 17 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 13 },
  number: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: { color: colors.purple, fontSize: 12, fontWeight: "800" },
  stepText: { flex: 1, gap: 6 },
  strong: { fontWeight: "700" },
  practice: { backgroundColor: colors.purpleSoft, gap: 15 },
  pattern: {
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 14,
  },
  patternText: {
    color: colors.text,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    lineHeight: 24,
  },
  instruction: { flexDirection: "row", gap: 10 },
  listNumber: { color: colors.purple, fontWeight: "700", lineHeight: 24 },
});
