import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function Homepage() {
  const router = useRouter();

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
        <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-3 py-1 mb-6 shadow-sm">
          <Ionicons name="search" size={24} color="#999" />
          <TextInput
            placeholder="Search for a location..."
            className="ml-3 flex-1 text-base text-black"
            placeholderTextColor="#999"
          />
        </View>

        {/* Recommendations */}
        <Text className="text-lg font-semibold text-yellow-500 mb-3">
          Recommendations
        </Text>
        <View className="flex-row justify-between mb-6">
          {[
            { icon: "home", label: "Hostel" },
            { icon: "school", label: "Lecture Halls" },
            { icon: "restaurant", label: "Mess", lib: MaterialIcons },
            { icon: "dumbbell", label: "Sports\nComplex", lib: FontAwesome5 },
          ].map((item, index) => {
            const IconLib = item.lib || Ionicons;
            return (
              <View className="items-center" key={index}>
                <View className="bg-yellow-100 rounded-full p-3 mb-1 shadow-sm">
                  <IconLib name={item.icon} size={22} color="#FFC107" />
                </View>
                <Text className="text-black text-sm text-center">{item.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Plan a Trip Button */}
        <TouchableOpacity
          onPress={() => router.push("/Mapscreen")}
          className="bg-yellow-400 py-4 rounded-2xl items-center shadow-md mb-6"
        >
          <Text className="text-black font-bold text-base">Plan a Trip</Text>
        </TouchableOpacity>

        {/* Recent Routes */}
        <Text className="text-lg font-semibold text-black mb-3">Recent Routes</Text>
        <View className="bg-white border-l-4 border-black p-4 rounded-xl mb-3 shadow-sm">
          <Text className="text-black font-medium">Hostel → Lecture Hall</Text>
          <Text className="text-gray-600 text-sm">5 min</Text>
        </View>
        <View className="bg-white border-l-4 border-black p-4 rounded-xl shadow-sm">
          <Text className="text-black font-medium">Hostel → Library</Text>
          <Text className="text-gray-600 text-sm">12 min</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
