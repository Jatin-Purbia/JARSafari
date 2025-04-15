import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import location data from the data file
import { 
  locations, 
  campusGraph, 
  locationCoordinates,
  IITJ_CENTER,
  getLocationType,
  getLocationIcon,
  findShortestPath
} from '../data/locationData';

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
  const router = useRouter();
  const params = useLocalSearchParams();
  const [fromLocation, setFromLocation] = useState(params.from || '');
  const [toLocation, setToLocation] = useState(params.to || '');
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleEarth, setShowGoogleEarth] = useState(false);
  const [error, setError] = useState(null);
  
  // Autocomplete states
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Get all available locations
  const availableLocations = locations;

  // Filter locations based on input
  const filterLocations = (input, locations) => {
    if (!input) return [];
    const lowerInput = input.toLowerCase();
    return locations.filter(location => 
      location && typeof location === 'string' && location.toLowerCase().includes(lowerInput)
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

  // Generate Google Earth HTML
  const generateGoogleEarthHTML = () => {
    if (!route || route.path.length === 0) return '';
    
    const startCoords = locationCoordinates[route.path[0]];
    const endCoords = locationCoordinates[route.path[route.path.length - 1]];
    
    // Create path coordinates for the route
    const pathCoordinates = route.path.map(location => {
      const coords = locationCoordinates[location];
      return { lat: coords.latitude, lng: coords.longitude };
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            html, body, #map { height: 100%; margin: 0; padding: 0; }
            #map { width: 100%; }
            .loading {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-family: Arial, sans-serif;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <div id="loading" class="loading">Loading map...</div>
          <script>
            let map;
            let markers = [];
            let pathLine;

            function initMap() {
              try {
                map = new google.maps.Map(document.getElementById('map'), {
                  center: { lat: ${IITJ_CENTER.latitude}, lng: ${IITJ_CENTER.longitude} },
                  zoom: 16,
                  mapTypeId: 'satellite',
                  tilt: 45
                });

                // Add start marker
                markers.push(new google.maps.Marker({
                  position: { lat: ${startCoords.latitude}, lng: ${startCoords.longitude} },
                  map: map,
                  title: '${route.path[0]}',
                  icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  }
                }));

                // Add end marker
                markers.push(new google.maps.Marker({
                  position: { lat: ${endCoords.latitude}, lng: ${endCoords.longitude} },
                  map: map,
                  title: '${route.path[route.path.length - 1]}',
                  icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  }
                }));

                // Add route path
                pathLine = new google.maps.Polyline({
                  path: ${JSON.stringify(pathCoordinates)},
                  geodesic: true,
                  strokeColor: '#F59E0B',
                  strokeOpacity: 1.0,
                  strokeWeight: 3
                });
                pathLine.setMap(map);

                // Add all buildings as markers
                const buildings = ${JSON.stringify(Object.entries(locationCoordinates).map(([name, coords]) => ({
                  name,
                  position: { lat: coords.latitude, lng: coords.longitude }
                })))};

                buildings.forEach(building => {
                  markers.push(new google.maps.Marker({
                    position: building.position,
                    map: map,
                    title: building.name,
                    icon: {
                      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }
                  }));
                });

                // Fit map to show the entire route
                const bounds = new google.maps.LatLngBounds();
                pathCoordinates.forEach(coord => {
                  bounds.extend(coord);
                });
                map.fitBounds(bounds, { padding: 50 });

                // Hide loading message
                document.getElementById('loading').style.display = 'none';
              } catch (error) {
                console.error('Error initializing map:', error);
                document.getElementById('loading').textContent = 'Error loading map: ' + error.message;
              }
            }

            function handleMapError() {
              document.getElementById('loading').textContent = 'Error loading Google Maps. Please check your internet connection.';
            }
          </script>
          <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQhelQ56ilkCodWB5Wyi9hNKI_eb5p4hQ&callback=initMap"
            onerror="handleMapError()">
          </script>
        </body>
      </html>
    `;
  };

  // Handle search for route
  const handleSearch = async () => {
    if (!fromLocation || !toLocation) {
      Alert.alert('Error', 'Please enter both starting and destination points');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Get coordinates for start and end points
      const startCoords = locationCoordinates[fromLocation];
      const endCoords = locationCoordinates[toLocation];

      if (!startCoords || !endCoords) {
        Alert.alert('Error', 'Invalid locations selected');
        setIsLoading(false);
        return;
      }

      // Find the shortest path using Dijkstra's algorithm
      const path = findShortestPath(fromLocation, toLocation);
      
      if (path.path.length === 0) {
        Alert.alert('Error', 'No walkable path found between the selected locations. Please try different locations.');
        setIsLoading(false);
        return;
      }

      // Calculate total distance and estimated time
      const totalDistance = path.distance;
      const walkingSpeed = 5; // km/h
      const estimatedTime = Math.ceil((totalDistance / walkingSpeed) * 60); // minutes

      // Generate route steps
      const steps = path.path.map((location, index) => {
        const nextLocation = path.path[index + 1];
        if (!nextLocation) return null;
        
        const distance = Math.max(campusGraph[location][nextLocation], 0.1); // Minimum 0.1 km
        const duration = Math.max(Math.ceil((distance / 5) * 60), 1); // Minimum 1 minute
        
        return {
          instruction: `Go to ${nextLocation}`,
          distance: `${distance.toFixed(1)} km`,
          duration: `${duration} minutes`
        };
      }).filter(step => step !== null);

      setRoute({
        path: path.path,
        distance: Math.max(totalDistance, 0.1), // Ensure minimum total distance
        time: Math.max(estimatedTime, 1), // Ensure minimum total time
        steps
      });

      // Navigate to Mapscreen with route parameters
      router.push({
        pathname: "/Mapscreen",
        params: { 
          destination: toLocation,
          userLatitude: startCoords.latitude,
          userLongitude: startCoords.longitude,
          path: JSON.stringify(path.path),
          distance: totalDistance,
          time: estimatedTime,
          steps: JSON.stringify(steps)
        }
      });
    } catch (error) {
      console.error('Error finding route:', error);
      setError('An error occurred while finding the route. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
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
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl font-bold text-black">Route Found</Text>
                <TouchableOpacity
                  className="bg-yellow-100 p-2 rounded-full"
                  onPress={() => router.push({
                    pathname: "/Mapscreen",
                    params: { 
                      destination: toLocation,
                      userLatitude: locationCoordinates[fromLocation].latitude,
                      userLongitude: locationCoordinates[fromLocation].longitude
                    }
                  })}
                >
                  <Ionicons 
                    name="map" 
                    size={24} 
                    color="#F59E0B" 
                  />
                </TouchableOpacity>
              </View>
              
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
              
              <Text className="text-gray-600 mb-2">Route Steps:</Text>
              <View className="bg-gray-50 p-3 rounded-xl">
                {route.steps.map((step, index) => (
                  <View key={index} className="mb-3">
                    <View className="flex-row items-center mb-1">
                      <View className="w-6 h-6 rounded-full bg-yellow-400 items-center justify-center mr-2">
                        <Text className="text-xs font-bold">{index + 1}</Text>
                      </View>
                      <Text className="text-black flex-1" numberOfLines={2}>
                        {step.instruction.replace(/<[^>]*>/g, '')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between ml-8">
                      <Text className="text-sm text-gray-500">{step.distance}</Text>
                      <Text className="text-sm text-gray-500">{step.duration}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Google Earth View */}
        {route && showGoogleEarth && (
          <View className="px-6 mb-6">
            <View className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 300 }}>
              <WebView
                source={{ html: generateGoogleEarthHTML() }}
                style={{ flex: 1 }}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  setError('WebView error: ' + nativeEvent.description);
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                renderLoading={() => (
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#F59E0B" />
                  </View>
                )}
              />
            </View>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View className="px-6 mb-6">
            <View className="bg-red-50 p-4 rounded-xl">
              <Text className="text-red-600">{error}</Text>
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
        
        {/* Add extra padding at the bottom for better scrolling experience */}
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* From Location Suggestions - Positioned absolutely */}
      {showFromSuggestions && fromSuggestions.length > 0 && (
        <View 
          style={{ 
            position: 'absolute',
            top: 220,
            left: 24,
            right: 24,
            backgroundColor: 'white',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            maxHeight: 200,
            zIndex: 1000
          }}
        >
          <FlatList
            data={fromSuggestions}
            renderItem={({ item }) => renderSuggestionItem({ item, onSelect: selectFromLocation })}
            keyExtractor={(item) => item}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            style={{ maxHeight: 200 }}
            scrollEnabled={true}
          />
        </View>
      )}

      {/* To Location Suggestions - Positioned absolutely */}
      {showToSuggestions && toSuggestions.length > 0 && (
        <View 
          style={{ 
            position: 'absolute',
            top: 320,
            left: 24,
            right: 24,
            backgroundColor: 'white',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            maxHeight: 200,
            zIndex: 1000
          }}
        >
          <FlatList
            data={toSuggestions}
            renderItem={({ item }) => renderSuggestionItem({ item, onSelect: selectToLocation })}
            keyExtractor={(item) => item}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            style={{ maxHeight: 200 }}
            scrollEnabled={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
