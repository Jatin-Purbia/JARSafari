import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Github, Linkedin } from 'lucide-react-native';

export default function ContactUs() {
  const router = useRouter();

  const SocialLinks = ({ githubUrl, linkedinUrl }) => (
    <View className="flex-row items-center space-x-3 gap-2 mt-2">
      <TouchableOpacity
        onPress={() => Linking.openURL(githubUrl)}
        className="bg-gray-200 rounded-full p-2"
      >
        <Github size={20} color="#374151" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => Linking.openURL(linkedinUrl)}
        className="bg-gray-200 rounded-full p-2"
      >
        <Linkedin size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} className="px-4 py-10">
        {/* Logo */}
        <View className="items-center mb-2">
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 100, height: 100 }}
            resizeMode="cover"
          />
        </View>

        {/* Title */}
        <Text className="text-4xl font-extrabold text-blue-500 text-center mb-6">Contact Us</Text>

        {/* Intro */}
        <Text className="text-lg text-gray-800 mb-4 text-justify">
          We’re a team of passionate developers working to make campus life at IIT Jodhpur more convenient.
        </Text>

        {/* Jatin */}
        <View className="items-center mb-8">
          <Image
            source={require('../assets/images/jatin.jpg')}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
          <Text className="text-2xl font-semibold text-gray-800 mt-2">Jatin Purbia</Text>
          <Text className="text-lg text-gray-700 mt-1">Founder & CTO</Text>
          <SocialLinks
            githubUrl="https://github.com/Jatin-Purbia"
            linkedinUrl="https://www.linkedin.com/in/jatin-purbia-355210212/"
          />
          <Text className="text-base text-gray-800 text-center mt-2">
            Full-stack developer with expertise in React, React-Native, Shopify, and WordPress.
          </Text>
        </View>

        {/* Rahul & Sharana */}
        <View className="flex-row justify-between mb-8">
          {/* Rahul */}
          <View className="flex-1 items-center mr-2  before:">
            <Image
              source={require('../assets/images/rahul.png')} // Replace with Rahul's image
              style={{ width: 120, height: 120, borderRadius: 60  }}

            />
            <Text className="text-xl font-semibold text-gray-800 mt-2">Rahul Ahuja</Text>
            <Text className="text-gray-700 mt-1">Co-Founder & CFO</Text>
            <SocialLinks
              githubUrl="https://github.com/b23ch1037"
              linkedinUrl="https://www.linkedin.com/in/rahul-ahuja-47397928a/"
            />
            <Text className="text-center text-sm text-gray-800 mt-2">
              Skilled in frontend and UI/UX using Figma.
            </Text>
          </View>

          {/* Sharana */}
          <View className="flex-1 items-center ml-2">
            <Image
              source={require('../assets/images/sharan.png')} // Replace with Sharana's image
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
            <Text className="text-xl font-semibold text-gray-800 mt-2">Sharan Lakshetty</Text>
            <Text className="text-gray-700 mt-1">Co-Founder & COO</Text>
            <SocialLinks
              githubUrl="https://github.com/Sharan4405"
              linkedinUrl="https://www.linkedin.com/in/sharan-lakshetty-a0b8b02aa/"
            />
            <Text className="text-center text-sm text-gray-800 mt-2">
              Frontend developer & creative designer.
            </Text>
          </View>
        </View>

        {/* Ayush */}
        <View className="items-center mb-8">
          <Image
            source={require('../assets/images/ayush.jpg')} // Replace with Ayush's image
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
          <Text className="text-2xl font-semibold text-gray-800 mt-2">Ayush Gupta</Text>
          <Text className="text-lg text-gray-700 mt-1">Co-Founder</Text>
          <SocialLinks
            githubUrl="https://github.com/ayushgupta67"
            linkedinUrl="https://www.linkedin.com/in/ayush-gupta-93253328a/"
          />
          <Text className="text-base text-gray-800 text-center mt-2">
            Frontend expert ensuring smooth UI.
          </Text>
        </View>

        {/* Back Button */}
        <View className="mt-4 w-full px-4">
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-2xl shadow-md w-full"
            onPress={() => router.back()}
          >
            <Text className="text-white text-center font-semibold text-lg">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
