import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { locationCoordinates, locations } from '../data/locationData';

const Search = () => {
    const router = useRouter();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [stops, setStops] = useState([]);
    const [stopInput, setStopInput] = useState('');
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapType, setMapType] = useState('standard');
    const [showControls, setShowControls] = useState(true);
    const [routeInfo, setRouteInfo] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [stopSuggestions, setStopSuggestions] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [showStopSuggestions, setShowStopSuggestions] = useState(false);
    const [showRouteInfo, setShowRouteInfo] = useState(false);
    const mapRef = useRef(null);
    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);
    const stopInputRef = useRef(null);
    const stopsScrollViewRef = useRef(null);

    // OSRM API endpoint
    const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/foot';   //open street route map

    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Permission to access location was denied');
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (error) {
                console.error('Error getting location:', error);
                setError('Could not get your location');
            }
        };

        getLocation();
    }, []);

    const filterLocations = (input) => {
        if (!input) return [];
        const searchTerm = input.toLowerCase().trim();
        return locations.filter(location =>
            location.toLowerCase().includes(searchTerm)
        );
    };

    const handleFromLocationChange = (text) => {
        setFromLocation(text);
        const suggestions = filterLocations(text);
        setFromSuggestions(suggestions);
        setShowFromSuggestions(true);
    };

    const handleToLocationChange = (text) => {
        setToLocation(text);
        const suggestions = filterLocations(text);
        setToSuggestions(suggestions);
        setShowToSuggestions(true);
    };

    const handleStopChange = (text) => {
        setStopInput(text);
        const suggestions = filterLocations(text);
        setStopSuggestions(suggestions);
        setShowStopSuggestions(true);
    };

    const selectFromLocation = (location) => {
        setFromLocation(location);
        setFromSuggestions([]);
        setShowFromSuggestions(false);
        fromInputRef.current?.blur();
    };

    const selectToLocation = (location) => {
        setToLocation(location);
        setToSuggestions([]);
        setShowToSuggestions(false);
        toInputRef.current?.blur();
    };

    const selectStop = (location) => {
        setStopInput(location);
        setStopSuggestions([]);
        setShowStopSuggestions(false);
        stopInputRef.current?.blur();
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowFromSuggestions(false);
            setShowToSuggestions(false);
            setShowStopSuggestions(false);
        }, 300);
    };

    const addStop = () => {
        if (stopInput && locations.includes(stopInput)) {
            if (!stops.includes(stopInput)) {
                const newStops = [...stops, stopInput];
                setStops(newStops);
                setStopInput('');
                setStopSuggestions([]);
                setShowStopSuggestions(false);
                // Scroll to the end of the stops list after adding
                setTimeout(() => {
                    stopsScrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            } else {
                ToastAndroid.show('Stop already added', ToastAndroid.SHORT);
            }
        } else if (stopInput) {
            ToastAndroid.show('Invalid location. Please select from suggestions', ToastAndroid.SHORT);
        }
    };

    const removeStop = (index) => {
        const updated = [...stops];
        updated.splice(index, 1);
        setStops(updated);
    };

    const getCoordinatesFromLocationName = async (locationName) => {
        if (locationCoordinates[locationName]) {
            return locationCoordinates[locationName];
        }
        console.warn(`Coordinates not found for ${locationName} in local data. Using fallback.`);
        return null;
    };

    const calculateRoute = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setRouteCoordinates([]);
            setRouteInfo(null);

            let originCoords;
            if (fromLocation) {
                originCoords = await getCoordinatesFromLocationName(fromLocation);
            } else if (userLocation) {
                originCoords = userLocation;
            }

            const destinationCoords = await getCoordinatesFromLocationName(toLocation);
            const waypointCoords = await Promise.all(stops.map(getCoordinatesFromLocationName));
            const validWaypoints = waypointCoords.filter(Boolean);

            if (!originCoords || !destinationCoords) {
                throw new Error('Could not determine origin or destination coordinates.');
            }

            // Create an array of all points in order: start -> stops -> destination
            const allPoints = [originCoords, ...validWaypoints, destinationCoords];
            const allRouteSegments = [];
            let totalDistance = 0;
            let totalDuration = 0;
            const segmentInfo = [];

            // Calculate route for each segment
            for (let i = 0; i < allPoints.length - 1; i++) {
                const startPoint = allPoints[i];
                const endPoint = allPoints[i + 1];

                const coordinates = [
                    [startPoint.longitude, startPoint.latitude],
                    [endPoint.longitude, endPoint.latitude]
                ];

                const formattedCoordinates = coordinates.map(coord => coord.join(',')).join(';');
                const apiUrl = `${OSRM_BASE_URL}/${formattedCoordinates}?geometries=geojson&overview=full`;

                try {
                    const response = await axios.get(apiUrl);
                    const data = response.data;

                    if (data && data.routes && data.routes.length > 0) {
                        const route = data.routes[0];
                        const segmentCoordinates = route.geometry.coordinates.map(p => ({
                            latitude: p[1],
                            longitude: p[0]
                        }));

                        allRouteSegments.push(segmentCoordinates);
                        totalDistance += route.distance;
                        totalDuration += route.duration;

                        // Calculate arrival time for this segment
                        const segmentDuration = route.duration / 60; // in minutes
                        const segmentDistance = route.distance / 1000; // in km
                        
                        segmentInfo.push({
                            from: i === 0 ? (fromLocation || 'Your Location') : stops[i - 1],
                            to: i === allPoints.length - 2 ? toLocation : stops[i],
                            distance: segmentDistance.toFixed(1),
                            duration: Math.ceil(segmentDuration),
                            arrivalTime: new Date(Date.now() + totalDuration * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        });
                    } else {
                        throw new Error(`No walkable route found between points ${i} and ${i + 1}.`);
                    }
                } catch (error) {
                    console.error(`Error calculating segment ${i}:`, error);
                    throw new Error(`Failed to calculate route segment: ${error.message}`);
                }
            }

            // Combine all route segments
            const combinedRoute = allRouteSegments.flat();
            setRouteCoordinates(combinedRoute);

            setRouteInfo({
                distance: (totalDistance / 1000).toFixed(1), // Convert to km
                time: Math.ceil(totalDuration / 60), // Convert to minutes
                stops: stops.length,
                segments: segmentInfo,
                totalDuration: totalDuration,
                startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                estimatedArrival: new Date(Date.now() + totalDuration * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            // Fit the map to show the entire route
            if (combinedRoute.length > 0 && mapRef.current) {
                const edgePadding = { top: 50, right: 50, bottom: 200, left: 50 };
                mapRef.current.fitToCoordinates(combinedRoute, { edgePadding });
            }

        } catch (error) {
            console.error('Error calculating route:', error);
            setError(error.message || 'Could not calculate route');
            ToastAndroid.show(error.message || 'Could not calculate route', ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMapType = () => {
        setMapType(mapType === 'standard' ? 'satellite' : 'standard');
    };

    const toggleControls = () => {
        setShowControls(!showControls);
    };

    const toggleRouteInfo = () => {
        setShowRouteInfo(!showRouteInfo);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.inputContainer}>
                    <Ionicons name="location" size={20} color="#666" />
                    <TextInput
                        ref={fromInputRef}
                        style={styles.input}
                        placeholder="From"
                        value={fromLocation}
                        onChangeText={handleFromLocationChange}
                        onBlur={handleBlur}
                        onFocus={() => setShowFromSuggestions(fromLocation.length > 0 && filterLocations(fromLocation).length > 0)}
                    />
                    {showFromSuggestions && fromSuggestions.length > 0 && (
                        <ScrollView style={styles.suggestionsContainer}>
                            {fromSuggestions.map((location, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.suggestionItem}
                                    onPress={() => selectFromLocation(location)}
                                    activeOpacity={1}>
                                    <Text style={styles.suggestionText}>{location}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="flag" size={20} color="#666" />
                    <TextInput
                        ref={toInputRef}
                        style={styles.input}
                        placeholder="To"
                        value={toLocation}
                        onChangeText={handleToLocationChange}
                        onBlur={handleBlur}
                        onFocus={() => setShowToSuggestions(toLocation.length > 0 && filterLocations(toLocation).length > 0)}
                    />
                    {showToSuggestions && toSuggestions.length > 0 && (
                        <ScrollView style={styles.suggestionsContainer}>
                            {toSuggestions.map((location, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.suggestionItem}
                                    onPress={() => selectToLocation(location)}
                                    activeOpacity={1}>
                                    <Text style={styles.suggestionText}>{location}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={styles.stopsInputContainer}>
                    <View style={styles.inputRow}>
                        <View style={styles.inputWithIcon}>
                            <Ionicons name="location-outline" size={20} color="#666" />
                            <TextInput
                                ref={stopInputRef}
                                style={styles.stopInput}
                                placeholder="Add Stop"
                                value={stopInput}
                                onChangeText={(text) => {
                                    setStopInput(text);
                                    setShowStopSuggestions(text.length > 0 && filterLocations(text).length > 0);
                                    setStopSuggestions(filterLocations(text));
                                }}
                                onBlur={handleBlur}
                                onFocus={() => setShowStopSuggestions(stopInput.length > 0 && filterLocations(stopInput).length > 0)}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addStop}>
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {showStopSuggestions && stopSuggestions.length > 0 && (
                        <ScrollView style={styles.suggestionsContainer}>
                            {stopSuggestions.map((location, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.suggestionItem}
                                    onPress={() => selectStop(location)}
                                    activeOpacity={1}>
                                    <Text style={styles.suggestionText}>{location}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Display Added Stops */}
                {stops.length > 0 && (
                    <View style={styles.stopsListContainer}>
                        <ScrollView ref={stopsScrollViewRef} horizontal={true} contentContainerStyle={styles.stopsListContent}>
                            {stops.map((stop, index) => (
                                <View key={index} style={styles.stopItem}>
                                    <Text style={styles.stopText}>{stop}</Text>
                                    <TouchableOpacity onPress={() => removeStop(index)}>
                                        <Ionicons name="close-circle" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={calculateRoute}
                    disabled={(!fromLocation && !userLocation) || !toLocation || isLoading}>
                    <Text style={styles.searchButtonText}>
                        {isLoading ? 'Calculating...' : 'Search Route'}
                    </Text>
                </TouchableOpacity>
            </View>

            <MapView
                ref={mapRef}
                style={styles.map}
                mapType={mapType}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                onPress={toggleControls}
            >
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeWidth={4}
                        strokeColor="#F59E0B"
                    />
                )}

                {fromLocation && locationCoordinates[fromLocation] && (
                    <Marker
                        coordinate={{
                            latitude: locationCoordinates[fromLocation].latitude,
                            longitude: locationCoordinates[fromLocation].longitude,
                        }}
                        title="Start"
                        description={fromLocation}
                    >
                        <View style={styles.markerContainer}>
                            <Ionicons name="location" size={24} color="#22C55E" />
                        </View>
                    </Marker>
                )}
                {userLocation && !fromLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        pinColor="#22C55E"
                    />
                )}

                {stops.map((stop, index) => (
                    <Marker
                        key={`stop-${index}`}
                        coordinate={{
                            latitude: locationCoordinates[stop].latitude,
                            longitude: locationCoordinates[stop].longitude,
                        }}
                        title={`Stop ${index + 1}`}
                        description={stop}
                    >
                        <View style={styles.markerContainer}>
                            <Ionicons name="location" size={24} color="#3B82F6" />
                            <Text style={styles.stopNumber}>{index + 1}</Text>
                        </View>
                    </Marker>
                ))}

                {toLocation && locationCoordinates[toLocation] && (
                    <Marker
                        coordinate={{
                            latitude: locationCoordinates[toLocation].latitude,
                            longitude: locationCoordinates[toLocation].longitude,
                        }}
                        title="Destination"
                        description={toLocation}
                    >
                        <View style={styles.markerContainer}>
                            <Ionicons name="flag" size={24} color="#EF4444" />
                        </View>
                    </Marker>
                )}
            </MapView>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F59E0B" />
                    <Text style={styles.loadingText}>Calculating route...</Text>
                </View>
            )}

            {error && (
                <View style={styles.errorText}>
                    <Text>{error}</Text>
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

            {routeInfo && showRouteInfo && (
                <View style={styles.infoPanel}>
                    <View style={styles.infoHeader}>
                        <Text style={styles.infoTitle}>Route Information</Text>
                        <View style={styles.timeInfo}>
                            <Text style={styles.timeLabel}>Start: {routeInfo.startTime}</Text>
                            <Text style={styles.timeLabel}>Arrival: {routeInfo.estimatedArrival}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="walk" size={24} color="#F59E0B" />
                            <Text style={styles.infoLabel}>Total Distance</Text>
                            <Text style={styles.infoValue}>{routeInfo.distance} km</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="time" size={24} color="#F59E0B" />
                            <Text style={styles.infoLabel}>Total Time</Text>
                            <Text style={styles.infoValue}>{routeInfo.time} min</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="location" size={24} color="#F59E0B" />
                            <Text style={styles.infoLabel}>Stops</Text>
                            <Text style={styles.infoValue}>{routeInfo.stops}</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.segmentsContainer}>
                        {routeInfo.segments.map((segment, index) => (
                            <View key={index} style={styles.segmentItem}>
                                <View style={styles.segmentHeader}>
                                    <Text style={styles.segmentTitle}>Stop {index + 1}</Text>
                                    <Text style={styles.segmentTime}>Arrival: {segment.arrivalTime}</Text>
                                </View>
                                <View style={styles.segmentDetails}>
                                    <Text style={styles.segmentRoute}>{segment.from} → {segment.to}</Text>
                                    <View style={styles.segmentMetrics}>
                                        <Text style={styles.segmentMetric}>{segment.distance} km</Text>
                                        <Text style={styles.segmentMetric}>{segment.duration} min</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    searchContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        position: 'relative',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    stopInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 2,
        maxHeight: 200,
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
    stopsInputContainer: {
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 50,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopsListContainer: {
        marginTop: 10,
        height: 40, // Adjust height as needed
    },
    stopsListContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stopItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
        marginRight: 5,
    },
    stopText: {
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#F59E0B',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        padding: 10,
        borderRadius: 8,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
    },
    infoPanel: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '50%',
        zIndex: 1,
    },
    infoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    timeInfo: {
        alignItems: 'flex-end',
    },
    timeLabel: {
        fontSize: 12,
        color: '#666',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        alignItems: 'center',
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    controls: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'column',
        gap: 10,
    },
    controlButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    markerContainer: {
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    stopNumber: {
        position: 'absolute',
        top: 2,
        right: 2,
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#3B82F6',
        padding: 2,
        borderRadius: 8,
        minWidth: 16,
        textAlign: 'center',
    },
    segmentsContainer: {
        marginTop: 10,
        maxHeight: 200,
    },
    segmentItem: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        marginRight: 5,
    },
    segmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    segmentTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    segmentTime: {
        fontSize: 12,
        color: '#666',
    },
    segmentDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    segmentRoute: {
        fontSize: 12,
        color: '#666',
        flex: 1,
        marginRight: 10,
    },
    segmentMetrics: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    segmentMetric: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
});

export default Search;