import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import images from "../data/images";
import { FamilyBadge } from "./UI";
import colors from "../theme/colors";
import styles from "../theme/styles";

export default function InstrumentCard({
  instrument,
  compact = false,
  onPress = undefined,
}) {
  const content = (
    <>
      <View style={[card.image, compact && card.smallImage]}>
        <Image
          source={images[instrument.id]}
          accessibilityLabel={instrument.name}
          resizeMode="contain"
          style={card.picture}
        />
      </View>
      <View style={card.content}>
        <FamilyBadge family={instrument.family} />
        <Text style={styles.heading}>{instrument.name}</Text>
        <Text style={styles.muted}>{instrument.description}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${instrument.name}`}
        onPress={onPress}
        style={({ pressed }) => [
          card.container,
          compact && card.compact,
          pressed && styles.pressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[card.container, compact && card.compact]}>
      {content}
    </View>
  );
}

const card = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  compact: { flexDirection: "row", alignItems: "center" },
  image: { backgroundColor: colors.image, height: 152, padding: 12 },
  smallImage: { width: 86, height: 110 },
  picture: { width: "100%", height: "100%" },
  content: { flex: 1, padding: 15, gap: 8 },
});
