import React, { useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IITJCampusMap() {
  const mapRef = useRef(null);

  // Center of the IITJ campus
  const iitjCenter = {
    latitude: 26.4757,
    longitude: 73.1146,
    latitudeDelta: 0.004,
    longitudeDelta: 0.004,
  };

  // Bounding box to prevent scrolling outside IITJ
  const IITJ_BOUNDARIES = {
    northEast: {
      latitude: 26.4785,
      longitude: 73.1175,
    },
    southWest: {
      latitude: 26.4727,
      longitude: 73.1108,
    },
  };

  const clampRegion = (region) => {
    const clampedLat = Math.max(
      IITJ_BOUNDARIES.southWest.latitude,
      Math.min(region.latitude, IITJ_BOUNDARIES.northEast.latitude)
    );
    const clampedLng = Math.max(
      IITJ_BOUNDARIES.southWest.longitude,
      Math.min(region.longitude, IITJ_BOUNDARIES.northEast.longitude)
    );

    return {
      ...region,
      latitude: clampedLat,
      longitude: clampedLng,
    };
  };

  const handleRegionChange = (region) => {
    const clamped = clampRegion(region);
    if (
      region.latitude !== clamped.latitude ||
      region.longitude !== clamped.longitude
    ) {
      mapRef.current.animateToRegion(clamped, 150);
    }
  };

  const buildings = [
    {
      title: "Hostel O4",
      description: "Boys Hostel Block",
      coords: { latitude: 26.4775, longitude: 73.1130 },
    },
    {
      title: "Hostel Y3",
      description: "Girls Hostel Block",
      coords: { latitude: 26.4745, longitude: 73.1162 },
    },
    {
      title: "Academic Block",
      description: "Main Academic Area",
      coords: { latitude: 26.4763, longitude: 73.1155 },
    },
    {
      title: "Central Library",
      description: "Learning Resource Center",
      coords: { latitude: 26.4758, longitude: 73.1144 },
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={iitjCenter}
        showsUserLocation={true}
        provider="google"
        onRegionChangeComplete={handleRegionChange}
        minZoomLevel={16}
        maxZoomLevel={20}
      >
        {buildings.map((building, index) => (
          <Marker
            key={index}
            coordinate={building.coords}
            title={building.title}
            description={building.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});