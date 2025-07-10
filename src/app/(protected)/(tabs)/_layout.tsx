import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";
export default async function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "01010101",
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <View>
              <Text>Home</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
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
