import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Import location data from the data file
import { 
  locationCoordinates,
  IITJ_CENTER,
  buildingMarkers,
  campusGraph
} from './data/locationData';

// Helper function to find the shortest path using Dijkstra's algorithm
const findShortestPath = (graph, start, end) => {
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  const visited = new Set();

  // Initialize distances
  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  });
  distances[start] = 0;

  while (unvisited.size > 0) {
    // Find the node with the smallest distance
    let current = null;
    let smallestDistance = Infinity;
    unvisited.forEach(node => {
      if (distances[node] < smallestDistance) {
        smallestDistance = distances[node];
        current = node;
      }
    });

    if (current === end) break;
    if (current === null) break;

    unvisited.delete(current);
    visited.add(current);

    // Update distances to neighbors
    Object.entries(graph[current]).forEach(([neighbor, distance]) => {
      if (!visited.has(neighbor)) {
        const newDistance = distances[current] + distance;
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
        }
      }
    });
  }

  // Build the path
  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
};

// Helper function to calculate intermediate points between two coordinates
const calculateIntermediatePoints = (start, end, numPoints = 5) => {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    points.push({
      latitude: start.latitude + (end.latitude - start.latitude) * t,
      longitude: start.longitude + (end.longitude - start.longitude) * t
    });
  }
  return points;
};

// Helper function to generate smooth path coordinates
const generatePathCoordinates = (path, locationCoordinates) => {
  const coordinates = [];
  for (let i = 0; i < path.length - 1; i++) {
    const start = locationCoordinates[path[i]];
    const end = locationCoordinates[path[i + 1]];
    const intermediatePoints = calculateIntermediatePoints(start, end);
    coordinates.push(...intermediatePoints);
  }
  return coordinates;
};

export default function Mapscreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapType, setMapType] = useState('satellite');
  const [showControls, setShowControls] = useState(true);
  const [routeInfo, setRouteInfo] = useState(null);

  // Initialize location tracking
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);

        // If destination is provided, calculate route
        if (params.destination) {
          const destination = params.destination;
          
          // Get destination coordinates
          const destCoords = locationCoordinates[destination];
          if (!destCoords) {
            setError('Invalid destination location');
            setIsLoading(false);
            return;
          }

          // Get start location coordinates
          const startLocation = params.userLatitude && params.userLongitude 
            ? { coords: { latitude: parseFloat(params.userLatitude), longitude: parseFloat(params.userLongitude) } }
            : location;

          console.log('Start Location:', startLocation.coords);
          console.log('Destination:', destCoords);

          // Find the shortest path using Dijkstra's algorithm
          const path = findShortestPath(campusGraph, params.fromLocation || 'Main Academic Block', destination);
          
          if (path.length > 0) {
            // Generate smooth path coordinates
            const coordinates = generatePathCoordinates(path, locationCoordinates);
            setRouteCoordinates(coordinates);

            // Calculate approximate distance and time
            const totalDistance = path.length * 0.1; // Approximate distance in km
            const walkingSpeed = 5; // km/h
            const estimatedTime = Math.ceil((totalDistance / walkingSpeed) * 60); // minutes

            setRouteInfo({
              distance: `${totalDistance.toFixed(1)} km`,
              duration: `${estimatedTime} minutes`,
              steps: path.map((location, index) => ({
                instruction: `Go to ${location}`,
                distance: '0.1 km',
                duration: '1 min'
              }))
            });

            // Fit map to show the entire route with padding
            if (mapRef.current) {
              mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                animated: true,
              });
            }
          } else {
            setError('Could not find a path to the destination');
          }
        }
      } catch (err) {
        console.error('Error in Mapscreen:', err);
        setError('Error getting location or calculating route: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.destination]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F59E0B" />
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
          ...IITJ_CENTER,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={true}
        pitchEnabled={true}
        rotateEnabled={true}
        showsBuildings={true}
        showsIndoors={true}
        showsTraffic={false}
        showsCompass={true}
        showsScale={true}
        onPress={() => setShowControls(!showControls)}
      >
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
              <View style={styles.userMarkerDot} />
            </View>
          </Marker>
        )}

        {/* Destination Marker */}
        {params.destination && (
          <Marker
            coordinate={locationCoordinates[params.destination]}
            title={params.destination}
          >
            <View style={styles.destinationMarker}>
              <Ionicons name="location" size={24} color="#F59E0B" />
            </View>
          </Marker>
        )}

        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#F59E0B"
            strokeWidth={5}
            lineDashPattern={[1]}
            geodesic={true}
          />
        )}

        {/* Building Markers */}
        {buildingMarkers.map((building, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: building.position.lat,
              longitude: building.position.lng,
            }}
            title={building.name}
          >
            <View style={styles.buildingMarker}>
              <Ionicons name="business" size={16} color="#F59E0B" />
            </View>
          </Marker>
        ))}
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
          <View style={styles.routeInfoContent}>
            <View style={styles.routeInfoItem}>
              <Ionicons name="walk" size={20} color="#F59E0B" />
              <Text style={styles.routeInfoText}>{routeInfo.distance}</Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Ionicons name="time" size={20} color="#F59E0B" />
              <Text style={styles.routeInfoText}>{routeInfo.duration}</Text>
            </View>
          </View>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  controlButton: {
    padding: 8,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: 'white',
  },
  userMarkerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    position: 'absolute',
    top: 6,
    left: 6,
  },
  destinationMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  buildingMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  routeInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    color: '#000',
  },
  routeInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeInfoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#F59E0B',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
