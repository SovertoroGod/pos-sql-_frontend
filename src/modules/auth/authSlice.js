import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authServices from "./authService";

const getUserFromLocalStorage = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const userObj = JSON.parse(userStr);
    if (userObj && userObj.role) {
      userObj.role = userObj.role.toLowerCase();
    }
    return userObj;
  } catch (e) {
    return null;
  }
};
const token = localStorage.getItem("token");
const initialState = {
  user: getUserFromLocalStorage(),
  token: token ? token : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const login = createAsyncThunk(
  "/auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authServices.login(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const userData = action.payload.data.user;
        if (userData && userData.role) {
          userData.role = userData.role.toLowerCase();
        }
        state.user = userData;
        state.token = action.payload.data.token;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", action.payload.data.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
