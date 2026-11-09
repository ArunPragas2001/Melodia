import React from "react";
import { ScrollView } from "react-native";
import styles from "../theme/styles";

export default function Page({ children }) {
  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
