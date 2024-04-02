import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Share,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import CustomImage from "@/components/CustomImage";
import axios from "axios";
import {
  AntDesign,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { styles } from "./Place.styles";
import ReviewCard from "@/components/Listings/ReviewCard";
import CustomUserImage from "@/components/CustomUserImage";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import PlaceSmCard from "@/components/Listings/PlaceSmCard";
import Carousel from "pinar";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

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
  reviews: review[];
}

interface review {
  comment: string;
  rating: number;
  userId: string;
  userName: string;
  userPhoto: string;
  _id: string;
}

const Page = () => {
  const IMG_HEIGHT = 500;

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [HomeLocation, setHomeLocation] =
    useState<Location.LocationGeocodedLocation[]>();
  const mapRef = useRef<MapView>(null);

  const [Place, setPlace] = useState<Place>();
  const [AllPlaces, setAllPlaces] = useState<Place[]>();

  const GetPlace = async () => {
    try {
      const { data } = await axios.get(
        `https://roomsy-v3-server.vercel.app/api/place/${id}`
      );
      setPlace(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLocation = async () => {
    const addressString = `${Place?.address}, ${Place?.city}, ${Place?.country}`;
    const location = await Location.geocodeAsync(addressString);
    setHomeLocation(location);
  };

  const GetAllPlaces = async () => {
    try {
      const { data } = await axios.get(
        "https://roomsy-v3-server.vercel.app/api/places"
      );
      const updatedPlaces = data.filter((place: Place) => place._id !== id);
      setAllPlaces(updatedPlaces);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetPlace();
    GetAllPlaces();
  }, []);

  useEffect(() => {
    getLocation();
  }, [Place]);

  useEffect(() => {
    if (HomeLocation && HomeLocation.length > 0) {
      mapRef.current?.animateToRegion({
        latitude: HomeLocation[0].latitude,
        longitude: HomeLocation[0].longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [HomeLocation]);

  const CalculateAverageRating = () => {
    if (Place) {
      if (!Place.reviews || Place.reviews.length === 0) {
        return 0;
      }

      const totalRating = Place.reviews.reduce(
        (acc: number, review: { rating: number }) => acc + review.rating,
        0
      );
      return totalRating / Place.reviews.length;
    }
  };

  const PlaceRating = CalculateAverageRating();

  function checkIfPerkExists(perks: string[], perk: string) {
    return perks && perks.includes(perk);
  }

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

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

  const sharePlace = async () => {
    try {
      await Share.share({
        title: Place?.title,
        url: `https://roomsy-v2.vercel.app/place/${Place?._id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
              <TouchableOpacity style={styles.headerright} onPress={sharePlace}>
                <Feather name="share-2" size={20} color="black" />
                <Text style={styles.headerrightText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.headerright}>
                <AntDesign name="hearto" size={20} color="black" />
                <Text style={styles.headerrightText}>Like</Text>
              </TouchableOpacity>
            </View>
          ),
          headerTransparent: true,
          headerShown: Place ? true : false,
          headerBackground: () => (
            <Animated.View style={[headerAnimatedStyle, styles.header]} />
          ),
        }}
      />

      {Place ? (
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
              {Place.images.map((image, index) => (
                <Animated.Image
                  key={index}
                  source={{
                    uri: image.includes("https://")
                      ? image
                      : "https://roomsy-v3-server.vercel.app/server/routes/uploads/" +
                        image,
                  }}
                  resizeMode="cover"
                  style={[
                    { width: "100%", height: "100%" },
                    imageAnimatedStyle,
                  ]}
                />
              ))}
            </Carousel>
          </View>

          <View style={styles.Textcontainer}>
            <Text style={styles.title}>{Place?.title}</Text>

            <View style={styles.rowcontainer}>
              <View style={styles.row}>
                <AntDesign name="star" size={15} color={Colors.maincolor} />
                <Text style={styles.rating}>{PlaceRating?.toFixed(1)}</Text>
                <Text style={styles.reviewslocation}>
                  ({Place?.reviews.length} Reviews)
                </Text>
              </View>

              <View style={styles.row}>
                <FontAwesome6
                  name="location-dot"
                  size={15}
                  color={Colors.maincolor}
                />

                <Text numberOfLines={1} style={{ marginLeft: 4, opacity: 0.7 }}>
                  {Place?.city},{Place?.country}
                </Text>
              </View>
            </View>

            <View style={styles.hostContainer}>
              <View style={styles.hostinfo}>
                <View>
                  <Text style={styles.hostText}>{Place?.type} hosted</Text>
                  <Text style={styles.hostText}>by {Place.owner.fullname}</Text>
                </View>

                <TouchableOpacity>
                  <CustomUserImage
                    source={Place.owner.profilepic}
                    resizeMode="cover"
                    style={styles.hostimage}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.placeinfo}>
                {Place.type} · {Place.bedrooms} Bedrooms · {Place.bathrooms}{" "}
                Bathrooms
              </Text>
            </View>
          </View>

          <View style={styles.InfoContainer}>
            <View style={{ width: "92%" }}>
              <View style={styles.availability}>
                <View style={styles.pricecontainer}>
                  <Text style={styles.rating}>${Place.price}/ night</Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign name="star" size={15} color={Colors.maincolor} />
                    <Text style={styles.rating}>{PlaceRating?.toFixed(1)}</Text>
                    <Text style={styles.reviewslocation}>
                      ({Place?.reviews.length} Reviews)
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.availabilitybtn}>
                  <Text style={styles.availabilitybtntext}>
                    Check Availability
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.amenities}>
                <View style={styles.perkContainer}>
                  <MaterialIcons
                    name="cleaning-services"
                    size={24}
                    color="black"
                    style={{ marginTop: 2 }}
                  />
                  <View style={styles.perk}>
                    <Text style={styles.perktitle}>Enhanced Clean</Text>
                    <Text style={styles.perkdesc}>
                      This host commited to Roomsy's 5-step enhanced cleaning
                      process.
                    </Text>
                  </View>
                </View>

                <View style={styles.perkContainer}>
                  <Ionicons
                    name="warning-outline"
                    size={24}
                    color="black"
                    style={{ marginTop: 2 }}
                  />
                  <View style={styles.perk}>
                    <Text style={styles.perktitle}>House rules</Text>
                    <Text style={styles.perkdesc}>
                      Please check-in before {Place.checkIn}
                    </Text>
                    <Text style={styles.perkdesc}>
                      Please check-out before {Place.checkOut}
                    </Text>
                    <Text style={styles.perkdesc}>
                      Max number of guests {Place.maxGuests}
                    </Text>
                  </View>
                </View>

                <View style={styles.perkContainer}>
                  <Feather
                    name="phone"
                    size={24}
                    color="black"
                    style={{ marginTop: 2 }}
                  />
                  <View style={styles.perk}>
                    <Text style={styles.perktitle}>Host Phone Number</Text>
                    <Text style={styles.perkdesc}>{Place.owner.phone}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.amenities}>
                <Text numberOfLines={5} style={styles.descriptiontext}>
                  {Place.description}
                </Text>
                <TouchableOpacity style={styles.descriptionbtn}>
                  <Text style={styles.descriptionbtntext}>Show more</Text>
                  <Feather name="chevron-right" size={14} color="black" />
                </TouchableOpacity>
              </View>

              <View style={styles.amenities}>
                <Text style={styles.arrangementsTitle}>House arrangements</Text>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{ gap: 20 }}
                >
                  <View style={styles.arrangementCard}>
                    <Ionicons name="bed-outline" size={26} color="gray" />

                    <Text style={styles.arrangementCardTitle}>
                      {Place.bedrooms} Bedrooms
                    </Text>
                    <Text style={styles.arrangementCardSubtitle}>
                      {Place.bedrooms > 3 ? "2 King beds" : "1 King bed"}
                    </Text>
                  </View>

                  <View style={styles.arrangementCard}>
                    <MaterialCommunityIcons
                      name="bathtub-outline"
                      size={26}
                      color="gray"
                    />

                    <Text style={styles.arrangementCardTitle}>
                      {Place.bathrooms} Bathrooms
                    </Text>
                  </View>

                  <View style={styles.arrangementCard}>
                    <MaterialCommunityIcons
                      name="room-service-outline"
                      size={26}
                      color="gray"
                    />

                    <Text style={styles.arrangementCardTitle}>
                      {Place.livingRooms} Living rooms
                    </Text>
                  </View>

                  <View style={styles.arrangementCard}>
                    <MaterialIcons name="kitchen" size={26} color="gray" />

                    <Text style={styles.arrangementCardTitle}>
                      {Place.kitchens} kitchens
                    </Text>
                  </View>
                </ScrollView>
              </View>

              <View style={styles.amenities}>
                <Text style={styles.arrangementsTitle}>Amenities</Text>

                {Place?.livingRooms >= 1 && (
                  <View style={styles.perkContainer}>
                    <AntDesign
                      name="home"
                      size={24}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                    <View style={styles.perk}>
                      <Text style={styles.perktitle}>Entire house</Text>
                      <Text style={styles.perkdesc}>
                        You'll have the house to yourself
                      </Text>
                    </View>
                  </View>
                )}

                {checkIfPerkExists(Place.perks, "wifi") && (
                  <View style={styles.perkContainer}>
                    <AntDesign
                      name="wifi"
                      size={24}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                    <View style={styles.perk}>
                      <Text style={styles.perktitle}>Wifi</Text>
                      <Text style={styles.perkdesc}>
                        Guests often search for this popular amenity
                      </Text>
                    </View>
                  </View>
                )}

                {checkIfPerkExists(Place.perks, "parking") && (
                  <View style={styles.perkContainer}>
                    <Ionicons
                      name="car-sport-outline"
                      size={24}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                    <View style={styles.perk}>
                      <Text style={styles.perktitle}>Parking</Text>
                      <Text style={styles.perkdesc}>
                        Free parking on premises
                      </Text>
                    </View>
                  </View>
                )}

                {checkIfPerkExists(Place.perks, "tv") && (
                  <View style={styles.perkContainer}>
                    <Ionicons
                      name="tv-outline"
                      size={24}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                    <View style={styles.perk}>
                      <Text style={styles.perktitle}>TV</Text>
                    </View>
                  </View>
                )}

                {checkIfPerkExists(Place.perks, "pets") && (
                  <View style={styles.perkContainer}>
                    <Ionicons
                      name="paw-outline"
                      size={24}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                    <View style={styles.perk}>
                      <Text style={styles.perktitle}>pets</Text>
                      <Text style={styles.perkdesc}>Pets allowed</Text>
                    </View>
                  </View>
                )}

                {checkIfPerkExists(Place.perks, "fitness") && (
                  <View style={styles.perkContainer}>
                    <Ionicons
                      name="barbell-outline"
                      size={24}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                    <View style={styles.perk}>
                      <Text style={styles.perktitle}>Gym</Text>
                      <Text style={styles.perkdesc}>
                        Private gym access and exercise equipment
                      </Text>
                    </View>
                  </View>
                )}

                {checkIfPerkExists(Place.perks, "privateentrance") && (
                  <View style={styles.perkContainer}>
                    <MaterialCommunityIcons
                      name="door-sliding"
                      size={24}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                    <View style={styles.perk}>
                      <Text style={styles.perktitle}>privateentrance</Text>
                      <Text style={styles.perkdesc}>
                        You'll have a private entrance to yourself
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.amenities}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.arrangementsTitle}>Reviews</Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign name="star" size={15} color={Colors.maincolor} />
                    <Text style={styles.rating}>{PlaceRating?.toFixed(1)}</Text>
                    <Text style={styles.reviewslocation}>
                      ({Place?.reviews.length} Reviews)
                    </Text>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10 }}
                >
                  {Place.reviews.length > 0 ? (
                    Place.reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))
                  ) : (
                    <Text
                      style={{
                        fontFamily: "popMedium",
                        fontSize: 16,
                        marginTop: 10,
                        opacity: 0.7,
                      }}
                    >
                      No reviews
                    </Text>
                  )}
                </ScrollView>
              </View>

              <View style={[styles.amenities, { borderBottomWidth: 0 }]}>
                <Text style={styles.arrangementsTitle}>Location</Text>

                <View>
                  {HomeLocation && HomeLocation.length > 0 && (
                    <MapView ref={mapRef} style={styles.MiniMap}>
                      <Marker
                        key={Place._id}
                        coordinate={{
                          latitude: HomeLocation && HomeLocation[0].latitude,
                          longitude: HomeLocation && HomeLocation[0].longitude,
                        }}
                      >
                        <View style={styles.HomeOuterContainer}>
                          <View style={styles.HomeContainer}>
                            <FontAwesome6
                              name="house-chimney"
                              size={16}
                              color="white"
                            />
                          </View>
                        </View>
                      </Marker>
                    </MapView>
                  )}
                </View>

                {!HomeLocation && !Place.extrainfo && (
                  <Text
                    style={{
                      fontFamily: "popMedium",
                      fontSize: 16,
                      marginTop: 10,
                      opacity: 0.7,
                    }}
                  >
                    No Location
                  </Text>
                )}

                {Place.extrainfo && (
                  <View>
                    <Text
                      numberOfLines={5}
                      style={{
                        fontFamily: "popRegular",
                        fontSize: 15,
                        marginTop: 10,
                        opacity: 0.7,
                      }}
                    >
                      {Place.extrainfo}
                    </Text>

                    {Place.extrainfo.length > 200 && (
                      <TouchableOpacity style={styles.descriptionbtn}>
                        <Text style={styles.descriptionbtntext}>Show more</Text>
                        <Feather name="chevron-right" size={14} color="black" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.MorePlacesContainer}>
              <Text
                style={[styles.arrangementsTitle, { marginHorizontal: 10 }]}
              >
                More places to stay
              </Text>

              <FlatList
                data={AllPlaces}
                renderItem={(place) => <PlaceSmCard place={place.item} />}
                keyExtractor={(place) => place._id}
                horizontal
                contentContainerStyle={{ gap: 10 }}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      ) : (
        <ActivityIndicator
          size={"large"}
          color={Colors.maincolor}
          style={{ marginTop: 100 }}
        />
      )}
    </Animated.ScrollView>
  );
};

export default Page;
