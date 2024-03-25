import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./profile/profile.styles";
import { AntDesign } from "@expo/vector-icons";
import CustomImage from "./CustomImage";

const PlaceCard = ({ place }: any) => {
  const CalculateAverageRating = () => {
    if (!place.item.reviews || place.item.reviews.length === 0) {
      return 0;
    }

    const totalRating = place.item.reviews.reduce(
      (acc: number, review: { rating: number }) => acc + review.rating,
      0
    );
    return totalRating / place.item.reviews.length;
  };

  const PlaceRating = CalculateAverageRating().toFixed(1);

  const MainImage = place.item.images[0];

  return (
    <View style={styles.PlaceCard}>
      <TouchableOpacity onPress={() => {}}>
        <CustomImage style={styles.PlaceCardImg} source={MainImage} />
      </TouchableOpacity>
      <View style={styles.PlaceCardTop}>
        <Text style={styles.PlaceCardTopText}>{place?.item.type}</Text>

        <View style={styles.PlaceCardRating}>
          <AntDesign name="star" size={17} color="black" />
          <Text style={styles.PlaceCardTopText}>{PlaceRating}</Text>
        </View>
      </View>

      <Text style={styles.PlaceCardBottomText} numberOfLines={1}>
        {place?.item.title}
      </Text>
    </View>
  );
};

export default PlaceCard;
