import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Homepage() {
  const router = useRouter(); // For navigation

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      {/* Welcome Message */}
      <Text className="text-4xl font-bold text-gray-900 mb-6">Welcome to Jarsafari!</Text>
      <Text className="text-lg text-gray-600 text-center mb-10">
        Explore the world with us. Start your journey now!
      </Text>

      {/* Navigation Buttons */}
      <View className="w-full px-6">
        <TouchableOpacity
          className="w-full bg-purple-500 py-4 rounded-3xl mb-4"
          onPress={() => router.push("/tabs/Profile")} // Example navigation
        >
          <Text className="text-white text-center font-semibold text-lg">Go to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-yellow-400 py-4 rounded-3xl"
          onPress={() => router.push("/tabs/Explore")} // Example navigation
        >
          <Text className="text-black text-center font-semibold text-lg">Explore Destinations</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}