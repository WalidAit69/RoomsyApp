import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
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
import Animated, { FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import ProfileBottomSheet from "@/components/profile/profileBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  const [isLoading, setisLoading] = useState(false);
  const [Edit, setEdit] = useState(false);
  const [updated, setupdated] = useState(false);

  // Redux (User Data)
  type AppDispatch = ThunkDispatch<RootState, unknown, any>;
  const dispatch: AppDispatch = useDispatch();
  const { Loading, User, error } = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // refetch user on update
  useEffect(() => {
    if (updated) {
      dispatch(fetchUserData());
    }
  }, [updated]);

  // Getting user places and likes
  useEffect(() => {
    const getUserPlaces = async () => {
      if (User) {
        try {
          setisLoading(true);
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
        } finally {
          setisLoading(false);
        }
      }
    };

    const getUserLikes = async () => {
      if (User) {
        try {
          setisLoading(true);
          const { data } = await axios.get(
            `https://roomsy-v3-server.vercel.app/api/placeBylikes/${User?.id}`
          );
          setUserLikes(data);
        } catch (error) {
          console.log("error getting User Likes");
        } finally {
          setisLoading(false);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                <Animated.View entering={FadeIn} style={styles.UserCard}>
                  <View style={styles.logoutBtn}>
                    <TouchableOpacity
                      onPress={() => {
                        setEdit(true);
                      }}
                    >
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
                </Animated.View>

                <Animated.View
                  entering={FadeIn.delay(200)}
                  style={styles.infoCard}
                >
                  <Text style={styles.infoCardtext}>
                    Your confirmed informations
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
                </Animated.View>
              </View>

              <View style={styles.containerleft}>
                <Animated.View
                  entering={FadeIn.delay(300)}
                  style={styles.about}
                >
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
                </Animated.View>
              </View>

              {!isLoading ? (
                <View style={[styles.containerleft, { marginTop: 10 }]}>
                  <Animated.View
                    entering={FadeIn.delay(400)}
                    style={styles.listingsheader}
                  >
                    <Text style={styles.aboutheaderText}>Your listings</Text>
                  </Animated.View>

                  {Array.isArray(UserPlaces) && UserPlaces.length > 0 ? (
                    <Animated.FlatList
                      entering={FadeIn.delay(400)}
                      data={UserPlaces}
                      renderItem={(place) => <PlaceCard place={place.item} />}
                      keyExtractor={(place) => place._id}
                      contentContainerStyle={{ columnGap: 10 }}
                      style={{ width: "90%" }}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  ) : User.host ? (
                    <Animated.Text
                      entering={FadeIn.delay(400)}
                      style={styles.UserCardsbottomtext}
                    >
                      No listings
                    </Animated.Text>
                  ) : (
                    <Animated.View
                      style={{ width: "90%" }}
                      entering={FadeIn.delay(400)}
                    >
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
                    </Animated.View>
                  )}

                  <Animated.View
                    entering={FadeIn.delay(500)}
                    style={styles.listingsheader}
                  >
                    <Text style={styles.aboutheaderText}>Your likes</Text>
                  </Animated.View>

                  {UserLikes && Array.isArray(UserLikes) ? (
                    <Animated.FlatList
                      entering={FadeIn.delay(500)}
                      data={UserLikes}
                      renderItem={(place) => <PlaceCard place={place.item} />}
                      keyExtractor={(place) => place._id}
                      contentContainerStyle={{ columnGap: 10 }}
                      style={{ width: "90%", marginBottom: 10 }}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  ) : (
                    <Animated.View
                      style={{ width: "90%", marginBottom: 10 }}
                      entering={FadeIn.delay(500)}
                    >
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                          router.push("/(tabs)");
                        }}
                      >
                        <Text style={styles.btntext}>Explore</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
              ) : (
                <ActivityIndicator size={"large"} color={Colors.maincolor} />
              )}
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

        {Edit && (
          <ProfileBottomSheet
            setEdit={setEdit}
            profilePic={User?.profilepic}
            userName={User?.fullname}
            job={User?.job}
            lang={User?.lang}
            bio={User?.bio}
            userid={User?.id}
            setupdated={setupdated}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Page;
