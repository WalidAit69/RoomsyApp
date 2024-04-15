import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";

interface InitialRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface LocationState {
  location: InitialRegion | undefined;
  address: Location.LocationGeocodedAddress | undefined;
  loading: boolean;
  error: any | null;
}

const initialState: LocationState = {
  location: undefined,
  address: undefined,
  loading: false,
  error: null,
};

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    try {
      let location = await Location.getCurrentPositionAsync({});

      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const CurrentLocation = {
        latitude: location ? location?.coords.latitude : 33.58831,
        longitude: location ? location?.coords.longitude : -7.61138,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      
      const Address = addressResponse[0];

      return { CurrentLocation, Address };
    } catch (error) {
      console.log("Error getting location:", error);
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.location = action?.payload?.CurrentLocation;
        state.address = action?.payload?.Address;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default locationSlice.reducer;
