import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';

// Import location data from the data file
import { 
  locations, 
  campusGraph, 
  locationCoordinates,
  IITJ_CENTER
} from './data/locationData';

// Dijkstra's algorithm implementation
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialize distances
  Object.keys(graph).forEach(location => {
    distances[location] = Infinity;
    unvisited.add(location);
  });
  distances[start] = 0;

  while (unvisited.size > 0) {
    // Find unvisited location with minimum distance
    let current = null;
    let minDistance = Infinity;
    unvisited.forEach(location => {
      if (distances[location] < minDistance) {
        minDistance = distances[location];
        current = location;
      }
    });

    if (current === end) break;
    unvisited.delete(current);

    // Update distances to neighbors
    Object.entries(graph[current]).forEach(([neighbor, distance]) => {
      if (!unvisited.has(neighbor)) return;

      const newDistance = distances[current] + distance;
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
      }
    });
  }

  // Reconstruct path
  const path = [];
  let current = end;
  while (current !== start) {
    path.unshift(current);
    current = previous[current];
  }
  path.unshift(start);

  return path;
}

export default function Mapscreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGoogleEarth, setShowGoogleEarth] = useState(false);
  const [mapType, setMapType] = useState('standard');

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
          const route = dijkstra(campusGraph, findNearestLocation(location.coords), destination);
          setRouteCoordinates(route.map(loc => locationCoordinates[loc]));
        }
      } catch (err) {
        setError('Error getting location: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.destination]);

  // Find nearest location to user's coordinates
  const findNearestLocation = (coords) => {
    let nearest = null;
    let minDistance = Infinity;

    Object.entries(locationCoordinates).forEach(([location, coord]) => {
      const distance = Math.sqrt(
        Math.pow(coord.latitude - coords.latitude, 2) +
        Math.pow(coord.longitude - coords.longitude, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = location;
      }
    });

    return nearest;
  };

  // Generate Google Earth HTML
  const generateGoogleEarthHTML = () => {
    const destination = params.destination;
    const destCoords = locationCoordinates[destination];
    const userCoords = userLocation ? {
      lat: userLocation.coords.latitude,
      lng: userLocation.coords.longitude
    } : null;

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

            function initMap() {
              try {
                map = new google.maps.Map(document.getElementById('map'), {
                  center: { lat: ${destCoords.latitude}, lng: ${destCoords.longitude} },
                  zoom: 18,
                  mapTypeId: 'satellite',
                  tilt: 45
                });

                // Add destination marker
                markers.push(new google.maps.Marker({
                  position: { lat: ${destCoords.latitude}, lng: ${destCoords.longitude} },
                  map: map,
                  title: '${destination}',
                  icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  }
                }));

                ${userCoords ? `
                  // Add user location marker
                  markers.push(new google.maps.Marker({
                    position: { lat: ${userCoords.lat}, lng: ${userCoords.lng} },
                    map: map,
                    title: 'You are here',
                    icon: {
                      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }
                  }));
                ` : ''}

                // Add 3D buildings
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
                      url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    }
                  }));
                });

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
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap"
            onerror="handleMapError()">
          </script>
        </body>
      </html>
    `;
  };

  // Fit map to show entire route
  const fitMapToRoute = () => {
    if (mapRef.current && routeCoordinates.length > 0) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

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
      {showGoogleEarth ? (
        <WebView
          source={{ html: generateGoogleEarthHTML() }}
          style={styles.map}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setError('WebView error: ' + nativeEvent.description);
          }}
          onLoadEnd={() => {
            // Handle WebView load completion
            setIsLoading(false);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          onNavigationStateChange={(navState) => {
            // Handle navigation state changes
            if (navState.url !== 'about:blank') {
              setError('Navigation error: ' + navState.url);
            }
          }}
        />
      ) : (
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
          onMapReady={fitMapToRoute}
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
              strokeWidth={3}
            />
          )}
        </MapView>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowGoogleEarth(!showGoogleEarth)}
        >
          <Ionicons 
            name={showGoogleEarth ? "map" : "earth"} 
            size={24} 
            color="#000" 
          />
        </TouchableOpacity>

        {!showGoogleEarth && (
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
        )}
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
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
    top: 50,
    right: 20,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  destinationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
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
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
