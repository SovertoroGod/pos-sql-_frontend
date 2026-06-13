import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import managerDashboardService from "./managerDashboardService";

const initialState = {
  stats: null,
  isLoading: false,
  message: "",
};

export const getManagerDashboard = createAsyncThunk(
  "managerDashboard/getManagerDashboard",
  async (_, thunkAPI) => {
    try {
      return await managerDashboardService.getManagerDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const managerDashboardSlice = createSlice({
  name: "managerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getManagerDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      });
  },
});

export default managerDashboardSlice.reducer;
