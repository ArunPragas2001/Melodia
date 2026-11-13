import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../theme/colors";

export default function AuthField({
  label,
  value,
  onChangeText,
  icon,
  secure = false,
  keyboardType = "default",
  autoComplete,
}) {
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={fieldStyles.group}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={fieldStyles.field}>
        <Ionicons name={icon} size={19} color={colors.purple} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          accessibilityLabel={label}
          autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
          autoCorrect={false}
          autoComplete={autoComplete}
          keyboardType={
            /** @type {import("react-native").KeyboardTypeOptions} */ (
              keyboardType
            )
          }
          secureTextEntry={hidden}
          style={fieldStyles.input}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            onPress={() => setHidden((current) => !current)}
            hitSlop={8}
          >
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colors.muted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  group: { gap: 8 },
  label: { color: colors.text, fontSize: 13, fontWeight: "700" },
  field: {
    minHeight: 54,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: { flex: 1, minHeight: 52, color: colors.text, fontSize: 15 },
});
