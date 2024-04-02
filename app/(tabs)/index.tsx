import { SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/explore/ExploreHeader";
import axios from "axios";
import PlacesMap from "@/components/explore/PlacesMap";
import PlacesBottomSheet from "@/components/explore/PlacesBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Page = () => {
  const [category, setcategory] = useState("All");
  const [FadeRight, setFadeRight] = useState(false);
  const [AllPlaces, setAllPlaces] = useState();
  const [PlacesByCat, setPlacesByCat] = useState();
  const [Loading, setLoading] = useState(false);

  const getPlaces = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://roomsy-v3-server.vercel.app/api/places"
      );
      setAllPlaces(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getPlacesByCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://roomsy-v3-server.vercel.app/api/placesByType/${category}`
      );
      setPlacesByCat(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onCategoryChanged = (category: string) => {
    setcategory(category);
  };

  useEffect(() => {
    getPlacesByCategory();
  }, [category]);

  useEffect(() => {
    getPlaces();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <Stack.Screen
          options={{
            header: () => (
              <ExploreHeader
                onCategoryChanged={onCategoryChanged}
                setFadeRight={setFadeRight}
              />
            ),
          }}
        />

        <PlacesMap AllPlaces={AllPlaces} />

        <PlacesBottomSheet
          AllPlaces={AllPlaces}
          PlacesByCat={PlacesByCat}
          category={category}
          FadeRight={FadeRight}
          Loading={Loading}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Page;
