import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";

export default function PlansLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Travel Plans",
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Plan Details",
          headerBackTitle: "Plans",
        }}
      />
    </Stack>
  );
} 