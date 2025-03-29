import { Text, View } from "react-native";
import { Link } from "expo-router";
import '../../global.css';
 
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>
        Welcome to JARSafari!
      </Text>
      <Text>Explore the app</Text>
     <Link href="/(auth)/login">Sign In</Link>
     <Link href="/explore">Explore</Link>
     <Link href="/profile">Profile</Link>
     <Link href="/properties/1">Property</Link>
    </View>
  );
}
