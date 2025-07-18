import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#baa1cc",
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {},
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="robot-excited"
              color="	#c9b4d8"
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="builder"
        options={{
          title: "Builder",
          tabBarIcon: () => (
            <View>
              <Text>Builder</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: () => (
            <View>
              <Text>Practice</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: "Dictionary",
          tabBarIcon: ({ color }) => (
            <View>
              <Text>Practice</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
