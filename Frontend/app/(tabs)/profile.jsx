import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

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
  const [userName, setUserName] = useState("Jatin");
  const [userEmail, setUserEmail] = useState("jatin@example.com");
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSaveProfile = () => {
    // Here you would typically save the profile changes to your backend
    setIsEditing(false);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Top Header with Gradient */}
      <LinearGradient
        colors={['#FCD34D', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-12 pb-6 px-6 rounded-b-3xl shadow-md"
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-black">Profile</Text>
          <TouchableOpacity 
            className="bg-white/30 p-2 rounded-full"
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Profile Image and Info */}
      <View className="items-center -mt-10 px-6">
        <TouchableOpacity onPress={pickImage} className="relative">
          {profileImage ? (
            <Image source={{ uri: profileImage }} className="w-28 h-28 rounded-full border-4 border-white shadow-lg" />
          ) : (
            <View
              className="w-28 h-28 rounded-full items-center justify-center border-4 border-white shadow-lg"
              style={{ backgroundColor: bgColor }}
            >
              <Text className="text-4xl font-bold text-white">{userInitial}</Text>
            </View>
          )}
          <View className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 border-2 border-white">
            <Ionicons name="camera" size={16} color="#000" />
          </View>
        </TouchableOpacity>
        
        {isEditing ? (
          <View className="mt-4 w-full">
            <TextInput
              className="bg-gray-100 p-3 rounded-xl text-center text-lg font-semibold"
              value={userName}
              onChangeText={setUserName}
              placeholder="Your Name"
            />
            <TextInput
              className="bg-gray-100 p-3 rounded-xl text-center text-base mt-2"
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="Your Email"
              keyboardType="email-address"
            />
            <TouchableOpacity 
              className="bg-yellow-400 py-3 rounded-xl mt-4"
              onPress={handleSaveProfile}
            >
              <Text className="text-center font-semibold text-black">Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="mt-3 text-2xl font-bold text-slate-900">{userName}</Text>
            <Text className="text-gray-500">{userEmail}</Text>
          </>
        )}
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-around mt-8 mx-6 bg-gray-50 p-4 rounded-2xl shadow-sm">
        <View className="items-center">
          <Text className="text-2xl font-bold text-yellow-500">12</Text>
          <Text className="text-gray-600">Journeys</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-yellow-500">5</Text>
          <Text className="text-gray-600">Saved</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-yellow-500">3</Text>
          <Text className="text-gray-600">Reviews</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className="mx-6 mt-8 mb-10 bg-red-50 rounded-2xl py-4 flex-row items-center justify-center"
        onPress={() => {
          router.replace("/(auth)/login");
        }}
      >
        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        <Text className="ml-2 text-lg font-semibold text-red-500">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
