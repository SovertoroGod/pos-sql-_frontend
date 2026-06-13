import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import issueItemServices from "./issueItemService";

export const getAllIssueItems = createAsyncThunk(
  "issueItem/getAllIssueItems",
  async (params, thunkAPI) => {
    try {
      return await issueItemServices.getAll(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getAllIssueItemsForManager = createAsyncThunk(
  "issueItem/getAllIssueItemsForManager",
  async (params, thunkAPI) => {
    try {
      return await issueItemServices.getAllForManager(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createIssueItem = createAsyncThunk(
  "issueItem/createIssueItem",
  async (data, thunkAPI) => {
    try {
      return await issueItemServices.createIssueItem(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  issueItems: [],
  metadata: {},
  isLoading: false,
  message: "",
};

const issueItemSlice = createSlice({
  name: "issueItem",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllIssueItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllIssueItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.issueItems = action.payload.data;
        state.metadata = action.payload._metadata || {};
      })
      .addCase(getAllIssueItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllIssueItemsForManager.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllIssueItemsForManager.fulfilled, (state, action) => {
        state.isLoading = false;
        state.issueItems = action.payload.data;
        state.metadata = action.payload._metadata || {};
      })
      .addCase(getAllIssueItemsForManager.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createIssueItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createIssueItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(createIssueItem.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      });
  },
});

export const { resetMessage } = issueItemSlice.actions;
export default issueItemSlice.reducer;
