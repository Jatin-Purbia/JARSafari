import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router"; // Correct import for Link
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for eye icon
import VerifyEmail from "../(auth)/verifyemail"; // Ensure the correct import path

export default function CreateAccountScreen() {
  const [isEmailValid, setIsEmailValid] = useState(false); // Tracks email validity
  const [password, setPassword] = useState(""); // Tracks password input
  const [passwordVisible, setPasswordVisible] = useState(false); // Tracks password visibility
  const router = useRouter(); // For navigation

  const handleContinue = () => {
    if (!isEmailValid || password.trim() === "") {
      alert("Please enter a valid email and password.");
    } else {
      // Navigate to the next page or perform API call
      router.push("/welcome"); // Replace with the appropriate route
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <View className="px-6 w-full mt-40">
        <Text className="text-3xl text-center font-bold mb-14">Create Account</Text>

        {/* Input Fields */}
        <View className="gap-2">
          <TextInput
            placeholder="Firstname"
            className="w-full p-4 border border-gray-300 rounded-lg mb-3"
          />
          <TextInput
            placeholder="Lastname"
            className="w-full p-4 border border-gray-300 rounded-lg mb-3"
          />
          {/* Email Input Field (Using VerifyEmail) */}
          <VerifyEmail onValidEmail={setIsEmailValid} />
          <View className="relative">
            {/* Password Input Field */}
            <TextInput
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword} // Update password state on change
              className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            />
            {/* Toggle Password Visibility */}
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-4"
            >
              <FontAwesome
                name={passwordVisible ? "eye-slash" : "eye"}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="mt-6" />
        {/* Continue Button */}
        <TouchableOpacity
          className="w-full bg-yellow-400 py-4 rounded-3xl"
          onPress={handleContinue} // Handle form submission
        >
          <Text className="text-black text-center font-semibold">Continue</Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-10">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Continue with Google Button */}
        <TouchableOpacity className="w-full flex-row items-center p-4 border border-gray-300 rounded-3xl">
          <FontAwesome name="google" size={20} className="mr-3" />
          <Text className="text-center flex-1 font-semibold">
            Continue With Google
          </Text>
        </TouchableOpacity>

        {/* Already Have an Account Section */}
        <Text className="mt-6 text-gray-600 text-center">
  Already have an account?{" "}
  <Link href="/login">
    <Text className="font-bold text-black">Login</Text>
  </Link>
</Text>
      </View>
    </SafeAreaView>
  );
}