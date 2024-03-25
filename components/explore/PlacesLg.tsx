import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import CustomImage from "../CustomImage";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";

const PlacesLg = ({ place, FadeRight }: { place: any; FadeRight: boolean }) => {
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

  return (
    <View style={styles.container}>
      <Animated.View
        style={styles.PlaceCard}
        entering={FadeRight ? FadeInLeft : FadeInRight}
        exiting={FadeOutLeft}
      >
        <TouchableOpacity style={{ position: "relative" }}>
          <CustomImage
            source={place?.images[0]}
            style={styles.PlaceCardImg}
            resizeMode="cover"
          />
          <View style={styles.ratingcontainer}>
            <Text style={styles.rating}>{PlaceRating}</Text>
          </View>
        </TouchableOpacity>

        <View>
          <Text numberOfLines={1} style={styles.title}>
            {place?.title}
          </Text>
          <Text style={styles.location}>
            {place?.city},{place.country}
          </Text>
          <Text style={styles.type}>
            {place.type} · {place.bedrooms} Bedrooms · {place.bathrooms}{" "}
            Bathrooms
          </Text>

          <Text style={styles.price}>${place.price}/night</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  PlaceCard: {
    marginTop: 0,
    width: "95%",
  },
  PlaceCardImg: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  title: {
    fontFamily: "popSemibold",
    fontSize: 16,
    marginTop: 5,
  },
  location: {
    fontFamily: "popMedium",
    opacity: 0.8,
    fontSize: 13,
  },
  type: {
    fontFamily: "popMedium",
    opacity: 0.6,
    fontSize: 12,
  },
  price: {
    fontFamily: "popMedium",
    fontSize: 13,
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
export default PlacesLg;
