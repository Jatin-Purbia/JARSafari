import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import VerifyEmail from "../(auth)/verifyemail"; // Ensure this is correct

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
      <View className="px-6 w-full mt-40">
        <Text className="text-3xl text-center font-bold mb-14">Create Account</Text>

        <View className="gap-2">
          <TextInput
            placeholder="Firstname"
            value={firstname}
            onChangeText={setFirstname}
            className="w-full p-4 border border-gray-300 rounded-lg mb-3"
          />
          <TextInput
            placeholder="Lastname"
            value={lastname}
            onChangeText={setLastname}
            className="w-full p-4 border border-gray-300 rounded-lg mb-3"
          />

          {/* Email Input */}
          <VerifyEmail
            onValidEmail={setIsEmailValid}
            setEmailGlobal={setEmail}
          />

          <View className="relative">
            <TextInput
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4"
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
        </View>

        <View className="mt-6" />

        {/* Continue Button */}
        <TouchableOpacity
          className={`w-full py-4 rounded-3xl ${
            isFormComplete ? "bg-yellow-400" : "bg-gray-300"
          }`}
          onPress={handleContinue}
          disabled={!isFormComplete}
        >
          <Text className="text-black text-center font-semibold">Continue</Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-10">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity className="w-full flex-row items-center p-4 border border-gray-300 rounded-3xl">
          <FontAwesome name="google" size={20} className="mr-3" />
          <Text className="text-center flex-1 font-semibold">
            Continue With Google
          </Text>
        </TouchableOpacity>

        <Text className="mt-6 text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/login">
            <Text className="font-bold text-black">Login</Text>
          </Link>
        </Text>
      </View>

      {/* 🔔 Toast must be outside main View */}
      <Toast />
    </SafeAreaView>
  );
}
