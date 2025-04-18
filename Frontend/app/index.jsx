import { Text, View, Image, TouchableOpacity, Animated } from "react-native";
import { Link } from "expo-router";
import React, { useEffect, useRef } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from "expo-router";
import "../global.css";


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
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF']}
      className="flex-1"
    >
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <View className="flex-1 justify-center items-center">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="items-center w-full" 
        >
          {/* Logo Image */}
          <Image
            source={require("../assets/images/NewLogo.png")}
            className="w-52 h-52 mb-0"
    
          />

          {/* JARSafari Title */}
          <Text className="text-5xl font-extrabold text-center mb-2">
            <Text
              style={{
                color: '#FFC107',
                textShadowColor: '##FFC107',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              JARSafari
            </Text>
          </Text>

         

          {/* Subtitle */}
          <Text className="text-lg text-gray-600 text-center mb-12 px-4">
            Your gateway to extraordinary adventures and unforgettable experiences
          </Text>

          {/* Action Button */}
          <View className="w-full px-6">
  <TouchableOpacity
    onPress={() => router.push("/user-info")}
    className="rounded-2xl w-full shadow-lg shadow-black/10 bg-blue-500 py-5"
  >
    <Text className="text-white text-center text-2xl font-semibold">
      Start Your Journey
    </Text>
  </TouchableOpacity>
</View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
