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
interface Props {
  PlacesByCat: Place[] | undefined;
  category: string;
  FadeRight: boolean;
  AllPlaces: Place[] | undefined;
  NumberofPlaces: number;
  setAllPlaces: any;
  Loading: boolean;
}

const PlacesBottomSheet = ({
  PlacesByCat,
  category,
  FadeRight,
  AllPlaces,
  NumberofPlaces,
  setAllPlaces,
  Loading,
}: Props) => {
  // refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "100%"], []);
  const listRef = useRef<BottomSheetFlatListMethods>(null);

  // loading
  const [loadingMore, setLoadingMore] = useState(false);
  const [refresh, setrefresh] = useState(0);

  // handling Scroll loading
  const handleEndReached = async () => {
    if (!loadingMore && AllPlaces && AllPlaces?.length < NumberofPlaces) {
      setLoadingMore(true);
      try {
        const startIndex = AllPlaces?.length;
        const endIndex = Math.min(startIndex + 5, NumberofPlaces);

        const { data } = await axios.get(
          "https://roomsy-v3-server.vercel.app/api/places"
        );

        const slicedData = data.slice(startIndex, endIndex);

        setAllPlaces((prevData: any) => [...prevData, ...slicedData]);
      } catch (error) {
        console.log(error);
      }
      setLoadingMore(false);
    }
  };

  // show map
  const ShowMap = () => {
    bottomSheetRef.current?.collapse();
    setrefresh(refresh + 1);
  };

  // Scrolling the list
  useEffect(() => {
    if (refresh) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [refresh]);
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
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
        {category === "All" ? (
          <View style={{ flex: 1 }}>
            {AllPlaces ? (
              <BottomSheetFlatList
                ref={listRef}
                data={AllPlaces}
                renderItem={(place: any) => (
                  <PlacesLg
                    place={place.item}
                    FadeRight={FadeRight}
                    Loading={Loading}
                  />
                )}
                keyExtractor={(place: Place) => place._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 40 }}
                ListHeaderComponent={
                  <Text style={styles.info}>{NumberofPlaces} Places</Text>
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
        ) : (
          <View style={{ flex: 1 }}>
            {PlacesByCat && PlacesByCat.length > 0 ? (
              <BottomSheetFlatList
                ref={listRef}
                data={PlacesByCat}
                renderItem={(place: any) => (
                  <PlacesLg
                    place={place.item}
                    FadeRight={FadeRight}
                    Loading={Loading}
                  />
                )}
                keyExtractor={(place) => place._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 40 }}
                ListHeaderComponent={
                  <Text style={styles.info}>{PlacesByCat?.length} Places</Text>
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
        )}
      </View>

      <View style={styles.mapBtnContainer}>
        <TouchableOpacity style={styles.mapBtn} onPress={ShowMap}>
          <Text style={styles.mapBtnText}>Map</Text>
          <Ionicons name="map-outline" size={18} color="white" />
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
