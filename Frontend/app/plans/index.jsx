import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "../../store/slices/planSlice";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function PlansScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { plans, loading, error } = useSelector((state) => state.plans);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
      });
    }
  }, [error]);

  const loadPlans = async () => {
    await dispatch(fetchPlans());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlans();
    setRefreshing(false);
  };

  const renderPlanItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-lg shadow-sm mb-4 p-4 border border-gray-200"
      onPress={() => router.push(`/plans/${item._id}`)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-gray-800">{item.name}</Text>
        <View className="bg-yellow-100 px-3 py-1 rounded-full">
          <Text className="text-yellow-800 font-medium">${item.price}</Text>
        </View>
      </View>
      
      <Text className="text-gray-600 mb-3">{item.description}</Text>
      
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <FontAwesome name="clock-o" size={16} color="#6B7280" />
          <Text className="text-gray-500 ml-1">{item.duration} days</Text>
        </View>
        
        <View className="flex-row items-center">
          <FontAwesome name="map-marker" size={16} color="#6B7280" />
          <Text className="text-gray-500 ml-1">{item.destination}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing && plans.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="mt-4 text-gray-600">Loading plans...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-800">Travel Plans</Text>
        <Text className="text-gray-500 mt-1">Explore our exciting travel packages</Text>
      </View>

      <FlatList
        data={plans}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F59E0B"]}
            tintColor="#F59E0B"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <FontAwesome name="plane" size={50} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">
              No travel plans available at the moment.
            </Text>
          </View>
        }
      />

      <Toast />
    </View>
  );
} 