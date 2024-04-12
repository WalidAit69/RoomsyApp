import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/Colors";
import UseToast from "@/widgets/Toast";
import uploadImageToS3 from "@/widgets/uploadImageToS3";
import axios from "axios";

interface Props {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  profilePic: string | undefined;
  userName: string | undefined;
  job: string | undefined;
  lang: string | undefined;
  bio: string | undefined;
  userid: string | undefined;
  setupdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileBottomSheet = ({
  setEdit,
  profilePic,
  userName,
  job,
  bio,
  lang,
  userid,
  setupdated,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["85%"], []);

  const [imageUri, setimageUri] = useState("");
  const [mimetype, setmimetype] = useState<string | undefined>("");
  const [source, setsource] = useState("");
  const [fullname, setfullname] = useState(userName);
  const [Job, setJob] = useState(job);
  const [Bio, setBio] = useState(bio);
  const [Lang, setLang] = useState(lang);
  const [Loading, setLoading] = useState(false);
  const [imgLoading, setimgLoading] = useState(false);

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

  // setting current userimage to source
  useEffect(() => {
    setsource(
      profilePic?.includes("https://")
        ? profilePic
        : "https://roomsy-v3-server.vercel.app/" + profilePic
    );
  }, []);

  // api call
  const ext = mimetype?.split("/")[1];
  const filename = Date.now() + "." + ext;

  async function UpdateUser() {
    try {
      setLoading(true);
      let ImageUrl;

      try {
        let response;
        if (imageUri) {
          setimgLoading(true);
          response = await fetch(imageUri);

          if (!response.ok) {
            throw new Error("Failed to fetch file");
          }

          const fileData = await response.blob();
          ImageUrl = await uploadImageToS3(fileData, filename, mimetype);
          setimgLoading(false);
        }

        await axios.put(
          `https://roomsy-v3-server.vercel.app/api/UpdateUser/${userid}`,
          {
            fullname,
            job: Job,
            lang: Lang,
            bio: Bio,
            profilepic: ImageUrl ? ImageUrl : "",
          }
        );

        UseToast({ msg: "Info updated" || "Info updated" });
        setupdated(false);
      } catch (error: any) {
        UseToast({ msg: error?.response?.data?.msg || "Unknown error" });
        console.log({
          msg: (error?.response?.data?.msg as string) || error?.response,
        });
      }
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setLoading(false);
      setupdated(true);
    }
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#cacaca" }}
      index={0}
      style={styles.sheetContainer}
      backgroundStyle={{ backgroundColor: "white" }}
      enablePanDownToClose={!Loading}
      onClose={() => setEdit(false)}
    >
      <BottomSheetScrollView style={styles.contentcontainer}>
        <View style={styles.UserCardTop}>
          <TouchableOpacity onPress={pickImage} style={styles.UserCardImg}>
            {imgLoading ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : imageUri || source ? (
              <Image
                source={{ uri: imageUri ? imageUri : source }}
                style={styles.image}
              />
            ) : (
              <AntDesign
                name="user"
                size={35}
                color={"white"}
                style={{ opacity: 0.5 }}
              />
            )}
            {!imgLoading && (
              <Feather name="edit-2" size={24} style={styles.editpen} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setimageUri("");
              setsource("");
            }}
            disabled={Loading}
          >
            <Ionicons
              name="trash-bin"
              size={20}
              color="red"
              style={{ opacity: 0.7, marginTop: 3 }}
            />
          </TouchableOpacity>
          <Text style={styles.UserCardTopText}>{fullname}</Text>
        </View>

        <View style={styles.inputscontainer}>
          <View style={styles.inputrow}>
            <Text style={styles.inputtext}>Full name</Text>
            <TextInput
              placeholder="Let us know your name!"
              maxLength={30}
              style={styles.input}
              value={fullname}
              onChangeText={setfullname}
            />
          </View>

          <View style={styles.inputrow}>
            <Text style={styles.inputtext}>Job</Text>
            <TextInput
              placeholder="Let us know what you do for work!"
              maxLength={30}
              style={styles.input}
              value={Job}
              onChangeText={setJob}
            />
          </View>

          <View style={styles.inputrow}>
            <Text style={styles.inputtext}>Languages</Text>
            <TextInput
              placeholder="What languages do you speak?"
              style={styles.input}
              value={Lang}
              onChangeText={setLang}
              multiline
            />
          </View>

          <View style={styles.inputrow}>
            <Text style={styles.inputtext}>Bio</Text>
            <TextInput
              placeholder="Tell us your story in a few words"
              style={[styles.input, { height: 100 }]}
              multiline
              value={Bio}
              onChangeText={setBio}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, { opacity: Loading ? 0.5 : 1 }]}
          onPress={UpdateUser}
          disabled={Loading}
        >
          {Loading ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Text style={styles.btntext}>Update</Text>
          )}
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {},
  contentcontainer: {},
  UserCardTop: {
    alignItems: "center",
    justifyContent: "center",
  },
  UserCardImg: {
    width: 80,
    height: 80,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  UserCardTopText: {
    fontFamily: "popSemibold",
    fontSize: 16,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    opacity: 0.7,
  },
  editpen: {
    position: "absolute",
    color: "white",
  },
  inputscontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    gap: 20,
  },
  input: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    borderRadius: 10,
    height: 70,
    fontFamily: "popRegular",
    paddingHorizontal: 10,
  },
  inputrow: {
    width: "100%",
    alignItems: "center",
  },
  inputtext: {
    width: "90%",
    fontFamily: "popRegular",
    opacity: 0.8,
  },
  btn: {
    backgroundColor: Colors.maincolor,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    alignSelf: "center",
    marginVertical: 30,
    height: 60,
    borderRadius: 10,
  },
  btntext: {
    fontFamily: "popMedium",
    color: "white",
  },
});

export default ProfileBottomSheet;
