import { ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../(modals)/login.styles";
import { RootSiblingParent } from "react-native-root-siblings";
import SignUpForm from "@/components/profile/SignUpForm";
import SignInForm from "@/components/profile/SignInForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const login = () => {
  const RegistrationType = useSelector(
    (state: RootState) => state.registrationtype.RegistrationType
  );

  return (
    <RootSiblingParent>
      <SafeAreaView
        style={{ backgroundColor: "white", flex: 1, marginBottom: 0 }}
      >
        <ScrollView style={styles.container}>
          {RegistrationType === "signup" ? <SignUpForm /> : <SignInForm />}
        </ScrollView>
      </SafeAreaView>
    </RootSiblingParent>
  );
};

export default login;
