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
  campusGraph,
  findShortestPath
} from './data/locationData';

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

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// A* search algorithm implementation
const findPath = (graph, start, end, locationCoordinates) => {
  const openSet = new Set([start]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  
  // Initialize scores
  Object.keys(graph).forEach(node => {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  });
  
  gScore[start] = 0;
  fScore[start] = heuristic(start, end, locationCoordinates);

  while (openSet.size > 0) {
    // Find node with lowest fScore
    let current = null;
    let lowestFScore = Infinity;
    openSet.forEach(node => {
      if (fScore[node] < lowestFScore) {
        lowestFScore = fScore[node];
        current = node;
      }
    });

    if (current === end) {
      // Reconstruct path
      const path = [end];
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.unshift(current);
      }
      return path;
    }

    openSet.delete(current);

    // Check neighbors
    Object.keys(graph[current]).forEach(neighbor => {
      const tentativeGScore = gScore[current] + graph[current][neighbor];
      
      if (tentativeGScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end, locationCoordinates);
        
        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }
      }
    });
  }

  return []; // No path found
};

// Heuristic function for A* (Haversine distance)
const heuristic = (node1, node2, locationCoordinates) => {
  const coords1 = locationCoordinates[node1];
  const coords2 = locationCoordinates[node2];
  return calculateDistance(coords1.latitude, coords1.longitude, coords2.latitude, coords2.longitude);
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

  // Initialize location tracking and route calculation
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

          // Find the nearest node to user's location
          let nearestNode = null;
          let minDistance = Infinity;
          
          Object.entries(locationCoordinates).forEach(([node, coords]) => {
            const distance = calculateDistance(
              startLocation.coords.latitude,
              startLocation.coords.longitude,
              coords.latitude,
              coords.longitude
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestNode = node;
            }
          });

          // Find the path using Dijkstra's algorithm
          const path = findShortestPath(campusGraph, nearestNode, destination);
          
          if (path.path.length > 0) {
            // Start with user's current location
            const coordinates = [{
              latitude: startLocation.coords.latitude,
              longitude: startLocation.coords.longitude
            }];

            // Add path to nearest node
            const nearestNodeCoords = locationCoordinates[nearestNode];
            coordinates.push({
              latitude: nearestNodeCoords.latitude,
              longitude: nearestNodeCoords.longitude
            });

            // Generate smooth path coordinates for the campus path
            const pathCoordinates = generatePathCoordinates(path.path, locationCoordinates);
            coordinates.push(...pathCoordinates);

            // Add destination point
            coordinates.push({
              latitude: destCoords.latitude,
              longitude: destCoords.longitude
            });

            setRouteCoordinates(coordinates);

            // Calculate approximate distance and time
            let totalDistance = 0;
            
            // Add distance from current location to nearest node
            totalDistance += calculateDistance(
              startLocation.coords.latitude,
              startLocation.coords.longitude,
              nearestNodeCoords.latitude,
              nearestNodeCoords.longitude
            );

            // Add distance along the path
            for (let i = 0; i < path.path.length - 1; i++) {
              const start = locationCoordinates[path.path[i]];
              const end = locationCoordinates[path.path[i + 1]];
              totalDistance += calculateDistance(
                start.latitude,
                start.longitude,
                end.latitude,
                end.longitude
              );
            }
            
            const walkingSpeed = 5; // km/h
            const estimatedTime = Math.ceil((totalDistance / walkingSpeed) * 60); // minutes

            setRouteInfo({
              distance: `${Math.max(totalDistance, 0.1).toFixed(1)} km`,
              duration: `${Math.max(estimatedTime, 1)} minutes`,
              steps: [
                {
                  instruction: `Walk to ${nearestNode}`,
                  distance: `${Math.max(calculateDistance(
                    startLocation.coords.latitude,
                    startLocation.coords.longitude,
                    nearestNodeCoords.latitude,
                    nearestNodeCoords.longitude
                  ), 0.1).toFixed(1)} km`,
                  duration: `${Math.max(Math.ceil((calculateDistance(
                    startLocation.coords.latitude,
                    startLocation.coords.longitude,
                    nearestNodeCoords.latitude,
                    nearestNodeCoords.longitude
                  ) / 5) * 60), 1)} minutes`
                },
                ...path.path.map((location, index) => {
                  const nextLocation = path.path[index + 1];
                  if (!nextLocation) return null;
                  
                  const distance = Math.max(campusGraph[location][nextLocation], 0.1); // Minimum 0.1 km
                  const duration = Math.max(Math.ceil((distance / 5) * 60), 1); // Minimum 1 minute
                  
                  return {
                    instruction: `Go to ${nextLocation}`,
                    distance: `${distance.toFixed(1)} km`,
                    duration: `${duration} minutes`
                  };
                }).filter(step => step !== null)
              ]
            });
          } else {
            setError('No path found to destination');
          }

          // Fit map to show the entire route with padding
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(routeCoordinates, {
              edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
              animated: true,
            });
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
        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4285F4"
            strokeWidth={5}
            lineDashPattern={[1]}
            geodesic={true}
            zIndex={1}
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
            zIndex={2}
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
            zIndex={2}
          >
            <View style={styles.destinationMarker}>
              <Ionicons name="location" size={24} color="#4285F4" />
            </View>
          </Marker>
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
    borderColor: '#4285F4',
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
