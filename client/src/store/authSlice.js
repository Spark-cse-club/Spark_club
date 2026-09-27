
import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name : "auth",
  initialState,
  reducers : {
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  }
});

export const {  setLoading, login, logout } = authSlice.actions;

export default authSlice.reducer;