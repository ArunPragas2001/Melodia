import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../theme/colors";

export default function SearchBar({
  value = "",
  onChangeText = undefined,
  onPress = undefined,
}) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search instruments"
        onPress={onPress}
        style={styles.container}
      >
        <Ionicons name="search-outline" size={20} color={colors.purple} />
        <Text style={styles.placeholder}>Search instruments</Text>
        <Ionicons name="options-outline" size={18} color={colors.muted} />
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={colors.purple} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search instruments by name"
        placeholder="Type an instrument name"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeText("")}
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={20} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  placeholder: {
    flex: 1,
    color: colors.muted,
    fontSize: 14,
  },
  input: {
    flex: 1,
    minHeight: 52,
    color: colors.text,
    fontSize: 14,
  },
});
