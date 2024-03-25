import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import PlacesLg from "./PlacesLg";
import BottomSheet from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

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

interface Props {
  AllPlaces: Place[] | undefined;
  PlacesByCat: Place[] | undefined;
  category: string;
  FadeRight: boolean;
}

const PlacesBottomSheet = ({
  AllPlaces,
  PlacesByCat,
  category,
  FadeRight,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "100%"], []);
  const [refresh, setrefresh] = useState(0);
  const listRef = useRef<FlatList>(null);

  const ShowMap = () => {
    bottomSheetRef.current?.collapse();
    setrefresh(refresh + 1);
  };

  useEffect(() => {
    if (refresh) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [refresh]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#cacaca" }}
      index={1}
      style={styles.sheetContainer}
      backgroundStyle={{ backgroundColor: Colors.backgoundcolor }}
    >
      <View style={{ marginTop: 0 }}>
        {category === "All" ? (
          <FlatList
            ref={listRef}
            data={AllPlaces}
            renderItem={(place) => (
              <PlacesLg place={place.item} FadeRight={FadeRight} />
            )}
            keyExtractor={(place) => place._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 40 }}
            ListHeaderComponent={
              <Text style={styles.info}>{AllPlaces?.length} Places</Text>
            }
          />
        ) : (
          <FlatList
            ref={listRef}
            data={PlacesByCat}
            renderItem={(place) => (
              <PlacesLg place={place.item} FadeRight={FadeRight} />
            )}
            keyExtractor={(place) => place._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 40 }}
            ListHeaderComponent={
              <Text style={styles.info}>{PlacesByCat?.length} Places</Text>
            }
          />
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
    backgroundColor: Colors.backgoundcolor,
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
