import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
        <Text className="text-3xl font-bold text-slate-900">Hi, Sharan!</Text>
        <Text className="text-base text-gray-700 mt-1 mb-4">
          Where do you want to go today?
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-3 py-1 mb-6 shadow-sm">
          <Ionicons name="search" size={24} color="#999" />
          <TextInput
            placeholder="Search for a location..."
            className="ml-3 flex-1 text-base text-slate-900"
            placeholderTextColor="#999"
          /> 
        </View>

        {/* Quick Access */}
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
                <View className="bg-gray-100 rounded-full p-3 mb-1 shadow-sm">
                  <IconLib name={item.icon} size={22} color="#0C1C2D" />
                </View>
                <Text className="text-slate-900 text-sm text-center">{item.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Mini Map Preview */}
        <View className="bg-white border border-gray-300 rounded-2xl h-32 items-center justify-center mb-6 shadow-sm">
          <Ionicons name="location" size={28} color="#0C1C2D" />
          <Text className="text-slate-900 mt-2 font-medium">Map Preview</Text>
        </View>

        {/* Favorites */}
        <Text className="text-lg font-semibold text-slate-900 mb-3">Favorites</Text>
        <View className="space-y-2 mb-6">
          <TouchableOpacity className="bg-white border border-gray-300 px-4 py-3 rounded-xl shadow-sm mb-3">
            <Text className="text-slate-900 font-semibold">Hostel → Lecture Hall</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border border-gray-300 px-4 py-3 rounded-xl shadow-sm">
            <Text className="text-slate-900 font-semibold">Hostel → Mess</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Routes */}
        <Text className="text-lg font-semibold text-slate-900 mb-3">Recent Routes</Text>
        <View className="bg-white border-l-4 border-slate-900 p-4 rounded-xl mb-3 shadow-sm">
          <Text className="text-slate-900 font-medium">Hostel → Lecture Hall</Text>
          <Text className="text-gray-600 text-sm">5 min</Text>
        </View>
        <View className="bg-white border-l-4 border-slate-900 p-4 rounded-xl shadow-sm">
          <Text className="text-slate-900 font-medium">Hostel → Library</Text>
          <Text className="text-gray-600 text-sm">12 min</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
