import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const saved = localStorage.getItem("spark-theme");
  if (saved) return saved;
  return "dark";
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("spark-theme", state.theme);
      document.documentElement.setAttribute("data-theme", state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("spark-theme", action.payload);
      document.documentElement.setAttribute("data-theme", action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
