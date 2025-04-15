import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av'; // Correct import from expo-av

const LoadingScreen = ({ onFinish }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish(); // Callback to switch to main content
    }, 3000); // Set duration of your video

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/Animations/Loading animation.mp4')} // Adjust path as needed
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping={false} // You can adjust this to true if you want the video to loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // White background
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  video: {
    width: 150,  // Custom width for the video
    height: 150, // Custom height for the video
  },
});

export default LoadingScreen;
