import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import axios from "axios";
import styles from "@/components/profile/profile.styles";
import { formatDistanceToNow } from "date-fns";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import PlaceCard from "@/components/profile/PlaceCard";
import Colors from "@/constants/Colors";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, logout } from "@/features/userSlice";
import { RootState } from "@/store/store";
import { ThunkDispatch } from "@reduxjs/toolkit";
import LandingPage from "@/components/profile/LandingPage";

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
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likedBy: string[];
}

const Page = () => {
  const router = useRouter();

  // States
  const [UserPlaces, setUserPlaces] = useState<Place>();
  const [UserLikes, setUserLikes] = useState<Place>();
  const [StartedHosting, setStartedHosting] = useState("Not a Host");
  const [TotalReviews, setTotalReviews] = useState<number>(0);
  const [AverageRating, setAverageRating] = useState("");

  // Redux (User Data)
  type AppDispatch = ThunkDispatch<RootState, unknown, any>;
  const dispatch: AppDispatch = useDispatch();
  const { Loading, User, error } = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // Getting user places and likes
  useEffect(() => {
    const getUserPlaces = async () => {
      if (User) {
        try {
          const { data } = await axios.get(
            `https://roomsy-v3-server.vercel.app/api/placeByowner/${User?.id}`
          );
          setUserPlaces(data);
          if (data && data.length > 0) {
            const dateString = data[0]?.createdAt;
            const date = new Date(dateString);
            setStartedHosting(formatDistanceToNow(date));
          }
        } catch (error) {
          console.log("error getting User Places");
        }
      }
    };

    const getUserLikes = async () => {
      if (User) {
        try {
          const { data } = await axios.get(
            `https://roomsy-v3-server.vercel.app/api/placeBylikes/${User?.id}`
          );
          setUserLikes(data);
        } catch (error) {
          console.log("error getting User Likes");
        }
      }
    };

    getUserPlaces();
    getUserLikes();
  }, [User]);
  useEffect(() => {
    let totalRating = 0;
    let reviewsCount = 0;

    if (Array.isArray(UserPlaces)) {
      UserPlaces.forEach((place) => {
        place.reviews.forEach((review: any) => {
          if (review.rating) {
            totalRating += review.rating;
            reviewsCount++;
          }
        });
      });
    }

    if (reviewsCount > 0) {
      setTotalReviews(reviewsCount);
      setAverageRating((totalRating / reviewsCount).toFixed(2));
    } else {
      setTotalReviews(0);
      setAverageRating("0");
    }
  }, [UserPlaces]);

  // logout
  const logOut = async () => {
    try {
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to log out?",
        [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              await AsyncStorage.setItem(
                "user_session",
                JSON.stringify({
                  number: "",
                  token: "",
                  userId: "",
                })
              );
              dispatch(logout());
              router.replace("/(tabs)/profile");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (e) {
      console.log("Error");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={{ backgroundColor: "#fff" }}>
        {User && (
          <View>
            <View style={styles.container}>
              <View style={styles.UserCard}>
                <View style={styles.logoutBtn}>
                  <TouchableOpacity>
                    <AntDesign name="edit" size={24} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={logOut}>
                    <AntDesign name="logout" size={22} color={"#e83636"} />
                  </TouchableOpacity>
                </View>

                <View style={styles.UserCardTop}>
                  <Image
                    source={{ uri: User?.profilepic }}
                    style={styles.UserCardImg}
                    resizeMode="cover"
                  />
                  <Text style={styles.UserCardTopText}>{User?.fullname}</Text>
                  <Text style={styles.UserCardTopTexthost}>
                    {User?.host && "Host"}
                  </Text>
                </View>

                <View style={styles.UserCardBottom}>
                  <View style={styles.UserCardBottomView}>
                    <Text style={{ fontFamily: "popMedium", fontSize: 15 }}>
                      {TotalReviews}
                    </Text>
                    <Text style={styles.UserCardBottomtext}>Reviews</Text>
                  </View>
                  <View style={styles.UserCardBottomView}>
                    <Text style={{ fontFamily: "popMedium", fontSize: 15 }}>
                      {AverageRating}
                    </Text>
                    <Text style={styles.UserCardBottomtext}>
                      Average Rating
                    </Text>
                  </View>
                  <View style={styles.UserCardBottomView}>
                    <Text style={{ fontFamily: "popMedium", fontSize: 15 }}>
                      {StartedHosting}
                    </Text>
                    <Text style={styles.UserCardBottomtext}>
                      Started Hosting
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoCardtext}>
                  {User?.fullname}'s confirmed informations
                </Text>
                <View
                  style={{
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {User.Superhost ? (
                      <Ionicons
                        name="checkmark-outline"
                        size={15}
                        color="#827f7f"
                      />
                    ) : (
                      <Ionicons
                        name="close-outline"
                        size={17}
                        color="#827f7f"
                      />
                    )}
                    <Text style={styles.infoCardtextsm}>Identity</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {User.Superhost ? (
                      <Ionicons
                        name="checkmark-outline"
                        size={15}
                        color="#827f7f"
                      />
                    ) : (
                      <Ionicons
                        name="close-outline"
                        size={17}
                        color="#827f7f"
                      />
                    )}
                    <Text style={styles.infoCardtextsm}>Email Address</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {User.Superhost ? (
                      <Ionicons
                        name="checkmark-outline"
                        size={15}
                        color="#827f7f"
                      />
                    ) : (
                      <Ionicons
                        name="close-outline"
                        size={17}
                        color="#827f7f"
                      />
                    )}
                    <Text style={styles.infoCardtextsm}>Phone Number</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.containerleft}>
              <View style={styles.about}>
                <Text style={styles.aboutheaderText}>About you</Text>

                <View style={{ gap: 20 }}>
                  <View style={styles.aboutView}>
                    <Ionicons name="briefcase" size={20} color="#827f7f" />
                    <Text style={styles.aboutText}>
                      My job: {User.job ? User.job : "Add your job"}
                    </Text>
                  </View>

                  <View style={styles.aboutView}>
                    <MaterialCommunityIcons
                      name="google-translate"
                      size={21}
                      color="#827f7f"
                    />
                    <Text style={styles.aboutText}>
                      Speaks: {User.lang ? User.lang : "Add your languages"}
                    </Text>
                  </View>
                  <Text style={styles.aboutText}>{User?.bio}</Text>
                </View>
              </View>

              <View style={styles.listingsheader}>
                <Text style={styles.aboutheaderText}>Your listings</Text>
              </View>

              {Array.isArray(UserPlaces) && UserPlaces.length > 0 ? (
                <FlatList
                  data={UserPlaces}
                  renderItem={(place) => <PlaceCard place={place.item} />}
                  keyExtractor={(place) => place._id}
                  contentContainerStyle={{ columnGap: 10 }}
                  style={{ width: "90%" }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.UserCardsbottomtext}>No listings</Text>
              )}

              <View style={styles.listingsheader}>
                <Text style={styles.aboutheaderText}>Your likes</Text>
              </View>

              {UserLikes && Array.isArray(UserLikes) ? (
                <FlatList
                  data={UserLikes}
                  renderItem={(place) => <PlaceCard place={place.item} />}
                  keyExtractor={(place) => place._id}
                  contentContainerStyle={{ columnGap: 10 }}
                  style={{ width: "90%", marginBottom: 10 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.UserCardsbottomtext}>No likes</Text>
              )}
            </View>
          </View>
        )}

        {!User && !Loading && <LandingPage />}

        {Loading && (
          <View style={styles.container}>
            <ActivityIndicator
              size={"large"}
              color={Colors.maincolor}
              style={{ marginTop: 100 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Page;
