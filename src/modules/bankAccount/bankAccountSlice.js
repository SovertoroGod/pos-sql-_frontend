import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bankAccountServices from "./bankAccountService";

const initialState = {
  bankAccounts: [],
  metadata: {},
  selectedBankAccount: null,
  isLoading: false,
  message: "",
};

export const getAllBankAccounts = createAsyncThunk(
  "bankAccount/getAllBankAccounts",
  async (filters, thunkAPI) => {
    try {
      return await bankAccountServices.getAllBankAccounts(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getBankAccountById = createAsyncThunk(
  "bankAccount/getBankAccountById",
  async (id, thunkAPI) => {
    try {
      return await bankAccountServices.getBankAccountById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const createBankAccount = createAsyncThunk(
  "bankAccount/createBankAccount",
  async (data, thunkAPI) => {
    try {
      return await bankAccountServices.createBankAccount(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateBankAccount = createAsyncThunk(
  "bankAccount/updateBankAccount",
  async ({ id, data }, thunkAPI) => {
    try {
      return await bankAccountServices.updateBankAccount(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const bankAccountSlice = createSlice({
  name: "bankAccount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBankAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBankAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bankAccounts = action.payload.data;
        state.metadata = action.payload._metadata || {};
      })
      .addCase(getAllBankAccounts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getBankAccountById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBankAccountById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBankAccount = action.payload.data;
      })
      .addCase(getBankAccountById.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createBankAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBankAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bankAccounts.unshift(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createBankAccount.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateBankAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBankAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBankAccount = action.payload.data;
        state.bankAccounts = state.bankAccounts.map((b) =>
          b.id === action.payload.data.id ? action.payload.data : b,
        );
      })
      .addCase(updateBankAccount.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default bankAccountSlice.reducer;