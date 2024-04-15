import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Carousel from "pinar";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";

interface review {
  comment: string;
  rating: number;
  userId: string;
  userName: string;
  userPhoto: string;
  _id: string;
}

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
  likedBy: string[];
  reviews: review[];
}

interface Props {
  SelectedPlace: Place;
}

const PlaceCard = ({ SelectedPlace }: Props) => {
  const router = useRouter();

  const CalculateAverageRating = () => {
    if (!SelectedPlace.reviews || SelectedPlace.reviews.length === 0) {
      return 0;
    }

    const totalRating = SelectedPlace.reviews.reduce(
      (acc: number, review: { rating: number }) => acc + review.rating,
      0
    );
    return totalRating / SelectedPlace.reviews.length;
  };

  const PlaceRating = CalculateAverageRating().toFixed(1);

  return (
    <Animated.View entering={FadeInDown} style={{ alignItems: "center" }}>
      <View style={[styles.cardhorizental]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/listing/${SelectedPlace._id}`);
          }}
        >
          <Animated.Image
            source={{
              uri: SelectedPlace.images[0].includes("https://")
                ? SelectedPlace.images[0]
                : "https://roomsy-v3-server.vercel.app/server/routes/uploads/" +
                  SelectedPlace.images[0],
            }}
            resizeMode="cover"
            style={[styles.cardimg, { height: 250 }]}
          />
          <View style={styles.ratingcontainer}>
            <Text style={styles.rating}>{PlaceRating}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.cardtextcontainer}>
          <Text style={styles.cardcity} numberOfLines={1}>
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
  cardhorizental: {
    borderRadius: 10,
    backgroundColor: "#fff",
    width: 300,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    height:365,
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
  ratingcontainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 5,
    height: 22,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  rating: {
    fontSize: 13,
    fontFamily: "popRegular",
  },
});

export default PlaceCard;
