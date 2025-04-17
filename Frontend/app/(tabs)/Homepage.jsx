import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

// Import location data from the data file
import { 
  locations, 
  campusGraph, 
  locationCoordinates,
  getLocationType,
  getLocationIcon,
  groupLocationsByType
} from '../data/locationData';

// Time-based recommendations based on location types
const timeBasedRecommendations = {
  morning: [
    { icon: "restaurant", label: "Old Mess", lib: MaterialIcons },
    { icon: "restaurant", label: "New Mess", lib: MaterialIcons },
    { icon: "school", label: "Lecture Hall Complex", lib: MaterialIcons },
    { icon: "local-library", label: "Central Library", lib: MaterialIcons },
    { icon: "sports-soccer", label: "Sports Complex", lib: MaterialIcons },
    { icon: "school", label: "Computer Science Department", lib: MaterialIcons },
  ],
  afternoon: [
    { icon: "restaurant", label: "Canteen", lib: MaterialIcons },
    { icon: "local-library", label: "Central Library", lib: MaterialIcons },
    { icon: "sports-soccer", label: "Sports Complex", lib: MaterialIcons },
    { icon: "school", label: "Mechanical Engineering Department", lib: MaterialIcons },
    { icon: "school", label: "Electrical Engineering Department", lib: MaterialIcons },
    { icon: "business", label: "Administration Block", lib: MaterialIcons },
  ],
  evening: [
    { icon: "restaurant", label: "Old Mess", lib: MaterialIcons },
    { icon: "sports-soccer", label: "Sports Complex", lib: MaterialIcons },
    { icon: "local-library", label: "Central Library", lib: MaterialIcons },
    { icon: "event", label: "Student Activity Center", lib: MaterialIcons },
    { icon: "sports-basketball", label: "Basketball Court", lib: MaterialIcons },
    { icon: "sports-tennis", label: "Tennis Court", lib: MaterialIcons },
  ],
  night: [
    { icon: "restaurant", label: "Canteen", lib: MaterialIcons },
    { icon: "home", label: "Hostel I3", lib: MaterialIcons },
    { icon: "home", label: "Hostel I2", lib: MaterialIcons },
    { icon: "medical-services", label: "Medical Center", lib: MaterialIcons },
    { icon: "local-library", label: "Central Library", lib: MaterialIcons },
    { icon: "event", label: "Student Activity Center", lib: MaterialIcons },
  ]
};

// Travel quotes based on time of day
const travelQuotes = {
  morning: "The early bird catches the worm. Start your day with adventure!",
  afternoon: "Adventure is not outside man; it is within.",
  evening: "The journey of a thousand miles begins with one step.",
  night: "The stars are better off without us. Let's explore the world below."
};

// Enhanced Trie data structure for autocomplete
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.frequency = 0; // Track how often this word is used
    this.metadata = {}; // Store additional data about the location
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word into the trie
  insert(word, metadata = {}) {
    let node = this.root;
    if (!word || typeof word !== 'string') return;
    const lowerWord = word.toLowerCase();
    
    for (let char of lowerWord) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    
    node.isEndOfWord = true;
    node.frequency += 1;
    node.metadata = { ...node.metadata, ...metadata };
  }

  // Search for words with the given prefix
  search(prefix, limit = 10) {
    let node = this.root;
    if (!prefix || typeof prefix !== 'string') return [];
    const lowerPrefix = prefix.toLowerCase();
    
    // Navigate to the node representing the prefix
    for (let char of lowerPrefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    
    // Find all words with this prefix
    const results = this._findAllWords(node, lowerPrefix);
    
    // Sort by frequency (most used first) and limit results
    return results
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map(item => item.word);
  }
  
  // Helper method to find all words with a given prefix
  _findAllWords(node, prefix) {
    const results = [];
    
    if (node.isEndOfWord) {
      results.push({ word: prefix, frequency: node.frequency });
    }
    
    for (const char in node.children) {
      const childResults = this._findAllWords(node.children[char], prefix + char);
      results.push(...childResults);
    }
    
    return results;
  }
  
  // Fuzzy search with Levenshtein distance
  fuzzySearch(query, limit = 10) {
    if (!query || typeof query !== 'string') return [];
    
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // Get all words from the trie
    const allWords = this._getAllWords(this.root, '');
    
    // Calculate Levenshtein distance for each word
    allWords.forEach(word => {
      if (typeof word === 'string') {
        const distance = levenshteinDistance(lowerQuery, word.toLowerCase());
        if (distance <= 3) { // Only include words with distance <= 3
          results.push({ word, distance });
        }
      }
    });
    
    // Sort by distance and limit results
    return results
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map(item => item.word);
  }
  
  // Helper method to get all words from the trie
  _getAllWords(node, prefix) {
    const words = [];
    
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    
    for (const char in node.children) {
      const childWords = this._getAllWords(node.children[char], prefix + char);
      words.push(...childWords);
    }
    
    return words;
  }
}

// Levenshtein distance implementation
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

export default function Homepage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [userName, setUserName] = useState(global.userInfo?.name || "User");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [toLocation, setToLocation] = useState(params?.to || '');
  const [favorites, setFavorites] = useState([]);

  const [actualTimeOfDay, setActualTimeOfDay] = useState("morning");
  
  // Determine time of day
  useEffect(() => {
    const determineTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 17) return "afternoon";
      if (hour >= 17 && hour < 20) return "evening";
      return "night";
    };
    
    const actualTime = determineTimeOfDay();
    setActualTimeOfDay(actualTime);
    setTimeOfDay(actualTime);
  }, []);

  // Request location permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, []);

  // Initialize favorites from global state
  useEffect(() => {
    if (global.favorites) {
      setFavorites(global.favorites);
    }
  }, []);

  // Initialize user name from global state
  useEffect(() => {
    if (global.userInfo?.name) {
      setUserName(global.userInfo.name);
    }
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    switch (actualTimeOfDay) {
      case "morning": return "Good Morning";
      case "afternoon": return "Good Afternoon";
      case "evening": return "Good Evening";
      case "night": return "Good Night";
      default: return "Hello";
    }
  };

  // Handle time selection
  const handleTimeSelection = (time) => {
    setTimeOfDay(time);
    setShowTimeDropdown(false);
  };

  // Handle location selection
  const handleLocationPress = (location) => {
    router.push({
      pathname: "/Mapscreen",
      params: { 
        destination: location,
        userLatitude: userLocation?.coords?.latitude,
        userLongitude: userLocation?.coords?.longitude
      }
    });
  };

  // Handle Plan a Trip button press
  const handlePlanTripPress = () => {
    router.push("/ComingSoon");
  };

  // Handle Explore Locations button press
  const handleExploreLocationsPress = () => {
    router.push("/Locations");
  };

  // Render recommendation item
  const renderRecommendationItem = ({ item, index }) => {
    const IconLib = item.lib || Ionicons;
    return (
      <TouchableOpacity 
        key={index}
        className="items-center justify-center mx-2"
        onPress={() => handleLocationPress(item.label)}
      >
        <View className="bg-yellow-100 rounded-full p-4 mb-2 shadow-sm">
          <IconLib name={item.icon} size={24} color="#F59E0B" />
        </View>
        <Text className="text-black text-sm text-center">{item.label}</Text>
      </TouchableOpacity>
    );
  };

  // Render time dropdown item
  const renderTimeDropdownItem = ({ item }) => (
    <TouchableOpacity 
      className="px-4 py-3 border-b border-gray-100"
      onPress={() => handleTimeSelection(item)}
    >
      <Text className="text-gray-800 capitalize">{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Main Content - Using FlatList instead of ScrollView */}
        <FlatList
          data={[{ key: 'content' }]}
          renderItem={() => (
            <>
              {/* Logo and App Name */}
              <View className="items-center py-6">
                <Image 
                  source={require('../../assets/images/logo.png')} 
                  className="w-24 h-24 mb-2"
                  resizeMode="cover"
                />
                <Text className="text-2xl font-bold text-black mb-1">JARSafari</Text>
                <Text className="text-base text-gray-600 italic">
                  Your Campus Navigation Companion
                </Text>
              </View>

              {/* Greeting */}
              <View className="px-6 mb-4">
                <Text className="text-2xl font-bold text-black">
                  {getGreeting()}, {userName}!
                </Text>
                
                {/* Quote */}
                <Text className="text-base text-gray-600 mt-2 italic">
                  "{travelQuotes[actualTimeOfDay]}"
                </Text>
              </View>

              {/* Explore Locations Button */}
              {/* <View className="px-6 mb-6">
                <TouchableOpacity
                  onPress={handleExploreLocationsPress}
                  className="overflow-hidden rounded-2xl shadow-md"
                >
                  <LinearGradient
                    colors={['#FCD34D', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 items-center flex-row justify-center"
                  >
                    <Ionicons name="location" size={20} color="#000" />
                    <Text className="text-black font-bold text-lg ml-2">Explore Locations</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>  */}

              {/* Time Selection Dropdown */}
              <View className="px-6 mb-4">
                <TouchableOpacity 
                  className="flex-row items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3"
                  onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={20} color="#F59E0B" />
                    <Text className="ml-2 text-black capitalize">{timeOfDay}</Text>
                  </View>
                  <Ionicons 
                    name={showTimeDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
                
                {/* Time Dropdown Modal */}
                {showTimeDropdown && (
                  <View className="absolute top-14 left-6 right-6 bg-white rounded-xl shadow-lg z-10 border border-gray-200">
                    <FlatList
                      data={["morning", "afternoon", "evening", "night"]}
                      keyExtractor={(item) => item}
                      renderItem={renderTimeDropdownItem}
                      scrollEnabled={true}
                      nestedScrollEnabled={true}
                    />
                  </View>
                )}
              </View>

             

              {/* Time-based Recommendations - Full Width */}
              <View className="mb-6">
                <View className="px-6 mb-3 flex-row justify-between items-center">
                  <Text className="text-lg font-semibold text-yellow-500">
                    {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Recommendations
                  </Text>
                  <TouchableOpacity 
                    onPress={() => router.push("/Locations")}
                    className="bg-yellow-100 px-3 py-1 rounded-full"
                  >
                    <Text className="text-xs text-yellow-800">View All</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={timeBasedRecommendations[timeOfDay]}
                  renderItem={renderRecommendationItem}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={true}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                />
              </View>

               {/* Favorites Section */}
               <View className="px-6 mb-6">
                {favorites.length > 0 && (
                  <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-lg font-semibold text-blue-500">Your Favorites</Text>
                      <TouchableOpacity 
                        onPress={() => router.push("/Locations")}
                        className="bg-blue-100 px-3 py-1 rounded-full"
                      >
                        <Text className="text-xs text-blue-800">View All</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      className="flex-row"
                    >
                      {favorites.map((location) => (
                        <TouchableOpacity
                          key={location}
                          className="bg-blue-100 p-4 m-2 rounded-xl items-center w-32"
                          onPress={() => {
                            setToLocation(location);
                            router.push({
                              pathname: "/Mapscreen",
                              params: { 
                                destination: location,
                                userLatitude: userLocation?.coords?.latitude,
                                userLongitude: userLocation?.coords?.longitude
                              }
                            });
                          }}
                        >
                          <View className="bg-blue-200 rounded-full p-3 mb-2">
                            <MaterialIcons 
                              name={getLocationIcon(location)} 
                              size={24} 
                              color="#3B82F6" 
                            />
                          </View>
                          <Text className="text-blue-800 text-center" numberOfLines={2}>
                            {location}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Plan a Trip Button */}
              <View className="px-6 mb-6">
                <TouchableOpacity
                  onPress={handlePlanTripPress}
                  className="overflow-hidden rounded-2xl shadow-lg"
                >
                  <LinearGradient
                    colors={['#FCD34D', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 px-6 flex-row items-center justify-center space-x-2"
                  >
                    <Text className="text-black font-bold text-xl">Plan a Trip</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

            </>
          )}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      </View>
    </SafeAreaView>
  );
}
