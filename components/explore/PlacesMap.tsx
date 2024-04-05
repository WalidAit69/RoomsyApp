import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import Carousel from "pinar";
import Colors from "@/constants/Colors";

interface InitialRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
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
  latitude: number;
  longitude: number;
}

const PlacesMap = ({ AllPlaces }: any) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [initialRegion, setinitialRegion] = useState<InitialRegion>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [SelectedPlace, setSelectedPlace] = useState<Place>();

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const initialRegion = {
        latitude: location ? location?.coords.latitude : 33.58831,
        longitude: location ? location?.coords.longitude : -7.61138,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

      setinitialRegion(initialRegion);
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const onLocationClicked = () => {
    if (initialRegion) {
      mapRef.current?.animateToRegion(initialRegion);
    } else {
      console.error("Location Disabled");
    }
  };

  const onMarkerSelected = (event: Place) => {
    setSelectedPlace(event);
  };

  return (
    <View>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        initialRegion={initialRegion}
        showsMyLocationButton={false}
      >
        {AllPlaces &&
          AllPlaces.map((place: Place) => (
            <Marker
              key={place._id}
              onPress={() => onMarkerSelected(place)}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>${place.price}</Text>
              </View>
            </Marker>
          ))}
      </MapView>

      {SelectedPlace && (
        <Animated.View entering={FadeInDown} style={{ alignItems: "center" }}>
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => router.push(`/listing/${SelectedPlace._id}`)}
            >
              <Carousel
                showsControls={false}
                autoplay={true}
                autoplayInterval={3000}
                loop
                style={styles.cardimg}
                dotStyle={styles.dots}
                activeDotStyle={styles.activedot}
                dotsContainerStyle={styles.dotscontainer}
              >
                {SelectedPlace.images.slice(0, 5).map((image, index) => (
                  <Animated.Image
                    key={index}
                    source={{
                      uri: image.includes("https://")
                        ? image
                        : "https://roomsy-v3-server.vercel.app/server/routes/uploads/" +
                          image,
                    }}
                    resizeMode="cover"
                    style={styles.cardimg}
                  />
                ))}
              </Carousel>
              <TouchableOpacity
                style={styles.cardcancel}
                onPress={() => setSelectedPlace(undefined)}
              >
                <AntDesign
                  name="closecircleo"
                  size={24}
                  color={Colors.maincolor}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            <View style={styles.cardtextcontainer}>
              <Text style={styles.cardcity}>
                {SelectedPlace?.city}, {SelectedPlace?.country}
              </Text>
              <Text style={styles.cardtype}>{SelectedPlace?.type}</Text>
              <Text style={styles.cardprice}>
                ${SelectedPlace?.price}/night
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={onLocationClicked}
        style={[styles.LocationBtn]}
      >
        <Text>
          <FontAwesome6 name="location-arrow" size={22} color="black" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  marker: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  markerText: {
    fontFamily: "popSemibold",
    fontSize: 13,
  },
  LocationBtn: {
    backgroundColor: "white",
    position: "absolute",
    right: 10,
    top: 10,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  card: {
    position: "absolute",
    bottom: 70,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardimg: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardtextcontainer: {
    padding: 10,
    paddingLeft: 15,
  },
  cardcity: {
    fontFamily: "popMedium",
    fontSize: 15,
  },
  cardtype: {
    fontFamily: "popRegular",
    opacity: 0.5,
  },
  cardprice: {
    fontFamily: "popMedium",
    fontSize: 13,
    marginTop: 5,
  },
  cardcancel: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  dots: {
    width: 5,
    height: 3,
    marginHorizontal: 3,
    borderRadius: 3,
    backgroundColor: Colors.backgoundcolor,
  },
  activedot: {
    backgroundColor: Colors.maincolor,
    width: 10,
    height: 3,
    marginHorizontal: 3,
    borderRadius: 3,
  },
  dotscontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    flexWrap: "wrap",
    marginHorizontal: 5,
    rowGap: 5,
  },
});
export default PlacesMap;
