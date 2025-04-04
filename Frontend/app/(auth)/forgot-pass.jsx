import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import VerifyEmail from "../(auth)/verifyemail";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const router = useRouter();

  // Debugging: Check if state updates properly
  useEffect(() => {
    console.log("Email Valid:", isEmailValid);
  }, [isEmailValid]);

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <View className="px-6 w-full mt-40">
        <Text className="text-3xl font-bold mb-4">Forgot Password</Text>

        {/* Email Input (Uses VerifyEmail) */}
        <VerifyEmail onValidEmail={setIsEmailValid} />

        {/* Continue Button */}
        <TouchableOpacity
          className={`w-full py-4 rounded-3xl ${
            isEmailValid ? "bg-purple-500" : "bg-gray-300"
          }`}
          disabled={!isEmailValid}
          onPress={() => {
            if (isEmailValid) {
              console.log("Navigating to reset-pass");
              router.push("/reset-pass");
            }
          }}
        >
          <Text className="text-white text-center font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
