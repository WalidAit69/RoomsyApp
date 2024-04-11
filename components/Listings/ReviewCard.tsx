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
  createdAt: any;
}

const ReviewCard = ({ review }: { review: Review }) => {
  // images
  let src = "";
  src =
    review?.userPhoto && review?.userPhoto.includes("https://")
      ? review?.userPhoto
      : "https://roomsy-v3-server.vercel.app/" + review?.userPhoto;

  // format date
  function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  }

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
          <Text style={styles.reviewdate}>
            {review.createdAt ? formatDate(review.createdAt) : "July 23"}
          </Text>
        </View>
      </View>

      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
};

export default ReviewCard;
