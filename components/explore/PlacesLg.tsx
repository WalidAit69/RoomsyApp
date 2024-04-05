import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import Carousel from "pinar";
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

const PlacesLg = ({
  place,
  FadeRight,
  Loading,
}: {
  place: Place;
  FadeRight?: boolean;
  Loading?: boolean;
}) => {
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
    <View style={styles.container}>
      <Animated.View
        style={styles.PlaceCard}
        entering={FadeRight ? FadeInLeft : FadeInRight}
        exiting={FadeOutLeft}
      >
        <View style={{ position: "relative" }}>
          <Carousel
            showsControls={false}
            autoplay={true}
            autoplayInterval={5000}
            loop
            style={styles.PlaceCardImg}
            dotStyle={styles.dots}
            activeDotStyle={styles.activedot}
            dotsContainerStyle={styles.dotscontainer}
          >
            {place.images.slice(0, 5).map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(`/listing/${place._id}`)}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Animated.Image
                  source={{
                    uri: image.includes("https://")
                      ? image
                      : "https://roomsy-v3-server.vercel.app/server/routes/uploads/" +
                        image,
                  }}
                  resizeMode="cover"
                  style={[styles.PlaceCardImg, { width: "99%" }]}
                />
              </TouchableOpacity>
            ))}
          </Carousel>
          <View style={styles.ratingcontainer}>
            <Text style={styles.rating}>{PlaceRating}</Text>
          </View>
        </View>

        <View style={{ gap: 3 }}>
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
    fontSize: 18,
    marginTop: 5,
  },
  location: {
    fontFamily: "popMedium",
    opacity: 0.8,
    fontSize: 15,
  },
  type: {
    fontFamily: "popMedium",
    opacity: 0.6,
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
export default PlacesLg;
