import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import UseToast from "@/widgets/Toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchLocation } from "@/features/userLocation";
import PlaceCard from "../PlaceCard";

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
  // reviews: review[];
  latitude: number;
  longitude: number;
}

const PlacesMap = ({ AllPlaces }: { AllPlaces: Place[] | null }) => {
  // getting user location with redux
  const dispatch: AppDispatch = useDispatch();
  const { location } = useSelector((state: RootState) => state.loaction);
  useEffect(() => {
    dispatch(fetchLocation());
  }, []);

  // refs
  const mapRef = useRef<MapView>(null);

  // data
  const [SelectedPlace, setSelectedPlace] = useState<Place>();

  // handle Location Button
  const onLocationClicked = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (location) {
      mapRef.current?.animateToRegion(location);
    } else {
      UseToast({ msg: "Location disabled" || "Location disabled" });
    }
  };

  // handle marker select
  const onMarkerSelected = (event: Place) => {
    setSelectedPlace(event);
  };

  return (
    <View>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        initialRegion={location}
        showsMyLocationButton={false}
      >
        {AllPlaces &&
          AllPlaces.map((place: Place) => (
            <Marker
              key={place._id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onMarkerSelected(place);
              }}
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
        <PlaceCard
          SelectedPlace={SelectedPlace}
          setSelectedPlace={setSelectedPlace}
          isMap={true}
        />
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
