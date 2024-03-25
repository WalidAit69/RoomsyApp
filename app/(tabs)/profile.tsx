import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useRouter } from "expo-router";
import axios from "axios";
import styles from "@/components/profile/profile.styles";
import { formatDistanceToNow } from "date-fns";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import PlaceCard from "@/components/PlaceCard";
import Colors from "@/constants/Colors";

interface User {
  id: string;
  email: string;
  password: string;
  fullname: string;
  phone: string;
  bio: string;
  job: string;
  lang: string;
  location: string;
  profilepic: string;
  createdAt: string; // Assuming ISO 8601 format
  updatedAt: string; // Assuming ISO 8601 format
  __v: number;
  host: boolean;
  Superhost: boolean;
  followers: string[]; // Assuming followers are user IDs
  likedPosts: string[]; // Assuming likedPosts are post IDs
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
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likedBy: string[];
}

const Page = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<{ userId: string } | null>(null);
  const [User, setUser] = useState<User>();
  const [UserPlaces, setUserPlaces] = useState<Place>();
  const [UserLikes, setUserLikes] = useState<Place>();
  const [StartedHosting, setStartedHosting] = useState("Not a Host");
  const [TotalReviews, setTotalReviews] = useState<number>(0);
  const [AverageRating, setAverageRating] = useState("");

  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("user_session");
        const data = jsonValue != null ? JSON.parse(jsonValue) : null;
        setUserData(data);
      } catch (error) {
        console.log("Error getting data:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://roomsy-v3-server.vercel.app/api/user/${userData?.userId}`
        );
        setUser(data);
      } catch (error) {
        console.log("error getting User");
      } finally {
        setLoading(false);
      }
    };

    const getUserPlaces = async () => {
      try {
        const { data } = await axios.get(
          `https://roomsy-v3-server.vercel.app/api/placeByowner/${userData?.userId}`
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
    };

    const getUserLikes = async () => {
      try {
        const { data } = await axios.get(
          `https://roomsy-v3-server.vercel.app/api/placeBylikes/${userData?.userId}`
        );
        setUserLikes(data);
      } catch (error) {
        console.log("error getting User Likes");
      }
    };

    getUser();
    getUserPlaces();
    getUserLikes();
  }, [userData]);

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

  const logOut = async () => {
    try {
      await AsyncStorage.setItem(
        "user_session",
        JSON.stringify({
          number: "",
          token: "",
          userId: "",
        })
      );
      setUserData(null);
      setUser(undefined);
      router.push("/(tabs)");
    } catch (e) {
      console.log("Error");
    }
  };

  const isUser = userData?.userId === User?.id;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView>
        <Link href={"/(modals)/login"} style={styles.container}>
          Login
        </Link>

        {User && (
          <View>
            <View style={styles.container}>
              {userData?.userId && (
                <TouchableOpacity onPress={logOut}>
                  <Text>Log out</Text>
                </TouchableOpacity>
              )}

              <View style={styles.UserCard}>
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
                    <Text style={{ fontFamily: "popMedium" }}>
                      {TotalReviews}
                    </Text>
                    <Text style={styles.UserCardBottomtext}>Reviews</Text>
                  </View>
                  <View style={styles.UserCardBottomView}>
                    <Text style={{ fontFamily: "popMedium" }}>
                      {AverageRating}
                    </Text>
                    <Text style={styles.UserCardBottomtext}>
                      Average Rating
                    </Text>
                  </View>
                  <View style={styles.UserCardBottomView}>
                    <Text style={{ fontFamily: "popMedium" }}>
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
                  {User.fullname}'s confirmed informations
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
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
                <Text style={styles.aboutheaderText}>
                  {isUser ? "About you" : `About ${User.fullname}`}
                </Text>

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
                <Text style={styles.aboutheaderText}>
                  {!isUser ? `${User.fullname}'s listings` : "Your listings"}
                </Text>
              </View>

              {Array.isArray(UserPlaces) && UserPlaces.length > 0 ? (
                <FlatList
                  data={UserPlaces}
                  renderItem={(place) => <PlaceCard place={place} />}
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
                <Text style={styles.aboutheaderText}>
                  {!isUser ? `${User.fullname}'s likes` : "Your likes"}
                </Text>
              </View>

              {UserLikes && Array.isArray(UserLikes) ? (
                <FlatList
                  data={UserLikes}
                  renderItem={(place) => <PlaceCard place={place} />}
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

        {Loading && (
          <View style={styles.container}>
            <ActivityIndicator size={"large"} color={Colors.maincolor} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;
