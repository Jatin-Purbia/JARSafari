import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
export default function CreateAccountScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-4">Create Account</Text>

      {/* Input Fields */}
      <TextInput placeholder="Firstname" className="w-full p-4 border border-gray-300 rounded-lg mb-3" />
      <TextInput placeholder="Lastname" className="w-full p-4 border border-gray-300 rounded-lg mb-3" />
      <TextInput placeholder="Email Address" className="w-full p-4 border border-gray-300 rounded-lg mb-3" />
      <TextInput placeholder="Password" secureTextEntry className="w-full p-4 border border-gray-300 rounded-lg mb-4" />

      {/* Continue Button */}
      <TouchableOpacity className="w-full bg-purple-500 py-4 rounded-lg">
        <Text className="text-white text-center font-semibold">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
