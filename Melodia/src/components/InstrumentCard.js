import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import images from "../data/images";
import { FamilyBadge } from "./UI";
import { useLibrary } from "../storage/LibraryContext";
import colors from "../theme/colors";
import styles from "../theme/styles";

export default function InstrumentCard({
  instrument,
  compact = false,
  onPress = undefined,
}) {
  const { favourites, saving, toggleFavourite } = useLibrary();
  const saved = favourites.includes(instrument.id);
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
      <View style={[card.container, compact && card.compact]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${instrument.name}`}
          onPress={onPress}
          style={({ pressed }) => [
            card.main,
            compact && card.compact,
            pressed && styles.pressed,
          ]}
        >
          {content}
        </Pressable>
        <FavouriteButton
          instrument={instrument}
          saved={saved}
          saving={saving}
          onPress={() => toggleFavourite(instrument.id)}
        />
      </View>
    );
  }

  return (
    <View style={[card.container, compact && card.compact]}>
      {content}
    </View>
  );
}

function FavouriteButton({ instrument, saved, saving, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${saved ? "Remove" : "Save"} ${instrument.name} ${
        saved ? "from" : "to"
      } favourites`}
      accessibilityState={{ selected: saved, disabled: saving }}
      disabled={saving}
      onPress={onPress}
      style={({ pressed }) => [
        card.favourite,
        pressed && styles.pressed,
        saving && { opacity: 0.55 },
      ]}
    >
      <Ionicons
        name={saved ? "heart" : "heart-outline"}
        size={20}
        color={saved ? colors.purple : colors.ink}
      />
    </Pressable>
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
  main: { flex: 1 },
  compact: { flexDirection: "row", alignItems: "center" },
  image: { backgroundColor: colors.image, height: 152, padding: 12 },
  smallImage: { width: 86, height: 110 },
  picture: { width: "100%", height: "100%" },
  content: { flex: 1, padding: 15, gap: 8 },
  favourite: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFFF2",
    alignItems: "center",
    justifyContent: "center",
  },
});
