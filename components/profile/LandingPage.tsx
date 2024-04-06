import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useDispatch } from "react-redux";
import { signin, signup } from "@/features/registrationTypeSlice";

const LandingPage = () => {
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;
  const dispatch = useDispatch();

  return (
    <View style={{ height: screenHeight - 50 }}>
      <View>
        <View>
          <Image
            style={styles.img}
            resizeMode="cover"
            source={{
              uri: "https://ucarecdn.com/f1e265a1-0107-46ff-9557-97268f3aa290/",
            }}
          />

          <View style={styles.imgtextcontainer}>
            <Text style={styles.imgtext}>Discover the best lovely places</Text>
            <Text style={styles.imgtextsec}>Let Roomsy guide you</Text>
          </View>
        </View>

        <View style={styles.bottomcontainer}>
          <View style={styles.btns}>
            <TouchableOpacity
              onPress={() => {
                dispatch(signup());
                router.push("/(modals)/login");
              }}
              style={styles.btnmaincontainer}
            >
              <Text style={styles.btnmain}>Create new account</Text>
              <AntDesign
                name="arrowright"
                size={20}
                color="white"
                style={{ marginBottom: 1, opacity: 0.8 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                dispatch(signin());
                router.push("/(modals)/login");
              }}
            >
              <Text style={styles.btnsec}>I already have an account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.seperator}>
            <View style={styles.beforeSeperator} />
            <Text style={styles.seperatorText}>OR</Text>
            <View style={styles.afterSeperator} />
          </View>

          <View style={styles.socialmedia}>
            <TouchableOpacity style={styles.scoialbtn}>
              <Ionicons name="logo-google" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.scoialbtn}>
              <Ionicons name="logo-facebook" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    height: "100%",
    width: "100%",
  },
  bottomcontainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: "32%",
    paddingTop: 10,
  },
  btns: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  btnmaincontainer: {
    backgroundColor: Colors.maincolor,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 40,
  },
  btnmain: {
    color: "white",
    fontFamily: "popMedium",
    opacity: 0.8,
    marginTop: 2,
  },
  btnsec: {
    color: "black",
    fontFamily: "popRegular",
    fontSize: 13,
    opacity: 0.8,
  },
  seperator: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    position: "relative",
  },
  seperatorText: {
    fontSize: 12,
    fontFamily: "popMedium",
    opacity: 0.5,
  },
  beforeSeperator: {
    position: "absolute",
    left: 25,
    backgroundColor: Colors.bordercolor,
    width: "40%",
    height: 1.5,
    opacity: 0.6,
  },
  afterSeperator: {
    position: "absolute",
    right: 25,
    backgroundColor: Colors.bordercolor,
    width: "40%",
    height: 1.5,
    opacity: 0.6,
  },
  socialmedia: {
    flexDirection: "row",
    gap: 20,
  },
  scoialbtn: {
    backgroundColor: Colors.backgoundcolorlight,
    borderRadius: 40,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  imgtextcontainer: {
    position: "absolute",
    top: "40%",
    left: 20,
  },
  imgtext: {
    color: "#fff",
    fontFamily: "popBold",
    fontSize: 25,
    maxWidth: 300,
  },
  imgtextsec: {
    color: "#fff",
    fontFamily: "popRegular",
    opacity: 0.9,
    fontSize: 13,
  },
});

export default LandingPage;
