import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AboutUs() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="px-4 py-6"
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Go Back Button at Top */}
        <View className="w-full mb-4">
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-xl shadow-md w-32"
            onPress={() => router.back()}
          >
            <Text className="text-white text-center font-semibold text-base">← Go Back</Text>
          </TouchableOpacity>
        </View>

        {/* Logo and Title */}
        <View className="flex items-center justify-center mb-6">
          <Image
            source={require('../assets/images/logo.png')}
            className="w-32 h-32 mb-4"
            resizeMode="cover"
          />
          <Text className="text-4xl font-extrabold text-blue-500 text-center">
            About Us
          </Text>
        </View>

        {/* Description Content */}
        <View className="w-full space-y-4 bg-gray-100 p-5 rounded-2xl shadow-sm">
          <Text className="text-base text-gray-800 text-justify leading-relaxed">
            Our app is crafted specifically for IIT Jodhpur students to simplify and enrich their campus navigation experience. Whether you're finding your way to a lecture hall, hostel, or your favorite spot on campus, we make it seamless.
          </Text>

          <Text className="text-base text-gray-800 text-justify leading-relaxed">
            🌟 You can save your favorite locations and instantly get a route to them with just one tap.
          </Text>

          <Text className="text-base text-gray-800 text-justify leading-relaxed">
            📍 Planning a trip within campus with multiple stops? Just add the locations, and we'll calculate the shortest path including your stops and even estimate the time to reach!
          </Text>

          <Text className="text-base text-gray-800 text-justify leading-relaxed">
            🚀 In the future, we aim to expand this experience beyond IIT Jodhpur and help plan efficient routes for outdoor trips as well.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
