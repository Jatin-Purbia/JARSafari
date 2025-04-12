import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      />
      {/* ✅ Add Toast here so it works on every screen */}
      <Toast />
    </>
  );
}
