import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import themeReducer from "./themeSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
});

export default store;
