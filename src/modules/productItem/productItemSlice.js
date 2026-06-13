import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productItemServices from "./productItemService";

const initialState = {
  productItems: [],
  selectedProductItem: null,
  isLoading: false,
  metadata: {},
  message: "",
};

export const getAllProductItems = createAsyncThunk(
  "productItem/getAllProductItems",
  async (params, thunkAPI) => {
    try {
      return await productItemServices.getAllProductItems(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createProductItem = createAsyncThunk(
  "productItem/createProductItem",
  async (data, thunkAPI) => {
    try {
      return await productItemServices.createProductItem(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getProductItemById = createAsyncThunk(
  "productItem/getProductItemById",
  async (id, thunkAPI) => {
    try {
      return await productItemServices.getProductItemById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateProductItem = createAsyncThunk(
  "productItem/updateProductItem",
  async ({ id, data }, thunkAPI) => {
    try {
      return await productItemServices.updateProductItem(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const productItemSlice = createSlice({
  name: "productItem",
  initialState,
  reducers: {
    resetProductItemState: (state) => {
      state.isLoading = false;
      state.selectedProductItem = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProductItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productItems = action.payload.data;
        state.metadata = action.payload._metadata || {};
        state.message = action.payload?.message || "";
      })
      .addCase(getAllProductItems.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(createProductItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProductItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(createProductItem.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(getProductItemById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductItemById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProductItem = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(getProductItemById.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(updateProductItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProductItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProductItem = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(updateProductItem.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      });
  },
});

export const { resetProductItemState } = productItemSlice.actions;
export default productItemSlice.reducer;
