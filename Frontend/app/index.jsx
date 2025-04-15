import { Text, View, Image, TouchableOpacity, Animated } from "react-native";
import { Link } from "expo-router";
import React, { useEffect, useRef } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import "../global.css"

export default function LandingPage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#1E293B', '#0F172A']}
      className="flex-1"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Home Button */}
      {/* <View className="absolute top-12 right-6 z-10">
        <Link href="/(tabs)/Homepage" asChild>
          <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-full">
            <Text className="text-white font-medium">Home</Text>
          </TouchableOpacity>
        </Link>
      </View> */}
      
      <View className="flex-1 justify-center items-center px-6">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="items-center"
        >
          {/* Jarsafari Logo */}
          <Image
            source={require("../assets/images/logo.png")}
            className="w-52 h-52 mb-6"
          />
          
          {/* Welcome Text */}
          <Text className="text-4xl font-extrabold text-white text-center mb-4">
            Welcome to JARSafari
          </Text>
          <Text className="text-lg text-gray-300 text-center mb-12 px-4">
            Your gateway to extraordinary adventures and unforgettable experiences
          </Text>

          {/* Action Button */}
          <View className="w-full px-10">
            <Link href="/user-info" asChild>
              <TouchableOpacity className="overflow-hidden rounded-lg w-full shadow-lg shadow-black/50">
                <LinearGradient
                  colors={['#FCD34D', '#F59E0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4"
                >
                  <Text className="text-black text-center text-2xl font-semibold">
                    Start Your Journey
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
