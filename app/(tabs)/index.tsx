import { SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/explore/ExploreHeader";
import PlacesMap from "@/components/explore/PlacesMap";
import PlacesBottomSheet from "@/components/explore/PlacesBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {  fetchPlaces } from "@/features/placeSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";

type AppDispatch = ThunkDispatch<RootState, unknown, any>;

const Page = () => {
  const dispatch: AppDispatch = useDispatch();

  // data
  const [category, setcategory] = useState("All");

  // handle category change
  const onCategoryChanged = (category: string) => {
    setcategory(category);
  };

  // get all places
  const { Place, SlicedPlace, Loading } = useSelector(
    (state: RootState) => state.place
  );
  useEffect(() => {
    dispatch(fetchPlaces());
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <Stack.Screen
          options={{
            header: () => (
              <ExploreHeader
                onCategoryChanged={onCategoryChanged}
              />
            ),
          }}
        />

        <PlacesMap AllPlaces={Place} />

        <PlacesBottomSheet
          category={category}
          AllPlaces={SlicedPlace}
          Loading={Loading}
          Place={Place}
          NumberofPlaces={Place?.length}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Page;
