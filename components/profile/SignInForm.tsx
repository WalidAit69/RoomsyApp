import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import { ListHeaderComponent } from "@/widgets/PhoneInputHeader";
import styles from "@/app/(modals)/login.styles";
import axios from "axios";
import UseToast from "@/widgets/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInForm = ({ setRegistrationType }: any) => {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");

  const [Loading, setLoading] = useState(false);
  const [FormError, setFormError] = useState("");

  const [number, setnumber] = useState("");
  const [password, setpassword] = useState("");

  const login = async () => {
    try {
      const phone = countryCode + number;
      setLoading(true);
      const response = await axios.post(
        "https://roomsy-v3-server.vercel.app/api/login",
        {
          phone: phone,
          password: password,
        }
      );
      console.log();
      try {
        await AsyncStorage.setItem(
          "user_session",
          JSON.stringify({
            number: phone,
            token: response.data.accesstoken,
            userId: response.data.id,
          })
        );
      } catch (e) {
        console.log("Error storing Data");
      }
      router.replace("/(tabs)/profile");
    } catch (error: any) {
      UseToast({ msg: error?.response?.data?.msg || "Unknown error" });
      console.log({
        msg: (error?.response?.data?.msg as string) || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  function handleSignIn() {
    password && number && countryCode
      ? login()
      : setFormError("All fields are required");
  }

  useEffect(() => {
    if (password && number && countryCode) {
      setFormError("");
    }
  }, [password, number, countryCode]);

  return (
    <View>
      <View style={styles.topcontainer}>
        <View>
          <Text style={{ fontFamily: "popSemibold", fontSize: 16 }}>
            Sign in
          </Text>
          <View style={styles.toptextcontainer}>
            <TouchableOpacity onPress={() => setRegistrationType("signup")}>
              <Text
                style={{
                  fontFamily: "popLight",
                  fontSize: 12,
                  textDecorationLine: "underline",
                }}
              >
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.topiconcontainer}
          onPress={() => router.back()}
        >
          <Ionicons name="close-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.formcontainer}>
        <View>
          <Text style={styles.FormError}>{FormError}</Text>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={styles.formcountrypickercontainer}
          >
            <>
              {countryCode ? (
                <View style={styles.formcountrypicker}>
                  <View>
                    <Text style={styles.countryregion}>Country/Region</Text>
                    <Text style={styles.country}>
                      {countryName} ({countryCode})
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="black"
                  />
                </View>
              ) : (
                <View style={styles.formcountrypicker}>
                  <View>
                    <Text style={styles.countryregion}>Country/Region</Text>
                    <Text style={{ fontFamily: "popRegular", opacity: 0.4 }}>
                      United States (+1)
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="black"
                  />
                </View>
              )}
            </>
          </TouchableOpacity>

          <TextInput
            placeholder="number number"
            keyboardType="number-pad"
            maxLength={15}
            onChangeText={(Text) => {
              const formattedText = Text.replace(/[^\d]/g, "");
              setnumber(formattedText);
            }}
            style={styles.FormAdress}
            placeholderTextColor="rgba(0, 0, 0, 0.2)"
          />

          <TextInput
            placeholder="password"
            keyboardType="default"
            secureTextEntry={true}
            maxLength={15}
            onChangeText={(Text) => {
              setpassword(Text);
            }}
            style={styles.FormPw}
            placeholderTextColor="rgba(0, 0, 0, 0.2)"
          />

          <Text style={styles.confirmtext}>
            We will call or text you to confirm your number. No message and data
            rates apply.
          </Text>
        </View>

        <View>
          <TouchableOpacity style={styles.Continue} onPress={handleSignIn}>
            {!Loading ? (
              <Text style={styles.ContinueText}>Sign in</Text>
            ) : (
              <ActivityIndicator size={30} color="white" />
            )}
          </TouchableOpacity>

          <View style={styles.seperator}>
            <View style={styles.beforeSeperator} />
            <Text style={styles.seperatorText}>OR</Text>
            <View style={styles.afterSeperator} />
          </View>

          <TouchableOpacity style={styles.ContinueWithSocial}>
            <Ionicons
              name="logo-facebook"
              size={24}
              color="black"
              style={styles.ContinueWithSocialIcon}
            />
            <Text style={styles.ContinueWithSocialText}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ContinueWithSocial}>
            <Ionicons
              name="logo-google"
              size={24}
              color="black"
              style={styles.ContinueWithSocialIcon}
            />
            <Text style={styles.ContinueWithSocialText}>
              Continue with Gmail
            </Text>
          </TouchableOpacity>
        </View>

        <CountryPicker
          show={show}
          lang="en"
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setCountryName(item.name.en);
            setShow(false);
          }}
          ListHeaderComponent={ListHeaderComponent}
          popularCountries={["en", "dz", "ma", "fr", "de"]}
        />
      </View>
    </View>
  );
};

export default SignInForm;
