import { View, Text, Image } from "react-native";
import React from "react";
import { styles } from "@/app/listing/Place.styles";
import CustomImage from "../CustomImage";

interface Review {
  comment: string;
  rating: number;
  userId: string;
  userName: string;
  userPhoto: string;
  _id: string;
}

const ReviewCard = ({ review }: { review: Review }) => {

  let src = "";

  src =
    review?.userPhoto && review?.userPhoto.includes("https://")
      ? review?.userPhoto
      : "https://roomsy-v3-server.vercel.app/" + review?.userPhoto;

  return (
    <View style={styles.ReviewContainer}>
      <View style={styles.ReviewTop}>
        <Image
          source={{ uri: src }}
          style={styles.reviewImg}
          resizeMode="cover"
        />
        <View>
          <Text style={styles.reviewname}>{review.userName}</Text>
          <Text style={styles.reviewdate}>July 2023</Text>
        </View>
      </View>

      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
};

export default ReviewCard;
