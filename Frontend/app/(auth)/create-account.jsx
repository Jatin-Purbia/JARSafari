import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
export default function CreateAccountScreen() {
  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <View className="px-6 w-full mt-40">
      <Text className="text-3xl font-bold mb-5">Create Account</Text>

      {/* Input Fields */}
      <View className="gap-2">
      <TextInput placeholder="Firstname" className="w-full p-4 border border-gray-300 rounded-lg mb-3" />
      <TextInput placeholder="Lastname" className="w-full p-4 border border-gray-300 rounded-lg mb-3" />
      <TextInput placeholder="Email Address" className="w-full p-4 border border-gray-300 rounded-lg mb-3" />
      <TextInput placeholder="Password" secureTextEntry className="w-full p-4 border border-gray-300 rounded-lg mb-4" />
      </View>
      {/* Continue Button */}
      <TouchableOpacity className="w-full bg-purple-500 py-4 rounded-3xl">
        <Text className="text-white text-center font-semibold">Continue</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}
