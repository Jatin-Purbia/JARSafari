import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import {Tabs} from "expo-router";
export default function Tabslayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          borderTopWidth: 1,
          minheight:70,
        },
      }}
    >
      <Tabs.Screen name="index" 
        options={{ 
          title: "Home", 
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: focused ? "#673ab7" : "#222" }}>Home</Text>
            </View>
          ),
         }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}