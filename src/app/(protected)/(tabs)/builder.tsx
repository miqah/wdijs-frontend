import React from "react";
import { View, StyleSheet } from "react-native";

export default function BuilderScreen() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});
