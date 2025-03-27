import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
export default function PasswordSignInScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      {/* Title */}
      <Text className="text-2xl font-bold mb-4">Sign in</Text>

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="w-full p-4 border border-gray-300 rounded-lg mb-4"
      />

      {/* Continue Button */}
      <TouchableOpacity className="w-full bg-purple-500 py-4 rounded-lg">
        <Text className="text-white text-center font-semibold">Continue</Text>
      </TouchableOpacity>

      {/* Forgot Password Link */}
      <Text className="mt-4 text-gray-600">
         <Text className="mt-4 text-gray-600">Forgot Password?<Link href="/forgot-pass" className="font-bold text-black"> Reset</Link></Text>
      </Text>
    </View>
  );
}
