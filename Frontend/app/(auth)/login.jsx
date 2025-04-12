import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [password, setPassword] = useState(""); // Tracks password input
  const [email, setEmail] = useState(""); // Tracks email input
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Tracks login state
  const [passwordVisible, setPasswordVisible] = useState(false); // Tracks password visibility
  const router = useRouter(); // For navigation

  // Function to validate email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

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
      router.push("/Homepage"); // Navigate to Homepage
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={{ width: 120, height: 120, resizeMode: "contain", marginTop: 40 }}
      />

      <View style={{ paddingHorizontal: 32, width: "100%", marginTop: 24 }}>
        <Text style={{ fontSize: 24, textAlign: "center", fontWeight: "bold", marginBottom: 40 }}>
          Login
        </Text>

        {/* Email Input Field */}
        <View style={{ marginBottom: 16 }}>
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            style={{
              width: "100%",
              padding: 16,
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
        </View>

        {/* Password Input Field */}
        <View style={{ marginBottom: 16 }}>
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            style={{
              width: "100%",
              padding: 16,
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={{ position: "absolute", right: 16, top: 16 }}
          >
            <FontAwesome
              name={passwordVisible ? "eye-slash" : "eye"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={{
            width: "100%",
            paddingVertical: 16,
            borderRadius: 8,
            backgroundColor: isLoggingIn ? "#D1D5DB" : "#FACC15",
            alignItems: "center",
            marginTop: 16,
          }}
          onPress={handleContinue}
          disabled={isLoggingIn}
        >
          <Text style={{ color: "black", fontWeight: "bold" }}>
            {isLoggingIn ? "Logging in..." : "Continue"}
          </Text>
        </TouchableOpacity>

        {/* Create Account */}
        <Text style={{ marginTop: 32, textAlign: "center", color: "#6B7280" }}>
          Don’t have an account?{" "}
          <Link href="/create-account">
            <Text style={{ fontWeight: "bold", color: "black" }}>Create One</Text>
          </Link>
        </Text>
      </View>

      <Toast />
    </SafeAreaView>
  );
}