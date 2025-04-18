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
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/Homepage");
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    let isValid = true;
    
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      dispatch(login({ email, password }));
    }
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
              <View className={`flex-row items-center border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 bg-gray-50`}>
                <FontAwesome name="envelope" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="flex-1 text-gray-800"
                />
              </View>
              {emailError ? <Text className="text-red-500 text-sm mt-1">{emailError}</Text> : null}
            </View>

            {/* Password Input */}
            <View className="w-full mb-6">
              <Text className="mb-2 font-medium text-gray-700">Password</Text>
              <View className={`flex-row items-center border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 bg-gray-50`}>
                <FontAwesome name="lock" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="Enter your password"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                  }}
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
              {passwordError ? <Text className="text-red-500 text-sm mt-1">{passwordError}</Text> : null}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={loading}
              className="w-full overflow-hidden rounded-lg mb-4"
            >
              <LinearGradient
                colors={['#FCD34D', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 items-center"
                style={{ opacity: loading ? 0.6 : 1 }}
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
