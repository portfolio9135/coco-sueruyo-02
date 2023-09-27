"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Features/userSlice";
import likesReducer from "./Features/likesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    likes: likesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispath = typeof store.dispatch;