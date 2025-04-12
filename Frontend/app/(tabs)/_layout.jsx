import React from "react";
import { View, Text,Image } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabIcon = ({ name, focused, title}) => {
  return (
    <View className="flex-1 mt-2 items-center justify-center">
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={20}
        color={focused ? "#FFC107" : "black"}
      />
      <Text className={`text-xs mt-2 ${focused ? "text-[#FFC107]" : "text-[black]"}`}
       style={{ width: 60, textAlign: "center" }} // 👈 Ensures proper spacing
        >
        {title}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: "#fff",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="Homepage"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="search" focused={focused} title="Explore"/>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
