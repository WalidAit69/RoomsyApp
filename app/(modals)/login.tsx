import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../(modals)/login.styles";
import { RootSiblingParent } from "react-native-root-siblings";
import SignUpForm from "@/components/profile/SignUpForm";
import SignInForm from "@/components/profile/SignInForm";

const login = () => {
  const router = useRouter();
  const [RegistrationType, setRegistrationType] = useState("");

  return (
    <RootSiblingParent>
      <SafeAreaView
        style={{ backgroundColor: "white", flex: 1, marginBottom: 0 }}
      >
        <ScrollView style={styles.container}>
          {RegistrationType === "signup" ? (
            <SignUpForm setRegistrationType={setRegistrationType} />
          ) : (
            <SignInForm setRegistrationType={setRegistrationType} />
          )}
        </ScrollView>
      </SafeAreaView>
    </RootSiblingParent>
  );
};

export default login;
