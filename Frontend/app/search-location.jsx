import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const SearchLocation = () => {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  // Dummy suggestions
  const dummySuggestions = [
    "Paota",
    "Paota Circle",
    "Paota C Road",
    "Paota Circle, Bhadwasia",
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      {/* Header */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center mt-2 mb-4 px-4"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text className="ml-2 text-lg font-semibold">Drop</Text>
      </TouchableOpacity>

      {/* Input Fields */}
      <View className="bg-gray-100 rounded-2xl px-4 mx-4 my-2 mb-4 shadow-sm">
        <View className="flex-row items-center">
          <Ionicons name="radio-button-on" size={18} color="green" />
          <TextInput
            className="ml-2 text-base text-black flex-1"
            placeholder="Enter pickup location"
            value={pickup}
            onChangeText={setPickup}
          />
        </View>
        <View className="border-t border-gray-300 my-1" /> {/* Divider */}
        <View className="flex-row items-center">
          <MaterialIcons name="radio-button-checked" size={18} color="red" />
          <TextInput
            className="ml-2 flex-1 text-base text-black"
            placeholder="Enter drop location"
            value={drop}
            onChangeText={setDrop}
          />
          {drop.length > 0 && (
            <TouchableOpacity onPress={() => setDrop("")}>
              <Ionicons name="close" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Select on map */}
      <TouchableOpacity
        onPress={() => router.push("/Mapscreen")}
        className="flex-row items-center bg-white border border-gray-300 rounded-full py-2 px-4 mb-4 mx-4 shadow-sm"
      >
        <Ionicons name="map" size={20} color="#000" />
        <Text className="ml-2 text-base font-medium text-black">
          Select on map
        </Text>
      </TouchableOpacity>

      {/* Suggestions */}
      <View className="mx-4">
        <FlatList
          data={dummySuggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="flex-row items-start justify-between mb-3 px-1">
              <View className="flex-row items-start">
                <Ionicons name="location-sharp" size={20} color="#444" />
                <View className="ml-2">
                  <Text className="text-black font-medium">{item}</Text>
                  <Text className="text-gray-600 text-sm">
                    Jodhpur, Rajasthan, India
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchLocation;