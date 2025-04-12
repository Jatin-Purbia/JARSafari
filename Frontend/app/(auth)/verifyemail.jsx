import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";

const VerifyEmail = ({ onValidEmail, exposeEmail }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Function to validate email
  const validateEmail = (inputEmail) => {
    const trimmedEmail = inputEmail.trim();  // ✨ Remove leading/trailing spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Standard email format

    setEmail(inputEmail); // Show raw input in field for user feedback

    if (!emailRegex.test(trimmedEmail)) {
      setError("Invalid email address");
      onValidEmail(false);
    } else {
      setError("");
      onValidEmail(true);
    }
  };

  return (
    <View className="w-full mb-4">
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={validateEmail}
        className={`w-full p-4 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg`}
      />
      {error ? <Text className="text-red-500">{error}</Text> : null}
    </View>
  );
};

export default VerifyEmail;
