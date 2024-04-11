import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import PlacesLg from "./PlacesLg";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { AddtoSlicedPlace, ChangeCategory } from "@/features/placeSlice";
import { useDispatch } from "react-redux";
import * as Haptics from "expo-haptics";

interface review {
  comment: string;
  rating: number;
  userId: string;
  userName: string;
  userPhoto: string;
  _id: string;
  createdAt: string;
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
  likedBy: string[];
  reviews: review[];
  latitude: number;
  longitude: number;
}

interface Props {
  category: string;
  AllPlaces: Place[] | null;
  Place: Place[] | null;
  NumberofPlaces: number | undefined;
  Loading: boolean;
}

const PlacesBottomSheet = ({
  category,
  AllPlaces,
  Loading,
  Place,
  NumberofPlaces,
}: Props) => {
  // refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "100%"], []);
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const dispatch = useDispatch();

  // data
  const [NumberofFilteredPlaces, setNumberofFilteredPlaces] =
    useState<number>(0);

  // loading
  const [loadingMore, setLoadingMore] = useState(false);
  const [refresh, setrefresh] = useState(0);

  // handling Scroll loading
  const handleEndReached = async () => {
    if (
      !loadingMore &&
      AllPlaces &&
      NumberofPlaces &&
      AllPlaces.length < NumberofPlaces
    ) {
      setLoadingMore(true);
      try {
        const startIndex = AllPlaces.length;
        const endIndex = Math.min(startIndex + 5, NumberofPlaces);
        const endIndexfiltered = Math.min(
          startIndex + 5,
          NumberofFilteredPlaces
        );

        const { data } = await axios.get(
          "https://roomsy-v3-server.vercel.app/api/places"
        );

        const slicedData = data.slice(startIndex, endIndex);

        if (Array.isArray(AllPlaces)) {
          const slicedFilteredData = data.slice(startIndex, endIndexfiltered);

          if (category != "All") {
            const filteredData = slicedFilteredData.filter(
              (AllPlaces: Place) => AllPlaces.type === category
            );
            dispatch(AddtoSlicedPlace(filteredData));
          } else {
            dispatch(AddtoSlicedPlace(slicedData));
          }
        } else {
          console.error("AllPlaces is not an array");
        }
      } catch (error) {
        console.log(error);
      }
      setLoadingMore(false);
    }
  };

  // show map
  const ShowMap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetRef.current?.collapse();
    setrefresh(refresh + 1);
  };

  // Scrolling the list
  useEffect(() => {
    if (refresh) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [refresh]);

  // Filtring data and updating state in redux
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    if (category != "All") {
      const filteredPlaces =
        Place &&
        Place.filter((place) => {
          return category === "" || place.type === category;
        });

      setNumberofFilteredPlaces(filteredPlaces?.length || 0);
      dispatch(ChangeCategory(filteredPlaces));
    } else {
      dispatch(ChangeCategory(Place?.slice(0, 5)));
    }
  }, [category]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#cacaca" }}
      index={1}
      style={styles.sheetContainer}
      backgroundStyle={{ backgroundColor: "white" }}
    >
      <View style={{ marginBottom: 0, flex: 1 }}>
        <View style={{ flex: 1 }}>
          {AllPlaces ? (
            <BottomSheetFlatList
              ref={listRef}
              data={AllPlaces}
              renderItem={({ item }) => (
                <PlacesLg
                  place={item}
                  Loading={Loading}
                />
              )}
              keyExtractor={(place: Place) => place._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 40 }}
              ListHeaderComponent={
                <Text style={styles.info}>
                  {category != "All" ? NumberofFilteredPlaces : NumberofPlaces}{" "}
                  Places
                </Text>
              }
              onEndReached={handleEndReached}
              onEndReachedThreshold={1}
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator
                    size="large"
                    color={Colors.maincolor}
                    style={{ marginBottom: 10 }}
                  />
                ) : null
              }
            />
          ) : (
            <ActivityIndicator
              size={"large"}
              color={Colors.maincolor}
              style={{ marginTop: 50 }}
            />
          )}
        </View>
      </View>

      <View style={styles.mapBtnContainer}>
        <TouchableOpacity style={styles.mapBtn} onPress={ShowMap}>
          <Text style={styles.mapBtnText}>Map</Text>
          <Ionicons name="map" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  mapBtnContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  mapBtn: {
    backgroundColor: "black",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    gap: 5,
    width: 110,
  },
  mapBtnText: {
    color: "white",
    fontFamily: "popSemibold",
    fontSize: 16,
  },
  sheetContainer: {
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  info: {
    textAlign: "center",
    fontFamily: "popSemibold",
    fontSize: 16,
    marginTop: 4,
  },
});

export default PlacesBottomSheet;
