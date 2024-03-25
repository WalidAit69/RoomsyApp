import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../(modals)/login.styles";
import { Ionicons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import { ListHeaderComponent } from "@/widgets/PhoneInputHeader";

const Page = () => {
  return (
    <>
      <Link href={"/(modals)/login"}>places</Link>
    </>
  );
};

export default Page;
