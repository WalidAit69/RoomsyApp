import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface User {
  id: string;
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

interface UserState {
  User: User | null;
  Loading: boolean;
  error: any | null;
}

const initialState: UserState = {
  User: null,
  Loading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_session");
      const UserData = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (!UserData || !UserData.userId) {
        return rejectWithValue("User session not found");
      }

      const { data } = await axios.get(
        `https://roomsy-v3-server.vercel.app/api/user/${UserData.userId}`
      );
      return data;
    } catch (error) {
      console.log("Error getting user data:", error);
      return rejectWithValue("Error getting user data");
    }
  }
);

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    logout: (state) => {
      state.User = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.Loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.Loading = false;
        state.User = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.Loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
