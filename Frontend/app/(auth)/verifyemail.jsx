import React, { useState } from "react";
import { View, TextInput } from "react-native";
import Toast from "react-native-toast-message";

const VerifyEmail = ({ onValidEmail, exposeEmail }) => {
  const [email, setEmail] = useState("");

  const handleInputChange = (inputEmail) => {
    setEmail(inputEmail);
    exposeEmail(inputEmail); // pass raw email to parent
  };

  // This is called from parent on button press
  VerifyEmail.validateOnSubmit = () => {
    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
        visibilityTime: 3000,
        position: "bottom",
      });
    }

    onValidEmail(isValid);
    return isValid;
  };

  return (
    <View className="w-full mb-4">
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={handleInputChange}
        className="w-full p-4 border border-slate-300 rounded-lg text-white bg-slate-800"
        placeholderTextColor="#CBD5E1"
      />
    </View>
  );
};

export default VerifyEmail;
