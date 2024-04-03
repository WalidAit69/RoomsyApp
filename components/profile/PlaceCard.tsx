import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./profile.styles";
import { AntDesign } from "@expo/vector-icons";
import CustomImage from "../CustomImage";
import { useRouter } from "expo-router";

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

const PlaceCard = ({ place }: { place: Place }) => {
  const CalculateAverageRating = () => {
    if (!place.reviews || place.reviews.length === 0) {
      return 0;
    }

    const totalRating = place.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return totalRating / place.reviews.length;
  };

  const PlaceRating = CalculateAverageRating().toFixed(1);

  const MainImage = place.images[0];

  const router = useRouter();

  return (
    <View style={styles.PlaceCard}>
      <TouchableOpacity
        onPress={() => {
          router.push(`/listing/${place._id}`);
        }}
      >
        <CustomImage style={styles.PlaceCardImg} source={MainImage} />
      </TouchableOpacity>
      <View style={styles.PlaceCardTop}>
        <Text style={styles.PlaceCardTopText}>{place?.type}</Text>

        <View style={styles.PlaceCardRating}>
          <AntDesign name="star" size={17} color="black" />
          <Text style={styles.PlaceCardTopText}>{PlaceRating}</Text>
        </View>
      </View>

      <Text style={styles.PlaceCardBottomText} numberOfLines={1}>
        {place?.title}
      </Text>
    </View>
  );
};

export default PlaceCard;
