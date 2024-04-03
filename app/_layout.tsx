import ModalHeaderText from "@/components/explore/ModalHeaderText";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    popLight: require("../assets/fonts/Poppins-Light.ttf"),
    popMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    popRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    popSemibold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    popBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  return (
    <RootSiblingParent>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/login"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen name="listing/[id]" options={{ headerTitle: "" }} />
        <Stack.Screen
          name="(modals)/booking"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            headerTransparent: true,
            headerTitle: () => <ModalHeaderText />,
            headerLeft: () =>
              Platform.OS === "ios" && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: Colors.bordercolor,
                    borderRadius: 20,
                    borderWidth: 1,
                    padding: 5,
                  }}
                  onPress={() => router.back()}
                >
                  <Ionicons name="close-outline" size={24} color="black" />
                </TouchableOpacity>
              ),
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </RootSiblingParent>
  );
}
