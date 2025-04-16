import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Import location data
import { locationCoordinates, findShortestPath } from './data/locationData';

const MapScreenNew = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef(null);
  
  // State variables
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [showControls, setShowControls] = useState(true);
  const [routeInfo, setRouteInfo] = useState(null);
  const [stops, setStops] = useState([]);

  // Initialize location
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setIsLoading(false);
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation(location);
        setIsLoading(false);
      } catch (err) {
        console.error('Location error:', err);
        setError('Error getting location');
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

  // Calculate route when destination is available
  useEffect(() => {
    const calculateRoute = async () => {
      if (!params.destination || !userLocation) return;

      try {
        // Parse stops from params
        const parsedStops = params.stops ? JSON.parse(params.stops) : [];
        setStops(parsedStops);

        // Get coordinates for all points
        const startCoords = userLocation.coords;
        const endCoords = {
          latitude: parseFloat(params.destination.latitude),
          longitude: parseFloat(params.destination.longitude)
        };
        const stopCoords = parsedStops.map(stop => locationCoordinates[stop]);

        // Create route segments
        const allCoordinates = [startCoords];
        let totalDistance = 0;
        let totalTime = 0;

        // Add stops to route
        if (stopCoords.length > 0) {
          for (let i = 0; i < stopCoords.length; i++) {
            const path = findShortestPath(
              parsedStops[i - 1] || params.from,
              parsedStops[i]
            );
            if (path.path.length > 0) {
              const segmentCoords = path.path.map(location => locationCoordinates[location]);
              allCoordinates.push(...segmentCoords);
              totalDistance += path.distance;
              totalTime += path.time;
            }
          }
        }

        // Add final destination
        const finalPath = findShortestPath(
          parsedStops[parsedStops.length - 1] || params.from,
          params.to
        );
        if (finalPath.path.length > 0) {
          const finalCoords = finalPath.path.map(location => locationCoordinates[location]);
          allCoordinates.push(...finalCoords);
          totalDistance += finalPath.distance;
          totalTime += finalPath.time;
        }

        setRouteCoordinates(allCoordinates);
        setRouteInfo({
          distance: `${totalDistance.toFixed(1)} km`,
          time: `${Math.ceil(totalTime)} minutes`,
          stops: parsedStops.length
        });

        // Fit map to show the entire route
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(allCoordinates, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          });
        }
      } catch (err) {
        console.error('Route calculation error:', err);
        setError('Error calculating route');
      }
    };

    calculateRoute();
  }, [params.destination, userLocation]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation?.coords.latitude || 26.5123,
          longitude: userLocation?.coords.longitude || 75.5678,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        onPress={() => setShowControls(!showControls)}
      >
        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4285F4"
            strokeWidth={5}
            geodesic={true}
          />
        )}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="You are here"
          >
            <View style={styles.userMarker}>
              <Ionicons name="person" size={24} color="#4285F4" />
            </View>
          </Marker>
        )}

        {/* Stop Markers */}
        {stops.map((stop, index) => (
          <Marker
            key={`stop-${index}`}
            coordinate={locationCoordinates[stop]}
            title={`Stop ${index + 1}: ${stop}`}
          >
            <View style={styles.stopMarker}>
              <Ionicons name="location" size={24} color="#F59E0B" />
            </View>
          </Marker>
        ))}

        {/* Destination Marker */}
        {params.destination && (
          <Marker
            coordinate={{
              latitude: parseFloat(params.destination.latitude),
              longitude: parseFloat(params.destination.longitude),
            }}
            title={params.destination.name}
          >
            <View style={styles.destinationMarker}>
              <Ionicons name="flag" size={24} color="#EF4444" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Route Information */}
      {routeInfo && (
        <View style={styles.routeInfo}>
          <View style={styles.routeInfoHeader}>
            <Text style={styles.routeInfoTitle}>Route Information</Text>
            <TouchableOpacity onPress={() => setShowControls(!showControls)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.routeInfoContent}>
            <View style={styles.routeInfoItem}>
              <Ionicons name="walk" size={20} color="#F59E0B" />
              <Text style={styles.routeInfoText}>{routeInfo.distance}</Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Ionicons name="time" size={20} color="#F59E0B" />
              <Text style={styles.routeInfoText}>{routeInfo.time}</Text>
            </View>
            {routeInfo.stops > 0 && (
              <View style={styles.routeInfoItem}>
                <Ionicons name="location" size={20} color="#F59E0B" />
                <Text style={styles.routeInfoText}>{routeInfo.stops} stops</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Controls */}
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <Ionicons 
              name={mapType === 'standard' ? "earth" : "map"} 
              size={24} 
              color="#000" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F59E0B',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  stopMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  destinationMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  routeInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 200,
  },
  routeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  routeInfoContent: {
    maxHeight: 120,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeInfoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButton: {
    padding: 10,
  },
});

export default MapScreenNew; 