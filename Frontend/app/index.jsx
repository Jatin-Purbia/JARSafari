import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const { height } = Dimensions.get("window");

export default function MapScreen() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const mapRef = useRef(null);

  // Function to convert address to coordinates
  const geocodeAddress = async (address) => {
    try {
      console.log("Geocoding:", address);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json`,
        {
          headers: {
            "User-Agent": "YourAppName/1.0 (your-email@example.com)",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        console.log("Geocode success:", response.data[0]);
        return {
          latitude: parseFloat(response.data[0].lat),
          longitude: parseFloat(response.data[0].lon),
        };
      } else {
        Alert.alert("Location Not Found", "Could not find coordinates.");
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert("Geocoding Error", "An error occurred.");
      return null;
    }
  };

  // Function to fetch route and set map path
  const getRoute = async () => {
    try {
      console.log("Fetching route...");

      const originCoords = await geocodeAddress(originText);
      if (!originCoords) return;
      setOrigin(originCoords);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const destinationCoords = await geocodeAddress(destinationText);
      if (!destinationCoords) return;
      setDestination(destinationCoords);

      console.log("Origin:", originCoords);
      console.log("Destination:", destinationCoords);

      const response = await axios.get(
        `http://router.project-osrm.org/route/v1/driving/${originCoords.longitude},${originCoords.latitude};${destinationCoords.longitude},${destinationCoords.latitude}?overview=full&geometries=geojson`
      );

      console.log("Route response:", response.data);

      if (response.data && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        setDistance(route.distance / 1000);
        setDuration(route.duration / 60);

        const coordinates = route.geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        setRouteCoordinates(coordinates);

        // Focus map on route
        mapRef.current.fitToCoordinates([originCoords, destinationCoords], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        });
      } else {
        Alert.alert("Route Not Found", "Could not find a route.");
      }
    } catch (error) {
      console.error("Routing error:", error);
      Alert.alert("Routing Error", "An error occurred.");
    }
  };

  const clearRoute = () => {
    setOrigin(null);
    setDestination(null);
    setRouteCoordinates([]);
    setDistance(null);
    setDuration(null);
    setOriginText("");
    setDestinationText("");
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Input Fields */}
      <View className="absolute top-10 w-11/12 self-center bg-white p-2 rounded-lg elevation-5">
        <TextInput
          placeholder="Enter Starting Location"
          value={originText}
          onChangeText={setOriginText}
          className="h-10 border border-gray-300 rounded-md p-2 mb-2"
        />
        <TextInput
          placeholder="Enter Final Destination"
          value={destinationText}
          onChangeText={setDestinationText}
          className="h-10 border border-gray-300 rounded-md p-2 mb-2"
        />
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded-md items-center mt-2"
          onPress={getRoute}
        >
          <Text className="text-white">Get Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <MapView
  ref={mapRef}
  style={{ width: "100%", height: height * 0.6 }}
  initialRegion={{
    latitude: 26.4691,
    longitude: 73.1145,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
>
  {origin && <Marker coordinate={origin} title="Start" />}
  {destination && <Marker coordinate={destination} title="Destination" />}
  {routeCoordinates.length > 0 && (
    <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
  )}
</MapView>


      {/* Distance & Duration */}
      {distance && duration && (
        <View className="absolute bottom-24 self-center bg-white p-2 rounded-md elevation-5">
          <Text>Distance: {distance.toFixed(2)} km</Text>
          <Text>Duration: {Math.floor(duration)} min</Text>
        </View>
      )}

      {/* Clear Route Button */}
      <TouchableOpacity
        className="absolute bottom-10 right-5 bg-red-500 p-2 rounded-full elevation-5"
        onPress={clearRoute}
      >
        <MaterialIcons name="clear" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
