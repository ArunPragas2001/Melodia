import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import SearchBar from "../components/SearchBar";
import InstrumentCard from "../components/InstrumentCard";
import { FamilyChips, Heading, useGrid } from "../components/UI";
import instruments from "../data/instruments.json";
import colors from "../theme/colors";
import styles from "../theme/styles";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("All");
  const { columns, cardWidth } = useGrid();

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    return instruments.filter((instrument) => {
      const matchesName = instrument.name.toLowerCase().includes(search);
      const matchesFamily = family === "All" || instrument.family === family;
      return matchesName && matchesFamily;
    });
  }, [family, query]);

  return (
    <FlatList
      key={columns}
      numColumns={columns}
      style={styles.page}
      contentContainerStyle={[styles.content, { gap: 14 }]}
      columnWrapperStyle={{ gap: 14 }}
      data={results}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={{ gap: 18, paddingBottom: 8 }}>
          <Heading
            eyebrow="FOLLOW YOUR CURIOSITY"
            title="Find an instrument."
            description="Search by name or choose an instrument family."
          />
          <SearchBar value={query} onChangeText={setQuery} />
          <FamilyChips value={family} onChange={setFamily} />
          <Text style={styles.muted}>
            {results.length} {results.length === 1 ? "result" : "results"}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={[styles.card, { alignItems: "center", paddingVertical: 34 }]}>
          <Ionicons name="search-outline" size={32} color={colors.purple} />
          <Text style={styles.heading}>No instruments found</Text>
          <Text style={[styles.muted, { textAlign: "center" }]}>
            Try another name or select a different family.
          </Text>
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
