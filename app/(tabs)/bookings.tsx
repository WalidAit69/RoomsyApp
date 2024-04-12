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
import {
  AntDesign,
  Feather,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserData } from "@/features/userSlice";
import CustomUserImage from "@/components/CustomUserImage";
import { fetchBookings } from "@/features/userbookingsSlice";
import * as Haptics from "expo-haptics";
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

const Page = () => {
  const router = useRouter();

  // getting user and bookings with redux
  const dispatch: AppDispatch = useDispatch();
  const { User, Loading, error } = useSelector(
    (state: RootState) => state.user
  );
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
            headerShown: Loading && isLoading ? false : true,
            headerTitleStyle: {
              fontFamily: "popMedium",
            },
            headerBackground: () => <View style={styles.header}></View>,
            headerTransparent: true,
          }}
        />
        {!isLoading &&
          ((Booked && Booked?.length > 0) ||
            (Booking && Booking?.length > 0)) &&
          User && (
            <View style={{ marginTop: 100 }}>
              <View style={{ alignItems: "center", marginTop: Booking && 20 }}>
                <Animated.Text
                  entering={FadeIn}
                  style={[styles.container, styles.title]}
                >
                  My bookings
                </Animated.Text>

                {Booking ? (
                  <Animated.FlatList
                    entering={FadeIn.delay(100)}
                    data={Booking}
                    renderItem={({ item }: { item: Booking }) => (
                      <BookingCard
                        booking={item}
                        isBooking={"Yes"}
                        currentuserid={User.id}
                      />
                    )}
                    keyExtractor={(booking) => booking._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                ) : (
                  <View
                    style={[
                      styles.container,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "popRegular",
                        opacity: 0.6,
                      }}
                    >
                      You have no bookings
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/(tabs)");
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Text
                        style={[
                          styles.btntext,
                          { color: "black", marginTop: 1 },
                        ]}
                      >
                        Explore
                      </Text>
                      <FontAwesome6
                        name="angle-right"
                        size={15}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View
                style={{ alignItems: "center", marginVertical: Booked && 20 }}
              >
                <Animated.Text
                  entering={FadeIn.delay(200)}
                  style={[
                    styles.container,
                    styles.title,
                    { marginTop: Booked ? 0 : 15 },
                  ]}
                >
                  My booked places
                </Animated.Text>

                {Booked ? (
                  <Animated.View
                    entering={FadeIn.delay(300)}
                    style={{ gap: 15 }}
                  >
                    {Booked &&
                      Booked.map((booking: Booking) => (
                        <BookingCard booking={booking} key={booking._id} />
                      ))}
                  </Animated.View>
                ) : (
                  <View style={[styles.container]}>
                    {User.host ? (
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "popRegular",
                          opacity: 0.6,
                        }}
                      >
                        You have no booked places
                      </Text>
                    ) : (
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                        }}
                      >
                        <Text style={styles.btntext}>Start hosting</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
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

      {!isLoading &&
        (!Booked || Booked.length == 0) &&
        (!Booking || Booking.length == 0) &&
        !Loading && (
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
  btn: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    paddingVertical: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },
  btntext: {
    color: "white",
    fontFamily: "popMedium",
  },
});

export default Page;
