import { Text, View, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import React from "react";
import "../global.css"
export default function LandingPage() {
  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      {/* Jarsafari Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        className="w-52 h-52 mb-6"
      />
      {/* Welcome Text */}
      <Text className="text-4xl font-extrabold text-gray-900 text-center mb-4">
        Welcome to JARSafari
      </Text>
      <Text className="text-lg text-gray-500 text-center mb-8 px-4">
        Explore new destinations
      </Text>
      {/* Start Journey Button */}
      <TouchableOpacity className="w-11/12 bg-yellow-400 py-4 rounded-2xl shadow-lg shadow-gray-300">
        <Link href="/login">
        <Text className="text-black text-center text-2xl font-semibold">
          Start Your Journey
          </Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
}
