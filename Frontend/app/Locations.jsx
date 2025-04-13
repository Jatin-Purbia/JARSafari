import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {
  locations,
  getLocationType,
  getLocationIcon,
  groupLocationsByType,
  locationCoordinates
} from './data/locationData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // for 2 columns with spacing
const CARD_HEIGHT = 140; // Increased height

export default function Locations() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const groupedLocations = groupLocationsByType(locations);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, []);

  const handleLocationPress = (location) => {
    const locationName = typeof location === 'string' ? location : location.title || '';
    router.push({
      pathname: "/Mapscreen",
      params: { 
        destination: locationName,
        userLatitude: userLocation?.coords?.latitude,
        userLongitude: userLocation?.coords?.longitude
      }
    });
  };

  const renderLocationItem = ({ item }) => {
    const locationName = typeof item === 'string' ? item : item.title || '';
    const icon = getLocationIcon(locationName);
    const type = getLocationType(locationName);
    const coordinates = locationCoordinates[locationName];

    // Map location types to appropriate MaterialIcons
    const getMaterialIcon = (iconName) => {
      const iconMap = {
        'restaurant': 'restaurant',
        'place': 'place',
        'school': 'school',
        'local-library': 'local-library',
        'sports-soccer': 'sports-soccer',
        'local-cafe': 'local-cafe',
        'event': 'event',
        'local-parking': 'local-parking',
        'business': 'business',
        'medical-services': 'medical-services',
        'fitness-center': 'fitness-center',
        'pool': 'pool',
        'sports-basketball': 'sports-basketball',
        'gate': 'door-front'
      };
      return iconMap[iconName] || 'place'; // Default to 'place' if icon not found
    };

    return (
      <TouchableOpacity
        className="m-2 bg-white rounded-xl shadow-sm overflow-hidden"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        onPress={() => handleLocationPress(locationName)}
      >
        <View className="flex-1 items-center justify-center px-3 py-4">
          <View className="w-14 h-14 bg-yellow-100 rounded-full items-center justify-center mb-3">
            <MaterialIcons name={getMaterialIcon(icon)} size={28} color="#F59E0B" />
          </View>
          <Text className="text-base font-semibold text-center text-gray-800 mb-1" numberOfLines={1}>
            {locationName}
          </Text>
          <Text className="text-sm text-gray-500 capitalize mb-1">
            {type}
          </Text>
          {coordinates && (
            <Text className="text-xs text-gray-400 text-center">
              {coordinates.latitude.toFixed(2)}, {coordinates.longitude.toFixed(2)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getFilteredLocations = () => {
    return activeTab === 'all' ? locations : groupedLocations[activeTab] || [];
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#FCD34D', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-12 pb-6 px-6 rounded-b-3xl shadow-md"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            className="mr-4"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black">Campus Locations</Text>
        </View>
      </LinearGradient>
      
      {/* Tabs */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row px-4 py-3 flex-wrap">
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full mr-2 mb-2 ${activeTab === 'all' ? 'bg-yellow-100' : 'bg-gray-100'}`}
          >
            <Text className={`${activeTab === 'all' ? 'text-yellow-800 font-semibold' : 'text-gray-600'}`}>
              All
            </Text>
          </TouchableOpacity>
          {Object.keys(groupedLocations).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setActiveTab(type)}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${activeTab === type ? 'bg-yellow-100' : 'bg-gray-100'}`}
            >
              <Text className={`${activeTab === type ? 'text-yellow-800 font-semibold' : 'text-gray-600'}`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Grid View */}
      <FlatList
        data={getFilteredLocations()}
        renderItem={renderLocationItem}
        keyExtractor={(item) => typeof item === 'string' ? item : item.title}
        numColumns={2}
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
