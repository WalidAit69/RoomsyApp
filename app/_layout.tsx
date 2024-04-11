import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import { Platform } from "react-native";

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
  return (
    <Provider store={store}>
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
            }}
          />

          <Stack.Screen
            name="(modals)/bookingPage"
            options={{
              presentation: "modal",
              headerShown: Platform.OS === "ios" && false,
            }}
          />
        </Stack>
      </RootSiblingParent>
    </Provider>
  );
}
