import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { locations } from './data/locationData';

export default function UserInfo() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [hostel, setHostel] = useState('');
  const [selectedHostel, setSelectedHostel] = useState(null);

  // Filter hostels from locations
  const hostels = locations.filter(location => 
    location.toLowerCase().includes('hostel')
  );

  const handleSubmit = () => {
    if (!name.trim() || !selectedHostel) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Save user info to global state
    global.userInfo = {
      name: name.trim(),
      hostel: selectedHostel
    };

    // Navigate to favorites selection
    router.push('/favorites');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="items-center justify-center py-8 px-4">
          <Image
            source={require('../assets/images/logo.png')}
            className="w-32 h-32 mb-8"

          />
          
          <Text className="text-3xl font-bold text-center mb-2">Welcome to JARSafari</Text>
          <Text className="text-gray-600 text-center mb-8">
            Your personal campus navigation assistant
          </Text>
          
          <View className="w-full mb-6">
            <Text className="text-lg font-semibold mb-2">Your Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-lg"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="w-full mb-8">
            <Text className="text-lg font-semibold mb-2">Your Hostel</Text>
            <View className="flex-row flex-wrap">
              {hostels.map((hostelName) => (
                <TouchableOpacity
                  key={hostelName}
                  className={`p-3 m-1 rounded-lg ${
                    selectedHostel === hostelName ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onPress={() => setSelectedHostel(hostelName)}
                >
                  <Text
                    className={`${
                      selectedHostel === hostelName ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {hostelName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg w-full"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Continue to Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 