import React from 'react';
import { View, Text, ScrollView,TouchableOpacity, Image  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AboutUs() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className=" w-full py-2" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 70 }}>
      <View className="px-6 mt-8">
  <View className="bg-blue-100 p-6 rounded-2xl shadow-md flex-col items-center justify-center">
    <Text className="text-3xl font-extrabold text-blue-500 text-center mb-4">
      About Us
    </Text>

    <Text className="text-base text-gray-800 text-center leading-relaxed">
      Our app is your smart companion to navigate campus life. From locating buildings and hostels to keeping track of your favorite places, we help you move with ease and comfort.
    </Text>

    <Text className="text-base text-gray-800 text-center mt-3 leading-relaxed">
      With a sleek UI, seamless animations, and user-friendly experience, our mission is to simplify navigation and improve how students experience campus.
    </Text>
  </View>
</View>

        <View className="px-6 mt-8">
  <Text className="text-3xl font-bold text-center text-blue-500 mb-4">Our Team</Text>

  {/* Team Members */}
  <View className="space-y-4">
    {[
      {
        name: "Sharan Gouda Lakshetty",
        role: "Developer & Designer",
        image: require('../assets/images/sharan.png'), // replace with your actual images
      },
      {
        name: "Jatin Purbia",
        role: "Backend & Architecture",
        image: require('../assets/images/logo.png'),
      },
      {
        name: "Rahul Ahuja",
        role: "Map Integration & UX",
        image: require('../assets/images/logo.png'),
      },
      {
        name: "Ayush Gupta",
        role: "Data & Recommendations",
        image: require('../assets/images/logo.png'),
      },
    ].map((member, index) => (
      <View
        key={index}
        className="flex-row items-center bg-gray-100 p-4 rounded-2xl shadow-sm mb-5"
      >
        <Image
          source={member.image}
          className="w-16 h-16 rounded-full mr-4"
          resizeMode="cover"
        />
        <View>
          <Text className="text-lg font-semibold text-black">
            {member.name}
          </Text>
          <Text className="text-sm text-gray-600">{member.role}</Text>
        </View>
      </View>
    ))}
  </View>

  {/* Footer Note */}
  <Text className="text-sm text-gray-500 italic mt-6 text-center">
    Supported by the vibrant student community of IIT Jodhpur
  </Text>
</View>

        <View className="w-full px-6">
        <TouchableOpacity
          className="bg-blue-500 rounded-2xl shadow-md w-full p-4 mb-5 active:opacity-80"
          onPress={() => router.back()}
        >
          <Text className="text-white text-center font-semibold text-lg">Go Back</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
