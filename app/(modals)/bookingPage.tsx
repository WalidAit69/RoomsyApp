import {
  View,
  Text,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Carousel from "pinar";
import CustomUserImage from "@/components/CustomUserImage";
import { differenceInCalendarDays } from "date-fns";
import { styles } from "./bookingPage.styles";
import StarRating from "react-native-star-rating-widget";
import axios from "axios";
import UseToast from "@/widgets/Toast";
import { RootSiblingParent } from "react-native-root-siblings";

const bookingPage = () => {
  const IMG_HEIGHT = 500;

  // data
  const {
    placeimages,
    placetitle,
    placeadress,
    username,
    userphoto,
    useremail,
    usernumber,
    userbio,
    usercreated,
    placeid,
    userid,
    checkin,
    checkout,
    fullprice,
    halfprice,
    isbooking,
    currentUserid,
  } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [error, seterror] = useState("");
  const [comment, setcomment] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const router = useRouter();

  // REFS
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const sharePlace = async () => {
    try {
      await Share.share({
        title: placetitle.toString(),
        url: `https://roomsy-v2.vercel.app/place/${placeid}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Animations
  const scrollOffset = useScrollViewOffset(scrollRef);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
      ],
    };
  });
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.2], [0, 1]),
    };
  });

  // caroussel
  const filenamesArray = placeimages.toString().split(",");
  const imageObjects = filenamesArray.map((filename, index) => ({
    id: index + 1,
    filename: filename,
  }));

  // dates
  let numberofDays = 0;
  if (checkin && checkout) {
    numberofDays = differenceInCalendarDays(
      new Date(checkout.toString()),
      new Date(checkin.toString())
    );
  }
  function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  }

  // navigation
  const handleNavigate = () => {
    if (currentUserid === userid) {
      router.push("/profile");
    } else {
      router.push(`/userpage/${userid}`);
    }
  };

  // handling review post
  const handleReview = async () => {
    if (!comment || comment.length < 20) {
      seterror("Review must be atleast 20 characters");
    } else if (!rating) {
      seterror("Add rating");
    } else {
      try {
        setisLoading(true);
        await axios.post(
          `https://roomsy-v3-server.vercel.app/api/reviews/${placeid}/${currentUserid}`,
          {
            comment: comment,
            rating: rating,
          }
        );
        UseToast({ msg: "Review posted" || "Review posted" });
        setRating(0);
        setcomment("");
      } catch (error) {
        console.log(error);
      } finally {
        setisLoading(false);
      }
    }
  };
  useEffect(() => {
    if (comment && comment.length > 20) {
      seterror("");
    }
    if (rating) {
      seterror("");
    }
  }, [comment, rating]);

  return (
    <RootSiblingParent>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Stack.Screen
          options={{
            headerTitle: "",
            headerLeft: () => (
              <TouchableOpacity
                style={styles.headerleft}
                onPress={() => router.back()}
              >
                <AntDesign name="arrowleft" size={20} color="black" />
                <Text style={styles.headerleftText}>GO BACK</Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View
                style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
              >
                <TouchableOpacity
                  style={styles.headerright}
                  onPress={sharePlace}
                >
                  <Feather name="share-2" size={20} color="black" />
                  <Text style={styles.headerrightText}>Share</Text>
                </TouchableOpacity>
              </View>
            ),
            headerTransparent: true,
            headerShown: placeimages && Platform.OS == "android" ? true : false,
            headerBackground: () => (
              <Animated.View style={[headerAnimatedStyle, styles.header]} />
            ),
          }}
        />

        {placeimages ? (
          <View style={styles.container}>
            <View style={styles.Images}>
              <Carousel
                showsControls={false}
                autoplay={true}
                autoplayInterval={3000}
                loop
                style={{ width: "100%", height: "100%" }}
                dotStyle={styles.dots}
                activeDotStyle={styles.activedot}
                dotsContainerStyle={styles.dotscontainer}
              >
                {imageObjects &&
                  imageObjects.map(
                    (image: { filename: string }, index: number) => (
                      <Animated.Image
                        key={index}
                        source={{
                          uri: image.filename.includes("https://")
                            ? image.filename
                            : "https://roomsy-v3-server.vercel.app/server/routes/uploads/" +
                              image.filename,
                        }}
                        resizeMode="cover"
                        style={[
                          { width: "100%", height: "100%" },
                          imageAnimatedStyle,
                        ]}
                      />
                    )
                  )}
              </Carousel>
              {Platform.OS == "ios" && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 15,
                    alignItems: "center",
                    position: "absolute",
                    right: 20,
                    top: 30,
                  }}
                >
                  <TouchableOpacity
                    style={styles.headerright}
                    onPress={sharePlace}
                  >
                    <Feather name="share-2" size={20} color="black" />
                    <Text style={styles.headerrightText}>Share</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.Textcontainer}>
              <Text style={styles.title}>{placetitle}</Text>

              <View style={styles.rowcontainer}>
                <View style={styles.row}>
                  <FontAwesome6
                    name="location-dot"
                    size={15}
                    color={Colors.maincolor}
                  />

                  <Text
                    numberOfLines={1}
                    style={{ marginLeft: 4, opacity: 0.7 }}
                  >
                    {placeadress}
                  </Text>
                </View>
              </View>

              <View style={[styles.amenities]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={[styles.rowcheck, { gap: 8 }]}>
                    <Text style={styles.textlight}>{numberofDays} nights:</Text>
                    <View style={[styles.rowcheck, { gap: 4 }]}>
                      <FontAwesome5
                        name="plane-departure"
                        style={styles.textlight}
                      />
                      <Text style={styles.textlight}>
                        {formatDate(checkin.toString())}
                      </Text>
                    </View>
                    <AntDesign name="arrowright" style={styles.textlight} />
                    <View style={[styles.rowcheck, { gap: 4 }]}>
                      <FontAwesome5
                        name="plane-arrival"
                        style={styles.textlight}
                      />
                      <Text style={styles.textlight}>
                        {formatDate(checkout.toString())}
                      </Text>
                    </View>
                  </View>

                  {fullprice && (
                    <Text style={styles.textdark}>${fullprice}</Text>
                  )}
                  {halfprice && (
                    <Text style={styles.textdark}>${+halfprice}</Text>
                  )}
                </View>
                {halfprice && (
                  <Text
                    style={[
                      styles.textdark,
                      {
                        marginTop: 10,
                        fontSize: 12,
                        opacity: 0.5,
                      },
                    ]}
                  >
                    {isbooking ? "You" : username} only paid half price, The
                    rest (${halfprice}) will be automatically charged to the
                    same payment method on {formatDate(checkout.toString())} !
                  </Text>
                )}
              </View>

              <View style={styles.hostContainer}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <Text style={[styles.hostText, { maxWidth: "80%" }]}>
                      meet your {isbooking ? "host" : "customer"} {username}
                    </Text>

                    <TouchableOpacity onPress={handleNavigate}>
                      <CustomUserImage
                        source={userphoto.toString()}
                        resizeMode="cover"
                        style={styles.hostimage}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 15, gap: 10 }}>
                    <Text style={styles.textlight}>{userbio}</Text>
                    <Text style={styles.textlight}>
                      Member since {formatDate(usercreated.toString())}
                    </Text>
                    <Text style={styles.textlight}>
                      You can reach out to {useremail} if you have any questions
                      or need assistance during your stay. Additionally, you can
                      contact {usernumber} for immediate support.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {isbooking && (
              <View style={styles.InfoContainer}>
                <View style={{ width: "92%" }}>
                  <View style={[styles.amenities, { borderBottomWidth: 0 }]}>
                    <Text style={styles.reviewtitle}>Leave a review</Text>

                    <View style={{ marginTop: 15, marginBottom: 5 }}>
                      <Text style={styles.errortext}>{error}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Write your review"
                        multiline
                        onChangeText={setcomment}
                      />
                    </View>

                    <StarRating
                      rating={rating}
                      onChange={setRating}
                      color={Colors.maincolor}
                      enableHalfStar={false}
                      starSize={28}
                    />
                    <TouchableOpacity
                      style={styles.reviewbtn}
                      onPress={handleReview}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size={"small"} color={"white"} />
                      ) : (
                        <Text style={styles.reviewbtntext}>Submit Review</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          <ActivityIndicator
            size={"large"}
            color={Colors.maincolor}
            style={{ marginTop: 100 }}
          />
        )}
      </Animated.ScrollView>
    </RootSiblingParent>
  );
};

export default bookingPage;
