import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState(""); // Tracks password input
  const [email, setEmail] = useState(""); // 👈 Add this
  const router = useRouter(); // For navigation
  const [passwordVisible, setPasswordVisible] = useState(false); // Tracks password visibility

  const handleContinue = () => {
    if (!isValidEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
      });
      return;
    }

    if (password.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Empty Password",
        text2: "Password cannot be empty.",
      });
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      router.push("/Homepage");
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={{ width: 120, height: 120, resizeMode: "contain", marginTop: 40 }}
      />

      <View className="px-8 w-full mt-6">
        <Text className="text-3xl text-center font-bold mb-10">Login</Text>

        {/* Email Input Field (Using VerifyEmail) */}
        <VerifyEmail onValidEmail={setIsEmailValid} exposeEmail={setEmail} />

        <View className="relative">
        {/* Password Input Field */}
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="w-full p-4 border border-gray-300 rounded-lg mb-4"
        />

        {/* Password */}
        <Text className="mb-1 font-medium text-gray-700">Password</Text>
        <View className="relative">
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            className="w-full p-4 border border-gray-300 rounded-lg mb-2"
          />
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

        {/* Forgot Password */}
        {/* <Link href="/forgot-pass">
          <Text className="mt-2 text-gray-600">
            Forgot Password? <Text className="font-bold text-black">Reset</Text>
          </Text>
        </Link> */}

        {/* Continue Button */}
        <TouchableOpacity
          className={`w-full py-4 mt-8 ${
            isLoggingIn ? "bg-gray-400" : "bg-yellow-400"
          } rounded-lg`}
          onPress={handleContinue}
          disabled={isLoggingIn}
        >
          <Text className="text-black text-center font-semibold">
            {isLoggingIn ? "Logging in..." : "Continue"}
          </Text>
        </TouchableOpacity>

        {/* Create Account */}
        <Text className="mt-8 text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link href="/create-account" className="font-bold text-black">
            Create One
          </Link>
        </Text>
      </View>

      <Toast />
    </SafeAreaView>
  );
}
