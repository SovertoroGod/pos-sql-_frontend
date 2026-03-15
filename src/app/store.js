import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../modules/auth/authSlice";
import usersReducer from "../modules/users/userSlice";
import branchReducer from "../modules/branches/branchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    branches: branchReducer,
  },
});