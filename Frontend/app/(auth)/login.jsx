import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link ,useRouter} from "expo-router";
import { useState  } from "react";
import VerifyEmail from "../(auth)/verifyemail"; // Ensure the correct import path
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState(""); // Tracks password input
  const router = useRouter(); // For navigation
  const [passwordVisible, setPasswordVisible] = useState(false); // Tracks password visibility

  const handleContinue = () => {
    if (isEmailValid && password.trim() !== "") {
      // Navigate to the next page if both fields are valid
      router.push("/login-pass");
    }else{
      alert("Please enter a valid email and password.");
    }
  };
  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <View className="px-8 w-full mt-40">
        {/* Sign In Text */}
        <Text className="text-3xl text-center font-bold mb-14">Login</Text>

        {/* Email Input Field (Using VerifyEmail) */}
        <VerifyEmail onValidEmail={setIsEmailValid} />

        <View classNmae="relative">
        {/* Password Input Field */}
        <TextInput
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword} // Update password state on change
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

        {/* Forgot Password Link */}
        <Link href="/forgot-pass">
          <Text className="mt-4 text-gray-600">
            Forgot Password?{" "}
            <Text className="font-bold text-black">Reset</Text>
          </Text>
        </Link>

        {/* Add Space Between Forgot Password and Continue Button */}
        <View className="mt-6" />

        {/* Continue Button */}
        <TouchableOpacity
          className={"w-full py-4 rounded-3xl bg-yellow-400" }
          disabled={!isEmailValid || password.trim() === ""} // Disable if email is invalid or password is empty
          onPress={handleContinue} // Call handleContinue on press
        >
          <Link href="/login-pass">
            <Text className="text-black text-center font-semibold">
              Continue
            </Text>
          </Link>
        </TouchableOpacity>

        {/* OR Option */}
        <View className="flex-row items-center my-10">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Continue with Google Button */}
        <TouchableOpacity className="w-full flex-row items-center p-4 border border-gray-300 rounded-3xl">
          <FontAwesome name="google" size={20} className="mr-3" />
          <Text className="text-center flex-1 font-semibold">
            Continue With Google
          </Text>
        </TouchableOpacity>
        <Text className="mt-6 text-gray-600 text-center">
  Don't have an account?{" "}
  <Link href="/create-account" className="font-bold text-black">
    Create One
  </Link>
     </Text>
      </View>
    </SafeAreaView>
  );
}