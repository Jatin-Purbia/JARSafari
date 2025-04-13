import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";

// Campus graph representation for Dijkstra's algorithm
const campusGraph = {
  "Hostel A": { "Academic Block": 5, "Cafeteria": 3, "Library": 7 },
  "Hostel B": { "Academic Block": 6, "Cafeteria": 4, "Library": 8 },
  "Academic Block": { "Hostel A": 5, "Hostel B": 6, "Library": 2, "Cafeteria": 4 },
  "Library": { "Hostel A": 7, "Hostel B": 8, "Cafeteria": 3, "Sports Complex": 6 },
  "Cafeteria": { "Hostel A": 3, "Hostel B": 4, "Academic Block": 4, "Library": 3, "Sports Complex": 5 },
  "Sports Complex": { "Library": 6, "Cafeteria": 5, "Medical Center": 4 },
  "Medical Center": { "Sports Complex": 4, "Hostel C": 3 },
  "Hostel C": { "Medical Center": 3, "Hostel D": 2 },
  "Hostel D": { "Hostel C": 2, "Parking Lot": 4 },
  "Parking Lot": { "Hostel D": 4, "Main Gate": 3 },
  "Main Gate": { "Parking Lot": 3, "Auditorium": 5 },
  "Auditorium": { "Main Gate": 5, "Academic Block": 6 }
};

// Dijkstra's algorithm implementation
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const nodes = new Set();
  const path = [];
  
  // Initialize distances and nodes
  for (const node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
    nodes.add(node);
  }
  
  while (nodes.size > 0) {
    // Find the node with the smallest distance
    let minNode = null;
    let minDistance = Infinity;
    
    for (const node of nodes) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        minNode = node;
      }
    }
    
    // If we've reached the end or there's no path
    if (minNode === null || minNode === end) {
      break;
    }
    
    nodes.delete(minNode);
    
    // Update distances to neighbors
    for (const neighbor in graph[minNode]) {
      if (nodes.has(neighbor)) {
        const distance = distances[minNode] + graph[minNode][neighbor];
        
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = minNode;
        }
      }
    }
  }
  
  // Reconstruct path
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  // If no path found
  if (path[0] !== start) {
    return { path: [], distance: Infinity, time: 0 };
  }
  
  // Calculate total distance and estimated time (assuming 4 km/h walking speed)
  const distance = distances[end];
  const timeMinutes = Math.round((distance / 4) * 60); // Convert to minutes
  
  return { path, distance, time: timeMinutes };
}

const SearchScreen = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Autocomplete states
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Get all available locations
  const availableLocations = Object.keys(campusGraph);

  // Filter locations based on input
  const filterLocations = (input, locations) => {
    if (!input) return [];
    const lowerInput = input.toLowerCase();
    return locations.filter(location => 
      location.toLowerCase().includes(lowerInput)
    );
  };

  // Handle from location input change
  const handleFromLocationChange = (text) => {
    setFromLocation(text);
    setFromSuggestions(filterLocations(text, availableLocations));
    setShowFromSuggestions(true);
  };

  // Handle to location input change
  const handleToLocationChange = (text) => {
    setToLocation(text);
    setToSuggestions(filterLocations(text, availableLocations));
    setShowToSuggestions(true);
  };

  // Select from location suggestion
  const selectFromLocation = (location) => {
    setFromLocation(location);
    setShowFromSuggestions(false);
  };

  // Select to location suggestion
  const selectToLocation = (location) => {
    setToLocation(location);
    setShowToSuggestions(false);
  };

  // Handle search for route
  const handleSearch = () => {
    if (!fromLocation || !toLocation) {
      Alert.alert('Error', 'Please enter both starting and destination points');
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      try {
        // Find the shortest path using Dijkstra's algorithm
        const result = dijkstra(campusGraph, fromLocation, toLocation);
        
        if (result.path.length === 0) {
          Alert.alert('No Route Found', 'No route found between these locations');
          setIsLoading(false);
          return;
        }
        
        setRoute(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error finding route:', error);
        Alert.alert('Error', 'An error occurred while finding the route');
        setIsLoading(false);
      }
    }, 1000);
  };

  // Render suggestion item with improved UI
  const renderSuggestionItem = ({ item, onSelect }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-100 active:bg-gray-50"
      onPress={() => onSelect(item)}
      style={{ 
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6'
      }}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
          <Ionicons name="location-outline" size={20} color="#3B82F6" />
        </View>
        <View>
          <Text className="text-base font-medium text-gray-900">{item}</Text>
          <Text className="text-sm text-gray-500">Campus Location</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={[{ key: 'header' }]}
        renderItem={() => (
          <>
            {/* Header with Gradient */}
            <LinearGradient
              colors={['#FCD34D', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="pt-12 pb-6 px-6 rounded-b-3xl shadow-md"
            >
              <Text className="text-2xl font-bold text-black mb-2">Explore Campus</Text>
              <Text className="text-gray-700">Find the shortest route between locations</Text>
            </LinearGradient>

            {/* IIT Jodhpur Map Image */}
            <View className="px-6 mt-4">
              <View className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Image 
                  source={require('../../assets/images/iitj-map.jpg')}
                  style={{ width: '100%', height: 200 }}
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-sm text-gray-500 text-center">
                    IIT Jodhpur Campus Map
                  </Text>
                </View>
              </View>
            </View>

            {/* Search Form */}
            <View className="px-6 mt-4">
              <View className="bg-white rounded-2xl shadow-lg p-4">
                {/* From Location */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                      <Ionicons name="location" size={16} color="#22C55E" />
                    </View>
                    <Text className="ml-2 text-gray-600">From</Text>
                  </View>
                  <View>
                    <TextInput
                      className="bg-gray-50 p-4 rounded-xl text-base"
                      placeholder="Enter starting point"
                      value={fromLocation}
                      onChangeText={handleFromLocationChange}
                      onFocus={() => setShowFromSuggestions(true)}
                    />
                    {showFromSuggestions && fromSuggestions.length > 0 && (
                      <View 
                        className="w-full bg-white rounded-xl shadow-lg overflow-hidden mt-1" 
                        style={{ 
                          maxHeight: 200,
                          borderWidth: 1,
                          borderColor: '#f3f4f6'
                        }}
                      >
                        <FlatList
                          data={fromSuggestions}
                          renderItem={({ item }) => renderSuggestionItem({ item, onSelect: selectFromLocation })}
                          keyExtractor={(item) => item}
                          nestedScrollEnabled={true}
                          showsVerticalScrollIndicator={true}
                          className="rounded-xl"
                        />
                      </View>
                    )}
                  </View>
                </View>

                {/* To Location */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                      <Ionicons name="flag" size={16} color="#EF4444" />
                    </View>
                    <Text className="ml-2 text-gray-600">To</Text>
                  </View>
                  <View>
                    <TextInput
                      className="bg-gray-50 p-4 rounded-xl text-base"
                      placeholder="Enter destination"
                      value={toLocation}
                      onChangeText={handleToLocationChange}
                      onFocus={() => setShowToSuggestions(true)}
                    />
                    {showToSuggestions && toSuggestions.length > 0 && (
                      <View 
                        className="w-full bg-white rounded-xl shadow-lg overflow-hidden mt-1" 
                        style={{ 
                          maxHeight: 200,
                          borderWidth: 1,
                          borderColor: '#f3f4f6'
                        }}
                      >
                        <FlatList
                          data={toSuggestions}
                          renderItem={({ item }) => renderSuggestionItem({ item, onSelect: selectToLocation })}
                          keyExtractor={(item) => item}
                          nestedScrollEnabled={true}
                          showsVerticalScrollIndicator={true}
                          className="rounded-xl"
                        />
                      </View>
                    )}
                  </View>
                </View>

                {/* Search Button */}
                <TouchableOpacity
                  className="bg-yellow-400 py-4 rounded-xl mt-4"
                  onPress={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Text className="text-center font-semibold text-black text-lg">Finding Route...</Text>
                  ) : (
                    <Text className="text-center font-semibold text-black text-lg">Find Route</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Route Results */}
            {route && (
              <View className="px-6 mt-6 mb-6">
                <View className="bg-white rounded-2xl shadow-lg p-4">
                  <Text className="text-xl font-bold text-black mb-2">Route Found</Text>
                  
                  <View className="flex-row justify-between mb-4">
                    <View>
                      <Text className="text-gray-600">Total Distance</Text>
                      <Text className="text-lg font-semibold">{route.distance.toFixed(1)} km</Text>
                    </View>
                    <View>
                      <Text className="text-gray-600">Estimated Time</Text>
                      <Text className="text-lg font-semibold">{route.time} minutes</Text>
                    </View>
                  </View>
                  
                  <Text className="text-gray-600 mb-2">Route:</Text>
                  <View className="bg-gray-50 p-3 rounded-xl">
                    {route.path.map((location, index) => (
                      <View key={index} className="flex-row items-center mb-2">
                        <View className="w-6 h-6 rounded-full bg-yellow-400 items-center justify-center mr-2">
                          <Text className="text-xs font-bold">{index + 1}</Text>
                        </View>
                        <Text className="text-black">{location}</Text>
                        {index < route.path.length - 1 && (
                          <Ionicons name="arrow-forward" size={16} color="#999" className="mx-2" />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Available Locations */}
            <View className="px-6 mb-8">
              <Text className="text-xl font-semibold text-slate-900 mb-4">Available Locations</Text>
              <View className="bg-gray-50 p-3 rounded-xl">
                <Text className="text-gray-600">
                  {Object.keys(campusGraph).join(', ')}
                </Text>
              </View>
            </View>
          </>
        )}
        ListFooterComponent={() => <View style={{ height: 100 }} />}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
