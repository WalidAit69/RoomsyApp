import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Page = () => {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View
        style={{
          backgroundColor: "#fff",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            name="notifications-off-outline"
            size={24}
            color="black"
            style={{ marginBottom: 5 }}
          />
          <Text style={{ fontFamily: "popRegular", fontSize: 18 }}>
            No Notifications
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Page;
