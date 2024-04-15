import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
  __v: number;
  likedBy: string[];
  reviews: review[];
  latitude: number;
  longitude: number;
}

interface PlaceState {
  Place: Place[] | null;
  SlicedPlace: Place[] | null;
  PlaceByLocation: Place[] | null;
  Loading: boolean;
  error: any | null;
}

const initialState: PlaceState = {
  Place: null,
  SlicedPlace: null,
  PlaceByLocation: null,
  Loading: false,
  error: null,
};

export const fetchPlaces = createAsyncThunk(
  "place/fetchPlaces",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        "https://roomsy-v3-server.vercel.app/api/places"
      );

      return data;
    } catch (error) {
      console.log("Error getting places:", error);
      return rejectWithValue("Error getting places");
    }
  }
);

const placeSlice = createSlice({
  name: "place",
  initialState: initialState,
  reducers: {
    AddtoSlicedPlace(state, action) {
      if (state.SlicedPlace === null) {
        state.SlicedPlace = [];
      }
      state.SlicedPlace.push(...action.payload);
    },
    ChangeCategory(state, action) {
      state.SlicedPlace = action.payload;
    },
    ChangeLocation(state, action) {
      state.PlaceByLocation = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPlaces.pending, (state) => {
      state.Loading = true;
      state.Place = null;
      state.SlicedPlace = null;
      state.error = null;
    });
    builder.addCase(fetchPlaces.fulfilled, (state, action) => {
      state.Loading = false;
      state.Place = action.payload;
      state.SlicedPlace = action.payload.slice(0, 5);
      state.error = null;
    });
    builder.addCase(fetchPlaces.rejected, (state, action) => {
      state.Loading = false;
      state.Place = null;
      state.SlicedPlace = null;
      state.error = action.payload;
    });
  },
});

export const { AddtoSlicedPlace, ChangeCategory, ChangeLocation } =
  placeSlice.actions;

export default placeSlice.reducer;
