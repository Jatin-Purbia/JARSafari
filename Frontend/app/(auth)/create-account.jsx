import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

// ✅ Email validator component
function VerifyEmail({ onValidEmail, setEmailGlobal }) {
  const [email, setEmail] = useState("");

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input);
    onValidEmail(isValid);
    setEmail(input);
    setEmailGlobal(input); // Send back the email to parent
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (!isEmailValid) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    if (
      firstname.trim() === "" ||
      lastname.trim() === "" ||
      password.trim() === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all the details",
      });
      return;
    }

    router.push("/welcome");
  };

  const isFormComplete =
    firstname.trim() && lastname.trim() && password.trim() && email.trim();

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      
      <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 120, height: 120, marginTop: 40 }}
            />
      <View className="px-6 w-full mt-10">
        <Text className="text-3xl text-center font-bold mb-12">
          Create Account
        </Text>

        {/* First and Last Name */}
        <View className="mb-3">
          <Text className="mb-1 text-sm font-semibold text-gray-700">
            First Name
          </Text>
          <TextInput
            placeholder="Firstname"
            value={firstname}
            onChangeText={setFirstname}
            className="w-full p-4 border border-gray-300 rounded-lg mb-3"
          />

          <Text className="mb-1 text-sm font-semibold text-gray-700">
            Last Name
          </Text>
          <TextInput
            placeholder="Lastname"
            value={lastname}
            onChangeText={setLastname}
            className="w-full p-4 border border-gray-300 rounded-lg mb-3"
          />
        </View>

        {/* Email */}
        <VerifyEmail
          onValidEmail={setIsEmailValid}
          setEmailGlobal={setEmail}
        />

        {/* Password */}
        <View className="mb-4 relative">
          <Text className="mb-1 text-sm font-semibold text-gray-700">
            Password
          </Text>
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

        {/* Continue Button */}
        <TouchableOpacity
          className={`w-full py-4 rounded-xl ${
            isFormComplete ? "bg-yellow-400" : "bg-gray-300"
          }`}
          onPress={handleContinue}
          disabled={!isFormComplete}
        >
          <Text className="text-black text-center font-semibold text-base">
            Continue
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        {/* <View className="flex-row items-center my-10">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View> */}

        {/* Google Button */}
        {/* <TouchableOpacity className="w-full flex-row items-center p-4 border border-gray-300 rounded-3xl">
          <FontAwesome name="google" size={20} color="gray" />
          <Text className="text-center flex-1 font-semibold">
            Continue With Google
          </Text>
        </TouchableOpacity> */}

        {/* Login link */}
        <Text className="mt-6 text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/login">
            <Text className="font-bold text-black">Login</Text>
          </Link>
        </Text>
      </View>

      {/* Toast shown here */}
      <Toast />
    </SafeAreaView>
  );
}
