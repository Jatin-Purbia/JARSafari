import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
export default function ForgotPasswordScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-4">Forgot Password</Text>

      {/* Email Input */}
      <TextInput placeholder="Enter Email address" className="w-full p-4 border border-gray-300 rounded-lg mb-4" />

      {/* Continue Button */}
      <TouchableOpacity className="w-full bg-purple-500 py-4 rounded-lg">
        <Link href="/reset-pass" className="text-white text-center font-semibold">Continue</Link>
      </TouchableOpacity>
    </View>
  );
}
