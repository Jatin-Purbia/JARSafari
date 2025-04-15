import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { locations, getLocationType } from './data/locationData';
import { Ionicons } from '@expo/vector-icons';

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    if (global.favorites) {
      setFavorites(global.favorites);
    }
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredSuggestions([]);
      return;
    }

    // Tokenize the search query
    const queryTokens = searchQuery.toLowerCase().split(/\s+/);

    // Perform substring matching for each location
    const scoredMatches = locations
      .filter(loc => !favorites.includes(loc))
      .map(loc => {
        const locLower = loc.toLowerCase();
        // Calculate score based on token matches
        const score = queryTokens.reduce((acc, token) => {
          return acc + (locLower.includes(token) ? 1 : 0);
        }, 0);
        return { loc, score };
      })
      .filter(({ score }) => score > 0) // Filter out non-matching locations
      .sort((a, b) => b.score - a.score) // Sort by relevance
      .map(({ loc }) => loc); // Extract just the location names

    setFilteredSuggestions(scoredMatches);
  }, [searchQuery, favorites]);

  const toggleFavorite = (location) => {
    const newFavorites = favorites.includes(location)
      ? favorites.filter((fav) => fav !== location)
      : [location, ...favorites];

    setFavorites(newFavorites);
    global.favorites = newFavorites;
  };

  const handleContinue = () => {
    if (favorites.length === 0) {
      Alert.alert(
        'Warning',
        "You haven't selected any favorite locations. Would you like to continue anyway?",
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => router.replace('/(tabs)') },
        ]
      );
    } else {
      router.replace('/(tabs)/Homepage');
    }
  };

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
      <View className="bg-white p-4 shadow-md flex-row justify-between items-center">
        {/* Header Section with Title and Done Button */}
        <View style={{ flex: 1 }}>
          <Text className="text-2xl font-bold">Select Your Favorites</Text>
          <Text className="text-gray-600 mb-4">
            Choose your frequently visited locations to get personalized recommendations
          </Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            height: 40,
            borderRadius: 20,
          }}
          onPress={handleContinue}
        >
          <Text className="text-white text-sm font-semibold">Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          {/* 🔍 Search Bar with icon inside */}
          <View className="relative mb-4">
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: [{ translateY: -10 }],
                zIndex: 10,
              }}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search locations..."
              className="bg-gray-100 pl-10 pr-4 p-3 rounded-lg border border-gray-300"
            />
          </View>

          {/* 💛 Selected Favorites Shown as Chips with X */}
          {favorites.length > 0 && (
            <View className="flex-row flex-wrap mb-4">
              {favorites.map((fav) => (
                <View
                  key={fav}
                  className="flex-row items-center bg-blue-100 px-3 py-2 rounded-full mr-2 mb-2"
                >
                  <Text className="text-blue-700 mr-1">{fav}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(fav)}>
                    <Ionicons name="close-circle" size={18} color="#1E3A8A" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* 🔮 Suggestions List */}
          {filteredSuggestions.length > 0 && (
            <View className="bg-white shadow-md mb-4 rounded-lg border border-gray-200">
              {filteredSuggestions.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  className="p-3 border-b border-gray-100"
                  onPress={() => {
                    toggleFavorite(loc);
                    setSearchQuery('');
                    setFilteredSuggestions([]);
                  }}
                >
                  <Text>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 📌 Grouped Favorites */}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
