import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';
import { ToastAndroid } from 'react-native';

// Import location coordinates
import { locationCoordinates } from '../app/data/locationData';

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/foot';

export default function Mapscreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapRegion, setMapRegion] = useState(null); // Initialize to null
    const [routeInfo, setRouteInfo] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);
    const [toLocation, setToLocation] = useState(params.destination || '');
    const [mapType, setMapType] = useState('standard'); // Default to standard
    const [showRouteInfo, setShowRouteInfo] = useState(false);


    useEffect(() => {
        const getLocationAndCalculateRoute = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Permission to access location was denied');
                    return;
                }
                const location = await Location.getCurrentPositionAsync({});
                const userCoords = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };
                setUserLocation(userCoords);
                setMapRegion({
                    latitude: userCoords.latitude,
                    longitude: userCoords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });

                if (toLocation) {
                    calculateRoute(userCoords, toLocation);
                }
            } catch (error) {
                console.error('Error getting location:', error);
                setError('Could not get your location');
            }
        };

        getLocationAndCalculateRoute();
    }, [toLocation]);

    const toggleMapType = () => {
        setMapType(mapType === 'standard' ? 'satellite' : 'standard');
    };

    const toggleRouteInfo = () => {
        setShowRouteInfo(!showRouteInfo);
    };


    /************* ✨ Windsurf Command ⭐  *************/
    /******* 1ba2aa40-36bb-4165-964b-606138e87d3a  *******/
    const getCoordinatesFromLocationName = (locationName) => {
        if (locationCoordinates[locationName]) {
            return locationCoordinates[locationName];
        }
        console.warn(`Coordinates not found for ${locationName} in local data.`);
        return null;
    };

    const calculateRoute = async (origin, destinationName) => {
        try {
            setIsLoading(true);
            setError(null);
            setRouteCoordinates([]);
            setRouteInfo(null);

            if (!origin) {
                throw new Error('Origin location not available.');
            }
            const destinationCoords = getCoordinatesFromLocationName(destinationName);
            if (!destinationCoords) {
                throw new Error(`Coordinates not found for destination: ${destinationName}`);
            }

            const coordinates = [
                [origin.longitude, origin.latitude],
                [destinationCoords.longitude, destinationCoords.latitude]
            ];

            const formattedCoordinates = coordinates.map(coord => coord.join(',')).join(';');
            const apiUrl = `${OSRM_BASE_URL}/${formattedCoordinates}?geometries=geojson&overview=full`;

            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data && data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const segmentCoordinates = route.geometry.coordinates.map(p => ({
                    latitude: p[1],
                    longitude: p[0]
                }));

                setRouteCoordinates(segmentCoordinates);

                const distanceInKm = route.distance / 1000;
                const durationInMinutes = Math.ceil(route.duration / 60);

                setRouteInfo({
                    distance: `${distanceInKm.toFixed(1)} km`,
                    duration: `${durationInMinutes} min`,
                });

                if (segmentCoordinates.length > 0 && mapRef.current) {
                    const edgePadding = { top: 50, right: 50, bottom: 200, left: 50 };
                    mapRef.current.fitToCoordinates(segmentCoordinates, { edgePadding });
                } else if (origin && destinationCoords && mapRef.current) {
                    mapRef.current.fitToCoordinates([
                        { latitude: origin.latitude, longitude: origin.longitude },
                        destinationCoords
                    ], { edgePadding: { top: 50, right: 50, bottom: 200, left: 50 } });
                }

            } else {
                throw new Error('No walkable route found.');
            }

        } catch (error) {
            console.error('Error calculating route:', error);
            setError(error.message || 'Could not calculate route');
            ToastAndroid.show(error.message || 'Could not calculate route', ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
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
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={mapRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
                pitchEnabled={false}
                rotateEnabled={false}
                showsBuildings={true}
                showsIndoors={false}
                showsTraffic={false}
                showsCompass={true}
                showsScale={true}
                mapType={mapType} // Set the mapType dynamically
            >
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#F59E0B"
                        strokeWidth={5}
                    />
                )}
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        pinColor="#22C55E"
                    />
                )}
                {toLocation && locationCoordinates[toLocation] && (
                    <Marker
                        coordinate={locationCoordinates[toLocation]}
                        title={toLocation}
                        pinColor="#EF4444"
                    />
                )}
            </MapView>

            {routeInfo && showRouteInfo && (
                <View style={styles.routeInfoContainer}>
                    <View style={styles.routeInfo}>
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

            {routeInfo && (
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={toggleMapType}>
                        <Ionicons
                            name={mapType === 'standard' ? 'earth' : 'map'}
                            size={24}
                            color="#F59E0B"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={toggleRouteInfo}>
                        <Ionicons
                            name={showRouteInfo ? 'information-circle' : 'information-circle-outline'}
                            size={24}
                            color="#F59E0B"
                        />
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <StatusBar hidden={false} barStyle="dark-content" translucent />
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
    routeInfoContainer: {
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
        alignItems: 'center',
    },
    routeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
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
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    controls: {
        position: 'absolute',
        top: 60,
        right: 10,
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
    },
    controlButton: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});