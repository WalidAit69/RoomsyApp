import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import BookingCard from "@/components/Booking/BookingCard";
import Colors from "@/constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserData } from "@/features/userSlice";
import CustomUserImage from "@/components/CustomUserImage";
import { fetchBookings } from "@/features/userbookingsSlice";

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

const Page = () => {
  const router = useRouter();

  // getting user and bookings with redux
  const dispatch: AppDispatch = useDispatch();
  const { User, Loading } = useSelector((state: RootState) => state.user);
  const { Booked, Booking, isLoading } = useSelector(
    (state: RootState) => state.bookings
  );
  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchBookings());
  }, []);

  return (
    <>
      <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            headerTitle: "Bookings",
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
            headerShown: !Booking && !Booked ? false : true,
            headerTitleStyle: {
              fontFamily: "popMedium",
            },
            headerBackground: () => <View style={styles.header}></View>,
            headerTransparent: true,
          }}
        />
        {!isLoading && (Booked || Booking) && User && (
          <View style={{ marginTop: 100 }}>
            <View style={{ alignItems: "center", marginTop: Booking && 20 }}>
              {Booking && (
                <Text style={[styles.container, styles.title]}>
                  My bookings
                </Text>
              )}
              <FlatList
                data={Booking}
                renderItem={({ item }: { item: Booking }) => (
                  <BookingCard booking={item} isBooking={"Yes"} currentuserid={User.id}/>
                )}
                keyExtractor={(booking) => booking._id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View
              style={{ alignItems: "center", marginVertical: Booked && 20 }}
            >
              {Booked && (
                <Text style={[styles.container, styles.title]}>
                  My booked places
                </Text>
              )}
              <View style={{ gap: 15 }}>
                {Booked &&
                  Booked.map((booking: Booking) => (
                    <BookingCard booking={booking} key={booking._id} />
                  ))}
              </View>
            </View>
          </View>
        )}

        {(isLoading || Loading) && (
          <ActivityIndicator
            size={"large"}
            color={Colors.maincolor}
            style={{ marginTop: 150 }}
          />
        )}
      </ScrollView>

      {!isLoading && !Booking && !Booked && !Loading && (
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="calendar-remove-outline"
            size={27}
            color="black"
          />
          <Text style={{ fontFamily: "popRegular", fontSize: 18 }}>
            No Bookings
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
  },
  header: {
    height: "100%",
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "popSemibold",
    fontSize: 20,
    marginBottom: 5,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
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
});

export default Page;
