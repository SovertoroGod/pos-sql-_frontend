import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminDashboardService from "./adminDashboardService";

const initialState = {
  stats: null,
  isLoading: false,
  message: "",
};

export const getDashboardStats = createAsyncThunk(
  "adminDashboard/getStats",
  async (_, thunkAPI) => {
    try {
      return await adminDashboardService.getDashboardStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      });
  },
});

export default adminDashboardSlice.reducer;
