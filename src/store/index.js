import { configureStore } from "@reduxjs/toolkit";
import dragReducer from "./slice/dragSlice";

export const store = configureStore({
  reducer: {
    drag: dragReducer,
  },
});
