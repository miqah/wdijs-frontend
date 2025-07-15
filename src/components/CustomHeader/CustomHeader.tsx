import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const CustomHeader = ({ onProfilePress, onSettingsPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onProfilePress}>
        <Image
          source={{ uri: "https://example.com/profile-pic.png" }}
          style={styles.profilePic}
        />
      </TouchableOpacity>
      <Text style={styles.title}>What Did I just Say</Text>
      <TouchableOpacity onPress={onSettingsPress}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#888888",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsIcon: {
    fontSize: 18,
  },
});

export default CustomHeader;
