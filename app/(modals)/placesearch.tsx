import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";

const placesearch = () => {
  const route = useRoute();

  return (
    <View>
      <Text>placesearch</Text>
    </View>
  );
};

export default placesearch;
