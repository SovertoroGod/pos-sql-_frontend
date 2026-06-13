import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productUnitServices from "./productUnitService";

const initialState = {
  productUnits: [],
  selectedProductUnit: null,
  isLoading: false,
  metadata: {},
  message: "",
};

export const getAllProductUnits = createAsyncThunk(
  "productUnit/getAllProductUnits",
  async (params, thunkAPI) => {
    try {
      return await productUnitServices.getAllProductUnits(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createProductUnit = createAsyncThunk(
  "productUnit/createProductUnit",
  async (data, thunkAPI) => {
    try {
      return await productUnitServices.createProductUnit(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getProductUnitById = createAsyncThunk(
  "productUnit/getProductUnitById",
  async (id, thunkAPI) => {
    try {
      return await productUnitServices.getProductUnitById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateProductUnit = createAsyncThunk(
  "productUnit/updateProductUnit",
  async ({ id, data }, thunkAPI) => {
    try {
      return await productUnitServices.updateProductUnit(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const productUnitSlice = createSlice({
  name: "productUnit",
  initialState,
  reducers: {
    resetProductUnitState: (state) => {
      state.isLoading = false;
      state.selectedProductUnit = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductUnits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProductUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productUnits = action.payload.data;
        state.metadata = action.payload._metadata || {};
        state.message = action.payload?.message || "";
      })
      .addCase(getAllProductUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(createProductUnit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProductUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(createProductUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(getProductUnitById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductUnitById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProductUnit = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(getProductUnitById.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(updateProductUnit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProductUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProductUnit = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(updateProductUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      });
  },
});

export const { resetProductUnitState } = productUnitSlice.actions;
export default productUnitSlice.reducer;
