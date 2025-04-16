import React from 'react';
import { View, Text, ScrollView,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AboutUs() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 py-10">
        <Text className="text-4xl font-extrabold text-blue-500 text-center mb-6">About Us</Text>

        <Text className="text-lg text-gray-800 mb-4">
          Our app is your smart companion to navigate campus life. From locating buildings and hostels to keeping track of your favorite places, we help you move with ease and comfort.
        </Text>

        <Text className="text-lg text-gray-800 mb-4">
          With a sleek UI, seamless animations, and user-friendly experience, our mission is to simplify navigation and improve how students experience campus.
        </Text>

        <Text className="text-xl font-semibold text-black mt-6 mb-2">Our Team</Text>

        <Text className="text-lg text-gray-700 mb-2">🔹 Sharana Gouda Lakshetty - Developer & Designer</Text>
        <Text className="text-lg text-gray-700 mb-2">🔹 Team JARS - Ideation and Backend</Text>
        <Text className="text-lg text-gray-700 mb-6">🔹 IIT Jodhpur Students - Inspiration and Support</Text>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-2xl shadow-md w-full"
          onPress={() => router.back()}
        >
          <Text className="text-white text-center font-semibold text-lg">Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
