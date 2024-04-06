import { createSlice } from "@reduxjs/toolkit";

export interface RegisterState {
  RegistrationType: string;
}

const initialState: RegisterState = {
  RegistrationType: "",
};

export const registrationSlice = createSlice({
  name: "RegistrationType",
  initialState,
  reducers: {
    signup: (state) => {
      state.RegistrationType = "signup";
    },
    signin: (state) => {
      state.RegistrationType = "signin";
    },
  },
});


export const { signup, signin } = registrationSlice.actions;

export default registrationSlice.reducer;
