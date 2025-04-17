import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const user = global?.userInfo || {
    name: "Jatin Purbia",
    hostel: "Ganga Bhawan",
    // joined: "2023-07-15"
  };

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-10 items-center">
          <Text className="text-4xl font-extrabold text-blue-500 mb-6">My Profile</Text>

          {/* Avatar */}
          <View style={{ backgroundColor: avatarColor }} className="w-24 h-24 rounded-full justify-center items-center mb-4 shadow-lg">
            <Text className="text-white text-3xl font-bold">{initial}</Text>
          </View>

          {/* Name + Hostel */}
          <View className="bg-white p-6 rounded-2xl w-full shadow-md border border-gray-100 mb-6">
            <ProfileField label="Full Name" value={user.name} />
            <ProfileField label="Hostel" value={user.hostel} />
          </View>

          {/* Action Buttons */}
            <View
              className="w-full bg-white p-4 shadow-md mb-6"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb', // Tailwind's gray-200
                borderRadius: 10,
                gap: 12
              }}
            >
              <CustomButton title="Edit Profile" onPress={() => router.push('/user-info')} />
              <CustomButton title="About Us" onPress={() => router.push('/about')} />
              <CustomButton title="Contact Us" onPress={() => router.push('/contact')} />
            </View>

          {/* Inspirational Quote */}
          <View className="bg-blue-50 w-full p-4 rounded-xl border border-blue-100 shadow-sm">
            <Text className="text-center italic text-gray-600">
              “Small steps in the right direction can turn out to be the biggest step of your life.”
            </Text>
          </View>
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

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity
    className=" py-4 px-2 rounded-2xl shadow w-full active:opacity-90"
    onPress={onPress}
    style={{
                borderWidth: 1,
                borderColor: 'black', // Tailwind's gray-200
                borderRadius: 10,
                gap: 12
              }}
  >
    <Text className="text-black text-left font-semibold text-lg tracking-wide">
      {title}
    </Text>
  </TouchableOpacity>
);

