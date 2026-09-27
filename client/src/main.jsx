import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";


import App from "./App";
import { store } from "./store/store";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </Provider>
  </React.StrictMode>
);