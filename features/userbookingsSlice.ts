import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  email: string;
  password: string;
  fullname: string;
  phone: string;
  bio: string;
  job: string;
  lang: string;
  location: string;
  profilepic: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  host: boolean;
  Superhost: boolean;
  followers: string[];
  likedPosts: string[];
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
}

interface Booking {
  _id: string;
  place: Place;
  user: User;
  host: string;
  checkin: string;
  checkout: string;
  guests: string;
  Username: string;
  Userphone: string;
  fullprice: string;
  halfprice: string;
  worktrip: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BookingsState {
  Booking: Booking[] | null;
  Booked: Booking[] | null;
  isLoading: boolean;
  error: any | null;
}

const initialState: BookingsState = {
  Booking: null,
  Booked: null,
  isLoading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_session");
      const User = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (!User || !User.userId) {
        return rejectWithValue("User session not found");
      }

      const bookingResponse = await axios.get(
        `https://roomsy-v3-server.vercel.app/api/BookingPlaces/${User.userId}`
      );

      const bookedResponse = await axios.get(
        `https://roomsy-v3-server.vercel.app/api/Booked/${User.userId}`
      );

      const bookingData = bookingResponse.data;
      const bookedData = bookedResponse.data;

      return { bookingData, bookedData };
    } catch (error) {
      console.log("Error getting bookings:", error);
      return rejectWithValue("Error getting bookings");
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.Booking = null;
        state.Booked = null;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Booking = action.payload.bookingData;
        state.Booked = action.payload.bookedData;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.Booking = null;
        state.Booked = null;
      });
  },
});

export default bookingsSlice.reducer;
