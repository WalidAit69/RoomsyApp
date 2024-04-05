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
  const [NumberofPlaces, setNumberofPlaces] = useState(0);
  const [SlicedPlaces, setSlicedPlaces] = useState();

  // get all places
  const getPlaces = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://roomsy-v3-server.vercel.app/api/places"
      );
      setAllPlaces(data);
      setSlicedPlaces(data.slice(0, 5));
      setNumberofPlaces(data.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // get places by category
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

  // handle category change
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
          PlacesByCat={PlacesByCat}
          category={category}
          FadeRight={FadeRight}
          NumberofPlaces={NumberofPlaces}
          AllPlaces={SlicedPlaces}
          setAllPlaces={setSlicedPlaces}
          Loading={Loading}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Page;
