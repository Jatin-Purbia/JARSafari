import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import VerifyEmail from "../(auth)/verifyemail";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ForgotPasswordScreen() {
  const [isEmailValid, setIsEmailValid] = useState(false);
  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <View className="px-6 w-full mt-40 ">
      <Text className="text-3xl font-bold mb-4">Forgot Password</Text>

        {/* Email Input (Uses VerifyEmail) */}
        <VerifyEmail onValidEmail={setIsEmailValid} />

      {/* Continue Button */}
      <TouchableOpacity className={`w-full py-4 rounded-3xl ${
          isEmailValid ? "bg-purple-500" : "bg-gray-300"
        }`}
        disabled={!isEmailValid}
      >
        <Link href="/reset-pass">
        <Text className="text-white text-center font-semibold">
          Continue
          </Text>
        </Link>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}
