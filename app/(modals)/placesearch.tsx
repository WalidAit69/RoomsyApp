import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import Colors from "@/constants/Colors";
import PlacesLg from "@/components/explore/PlacesLg";
import { AntDesign } from "@expo/vector-icons";

interface Place {
  _id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  country: string;
  images: string[];
  type: string;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  kitchens: number;
  perks: string[];
  extrainfo: string;
  userNumber: string;
  checkIn: string;
  checkOut: string;
  maxGuests: number;
  owner: {
    fullname: string;
    phone: string;
    profilepic: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  likedBy: string[];
  reviews: review[];
}

interface review {
  comment: string;
  rating: number;
  userId: string;
  userName: string;
  userPhoto: string;
  _id: string;
}

const placesearch = () => {
  const { selectedCountry, Checkin, Checkout, guests } = useLocalSearchParams();
  const router = useRouter();

  //data
  const [searchRes, setsearchRes] = useState<Place[]>();
  const [Loading, setLoading] = useState(false);
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://roomsy-v3-server.vercel.app/api/placesBySearch/${selectedCountry}/${Checkin}/${Checkout}/${guests}`
      );
      setsearchRes(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric" };
    //@ts-ignore
    return date.toLocaleDateString("en-US", options);
  };

  // sorting
  const [SortDirection, setSortDirection] = useState("");
  const sortByPriceHighToLow = () => {
    if (searchRes) {
      const sortedResults = [...searchRes].sort((a, b) => b.price - a.price);
      setSortDirection("highToLow");
      setsearchRes(sortedResults);
    }
  };

  const sortByPriceLowToHigh = () => {
    if (searchRes) {
      const sortedResults = [...searchRes].sort((a, b) => a.price - b.price);
      setSortDirection("lowToHigh");
      setsearchRes(sortedResults);
    }
  };

  const handleSortClick = () => {
    if (SortDirection === "" || SortDirection === "lowToHigh") {
      sortByPriceHighToLow();
      setSortDirection("highToLow");
    }
    if (SortDirection === "highToLow") {
      sortByPriceLowToHigh();
      setSortDirection("lowToHigh");
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerLeft: () => (
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
          ),
          headerRight: () => (
            <View style={styles.headercontainer}>
              <Text style={styles.lighttext}>
                {formatDate(Checkin.toString())} ·{" "}
                {formatDate(Checkout.toString())} · {guests}
                {+guests > 1 ? " Guests" : " Guest"}
              </Text>
            </View>
          ),
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.backgoundcolorlight,
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={{ backgroundColor: "#fff", height: "100%" }}>
        {!Loading ? (
          <View
            style={{
              marginTop: 50,
              gap: 20,
              alignItems: "center",
              width: "100%",
            }}
          >
            <View style={styles.container}>
              <View>
                <Text style={styles.lighttext}>
                  {searchRes?.length}{" "}
                  {searchRes && searchRes?.length > 1 ? "Places" : "Place"}
                </Text>
                <Text style={[styles.darktext, { fontSize: 17 }]}>
                  Places in selected area
                </Text>
              </View>

              <View
                style={{
                  alignSelf: "flex-end",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "popRegular", opacity: 0.8 }}>
                  Filter by
                </Text>
                <TouchableOpacity style={styles.btn} onPress={handleSortClick}>
                  <Text
                    style={[styles.darktext, { fontSize: 12, marginTop: 1 }]}
                  >
                    Price
                  </Text>
                  {SortDirection === "lowToHigh" && (
                    <AntDesign name="up" size={12} color="black" />
                  )}
                  {SortDirection === "highToLow" && (
                    <AntDesign name="down" size={12} color="black" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {searchRes &&
              searchRes.length > 0 &&
              searchRes.map((place) => (
                <View key={place._id} style={{ width: "100%" }}>
                  <PlacesLg place={place} />
                </View>
              ))}
          </View>
        ) : (
          <ActivityIndicator
            size={"large"}
            color={Colors.maincolor}
            style={{ marginTop: 100 }}
          />
        )}
      </ScrollView>
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

export default placesearch;
