import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const ModalHeaderText = () => {
  const [active, setactive] = useState(0);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setactive(0);
        }}
      >
        <Text
          style={{
            fontFamily: "popMedium",
            fontSize: 15,
            textDecorationLine: active === 0 ? "underline" : "none",
            opacity: active === 0 ? 1 : 0.5,
          }}
        >
          Places
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setactive(1);
        }}
      >
        <Text
          style={{
            fontFamily: "popMedium",
            fontSize: 15,
            textDecorationLine: active === 1 ? "underline" : "none",
            opacity: active === 1 ? 1 : 0.5,
          }}
        >
          Experiences
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalHeaderText;
