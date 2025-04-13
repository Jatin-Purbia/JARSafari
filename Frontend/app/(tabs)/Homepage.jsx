import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

// Hardcoded locations for autocomplete
const locations = [
  "Old Mess", "New Mess", "Sports Complex", "Lecture Hall", 
  "Library", "Ground", "Shamiyana", "Hostel", "Cafeteria",
  "Auditorium", "Parking Lot", "Admin Block", "Medical Center",
  "Gymnasium", "Swimming Pool", "Tennis Court", "Basketball Court"
];

// Time-based recommendations
const timeBasedRecommendations = {
  morning: [
    { icon: "restaurant", label: "Old Mess", lib: MaterialIcons },
    { icon: "restaurant", label: "New Mess", lib: MaterialIcons },
    { icon: "dumbbell", label: "Sports Complex", lib: FontAwesome5 },
    { icon: "school", label: "Lecture Hall", lib: Ionicons },
  ],
  afternoon: [
    { icon: "restaurant", label: "Mess", lib: MaterialIcons },
    { icon: "library", label: "Library", lib: MaterialIcons },
    { icon: "dumbbell", label: "Sports Complex", lib: FontAwesome5 },
    { icon: "local-cafe", label: "Cafeteria", lib: MaterialIcons },
  ],
  evening: [
    { icon: "restaurant", label: "Mess", lib: MaterialIcons },
    { icon: "sports-soccer", label: "Ground", lib: MaterialIcons },
    { icon: "library", label: "Library", lib: MaterialIcons },
    { icon: "umbrella", label: "Shamiyana", lib: MaterialIcons },
  ],
  night: [
    { icon: "restaurant", label: "Mess", lib: MaterialIcons },
    { icon: "nightlight", label: "Ground", lib: MaterialIcons },
    { icon: "local-cafe", label: "Cafeteria", lib: MaterialIcons },
    { icon: "home", label: "Hostel", lib: Ionicons },
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

  // Find all words starting from a given node
  _findAllWords(node, prefix) {
    let results = [];
    
    // If this is a complete word, add it to results
    if (node.isEndOfWord) {
      results.push({ 
        word: prefix, 
        frequency: node.frequency,
        metadata: node.metadata
      });
    }
    
    // Recursively find all words in child nodes
    for (let char in node.children) {
      results = results.concat(
        this._findAllWords(node.children[char], prefix + char)
      );
    }
    
    return results;
  }

  // Fuzzy search - find words that are similar to the query
  fuzzySearch(query, limit = 5) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // Helper function to calculate Levenshtein distance
    const levenshteinDistance = (a, b) => {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;
      
      const matrix = Array(b.length + 1).fill(null).map(() => 
        Array(a.length + 1).fill(null)
      );
      
      for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
      for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
      
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
          matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1, // deletion
            matrix[j - 1][i] + 1, // insertion
            matrix[j - 1][i - 1] + substitutionCost // substitution
          );
        }
      }
      
      return matrix[b.length][a.length];
    };
    
    // Get all words from the trie
    const getAllWords = (node, prefix = '') => {
      let words = [];
      if (node.isEndOfWord) {
        words.push(prefix);
      }
      for (let char in node.children) {
        words = words.concat(getAllWords(node.children[char], prefix + char));
      }
      return words;
    };
    
    const allWords = getAllWords(this.root);
    
    // Calculate distance for each word and sort by distance
    allWords.forEach(word => {
      const distance = levenshteinDistance(lowerQuery, word.toLowerCase());
      if (distance <= 3) { // Only include words with distance <= 3
        results.push({ word, distance });
      }
    });
    
    // Sort by distance and limit results
    return results
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map(item => item.word);
  }
}

export default function Homepage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [userName, setUserName] = useState("Sharan");
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize the trie with locations
  const [trie] = useState(() => {
    const trie = new Trie();
    locations.forEach(location => {
      // Add metadata for each location
      const metadata = {
        type: getLocationType(location),
        icon: getLocationIcon(location)
      };
      trie.insert(location, metadata);
    });
    return trie;
  });

  // Helper function to determine location type
  function getLocationType(location) {
    const lowerLocation = location.toLowerCase();
    if (lowerLocation.includes('mess')) return 'dining';
    if (lowerLocation.includes('library')) return 'academic';
    if (lowerLocation.includes('hall')) return 'academic';
    if (lowerLocation.includes('ground') || lowerLocation.includes('court')) return 'sports';
    if (lowerLocation.includes('hostel')) return 'residential';
    if (lowerLocation.includes('medical')) return 'health';
    if (lowerLocation.includes('parking')) return 'transport';
    if (lowerLocation.includes('cafeteria')) return 'dining';
    return 'other';
  }

  // Helper function to get icon for location
  function getLocationIcon(location) {
    const lowerLocation = location.toLowerCase();
    if (lowerLocation.includes('mess')) return 'restaurant';
    if (lowerLocation.includes('library')) return 'library';
    if (lowerLocation.includes('hall')) return 'school';
    if (lowerLocation.includes('ground')) return 'sports-soccer';
    if (lowerLocation.includes('court')) return 'sports';
    if (lowerLocation.includes('hostel')) return 'home';
    if (lowerLocation.includes('medical')) return 'medkit';
    if (lowerLocation.includes('parking')) return 'car';
    if (lowerLocation.includes('cafeteria')) return 'local-cafe';
    return 'place';
  }

  // Determine time of day
  useEffect(() => {
    const determineTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 17) return "afternoon";
      if (hour >= 17 && hour < 20) return "evening";
      return "night";
    };
    
    setTimeOfDay(determineTimeOfDay());
  }, []);

  // Handle search input with debounce
  const handleSearch = (text) => {
    setSearchQuery(text);
    
    if (text.length > 0) {
      setIsLoading(true);
      
      // Simulate network delay for better UX
      setTimeout(() => {
        // First try exact prefix match
        let results = trie.search(text);
        
        // If not enough results, try fuzzy search
        if (results.length < 3 && text.length > 2) {
          const fuzzyResults = trie.fuzzySearch(text);
          // Combine results, removing duplicates
          results = [...new Set([...results, ...fuzzyResults])];
        }
        
        setSuggestions(results);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // Update frequency in trie
    trie.insert(suggestion);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    switch (timeOfDay) {
      case "morning": return "Good Morning";
      case "afternoon": return "Good Afternoon";
      case "evening": return "Good Evening";
      case "night": return "Good Night";
      default: return "Hello";
    }
  };

  // Render suggestion item
  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity 
      className="px-4 py-3 border-b border-gray-100"
      onPress={() => selectSuggestion(item)}
    >
      <Text className="text-gray-800">{item}</Text>
    </TouchableOpacity>
  );

  // Render recommendation item
  const renderRecommendationItem = ({ item, index }) => {
    const IconLib = item.lib || Ionicons;
    return (
      <TouchableOpacity 
        key={index}
        className="mr-4 items-center"
        onPress={() => router.push("/Mapscreen")}
      >
        <View className="bg-yellow-100 rounded-full p-4 mb-2 shadow-sm">
          <IconLib name={item.icon} size={24} color="#F59E0B" />
        </View>
        <Text className="text-black text-sm text-center">{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Search Bar - Outside of ScrollView */}
        <View className="px-6 py-4">
          <View className="relative">
            <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-3 py-2 shadow-sm">
              <Ionicons name="search" size={24} color="#999" />
              <TextInput
                placeholder="Search for a location..."
                className="ml-3 flex-1 text-base text-black"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <View className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-lg z-10 border border-gray-200">
                {isLoading ? (
                  <View className="p-4 items-center">
                    <ActivityIndicator size="small" color="#F59E0B" />
                  </View>
                ) : suggestions.length > 0 ? (
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item}
                    renderItem={renderSuggestionItem}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                  />
                ) : (
                  <View className="p-4">
                    <Text className="text-gray-500 text-center">No locations found</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Main Content - Using FlatList instead of ScrollView */}
        <FlatList
          data={[{ key: 'content' }]}
          renderItem={() => (
            <>
              {/* Greeting */}
              <View className="px-6">
                <Text className="text-3xl font-bold text-black">
                  {getGreeting()}, {userName}!
                </Text>
                
                {/* Quote */}
                <Text className="text-base text-gray-600 mt-2 mb-6 italic">
                  "{travelQuotes[timeOfDay]}"
                </Text>
              </View>

              {/* Time-based Recommendations */}
              <View className="px-6 mb-6">
                <Text className="text-lg font-semibold text-yellow-500 mb-3">
                  {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Recommendations
                </Text>
                
                <FlatList
                  data={timeBasedRecommendations[timeOfDay]}
                  renderItem={renderRecommendationItem}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={true}
                />
              </View>

              {/* Plan a Trip Button */}
              <View className="px-6 mb-6">
                <TouchableOpacity
                  onPress={() => router.push("/Mapscreen")}
                  className="overflow-hidden rounded-2xl shadow-md"
                >
                  <LinearGradient
                    colors={['#FCD34D', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 items-center"
                  >
                    <Text className="text-black font-bold text-lg">Plan a Trip</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Recent Routes */}
              <View className="px-6 mb-6">
                <Text className="text-lg font-semibold text-black mb-3">Recent Routes</Text>
                <View className="bg-white border-l-4 border-black p-4 rounded-xl mb-3 shadow-sm">
                  <Text className="text-black font-medium">Hostel → Lecture Hall</Text>
                  <Text className="text-gray-600 text-sm">5 min</Text>
                </View>
                <View className="bg-white border-l-4 border-black p-4 rounded-xl shadow-sm">
                  <Text className="text-black font-medium">Hostel → Library</Text>
                  <Text className="text-gray-600 text-sm">12 min</Text>
                </View>
              </View>
            </>
          )}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      </View>
    </SafeAreaView>
  );
}
