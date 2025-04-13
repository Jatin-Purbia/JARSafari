import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Animatable from 'react-native-animatable';
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import Card from "../../components/card";

export default function Homepage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [timeBasedData, setTimeBasedData] = useState([]);

  const data = {
    Hostels: ["O4", "O3", "Y4", "Y3", "B1", "G6"],
    "Lecture Halls": ["LHC 101", "LHC 102", "LHC 201"],
    Mess: ["Main Mess", "North Mess"],
    Departments: ["Chem Engg", "CSE", "EE"],
    "Sports Facilities": ["Football Ground", "Tennis Court", "Gym"],
    "Grocery Shops": ["Campus Mart", "Daily Needs"],
    Cafes: ["Night Owl", "Cafe Coffee Day"]
  };

  const allRecommendations = {
    Morning: [
      { icon: "school", label: "Lecture Halls" },
      { icon: "building", label: "Departments", lib: FontAwesome5 }
    ],
    Afternoon: [
      { icon: "restaurant", label: "Mess", lib: MaterialIcons },
      { icon: "home", label: "Hostels" }
    ],
    Evening: [
      { icon: "soccer-ball-o", label: "Sports Facilities", lib: FontAwesome },
      { icon: "shopping-cart", label: "Grocery Shops", lib: FontAwesome }
    ],
    Night: [
      { icon: "coffee", label: "Cafes", lib: FontAwesome },
      { icon: "restaurant", label: "Mess", lib: MaterialIcons }
    ]
  };

  useEffect(() => {
    const hour = new Date().getHours();
    const { greetingText, timeKey } = getTimeGreeting(hour);
    setGreeting(greetingText);
    setTimeBasedData(allRecommendations[timeKey]);
  }, []);

  const getTimeGreeting = (hour) => {
    if (hour >= 5 && hour < 12) return { greetingText: "Good Morning", timeKey: "Morning" };
    if (hour >= 12 && hour < 16) return { greetingText: "Good Afternoon", timeKey: "Afternoon" };
    if (hour >= 16 && hour < 20) return { greetingText: "Good Evening", timeKey: "Evening" };
    return { greetingText: "Good Night", timeKey: "Night" };
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-8 py-4">
        {/* Animated Greeting */}
        <Animatable.View animation="slideInDown" duration={800}>
          <Text className="text-3xl font-bold text-black">Hi, Sharan!</Text>
          <Text className="text-xl text-gray-700 mt-1 mb-4">{greeting}</Text>
        </Animatable.View>

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

        {/* Dynamic Recommendations */}
        <Text className="text-lg font-semibold text-black mb-3">
          Suggestions for You
        </Text>
        <Animatable.View animation="fadeInUp" duration={700} className="flex-row flex-wrap gap-6 mb-6">
          {timeBasedData.map((item, index) => {
            const IconLib = item.lib || Ionicons;
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  setActiveType(activeType === item.label ? null : item.label)
                }
                className="items-center w-[22%]"
              >
                <View className="bg-gray-100 rounded-full p-3 mb-1 shadow-sm">
                  <IconLib name={item.icon} size={22} color="#FFC107" />
                </View>
                <Text className="text-black text-xs text-center">
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animatable.View>

        {/* Conditionally Show Cards */}
        {activeType && data[activeType] && (
          <Animatable.View animation="fadeInUp" duration={600} className="mb-6">
            {Array.from({ length: Math.ceil(data[activeType].length / 4) }).map((_, rowIndex) => (
              <View key={rowIndex} className="flex-row justify-between mb-4">
                {data[activeType]
                  .slice(rowIndex * 4, rowIndex * 4 + 4)
                  .map((place, idx) => (
                    <Card key={idx} title={place} />
                  ))}
              </View>
            ))}
          </Animatable.View>
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
