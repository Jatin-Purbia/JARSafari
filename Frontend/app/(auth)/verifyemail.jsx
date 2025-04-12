import React, { useState } from "react";
import { View, TextInput } from "react-native";

const EmailInput = ({ onValidEmail }) => {
  const [email, setEmail] = useState("");

  const validateEmail = (inputEmail) => {
    const trimmedEmail = inputEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmail(inputEmail);
    // setEmailGlobal(inputEmail); // Send value up to parent

    if (!emailRegex.test(trimmedEmail)) {
      onValidEmail(false);
    } else {
      onValidEmail(true);
    }
  };

  return (
    <View className="w-full mb-4">
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={validateEmail}
        className="w-full p-4 border border-gray-300 rounded-lg"
        autoCapitalize="none"
        keyboardType="email-address"
      />
    </View>
  );
};

export default EmailInput;
