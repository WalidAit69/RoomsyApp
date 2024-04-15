import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Carousel from "pinar";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";

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
  latitude: number;
  longitude: number;
}

interface Props {
  SelectedPlace: Place;
  setSelectedPlace: Dispatch<SetStateAction<Place | undefined>>;
}

const PlaceCard = ({ SelectedPlace, setSelectedPlace }: Props) => {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown} style={{ alignItems: "center" }}>
      <View style={[styles.card]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/listing/${SelectedPlace._id}`);
          }}
        >
          <Carousel
            showsControls={false}
            autoplay={true}
            autoplayInterval={3000}
            loop
            style={[styles.cardimg]}
            dotStyle={styles.dots}
            activeDotStyle={styles.activedot}
            dotsContainerStyle={styles.dotscontainer}
          >
            {SelectedPlace.images.slice(0, 5).map((image, index) => (
              <Animated.Image
                key={index}
                source={{
                  uri: image.includes("https://")
                    ? image
                    : "https://roomsy-v3-server.vercel.app/server/routes/uploads/" +
                      image,
                }}
                resizeMode="cover"
                style={[styles.cardimg]}
              />
            ))}
          </Carousel>

          <TouchableOpacity
            style={styles.cardcancel}
            onPress={() => setSelectedPlace(undefined)}
          >
            <AntDesign name="closecircleo" size={24} color={Colors.maincolor} />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.cardtextcontainer}>
          <Text style={styles.cardcity}>
            {SelectedPlace?.city}, {SelectedPlace?.country}
          </Text>
          <Text style={styles.cardtype}>{SelectedPlace?.type}</Text>
          <Text style={styles.cardprice}>${SelectedPlace?.price}/night</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    bottom: 70,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardimg: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardtextcontainer: {
    padding: 10,
    paddingLeft: 15,
  },
  cardcity: {
    fontFamily: "popMedium",
    fontSize: 15,
  },
  cardtype: {
    fontFamily: "popRegular",
    opacity: 0.5,
  },
  cardprice: {
    fontFamily: "popMedium",
    fontSize: 13,
    marginTop: 5,
  },
  cardcancel: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  dots: {
    width: 5,
    height: 3,
    marginHorizontal: 3,
    borderRadius: 3,
    backgroundColor: Colors.backgoundcolor,
  },
  activedot: {
    backgroundColor: Colors.maincolor,
    width: 10,
    height: 3,
    marginHorizontal: 3,
    borderRadius: 3,
  },
  dotscontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    flexWrap: "wrap",
    marginHorizontal: 5,
    rowGap: 5,
  },
});

export default PlaceCard;
