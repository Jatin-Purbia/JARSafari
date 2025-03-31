import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";

const EmailInput = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Function to validate email
  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Standard email format
    if (!emailRegex.test(inputEmail)) {
      setError("Invalid email address");
    } else {
      setError("");  // No error if email is valid
    }
    setEmail(inputEmail);
  };

  return (
    <View className="w-full mb-4">
      {/* Email Input Field */}
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={validateEmail}  // Call validation on text change
        className={`w-full p-4 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg`}
      />

      {/* Show Error Message If Email is Invalid */}
      {error ? <Text className="text-red-500">{error}</Text> : null}
    </View>
  );
};

export default EmailInput;
