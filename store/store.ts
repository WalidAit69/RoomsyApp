import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/userSlice";
import bookingReducer from "@/features/userbookingsSlice";
import RegisterReducer from "@/features/registrationTypeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    bookings: bookingReducer,
    registrationtype: RegisterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
