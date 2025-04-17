import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AboutUs() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="px-4 py-10" 
        contentContainerStyle={{ alignItems: 'center' }} // Correctly use contentContainerStyle here
      >
        {/* App Logo */}
        <Image
          source={require('../assets/images/logo.png')} // replace with actual logo file name
          style={{ width: 120, height: 120, marginBottom: 20 }}
          resizeMode="contain"
        />

        {/* Title */}
        <Text className="text-4xl font-extrabold text-blue-500 text-center mb-6">About Us</Text>

        {/* Description */}
        <Text className="text-base text-gray-800 text-justify mb-4 leading-relaxed">
          Our app is crafted specifically for IIT Jodhpur students to simplify and enrich their campus navigation experience. Whether you're finding your way to a lecture hall, hostel, or your favorite spot on campus, we make it seamless.
        </Text>

        <Text className="text-base text-gray-800 text-justify mb-4 leading-relaxed">
          🌟 You can save your favorite locations and instantly get a route to them with just one tap.
        </Text>

        <Text className="text-base text-gray-800 text-justify mb-4 leading-relaxed">
          📍 Planning a trip within campus with multiple stops? Just add the locations, and we'll calculate the shortest path including your stops and even estimate the time to reach!
        </Text>

        <Text className="text-base text-gray-800 text-justify mb-4 leading-relaxed">
          🚀 In the future, we aim to expand this experience beyond IIT Jodhpur and help plan efficient routes for outdoor trips as well.
        </Text>

        {/* Go Back Button */}
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-2xl shadow-md w-full mt-8"
          onPress={() => router.back()}
        >
          <Text className="text-white text-center font-semibold text-lg">Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
