import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { locations, getLocationType } from './data/locationData';

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Initialize favorites from global state if it exists
    if (global.favorites) {
      setFavorites(global.favorites);
    }
  }, []);

  const toggleFavorite = (location) => {
    const newFavorites = favorites.includes(location)
      ? favorites.filter(fav => fav !== location)
      : [...favorites, location];

    setFavorites(newFavorites);
    global.favorites = newFavorites;
  };

  const handleContinue = () => {
    if (favorites.length === 0) {
      Alert.alert('Warning', 'You haven\'t selected any favorite locations. Would you like to continue anyway?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.replace('/(tabs)') }
      ]);
    } else {
      router.replace('/(tabs)/Homepage');
    }
  };

  // Group locations by type
  const groupedLocations = locations.reduce((acc, location) => {
    const type = getLocationType(location);
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(location);
    return acc;
  }, {});

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold mb-4">Select Your Favorites</Text>
          <Text className="text-gray-600 mb-6">
            Choose your frequently visited locations to get personalized recommendations
          </Text>

          {Object.entries(groupedLocations).map(([type, locations]) => (
            <View key={type} className="mb-6">
              <Text className="text-lg font-semibold mb-2 capitalize">{type}</Text>
              <View className="flex-row flex-wrap">
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    className={`p-3 m-1 rounded-lg ${
                      favorites.includes(location) ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    onPress={() => toggleFavorite(location)}
                  >
                    <Text
                      className={`${
                        favorites.includes(location) ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg mt-6"
            onPress={handleContinue}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Continue to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 