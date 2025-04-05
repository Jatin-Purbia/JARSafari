import React from "react";
import { View, Text,Image } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchIcon from "../../assets/images/Icon.png"; // Import your custom icon
const TabIcon = ({ name, focused, title , customIcon }) => {
  return (
    <View className="flex-1 mt-2 items-center justify-center height: 40">
      {customIcon ? (
        <Image
          source={customIcon}
          style={{
            width: 36,
            height: 36,
            tintColor: focused ? "#FFC107" : "#000",
            resizeMode: "contain",
          }}
        />
      ) : (
        <Ionicons
          name={focused ? name : `${name}-outline`}
          size={22}
          color={focused ? "#FFC107" : "#000"}
        />
      )}
      <Text className={`text-xs mt-2 ${focused ? "text-[#FFC107]" : "text-[black]"}`}>
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
          height: 70,
          backgroundColor: "#fff",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
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
            <TabIcon name="search" focused={focused} title="Explore" customIcon={SearchIcon}/>
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
