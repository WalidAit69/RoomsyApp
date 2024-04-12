import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBookings } from "@/features/userbookingsSlice";
import CustomUserImage from "@/components/CustomUserImage";
import Colors from "@/constants/Colors";
import { fetchUserData } from "@/features/userSlice";
import CustomImage from "@/components/CustomImage";
import { format } from "date-fns";
import Animated, { FadeIn } from "react-native-reanimated";

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

interface GroupedBooks {
  [dateKey: string]: Booking[];
}

const Page = () => {
  const router = useRouter();

  // Getting User and Booked data with Redux
  const { Booked, isLoading } = useSelector(
    (state: RootState) => state.bookings
  );
  const { User, Loading } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchUserData());
  }, []);

  // Grouping Data by Date
  const groupByDate = (notifications: Booking[] | null): GroupedBooks => {
    const grouped: GroupedBooks = {};

    if (notifications) {
      notifications.forEach((book) => {
        const dateKey = book.createdAt
          ? new Date(book.createdAt).toLocaleDateString()
          : "Unknown Date";

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }

        grouped[dateKey].push(book);
      });
    }

    return grouped;
  };
  const groupedBooked = groupByDate(Booked);

  // Formating Date
  const formatDate = (dateString: string): string => {
    let day: string, month: string, year: string;
    let delimiter: string;

    if (dateString.includes(".")) {
      [day, month, year] = dateString.split(".");
      delimiter = "-";
    } else if (dateString.includes("/")) {
      [day, month, year] = dateString.split("/");
      delimiter = "-";
    } else {
      throw new Error("Invalid date string format");
    }

    const date = new Date(`${year}${delimiter}${month}${delimiter}${day}`);
    const currentYear = new Date().getFullYear();
    const includeYear = parseInt(year) < currentYear;
    const formatString = includeYear ? "d MMMM yyyy" : "d MMMM";

    return format(date, formatString);
  };

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
      },
    });
  };

  return (
    <>
      <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            headerTitle: "Notifications",
            headerLeft: () => (
              <TouchableOpacity
                style={styles.headerleft}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <CustomUserImage style={styles.img} source={User?.profilepic} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity style={styles.headerright}>
                <AntDesign name="search1" size={20} color="black" />
              </TouchableOpacity>
            ),
            headerShadowVisible: false,
            headerShown: Loading && isLoading ? false : true,
            headerTitleStyle: {
              fontFamily: "popMedium",
            },
            headerBackground: () => <View style={styles.header}></View>,
            headerTransparent: true,
          }}
        />

        <View>
          {!isLoading && !Loading && Booked && User && (
            <View style={{ marginTop: 100 }}>
              {Object.keys(groupedBooked).map((dateKey, index) => (
                <Animated.View
                  entering={FadeIn.delay(200 * index)}
                  key={dateKey}
                  style={{ alignItems: "center" }}
                >
                  <Text style={styles.dateText}>{formatDate(dateKey)}</Text>
                  <View style={styles.container}>
                    {groupedBooked[dateKey].map((book: any) => (
                      <TouchableOpacity
                        onPress={() => handleClick(book)}
                        key={book._id}
                        style={styles.notification}
                      >
                        <CustomUserImage
                          source={book.user.profilepic}
                          style={styles.userimg}
                        />
                        <View style={styles.textcontainer}>
                          <Text style={styles.textuser}>
                            {book.user.fullname}
                          </Text>
                          <Text style={styles.texttype}>booked</Text>
                          <Text style={styles.text}>your place</Text>
                        </View>
                        <CustomImage
                          style={styles.placeimg}
                          source={book.place.images[0]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          {(isLoading || Loading) && !Booked && (
            <ActivityIndicator
              size={"large"}
              color={Colors.maincolor}
              style={{ marginTop: 100 }}
            />
          )}
        </View>
      </ScrollView>
      {Booked?.length == 0 && !Loading && !isLoading && (
        <View
          style={{
            backgroundColor: "#fff",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center", gap: 10 }}>
            <Ionicons
              name="notifications-off-outline"
              size={24}
              color="black"
            />
            <Text style={{ fontFamily: "popRegular", fontSize: 18 }}>
              No Notifications
            </Text>
          </View>
        </View>
      )}
    </>
  );
};


const styles = StyleSheet.create({
  header: {
    height: "100%",
    backgroundColor: "#fff",
  },
  headerleft: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  img: {
    height: "100%",
    width: "100%",
    borderRadius: 50,
  },
  headerright: {
    marginRight: 10,
    width: 40,
    height: 40,
    backgroundColor: Colors.backgoundcolorlight,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
  },
  notification: {
    minHeight: 70,
    borderBottomWidth: 1,
    borderColor: Colors.bordercolor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "95%",
    flexWrap: "wrap",
    paddingVertical: 20,
  },
  userimg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textcontainer: {
    flexDirection: "row",
    alignItems: "center",
    rowGap: 0,
    width: "50%",
    flexWrap: "wrap",
    columnGap: 5,
  },
  placeimg: {
    width: 80,
    height: 50,
    borderRadius: 10,
  },
  textuser: {
    fontFamily: "popMedium",
    color: Colors.maincolor,
    fontSize: 13,
  },
  texttype: {
    fontFamily: "popMedium",
    fontSize: 13,
  },
  text: {
    fontFamily: "popRegular",
    fontSize: 13,
  },
  dateText: {
    width: "95%",
    marginTop: 15,
    fontFamily: "popMedium",
  },
});

export default Page;
