import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import CustomImage from "../CustomImage";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

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

const PlaceSmCard = ({ place }: { place: Place }) => {
  const CalculateAverageRating = () => {
    if (!place.reviews || place.reviews.length === 0) {
      return 0;
    }

    const totalRating = place.reviews.reduce(
      (acc: number, review: { rating: number }) => acc + review.rating,
      0
    );
    return totalRating / place.reviews.length;
  };

  const PlaceRating = CalculateAverageRating().toFixed(1);
  const router = useRouter();

  return (
    <View style={styles.CardContainer}>
      <TouchableOpacity
        style={styles.image}
        onPress={() => {
          router.push(`/listing/${place._id}`);
        }}
      >
        <CustomImage
          source={place?.images[0]}
          style={styles.PlaceCardImg}
          resizeMode="cover"
        />
        <View style={styles.ratingcontainer}>
          <Text style={styles.rating}>{PlaceRating}</Text>
        </View>
      </TouchableOpacity>

      <Text numberOfLines={1} style={styles.title}>
        {place?.title}
      </Text>

      <Text style={styles.typelocation}>
        {place.type} in {place.city}
      </Text>
      <Text style={styles.type}>
        {place.bedrooms} bed · {place.bathrooms} bath
      </Text>
      <Text style={styles.price}>${place.price}/night</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    width: 280,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#b4b4b4",
    padding: 10,
    marginLeft: 15,
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 170,
  },
  PlaceCardImg: {
    width: "100%",
    height: "100%",
    borderRadius: 7,
  },
  title: {
    fontFamily: "popSemibold",
    fontSize: 16,
    marginTop: 5,
  },
  type: {
    fontFamily: "popMedium",
    opacity: 0.6,
    marginTop: 5,
  },
  typelocation: {
    fontFamily: "popRegular",
  },
  price: {
    fontFamily: "popMedium",
    fontSize: 15,
    marginTop: 20,
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

export default PlaceSmCard;
