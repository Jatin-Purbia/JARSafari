import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Dimensions, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';

// Campus graph representation for Dijkstra's algorithm
const campusGraph = {
  "Hostel A": { "Academic Block": 5, "Cafeteria": 3, "Library": 7 },
  "Hostel B": { "Academic Block": 6, "Cafeteria": 4, "Library": 8 },
  "Academic Block": { "Hostel A": 5, "Hostel B": 6, "Library": 2, "Cafeteria": 4 },
  "Library": { "Academic Block": 2, "Hostel A": 7, "Hostel B": 8, "Cafeteria": 3, "Sports Complex": 6 },
  "Cafeteria": { "Hostel A": 3, "Hostel B": 4, "Academic Block": 4, "Library": 3, "Sports Complex": 5 },
  "Sports Complex": { "Library": 6, "Cafeteria": 5, "Medical Center": 4 },
  "Medical Center": { "Sports Complex": 4, "Hostel C": 3 },
  "Hostel C": { "Medical Center": 3, "Hostel D": 2 },
  "Hostel D": { "Hostel C": 2, "Parking Lot": 4 },
  "Parking Lot": { "Hostel D": 4, "Main Gate": 3 },
  "Main Gate": { "Parking Lot": 3, "Auditorium": 5 },
  "Auditorium": { "Main Gate": 5, "Academic Block": 6 }
};

// Location coordinates for Google Maps (IIT Jodhpur)
const locationCoordinates = {
  "Hostel A": { lat: 26.2518, lng: 73.1137 },
  "Hostel B": { lat: 26.2525, lng: 73.1145 },
  "Academic Block": { lat: 26.2530, lng: 73.1150 },
  "Library": { lat: 26.2535, lng: 73.1155 },
  "Cafeteria": { lat: 26.2528, lng: 73.1148 },
  "Sports Complex": { lat: 26.2540, lng: 73.1160 },
  "Medical Center": { lat: 26.2545, lng: 73.1165 },
  "Hostel C": { lat: 26.2550, lng: 73.1170 },
  "Hostel D": { lat: 26.2555, lng: 73.1175 },
  "Parking Lot": { lat: 26.2560, lng: 73.1180 },
  "Main Gate": { lat: 26.2565, lng: 73.1185 },
  "Auditorium": { lat: 26.2532, lng: 73.1152 }
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

// Generate Google Maps HTML with route
function generateGoogleMapsHTML(start, end, path) {
  // Get coordinates for the path
  const pathCoordinates = path.map(loc => locationCoordinates[loc]);
  
  // Create markers for start and end
  const startMarker = locationCoordinates[start];
  const endMarker = locationCoordinates[end];
  
  // Create a static map URL for the top image
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=26.2530,73.1150&zoom=15&size=600x300&maptype=hybrid&markers=color:green%7C${startMarker.lat},${startMarker.lng}&markers=color:red%7C${endMarker.lat},${endMarker.lng}&path=color:0x0000ff|weight:5|${pathCoordinates.map(coord => `${coord.lat},${coord.lng}`).join('|')}&key=YOUR_GOOGLE_MAPS_API_KEY`;
  
  return {
    interactiveMap: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        function initMap() {
          // Center on IIT Jodhpur
          const iitJodhpur = { lat: 26.2530, lng: 73.1150 };
          
          // Create the map
          const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: iitJodhpur,
            mapTypeId: 'hybrid',
            styles: [
              {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
              }
            ]
          });
          
          // Add markers for start and end
          const startMarker = new google.maps.Marker({
            position: ${JSON.stringify(startMarker)},
            map: map,
            title: '${start}',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#00FF00',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }
          });
          
          const endMarker = new google.maps.Marker({
            position: ${JSON.stringify(endMarker)},
            map: map,
            title: '${end}',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#FF0000',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }
          });
          
          // Add markers for waypoints
          const waypointMarkers = [];
          ${path.slice(1, -1).map((loc, i) => `
            waypointMarkers.push(new google.maps.Marker({
              position: ${JSON.stringify(locationCoordinates[loc])},
              map: map,
              title: '${loc}',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#0000FF',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 1
              }
            }));
          `).join('')}
          
          // Create the polyline for the route
          const pathCoords = ${JSON.stringify(pathCoordinates)};
          const routePath = pathCoords.map(coord => new google.maps.LatLng(coord.lat, coord.lng));
          
          const routeLine = new google.maps.Polyline({
            path: routePath,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3
          });
          
          routeLine.setMap(map);
          
          // Fit bounds to show the entire route
          const bounds = new google.maps.LatLngBounds();
          routePath.forEach(point => bounds.extend(point));
          map.fitBounds(bounds);
          
          // Add info windows for start and end
          const startInfo = new google.maps.InfoWindow({
            content: '<div style="padding: 10px;"><strong>${start}</strong><br>Starting Point</div>'
          });
          
          const endInfo = new google.maps.InfoWindow({
            content: '<div style="padding: 10px;"><strong>${end}</strong><br>Destination</div>'
          });
          
          startMarker.addListener('click', () => {
            startInfo.open(map, startMarker);
          });
          
          endMarker.addListener('click', () => {
            endInfo.open(map, endMarker);
          });
        }
      </script>
      <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap">
      </script>
    </body>
    </html>
  `,
    staticMapUrl
  };
}

const SearchScreen = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [staticMapUrl, setStaticMapUrl] = useState('');
  
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
        
        // Generate Google Maps HTML
        const { interactiveMap, staticMapUrl } = generateGoogleMapsHTML(fromLocation, toLocation, result.path);
        setHtmlContent(interactiveMap);
        setStaticMapUrl(staticMapUrl);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error finding route:', error);
        Alert.alert('Error', 'An error occurred while finding the route');
        setIsLoading(false);
      }
    }, 1000);
  };

  // Toggle map view
  const toggleMapView = () => {
    setShowMapView(!showMapView);
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
                  
                  <TouchableOpacity
                    className="bg-blue-500 py-3 rounded-xl mt-4 flex-row items-center justify-center"
                    onPress={toggleMapView}
                  >
                    <Ionicons name={showMapView ? "map" : "map-outline"} size={20} color="#FFF" />
                    <Text className="text-center font-semibold text-white text-lg ml-2">
                      {showMapView ? "Hide Map" : "Show Map"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Google Maps View */}
            {showMapView && route && (
              <View className="px-6 mb-6" style={{ height: 400 }}>
                <View className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 400 }}>
                  <WebView
                    source={{ html: htmlContent }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    originWhitelist={['*']}
                    mixedContentMode="always"
                    onError={(syntheticEvent) => {
                      const { nativeEvent } = syntheticEvent;
                      console.warn('WebView error: ', nativeEvent);
                      Alert.alert('Map Error', 'There was an error loading the map. Please try again.');
                    }}
                  />
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
