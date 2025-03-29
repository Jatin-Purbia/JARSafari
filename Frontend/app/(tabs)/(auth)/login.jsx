import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Link } from "expo-router";
export default function LoginScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      
      {/* Sign In Text */}
      <Text className="text-2xl font-bold mb-4">Sign in</Text>

      {/* Email Input Field */}
      <TextInput 
        placeholder="Email Address" 
        className="w-full p-4 border border-gray-300 rounded-lg mb-4"
      />

      {/* Continue Button */}
      <TouchableOpacity className="w-full bg-purple-500 py-4 rounded-lg">
        <Link href="/login-pass" className="text-white text-center font-semibold">Continue</Link>
      </TouchableOpacity>

      {/* Create Account Link */}
      <Text className="mt-4 text-gray-600">
        Don't have an Account? <Link href = "/create-account"className="font-bold text-black">
          Create One</Link>
      </Text>

      {/* Social Login Buttons */}
      <View className="mt-6 space-y-3 w-full">
        <SocialLoginButton icon="apple" text="Continue With Apple" />
        <SocialLoginButton icon="google" text="Continue With Google" />
        <SocialLoginButton icon="facebook" text="Continue With Facebook" />
      </View>
    </View>
  );
}

// Social Button Component
const SocialLoginButton = ({ icon, text }) => (
  <TouchableOpacity className="w-full flex-row items-center p-4 border border-gray-300 rounded-lg">
    <FontAwesome name={icon} size={20} className="mr-3" />
    <Text className="text-center flex-1 font-semibold">{text}</Text>
  </TouchableOpacity>
);
