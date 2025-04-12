import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../store/slices/authSlice";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error,
      });
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/Homepage");
    }
  }, [isAuthenticated]);

  const handleContinue = () => {
    if (!isValidEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: "error",
        text1: "Empty Password",
        text2: "Password cannot be empty.",
      });
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-6 py-10">
            {/* Logo and Intro Text */}
            <View className="items-center mb-8">
              <Image
                source={require("../../assets/images/logo.png")}
                style={{ width: 120, height: 120, resizeMode: "contain" }}
              />
              <Text className="text-3xl font-bold text-gray-800 mt-4">Welcome Back</Text>
              <Text className="text-gray-500 text-center mt-2">
                Sign in to continue your journey with JARSafari
              </Text>
            </View>

            {/* Email Input */}
            <View className="w-full mb-4">
              <Text className="mb-2 font-medium text-gray-700">Email</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <FontAwesome name="envelope" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="flex-1 text-gray-800"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="w-full mb-6">
              <Text className="mb-2 font-medium text-gray-700">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <FontAwesome name="lock" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="Enter your password"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 text-gray-800"
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <FontAwesome
                    name={passwordVisible ? "eye-slash" : "eye"}
                    size={18}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full overflow-hidden rounded-lg mb-4"
            >
              <LinearGradient
                colors={['#FCD34D', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 items-center"
                style={{ opacity: (loading || !email.trim() || !password.trim()) ? 0.6 : 1 }}
              >
                {loading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="black" style={{ marginRight: 8 }} />
                    <Text className="text-black font-semibold text-lg">
                      Signing in...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-black font-semibold text-lg">
                    Sign In
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Create Account */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600">Don't have an account? </Text>
              <Link href="/create-account">
                <Text className="font-bold text-yellow-600">Create One</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}
