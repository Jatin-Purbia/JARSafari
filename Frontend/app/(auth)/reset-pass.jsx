import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

export default function PasswordResetSent() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center px-5 bg-white">
      {/* Lottie Animation */}
      <LottieView
        source={require("../../assets/Animations/email-sent.json")} // Add your Lottie animation file
        autoPlay
        loop={false}
        style={{ width: 150, height: 150, marginBottom: 20 }}
      />

      <Text className="text-lg text-center mb-5 font-semibold">
        We sent you an email to reset your password.
      </Text>

      {/* Return to Login Button */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        className="bg-purple-500 py-3 px-6 rounded-lg"
      >
        <Text className="text-white text-lg font-semibold">Return to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
