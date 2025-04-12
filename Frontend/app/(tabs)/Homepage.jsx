import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Card from "../../components/card"; // Import the Card component

export default function Homepage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState(null);

  const data = {
    Hostels: ["O4", "O3", "Y4","Y3", "B1", "G6"],
    "Lecture Halls": ["LHC 101", "LHC 102"],
    Mess: ["Main Mess", "North Mess"],
    Departments: ["Chem Engg", "CSE", "EE"]
  };

  const recommendations = [
    { icon: "home", label: "Hostels" },
    { icon: "school", label: "Lecture Halls" },
    { icon: "restaurant", label: "Mess", lib: MaterialIcons },
    { icon: "building", label: "Departments", lib: FontAwesome5 }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-8 py-4">
        {/* Greeting */}
        <Text className="text-3xl font-bold text-black">Hi, Sharan!</Text>
        <Text className="text-base text-gray-700 mt-1 mb-4">
          Where do you want to go today?
        </Text>

        {/* Tagline */}
        <View className="mt-2 mb-6">
          <Text className="text-2xl font-semibold text-black leading-snug">
            Explore like never{'\n'}before.
          </Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
         onPress={() => router.push("/search-location")} 
         className="w-full flex-row items-center bg-gray-100 rounded-2xl px-4 py-4 mb-6 shadow-sm"
      >
      <Ionicons name="search" size={24} color="#000" />
      <Text className="ml-3 text-base text-black">
       Search for a location...
      </Text>
      </TouchableOpacity>


        {/* Recommendations */}
        <Text className="text-lg font-semibold text-black mb-3">
          Recommendations
        </Text>
        <View className="flex-row justify-between mb-6">
          {recommendations.map((item, index) => {
            const IconLib = item.lib || Ionicons;
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  setActiveType(activeType === item.label ? null : item.label)
                }
                className="items-center"
              >
                <View className="bg-gray-100 rounded-full p-3 mb-1 shadow-sm">
                  <IconLib name={item.icon} size={22} color="#FFC107" />
                </View>
                <Text className="text-black text-sm text-center">
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Conditionally show cards */}
        {activeType && (
  <View className="mb-6">
    {Array.from({ length: Math.ceil(data[activeType].length / 4) }).map((_, rowIndex) => (
      <View key={rowIndex} className="flex-row justify-between mb-4">
        {data[activeType]
          .slice(rowIndex * 4, rowIndex * 4 + 4)
          .map((place, idx) => (
            <Card key={idx} title={place} />
        ))}
      </View>
    ))}
  </View>
)}


        {/* Plan a Trip */}
        <TouchableOpacity
          onPress={() => router.push("/Mapscreen")}
          className="bg-yellow-400 py-4 rounded-2xl items-center shadow-md mb-6"
        >
          <Text className="text-black font-bold text-base">Plan a Trip</Text>
        </TouchableOpacity>

        {/* Recent Routes */}
        <Text className="text-lg font-semibold text-black mb-3">
          Recent Routes
        </Text>
        <View className="bg-gray-100 border-l-4 border-black p-4 rounded-xl mb-3 shadow-sm">
          <Text className="text-black font-medium">Hostel → Lecture Hall</Text>
          <Text className="text-gray-600 text-sm">5 min</Text>
        </View>
        <View className="bg-gray-100 border-l-4 border-black p-4 rounded-xl shadow-sm">
          <Text className="text-black font-medium">Hostel → Library</Text>
          <Text className="text-gray-600 text-sm">12 min</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
