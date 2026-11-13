import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, View, Pressable } from "react-native";
import instruments from "../data/instruments.json";
import families from "../data/families";
import InstrumentCard from "../components/InstrumentCard";
import SearchBar from "../components/SearchBar";
import { Heading, FamilyChips, useGrid } from "../components/UI";
import s from "../theme/styles";
import c from "../theme/colors";
export default function ExploreScreen() {
  const [sortDirection, setSortDirection] = useState("ascending");
  const params = useLocalSearchParams();
  const family =
    typeof params.family === "string" && Object.hasOwn(families, params.family)
      ? params.family
      : "";
  const { columns, cardWidth } = useGrid();
  const data = instruments
    .filter((instrument) => !family || instrument.family === family)
    .sort((first, second) => {
      const order = first.name.localeCompare(second.name);
      return sortDirection === "ascending" ? order : -order;
    });
  return (
    <FlatList
      testID="instrument-list"
      key={columns}
      numColumns={columns}
      style={s.page}
      contentContainerStyle={[s.content, { gap: 14 }]}
      columnWrapperStyle={{ gap: 14 }}
      data={data}
      keyExtractor={(i) => i.id}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={{ gap: 20, paddingBottom: 8 }}>
          <Heading
            eyebrow="THE INSTRUMENT LIBRARY"
            title={family || "A world of instruments."}
            description="Get to know the sounds behind the music."
          />
          <SearchBar onPress={() => router.push("/search")} />
          <FamilyChips
            value={family || "All"}
            onChange={(name) =>
              router.setParams({
                family: name === "All" ? "" : name,
              })
            }
          />
          <View style={s.between}>
            <Text style={s.muted}>{data.length} instruments to discover</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/categories")}
              style={{ minHeight: 44, justifyContent: "center" }}
            >
              <Text style={{ color: c.purple, fontSize: 12 }}>
                Browse categories →
              </Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              sortDirection === "ascending"
                ? "Sort instruments Z to A"
                : "Sort instruments A to Z"
            }
            onPress={() =>
              setSortDirection((current) =>
                current === "ascending" ? "descending" : "ascending",
              )
            }
            style={[s.chip, { alignSelf: "flex-start" }]}
          >
            <Text style={{ color: c.text, fontSize: 12, fontWeight: "700" }}>
              {sortDirection === "ascending" ? "A–Z" : "Z–A"}
            </Text>
          </Pressable>
          {family ? (
            <Pressable onPress={() => router.setParams({ family: "" })}>
              <Text style={s.error}>Show all families →</Text>
            </Pressable>
          ) : null}
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
