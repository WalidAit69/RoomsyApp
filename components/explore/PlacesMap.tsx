import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

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
  const [places, setPlaces] = useState<Place[]>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

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

  const geocodeAddresses = async () => {
    const updatedPlaces: Place[] = [];
    for (const place of AllPlaces) {
      try {
        const addressString = `${place.address}, ${place.city}, ${place.country}`;
        const location = await Location.geocodeAsync(addressString);
        if (location && location.length > 0 && location[0]) {
          updatedPlaces.push({
            ...place,
            latitude: location[0].latitude,
            longitude: location[0].longitude,
          });
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
    }
    setPlaces(updatedPlaces);
  };

  useEffect(() => {
    geocodeAddresses();
  }, [AllPlaces]);

  const onMarkerSelected = (event: Place) => {
    router.push(`/places`);
  };

  const onLocationClicked = () => {
    if (initialRegion) {
      mapRef.current?.animateToRegion(initialRegion);
    } else {
      console.error("Location Disabled");
    }
  };

  return (
    <View>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        initialRegion={initialRegion}
      >
        {places &&
          places.map((place: Place) => (
            <Marker
              key={place._id}
              onPress={() => onMarkerSelected(place)}
              coordinate={{
                latitude: place?.latitude,
                longitude: place?.longitude,
              }}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>${place.price}</Text>
              </View>
            </Marker>
          ))}

        {Platform.OS === "ios" && (
          <TouchableOpacity
            onPress={onLocationClicked}
            style={styles.LocationBtn}
          >
            <FontAwesome6 name="location-arrow" size={22} color="black" />
          </TouchableOpacity>
        )}
      </MapView>
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
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
  },
});
export default PlacesMap;
