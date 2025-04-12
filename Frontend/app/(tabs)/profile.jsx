import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const getColorForLetter = (letter) => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FF8C33", "#33FFF3",
    "#A133FF", "#FFD700", "#FF4500", "#008080", "#DC143C", "#2E8B57",
    "#8A2BE2", "#FF1493", "#4169E1", "#FF6347"
  ];
  return colors[letter.charCodeAt(0) % colors.length];
};

const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const userName = "Jatin";
  const userInitial = userName.charAt(0).toUpperCase();
  const bgColor = getColorForLetter(userInitial);
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5">
      {/* Top Header */}
      <View className="flex-row justify-between items-center mt-5">
        <Text className="text-lg font-bold text-slate-900">Profile</Text>
        <Ionicons name="notifications-outline" size={24} color="#0C1C2D" />
      </View>

      {/* Profile Image */}
      <View className="items-center mt-6">
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} className="w-24 h-24 rounded-full" />
          ) : (
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <Text className="text-3xl font-bold text-white">{userInitial}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text className="mt-3 text-2xl font-semibold text-slate-900">{userName}</Text>
      </View>

      {/* Profile Menu */}
      <View className="mt-16 border-t border-gray-200">
        <MenuItem icon="calendar-outline" title="My Journey" />
        <MenuItem icon="notifications-outline" title="Notification" />
        <MenuItem icon="lock-closed-outline" title="Security" />
        <MenuItem icon="language-outline" title="Language" />
        <MenuItem icon="help-circle-outline" title="Help Center" />
        <MenuItem icon="people-outline" title="Invite Friends" />

        {/* Logout Button - Unchanged */}
        <TouchableOpacity
          className="mt-16 bg-yellow-400 rounded-3xl py-3 px-3 flex-row items-center justify-center"
          onPress={() => {
            router.replace("/(auth)/login");
          }}
        >
          <Ionicons name="log-out-outline" size={22} color="#000000" />
          <Text className="ml-2 text-xl font-semibold text-black">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, title }) => (
  <TouchableOpacity className="flex-row items-center justify-between py-3 px-4 border-b border-gray-200">
    <View className="flex-row items-center">
      <Ionicons name={icon} size={22} color="#0C1C2D" />
      <Text className="ml-4 text-base text-slate-900">{title}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={20} color="#999" />
  </TouchableOpacity>
);

export default ProfileScreen;
