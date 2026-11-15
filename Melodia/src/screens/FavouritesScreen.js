import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import InstrumentCard from "../components/InstrumentCard";
import { Heading, useGrid } from "../components/UI";
import instruments from "../data/instruments.json";
import { useLibrary } from "../storage/LibraryContext";
import colors from "../theme/colors";
import styles from "../theme/styles";

export default function FavouritesScreen() {
  const { favourites, ready, error } = useLibrary();
  const { columns, cardWidth } = useGrid();
  const saved = instruments.filter((item) => favourites.includes(item.id));

  if (!ready) {
    return (
      <View style={[styles.page, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={colors.purple} accessibilityLabel="Loading favourites" />
      </View>
    );
  }

  return (
    <FlatList
      key={columns}
      numColumns={columns}
      style={styles.page}
      contentContainerStyle={[styles.content, { gap: 14 }]}
      columnWrapperStyle={{ gap: 14 }}
      data={saved}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={{ gap: 15, paddingBottom: 8 }}>
          <Heading
            eyebrow="YOUR COLLECTION"
            title="Favourites."
            description="Keep the instruments you want to revisit."
          />
          {saved.length ? (
            <Text style={styles.muted}>
              {saved.length} saved {saved.length === 1 ? "instrument" : "instruments"}
            </Text>
          ) : null}
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        <View style={[styles.card, { alignItems: "center", paddingVertical: 36 }]}>
          <Ionicons name="heart-outline" size={34} color={colors.purple} />
          <Text style={styles.heading}>Your collection is empty</Text>
          <Text style={[styles.muted, { textAlign: "center" }]}>
            Use the heart button on an instrument to save it here.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.navigate("/explore")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Explore instruments</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ width: cardWidth }}>
          <InstrumentCard
            instrument={item}
            onPress={() =>
              router.push({ pathname: "/details", params: { id: item.id } })
            }
          />
        </View>
      )}
    />
  );
}
