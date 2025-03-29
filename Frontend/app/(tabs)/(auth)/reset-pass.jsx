import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function PasswordResetSent() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      {/* Corrected Image Component */}
      <Image
        source={require("../../../assets/images/image 4.png")} // Corrected the path
        style={{ width: 100, height: 100, marginBottom: 20 }}
      />

      <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 20 }}>
        We sent you an email to reset your password.
      </Text>

      {/* Return to Login Button */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")} // Corrected the path
        style={{
          backgroundColor: "#8B5CF6",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Return to Login</Text>
      </TouchableOpacity>
    </View>
  );
}