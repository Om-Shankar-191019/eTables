import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  email: "",
  firstName: "",
  lastName: "",
  image: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      state._id = action.payload.data._id;
      state.email = action.payload.data.email;
      state.firstName = action.payload.data.firstName;
      state.lastName = action.payload.data.lastName;
      state.image = action.payload.data.image;
    },
    logoutRedux: (state) => {
      state._id = "";
      state.email = "";
      state.firstName = "";
      state.lastName = "";
      state.image = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginRedux, logoutRedux } = userSlice.actions;

export default userSlice.reducer;
