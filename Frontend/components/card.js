// components/Card.js
// components/Card.js
import React from "react";
import { View, Text } from "react-native";

export default function Card({ title}) {
  return (
    <View className="bg-gray-100 p-3 rounded-xl items-center justify-center mx-1" style={{ width: "23%"}}>
    <Text className="text-black text-sm text-center">{title}</Text>
    </View>
  );
}

