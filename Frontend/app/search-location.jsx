import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const SearchLocation = () => {
  const router = useRouter();
  const [pickup, setPickup] = useState(""); // State for pickup input
  const [drop, setDrop] = useState(""); // State for drop input
  const [isPickupFocused, setIsPickupFocused] = useState(true); // Track which input is focused

  // Dummy suggestions
  const dummySuggestions = [
    { name: "Hostel O4", coordinates: { latitude: 26.2978, longitude: 73.0168 } },
    { name: "Hostel I2", coordinates: { latitude: 26.4745, longitude: 73.1162 } },
    { name: "Academic Block", coordinates: { latitude: 26.4763, longitude: 73.1155 } },
    { name: "Paota Circle, Bhadwasia", coordinates: { latitude: 26.3000, longitude: 73.0190 } },
  ];

  // Filter suggestions based on the focused input (pickup or drop)
  const filteredSuggestions = dummySuggestions.filter((location) =>
    isPickupFocused
      ? location.name.toLowerCase().includes(pickup.toLowerCase())
      : location.name.toLowerCase().includes(drop.toLowerCase())
  );

  // Handle selection of a suggestion
  const handleSuggestionSelect = (location) => {
    if (isPickupFocused) {
      setPickup(location.name);
    } else {
      setDrop(location.name);
    }
  };

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
        {/* Pickup Input */}
        <View className="flex-row items-center">
          <Ionicons name="radio-button-on" size={18} color="green" />
          <TextInput
            className="ml-2 text-base text-black flex-1"
            placeholder="Enter pickup location"
            value={pickup}
            onChangeText={setPickup}
            onFocus={() => setIsPickupFocused(true)} // Set focus to pickup
          />
          {pickup.length > 0 && (
            <TouchableOpacity onPress={() => setPickup("")}>
              <Ionicons name="close" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        <View className="border-t border-gray-300 my-1" /> {/* Divider */}

        {/* Drop Input */}
        <View className="flex-row items-center">
          <MaterialIcons name="radio-button-checked" size={18} color="red" />
          <TextInput
            className="ml-2 flex-1 text-base text-black"
            placeholder="Enter drop location"
            value={drop}
            onChangeText={setDrop}
            onFocus={() => setIsPickupFocused(false)} // Set focus to drop
          />
          {drop.length > 0 && (
            <TouchableOpacity onPress={() => setDrop("")}>
              <Ionicons name="close" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Suggestions */}
      <FlatList
        className="mx-4"
        data={filteredSuggestions} // Use filtered suggestions
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSuggestionSelect(item)}>
            <View className="flex-row items-start justify-between mb-3 px-1">
              <View className="flex-row items-start">
                <Ionicons name="location-sharp" size={20} color="#444" />
                <View className="ml-2">
                  <Text className="text-black font-medium">{item.name}</Text>
                  <Text className="text-gray-600 text-sm">Jodhpur, Rajasthan, India</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Open Map Button */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/Mapscreen",
            params: {
              pickup: JSON.stringify(dummySuggestions.find((loc) => loc.name === pickup)?.coordinates),
              drop: JSON.stringify(dummySuggestions.find((loc) => loc.name === drop)?.coordinates),
            },
          })
        }
        className="bg-blue-500 rounded-full mx-4 my-4 py-3"
      >
        <Text className="text-center text-white text-lg font-semibold">Open Map</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SearchLocation;