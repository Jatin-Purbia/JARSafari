import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { LinearGradient } from 'expo-linear-gradient';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentPlan, loading, error } = useSelector((state) => state.plans);

  useEffect(() => {
    if (id) {
      dispatch(fetchPlanById(id));
    }
    
    return () => {
      dispatch(clearCurrentPlan());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
      });
    }
  }, [error]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="mt-4 text-gray-600">Loading plan details...</Text>
      </View>
    );
  }

  if (!currentPlan) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <FontAwesome name="exclamation-circle" size={50} color="#D1D5DB" />
        <Text className="text-gray-500 mt-4 text-center text-lg">
          Plan not found or unavailable.
        </Text>
        <TouchableOpacity 
          className="mt-6 bg-yellow-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Image */}
      <View className="h-64 w-full">
        <Image
          source={{ uri: currentPlan.image || "https://via.placeholder.com/400x200?text=Travel+Plan" }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          className="absolute bottom-0 left-0 right-0 h-24 justify-end p-4"
        >
          <Text className="text-white text-2xl font-bold">{currentPlan.name}</Text>
        </LinearGradient>
      </View>

      <View className="p-4">
        {/* Price and Duration */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="bg-yellow-100 px-4 py-2 rounded-full">
            <Text className="text-yellow-800 font-bold text-lg">${currentPlan.price}</Text>
          </View>
          <View className="flex-row items-center">
            <FontAwesome name="clock-o" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1">{currentPlan.duration} days</Text>
          </View>
        </View>

        {/* Destination */}
        <View className="flex-row items-center mb-6">
          <FontAwesome name="map-marker" size={18} color="#6B7280" />
          <Text className="text-gray-700 ml-2 text-lg">{currentPlan.destination}</Text>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-2">Description</Text>
          <Text className="text-gray-600 leading-6">{currentPlan.description}</Text>
        </View>

        {/* Highlights */}
        {currentPlan.highlights && currentPlan.highlights.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-2">Highlights</Text>
            {currentPlan.highlights.map((highlight, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <FontAwesome name="check-circle" size={18} color="#F59E0B" className="mt-1 mr-2" />
                <Text className="text-gray-600 flex-1">{highlight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Book Button */}
        <TouchableOpacity 
          className="overflow-hidden rounded-lg mb-8"
          onPress={() => Toast.show({
            type: "success",
            text1: "Booking Confirmed",
            text2: `You've booked the ${currentPlan.name} plan!`,
          })}
        >
          <LinearGradient
            colors={['#FCD34D', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center"
          >
            <Text className="text-black font-semibold text-lg">
              Book This Plan
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Toast />
    </ScrollView>
  );
} 