import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface Props {
  selectedCountry: string | string[];
  Checkin: string | string[];
  Checkout: string | string[];
  guests: string | string[];
}
const Searchheader = ({
  selectedCountry,
  Checkin,
  Checkout,
  guests,
}: Props) => {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric" };
    //@ts-ignore
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff"  }}>
      <View style={styles.header}>
        <View>
          <TouchableOpacity
            style={styles.headercontainer}
            onPress={() => router.back()}
          >
            <AntDesign
              name="left"
              size={15}
              color="black"
              style={{ marginBottom: Platform.OS === "android" ? 4 : 0 }}
            />
            <Text style={styles.darktext}>{selectedCountry}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headercontainer}>
          <Text style={styles.lighttext}>
            {formatDate(Checkin.toString())} · {formatDate(Checkout.toString())}{" "}
            · {guests}
            {+guests > 1 ? " Guests" : " Guest"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgoundcolorlight,
    marginTop: Platform.OS === "android" ? 30 : 0,
    height: 70,
    marginHorizontal: 10,
    borderRadius: 40,
    paddingHorizontal: 20,
  },
  headercontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  darktext: {
    fontFamily: "popMedium",
    fontSize: 14,
  },
  lighttext: {
    fontFamily: "popRegular",
    fontSize: 14,
    opacity: 0.5,
  },
  container: {
    width: "95%",
  },
  btn: {
    borderWidth: 1,
    borderColor: Colors.backgoundcolor,
    borderRadius: 7,
    width: 85,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
});

export default Searchheader;
