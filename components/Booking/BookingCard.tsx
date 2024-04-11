import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CustomImage from "../CustomImage";
import Colors from "@/constants/Colors";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { differenceInCalendarDays } from "date-fns";
import Animated, { FadeInUp, SlideInRight } from "react-native-reanimated";
import { useRouter } from "expo-router";

interface User {
  _id: string;
  email: string;
  password: string;
  fullname: string;
  phone: string;
  bio: string;
  job: string;
  lang: string;
  location: string;
  profilepic: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  host: boolean;
  Superhost: boolean;
  followers: string[];
  likedPosts: string[];
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
  __v: number;
  likedBy: string[];
}

interface Booking {
  _id: string;
  place: Place;
  user: User;
  host: string;
  checkin: string;
  checkout: string;
  guests: string;
  Username: string;
  Userphone: string;
  fullprice: string;
  halfprice: string;
  worktrip: boolean;
  createdAt: string;
  updatedAt: string;
}

const BookingCard = ({
  booking,
  isBooking,
  currentuserid,
}: {
  booking: Booking;
  isBooking?: string;
  currentuserid?: string;
}) => {
  const router = useRouter();
  const width = Dimensions.get("window").width;

  // dates
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

  // route
  const handleClick = (book: Booking) => {
    const placeid = book.place._id;
    const placeimages = book.place.images;
    const placetitle = book.place.title;
    const placeadress = [book.place.city, book.place.country];
    const username = book.user.fullname;
    const userphoto = book.user.profilepic;
    const useremail = book.user.email;
    const usernumber = book.user.email;
    const userbio = book.user.bio;
    const usercreated = book.user.createdAt;
    const userid = book.user._id;
    const checkin = book.checkin;
    const checkout = book.checkout;
    const fullprice = book.fullprice;
    const halfprice = book.halfprice;
    const isbooking = isBooking || "";
    const currentUserid = currentuserid || "";

    router.push({
      pathname: "/(modals)/bookingPage",
      params: {
        placeid,
        placeimages,
        placetitle,
        placeadress,
        username,
        userphoto,
        useremail,
        usernumber,
        userbio,
        usercreated,
        userid,
        checkin,
        checkout,
        fullprice,
        halfprice,
        isbooking,
        currentUserid,
      },
    });
  };

  // rendering nights
  const nights = () => {
    return (
      <View style={[styles.row, { columnGap: 8, flexWrap: "wrap" }]}>
        <Text style={styles.textlight}>{numberofDays} nights:</Text>
        <View style={[styles.row, { columnGap: 8 }]}>
          <View style={[styles.row, { gap: 4 }]}>
            <FontAwesome5 name="plane-departure" style={styles.textlight} />
            <Text style={styles.textlight}>{formatDate(booking.checkin)}</Text>
          </View>
          <AntDesign name="arrowright" style={styles.textlight} />
          <View style={[styles.row, { gap: 4 }]}>
            <FontAwesome5 name="plane-arrival" style={styles.textlight} />
            <Text style={styles.textlight}>{formatDate(booking.checkin)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Animated.View entering={FadeInUp} exiting={SlideInRight}>
      <TouchableOpacity
        style={[styles.container, { width: width - 20 }]}
        onPress={() => handleClick(booking)}
      >
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

          {nights()}

          <Text style={styles.textdark}>
            Total price $
            {booking.fullprice ? booking.fullprice : +booking.halfprice * 2}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgoundcolorlight,
    borderRadius: 10,
    marginHorizontal: 10,
    height: 180,
  },
  img: {
    width: "40%",
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightcontainer: {
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
