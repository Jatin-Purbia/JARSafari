import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const user = global?.userInfo;

  const getInitial = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';
  };

  const initial = getInitial(user?.name);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-10 items-center">
          <Text className="text-4xl font-extrabold text-blue-700 mb-8">My Profile</Text>

          {/* Avatar Circle */}
          <View className="w-24 h-24 rounded-full bg-blue-500 justify-center items-center mb-6 shadow-lg">
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

          {/* Edit Button */}
          <TouchableOpacity
            className="bg-blue-600 p-4 px-6 rounded-full shadow-md w-full active:opacity-80"
            onPress={() => router.push('/user-info')}
          >
            <Text className="text-white text-center font-semibold text-lg tracking-wide">
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
