import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import branchServices from "./branchService";

const initialState = {
  branchesForUser: [],
  branches: [],
  metadata: {},
  selectedBranch: null,
  isLoading: false,
  message: "",
};

export const getAllBranches = createAsyncThunk(
  "branches/getAllBranches",
  async (filters, thunkAPI) => {
    try {
      return await branchServices.getAllBranches(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getAllBranchesForUser = createAsyncThunk(
  "branches/getAllBranchesForUser",
  async (filters, thunkAPI) => {
    try {
      return await branchServices.getAllBranchesForUsers(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getBranchById = createAsyncThunk(
  "branches/getBranchById",
  async (id, thunkAPI) => {
    try {
      return await branchServices.getBranchById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const createBranch = createAsyncThunk(
  "branches/createBranch",
  async (data, thunkAPI) => {
    try {
      return await branchServices.createBranch(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateBranch = createAsyncThunk(
  "branches/updateBranch",
  async ({ id, data }, thunkAPI) => {
    try {
      return await branchServices.updateBranch(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteBranch = createAsyncThunk(
  "branches/deleteBranch",
  async (id, thunkAPI) => {
    try {
      return await branchServices.deleteBranch(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const branchSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBranches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = action.payload.data;
        state.metadata = action.payload._metadata || {};
      })
      .addCase(getAllBranches.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllBranchesForUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBranchesForUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branchesForUser = action.payload.data;
        state.metadata = action.payload._metadata || {};
      })
      .addCase(getAllBranchesForUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getBranchById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBranch = action.payload.data;
      })
      .addCase(getBranchById.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches.unshift(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createBranch.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBranch = action.payload.data;
        state.branches = state.branches.map((b) =>
          b.id === action.payload.data.id ? action.payload.data : b,
        );
      })
      .addCase(updateBranch.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.branches = state.branches.map((b) =>
        //   b.id !== action.payload.data.id ? b : null,
        // );
      })
      .addCase(deleteBranch.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default branchSlice.reducer;