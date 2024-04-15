import { View, Text } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

const Bars = () => {
  return (
    <View style={{ width: 30 }}>
      <Text
        style={{ width: "55%", height: 1.5, backgroundColor: Colors.maincolor }}
      ></Text>
      <Text
        style={{
          width: "100%",
          height: 1.5,
          backgroundColor: Colors.maincolor,
          marginVertical: 5,
        }}
      ></Text>
      <Text
        style={{
          width: "55%",
          height: 1.5,
          backgroundColor: Colors.maincolor,
          alignSelf: "flex-end",
        }}
      ></Text>
    </View>
  );
};

export default Bars;
