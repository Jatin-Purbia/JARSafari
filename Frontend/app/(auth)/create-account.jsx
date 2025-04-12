import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

// Email validator component
function VerifyEmail({ onValidEmail }) {
  const [email, setEmail] = useState("");

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input);
    onValidEmail(isValid);
    setEmail(input);
  };

  return (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-semibold text-gray-700">Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={validateEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="w-full p-4 border border-gray-300 rounded-lg"
      />
    </View>
  );
}

export default function CreateAccountScreen() {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const showToast = (message) => {
    Toast.show({
      type: "error",
      text1: "Validation Error",
      text2: message,
      position: "top",
    });
  };

  const handleContinue = () => {
    if (!isEmailValid) {
      showToast("Please enter a valid email.");
    } else if (password.trim() === "") {
      showToast("Please enter a password.");
    } else {
      router.push("/welcome");
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <Toast />
      <View className="px-6 w-full mt-28">
        <Text className="text-3xl text-center font-bold mb-12">Create Account</Text>

        {/* Input Fields */}
        <View className="gap-2">
          <View className="mb-3">
            <Text className="mb-1 text-sm font-semibold text-gray-700">First Name</Text>
            <TextInput
              placeholder="Enter your first name"
              className="w-full p-4 border border-gray-300 rounded-lg"
            />
          </View>

          <View className="mb-3">
            <Text className="mb-1 text-sm font-semibold text-gray-700">Last Name</Text>
            <TextInput
              placeholder="Enter your last name"
              className="w-full p-4 border border-gray-300 rounded-lg"
            />
          </View>

          {/* Email Field */}
          <VerifyEmail onValidEmail={setIsEmailValid} />

          {/* Password Field */}
          <View className="mb-4 relative">
            <Text className="mb-1 text-sm font-semibold text-gray-700">Password</Text>
            <TextInput
              placeholder="Enter your password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              className="w-full p-4 border border-gray-300 rounded-lg pr-12"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-11"
            >
              <FontAwesome
                name={passwordVisible ? "eye-slash" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          className="w-full bg-yellow-400 py-4 rounded-xl mt-4"
          onPress={handleContinue}
        >
          <Text className="text-black text-center font-semibold text-base">Continue</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <Text className="mt-8 text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/login">
            <Text className="font-bold text-black">Login</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
