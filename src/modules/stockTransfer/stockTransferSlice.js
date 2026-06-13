import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import stockTransferServices from "./stockTransferService";

export const getAllStockTransfers = createAsyncThunk(
  "stockTransfer/getAllStockTransfers",
  async (params, thunkAPI) => {
    try {
      return await stockTransferServices.getAllStockTransfers(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getStockTransferById = createAsyncThunk(
  "stockTransfer/getStockTransferById",
  async (id, thunkAPI) => {
    try {
      return await stockTransferServices.getStockTransferById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createStockTransfer = createAsyncThunk(
  "stockTransfer/createStockTransfer",
  async (data, thunkAPI) => {
    try {
      return await stockTransferServices.createStockTransfer(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const cancelStockTransfer = createAsyncThunk(
  "stockTransfer/cancelStockTransfer",
  async (id, thunkAPI) => {
    try {
      return await stockTransferServices.cancelStockTransfer(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const receiveStockTransfer = createAsyncThunk(
  "stockTransfer/receiveStockTransfer",
  async (id, thunkAPI) => {
    try {
      return await stockTransferServices.receiveStockTransfer(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  stockTransfers: [],
  selectedTransfer: null,
  metadata: {},
  isLoading: false,
  actionLoading: false,
  message: "",
};

const stockTransferSlice = createSlice({
  name: "stockTransfer",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllStockTransfers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllStockTransfers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stockTransfers = action.payload.data;
        state.metadata = action.payload._metadata || {};
      })
      .addCase(getAllStockTransfers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getStockTransferById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStockTransferById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTransfer = action.payload.data;
      })
      .addCase(getStockTransferById.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createStockTransfer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStockTransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(createStockTransfer.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(cancelStockTransfer.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(cancelStockTransfer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedTransfer = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(cancelStockTransfer.rejected, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload;
      })
      .addCase(receiveStockTransfer.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(receiveStockTransfer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedTransfer = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(receiveStockTransfer.rejected, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload;
      });
  },
});

export const { resetMessage } = stockTransferSlice.actions;
export default stockTransferSlice.reducer;
