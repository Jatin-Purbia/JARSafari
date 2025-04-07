import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ExploreScreen() {
  const quickAccessItems = [
    { title: "Hostels", icon: "bed-outline" },
    { title: "Departments", icon: "school-outline" },
    { title: "Cafes", icon: "cafe-outline" },
    { title: "Sports", icon: "football-outline" },
    { title: "Labs", icon: "flask-outline" },
    { title: "Library", icon: "book-outline" },
    { title: "Medical", icon: "medkit-outline" },
    { title: "Shuttle Stops", icon: "bus-outline" },
  ];

  const suggestedRoutes = [
    { from: "Hostel A", to: "Academic Block" },
    { from: "Cafeteria", to: "Library" },
    { from: "Medical", to: "Hostel D" },
    { from: "Football Ground", to: "Shuttle Stop" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 py-4">
        {/* Title */}
        <Text className="text-3xl font-bold text-slate-900 mb-1">Explore IIT Jodhpur</Text>
        <Text className="text-base text-gray-600 mb-6">
          Navigate easily and discover your campus like never before.
        </Text>

        {/* Quick Access */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-slate-900 mb-4">Quick Access</Text>
          <View className="flex-row flex-wrap justify-between gap-4">
            {quickAccessItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className="bg-yellow-300 rounded-2xl w-[45%] p-4 items-center shadow"
              >
                <Ionicons name={item.icon} size={28} color="#0C1C2D" />
                <Text className="text-slate-900 font-medium mt-2">{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Suggested Routes */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-slate-900 mb-4">Suggested Routes</Text>
          {suggestedRoutes.map((route, idx) => (
            <TouchableOpacity
              key={idx}
              className="bg-yellow-300 p-4 rounded-xl mb-3 shadow"
            >
              <Text className="text-slate-900 font-medium text-lg">
                {route.from} → {route.to}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">Shortest path suggestion</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Discover More */}
        <View className="mb-12">
          <Text className="text-xl font-semibold text-slate-900 mb-4">Discover More</Text>
          <TouchableOpacity className="bg-yellow-300 p-4 rounded-xl mb-3 shadow">
            <Text className="text-slate-900 font-medium text-lg">Campus Events</Text>
            <Text className="text-sm text-gray-600 mt-1">Know what's happening today</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-yellow-300 p-4 rounded-xl mb-3 shadow">
            <Text className="text-slate-900 font-medium text-lg">Food Joints</Text>
            <Text className="text-sm text-gray-600 mt-1">Top-rated places to eat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
