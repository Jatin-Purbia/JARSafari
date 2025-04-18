import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from 'expo-linear-gradient';

// ✅ Email Validator Component
function VerifyEmail({ onValidEmail, setEmailGlobal, emailError, setEmailError }) {
  const [email, setEmail] = useState("");

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input);
    onValidEmail(isValid);
    setEmail(input);
    setEmailGlobal(input);
    
    if (!input.trim()) {
      setEmailError("Email is required");
    } else if (!isValid) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  return (
    <View className="mb-4">
      <Text className="mb-2 font-medium text-gray-700">Email</Text>
      <View className={`flex-row items-center border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 bg-gray-50`}>
        <FontAwesome name="envelope" size={18} color="#9CA3AF" className="mr-3" />
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={validateEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="flex-1 text-gray-800"
        />
      </View>
      {emailError ? <Text className="text-red-500 text-sm mt-1">{emailError}</Text> : null}
    </View>
  );
}

export default function CreateAccountScreen() {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Password validation
  const validatePassword = (pass) => {
    setPassword(pass);
    setPasswordStrength({
      hasMinLength: pass.length >= 8,
      hasUpperCase: /[A-Z]/.test(pass),
      hasLowerCase: /[a-z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
    });
    
    if (!pass.trim()) {
      setPasswordError("Password is required");
    } else if (!Object.values(passwordStrength).every(Boolean)) {
      setPasswordError("Password does not meet requirements");
    } else {
      setPasswordError("");
    }
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
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
    
    // Validate firstname
    if (!firstname.trim()) {
      setFirstnameError("First name is required");
      isValid = false;
    } else {
      setFirstnameError("");
    }
    
    // Validate lastname
    if (!lastname.trim()) {
      setLastnameError("Last name is required");
      isValid = false;
    } else {
      setLastnameError("");
    }
    
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isEmailValid) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!isPasswordValid) {
      setPasswordError("Password does not meet requirements");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };

  const handleContinue = async () => {
    if (validateForm()) {
      dispatch(register({ firstname, lastname, email, password }));
    }
  };

  const isFormComplete =
    firstname.trim() && lastname.trim() && password.trim() && email.trim() && isPasswordValid;

  const renderPasswordRequirement = (met, text) => (
    <View className="flex-row items-center mb-1">
      <FontAwesome
        name={met ? "check-circle" : "circle-o"}
        size={14}
        color={met ? "#10B981" : "#9CA3AF"}
        className="mr-2"
      />
      <Text className={`text-sm ${met ? "text-green-600" : "text-gray-500"}`}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center justify-center px-6 py-8">
            {/* Logo */}
            <View className="items-center mb-8">
              <Image
                source={require("../../assets/images/logo.png")}
                style={{ width: 100, height: 100, resizeMode: "contain" }}
                className="mb-4"
              />
              <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
              <Text className="text-gray-500 text-center mt-2">
                Join JARSafari and start your adventure
              </Text>
            </View>

            {/* Form */}
            <View className="w-full mb-6">
              {/* First & Last Name */}
              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className="mb-2 font-medium text-gray-700">First Name</Text>
                  <View className={`flex-row items-center border ${firstnameError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 bg-gray-50`}>
                    <FontAwesome name="user" size={18} color="#9CA3AF" className="mr-3" />
                    <TextInput
                      placeholder="Firstname"
                      value={firstname}
                      onChangeText={(text) => {
                        setFirstname(text);
                        if (firstnameError) setFirstnameError("");
                      }}
                      className="flex-1 text-gray-800"
                    />
                  </View>
                  {firstnameError ? <Text className="text-red-500 text-sm mt-1">{firstnameError}</Text> : null}
                </View>

                <View className="flex-1 ml-2">
                  <Text className="mb-2 font-medium text-gray-700">Last Name</Text>
                  <View className={`flex-row items-center border ${lastnameError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 bg-gray-50`}>
                    <FontAwesome name="user" size={18} color="#9CA3AF" className="mr-3" />
                    <TextInput
                      placeholder="Lastname"
                      value={lastname}
                      onChangeText={(text) => {
                        setLastname(text);
                        if (lastnameError) setLastnameError("");
                      }}
                      className="flex-1 text-gray-800"
                    />
                  </View>
                  {lastnameError ? <Text className="text-red-500 text-sm mt-1">{lastnameError}</Text> : null}
                </View>
              </View>

              {/* Email */}
              <VerifyEmail
                onValidEmail={setIsEmailValid}
                setEmailGlobal={setEmail}
                emailError={emailError}
                setEmailError={setEmailError}
              />

              {/* Password */}
              <View className="mb-6">
                <Text className="mb-2 font-medium text-gray-700">Password</Text>
                <View className={`flex-row items-center border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 bg-gray-50`}>
                  <FontAwesome name="lock" size={18} color="#9CA3AF" className="mr-3" />
                  <TextInput
                    placeholder="Enter your password"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={validatePassword}
                    className="flex-1 text-gray-800"
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <FontAwesome
                      name={passwordVisible ? "eye-slash" : "eye"}
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text className="text-red-500 text-sm mt-1">{passwordError}</Text> : null}

                {/* Password Requirements */}
                <View className="mt-2 px-2">
                  {renderPasswordRequirement(
                    passwordStrength.hasMinLength,
                    "At least 8 characters"
                  )}
                  {renderPasswordRequirement(
                    passwordStrength.hasUpperCase,
                    "One uppercase letter"
                  )}
                  {renderPasswordRequirement(
                    passwordStrength.hasLowerCase,
                    "One lowercase letter"
                  )}
                  {renderPasswordRequirement(
                    passwordStrength.hasNumber,
                    "One number"
                  )}
                </View>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                onPress={handleContinue}
                disabled={loading}
                className="overflow-hidden rounded-lg"
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
                        Creating Account...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-black font-semibold text-lg">
                      Create Account
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/login">
                <Text className="font-bold text-yellow-600">Sign In</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}
