import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const user = global?.userInfo;
  const favorites = global?.favorites || [];
  const [showAllFavorites, setShowAllFavorites] = useState(false);

  const getInitial = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';
  };

  const getColorForInitial = (initial) => {
    const colors = {
      A: '#F44336', B: '#E91E63', C: '#9C27B0', D: '#673AB7', E: '#3F51B5',
      F: '#2196F3', G: '#03A9F4', H: '#00BCD4', I: '#009688', J: '#4CAF50',
      K: '#8BC34A', L: '#CDDC39', M: '#FFC107', N: '#FF9800', O: '#FF5722',
      P: '#795548', Q: '#9E9E9E', R: '#607D8B', S: '#E53935', T: '#D81B60',
      U: '#8E24AA', V: '#5E35B1', W: '#3949AB', X: '#1E88E5', Y: '#039BE5',
      Z: '#00ACC1'
    };
    return colors[initial] || '#007BFF'; // default blue if no match
  };

  const initial = getInitial(user?.name);
  const avatarColor = getColorForInitial(initial);

  const toggleViewAll = () => {
    setShowAllFavorites(!showAllFavorites);
  };

  const favoritesToDisplay = showAllFavorites ? favorites : favorites.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-10 items-center">
          <Text className="text-4xl font-extrabold text-black mb-8">My Profile</Text>

          {/* Dynamic Avatar Circle */}
          <View style={{ backgroundColor: avatarColor }} className="w-24 h-24 rounded-full justify-center items-center mb-6 shadow-lg">
            <Text className="text-white text-3xl font-bold">{initial}</Text>
          </View>

          {/* Info Card */}
          <View className="bg-white p-6 rounded-2xl w-full shadow-md border border-gray-100 mb-8">
            {user ? (
              <>
                <ProfileField label="Full Name" value={user.name} />
                <ProfileField label="Hostel" value={user.hostel} />
              </>
            ) : (
              <Text className="text-center text-gray-400">
                No user information available
              </Text>
            )}
          </View>

          {/* Favorites Bar */}
          <View className="bg-white p-6 rounded-2xl w-full shadow-md border border-gray-100 mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Your Favorites</Text>
            {favoritesToDisplay.length > 0 ? (
              <View className="flex-row flex-wrap">
                {favoritesToDisplay.map((fav) => (
                  <View
                    key={fav}
                    className="bg-blue-100 p-2 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-blue-700">{fav}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-center text-gray-400">No favorites selected</Text>
            )}

            {/* View All Button */}
            {favorites.length > 3 && (
              <TouchableOpacity
                className="bg-blue-600 p-3 rounded-full mt-4"
                onPress={toggleViewAll}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {showAllFavorites ? 'View Less' : 'View All'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* About Us Button */}
          <TouchableOpacity
            className="bg-green-600 p-4 px-6 rounded-full shadow-md w-full mb-4 active:opacity-80"
            onPress={() => Alert.alert('About Us', 'This is an app for managing and exploring your locations, preferences, and personal details.')}
          >
            <Text className="text-white text-center font-semibold text-lg tracking-wide">
              About Us
            </Text>
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity
            className="bg-yellow-400 p-4 px-6 rounded-2xl shadow-md w-full active:opacity-80"
            onPress={() => router.push('/user-info')}
          >
            <Text className="text-black text-center font-semibold text-lg tracking-wide">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ProfileField = ({ label, value }) => (
  <View className="mb-4">
    <Text className="text-gray-500 text-sm">{label}</Text>
    <Text className="text-lg font-semibold text-gray-800 mt-1">{value || 'N/A'}</Text>
  </View>
);
