import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productUnitLogServices from "./productUnitLogService";

const initialState = {
  productUnitLogs: [],
  isLoading: false,
  metadata: {},
  message: "",
};

export const getAllProductUnitLogs = createAsyncThunk(
  "productUnitLog/getAllProductUnitLogs",
  async (params, thunkAPI) => {
    try {
      return await productUnitLogServices.getAllProductUnitLogs(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const productUnitLogSlice = createSlice({
  name: "productUnitLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductUnitLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProductUnitLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productUnitLogs = action.payload.data;
        state.metadata = action.payload._metadata || {};
        state.message = action.payload?.message || "";
      })
      .addCase(getAllProductUnitLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      });
  },
});

export default productUnitLogSlice.reducer;
