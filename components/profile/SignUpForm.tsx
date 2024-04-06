import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import { ListHeaderComponent } from "@/widgets/PhoneInputHeader";
import styles from "@/app/(modals)/login.styles";
import axios from "axios";
import uploadImageToS3 from "@/widgets/uploadImageToS3";
import * as ImagePicker from "expo-image-picker";
import UseToast from "@/widgets/Toast";
import { useDispatch } from "react-redux";
import { signin } from "@/features/registrationTypeSlice";

const SignUpForm = () => {
  const router = useRouter();

  // country picker
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");

  // states
  const [Step, setStep] = useState(1);
  const [FormError, setFormError] = useState("");
  const [Loading, setLoading] = useState(false);

  // data
  const [Number, setNumber] = useState("");
  const [Fullname, setFullname] = useState("");
  const [Bio, setBio] = useState("");
  const [Location, setLocation] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [mimetype, setmimetype] = useState<string>();
  const [imageUri, setimageUri] = useState<string>();

  // register type
  const dispatch = useDispatch();

  // getting image from user
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setimageUri(result.assets[0].uri);
      setmimetype(result.assets[0].mimeType);
    }
  };

  // countinue button
  function handleContinue() {
    if (countryCode && Number.length > 8) {
      setStep(2);
      setFormError("");
    } else {
      setFormError("Invalid Number");
    }
  }

  // sign up button
  function handleSignUp() {
    Fullname && Email && Password && Location && Bio && imageUri
      ? SignUp()
      : setFormError("All fields are required");
  }

  // api call
  const ext = mimetype?.split("/")[1];
  const filename = Date.now() + "." + ext;

  async function SignUp() {
    try {
      setLoading(true);
      const PhoneNumber = countryCode + Number;
      let ImageUrl;

      try {
        if (imageUri) {
          const response = await fetch(imageUri);

          if (!response.ok) {
            throw new Error("Failed to fetch file");
          }
          const fileData = await response.blob();
          ImageUrl = await uploadImageToS3(fileData, filename, mimetype);

          const result = await axios.post(
            "https://roomsy-v3-server.vercel.app/api/appregister",
            {
              phone: PhoneNumber,
              password: Password,
              email: Email,
              fullname: Fullname,
              bio: Bio,
              location: Location,
              profilepic: ImageUrl,
            }
          );

          dispatch(signin());
        }
      } catch (error: any) {
        UseToast({ msg: error?.response?.data?.msg || "Unknown error" });
        console.log({
          msg: (error?.response?.data?.msg as string) || "Unknown error",
        });
      }
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <View style={styles.topcontainer}>
        <View>
          {Step === 1 ? (
            <>
              <Text style={{ fontFamily: "popSemibold", fontSize: 16 }}>
                Sign up
              </Text>
              <View style={styles.toptextcontainer}>
                <Text style={{ fontFamily: "popLight", fontSize: 12 }}>
                  Have an account?
                </Text>
                <TouchableOpacity onPress={() => dispatch(signin())}>
                  <Text
                    style={{
                      fontFamily: "popLight",
                      fontSize: 12,
                      textDecorationLine: "underline",
                    }}
                  >
                    Log in
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.topiconcontainer}
              onPress={() => {
                setStep(1);
                setFormError("");
              }}
            >
              <Ionicons name="chevron-back" size={22} color="black" />
            </TouchableOpacity>
          )}
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
          {Step === 1 ? (
            <>
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
                        <Text
                          style={{ fontFamily: "popRegular", opacity: 0.4 }}
                        >
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
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={Number}
                maxLength={15}
                onChangeText={(Text) => {
                  const formattedText = Text.replace(/[^\d]/g, "");
                  setNumber(formattedText);
                }}
                style={styles.formnumberinput}
                placeholderTextColor="rgba(0, 0, 0, 0.2)"
              />

              <Text style={styles.confirmtext}>
                We will call or text you to confirm your number. No message and
                data rates apply.
              </Text>
            </>
          ) : (
            <>
              <View style={styles.UploadContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.ImageBtn}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  ) : (
                    <AntDesign name="user" size={35} color={"white"} />
                  )}
                </TouchableOpacity>
                <Text style={styles.ImageText}>Upload your picture</Text>
              </View>

              <Text style={styles.FormError}>{FormError}</Text>

              <TextInput
                placeholder="Full Name"
                value={Fullname}
                maxLength={15}
                onChangeText={(Text) => setFullname(Text)}
                style={styles.formName}
                placeholderTextColor="rgba(0, 0, 0, 0.2)"
              />

              <TextInput
                placeholder="Bio"
                value={Bio}
                onChangeText={(Text) => setBio(Text)}
                style={styles.FormAdress}
                placeholderTextColor="rgba(0, 0, 0, 0.2)"
              />

              <TextInput
                placeholder="Location"
                value={Location}
                maxLength={15}
                onChangeText={(Text) => setLocation(Text)}
                style={styles.FormAdress}
                placeholderTextColor="rgba(0, 0, 0, 0.2)"
              />

              <TextInput
                placeholder="Email Adress"
                keyboardType="email-address"
                onChangeText={(Text) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  const isValidEmail = emailRegex.test(Text);
                  if (isValidEmail) {
                    setEmail(Text);
                    setFormError("");
                  } else {
                    setFormError("Invalid Email Adress");
                  }
                }}
                style={styles.FormAdress}
                placeholderTextColor="rgba(0, 0, 0, 0.2)"
              />

              <TextInput
                placeholder="Password"
                keyboardType="default"
                secureTextEntry={true}
                maxLength={15}
                onChangeText={(Text) => {
                  setPassword(Text);
                }}
                style={styles.FormPw}
                placeholderTextColor="rgba(0, 0, 0, 0.2)"
              />
            </>
          )}
        </View>

        <View>
          <TouchableOpacity
            style={styles.Continue}
            onPress={Step == 1 ? handleContinue : handleSignUp}
          >
            {!Loading ? (
              <Text style={styles.ContinueText}>
                {Step == 1 ? "Continue" : "Sign up"}
              </Text>
            ) : (
              <ActivityIndicator size={30} color={"white"} />
            )}
          </TouchableOpacity>

          {Step === 1 && (
            <>
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
            </>
          )}
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

export default SignUpForm;
