import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import CustomImage from "../CustomImage";
import Colors from "@/constants/Colors";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { differenceInCalendarDays } from "date-fns";
import Animated, { SlideInUp } from "react-native-reanimated";

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
}

interface Booking {
  _id: string;
  place: Place;
  user: string;
  host: string;
  checkin: string;
  checkout: string;
  guests: string;
  Username: string;
  Userphone: string;
  fullprice: string;
  worktrip: boolean;
  createdAt: string;
  updatedAt: string;
}

const BookingCard = (booking: Booking) => {
  const width = Dimensions.get("window").width;

  let numberofDays = 0;
  if (booking.checkin && booking.checkout) {
    numberofDays = differenceInCalendarDays(
      new Date(booking.checkout),
      new Date(booking.checkin)
    );
  }

  function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  }

  return (
    <Animated.View entering={SlideInUp} style={[styles.container, { width: width - 20 }]}>
      <CustomImage source={booking?.place?.images[0]} style={styles.img} />
      <View style={styles.rightcontainer}>
        <Text style={styles.textdark} numberOfLines={2}>
          {booking?.place?.title}
        </Text>

        <View style={styles.row}>
          <Entypo
            name="location-pin"
            style={[styles.textlight, { fontSize: 18 }]}
          />
          <Text style={styles.textlight}>
            {booking?.place?.city}, {booking?.place?.country}
          </Text>
        </View>

        <View style={[styles.row, { gap: 8 }]}>
          <Text style={styles.textlight}>{numberofDays} nights:</Text>
          <View style={[styles.row, { gap: 4 }]}>
            <FontAwesome5 name="plane-departure" style={styles.textlight} />
            <Text style={styles.textlight}>{formatDate(booking.checkin)}</Text>
          </View>
          <AntDesign name="arrowright" style={styles.textlight} />
          <View style={[styles.row, { gap: 4 }]}>
            <FontAwesome5 name="plane-departure" style={styles.textlight} />
            <Text style={styles.textlight}>{formatDate(booking.checkin)}</Text>
          </View>
        </View>

        <Text style={styles.textdark}>Total price ${booking.fullprice}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgoundcolorlight,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginHorizontal: 10,
  },
  img: {
    width: "40%",
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightcontainer: {
    // backgroundColor: "red",
    width: "60%",
    paddingLeft: 10,
    gap: 10,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  textdark: {
    fontFamily: "popMedium",
    fontSize: 14,
  },
  textlight: {
    fontFamily: "popRegular",
    fontSize: 12.5,
    opacity: 0.6,
  },
});

export default BookingCard;
