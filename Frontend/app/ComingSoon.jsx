import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Travel quotes based on time of day
const travelQuotes = {
  morning: "The early bird catches the worm. Start your day with adventure!",
  afternoon: "Adventure is not outside man; it is within.",
  evening: "The journey of a thousand miles begins with one step.",
  night: "The stars are better off without us. Let's explore the world below."
};

export default function ComingSoon() {
  const router = useRouter();
  const [actualTimeOfDay, setActualTimeOfDay] = useState("morning");

  // Determine time of day
  useEffect(() => {
    const determineTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 17) return "afternoon";
      if (hour >= 17 && hour < 20) return "evening";
      return "night";
    };
    
    setActualTimeOfDay(determineTimeOfDay());
  }, []);

  const getGreeting = () => {
    switch (actualTimeOfDay) {
      case "morning": return "Good Morning";
      case "afternoon": return "Good Afternoon";
      case "evening": return "Good Evening";
      case "night": return "Good Night";
      default: return "Hello";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center mb-8">
          <Image 
            source={require('../assets/images/logo.png')} 
            className="w-32 h-32 mb-4"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-black mb-2">Coming Soon!</Text>
          <Text className="text-base text-gray-600 mt-2 italic">
            "{travelQuotes[actualTimeOfDay]}"
          </Text>
        </View>
        
        <View className="w-full max-w-md">
          <TouchableOpacity
            onPress={() => router.back()}
            className="overflow-hidden rounded-2xl shadow-md"
          >
            <LinearGradient
              colors={['#FCD34D', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center flex-row justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="#000" />
              <Text className="text-black font-bold text-lg ml-2">Go Back</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 