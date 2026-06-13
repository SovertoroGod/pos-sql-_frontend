import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productListServices from "./productListService";

const initialState = {
  productLists: [],
  selectedProductList: null,
  isLoading: false,
  metadata: {},
  message: "",
};

export const getAllProductLists = createAsyncThunk(
  "productList/getAllProductLists",
  async (params, thunkAPI) => {
    try {
      return await productListServices.getAllProductLists(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getProductListById = createAsyncThunk(
  "productList/getProductListById",
  async (id, thunkAPI) => {
    try {
      return await productListServices.getProductListById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createProductList = createAsyncThunk(
  "productList/createProductList",
  async (data, thunkAPI) => {
    try {
      return await productListServices.createProductList(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateProductList = createAsyncThunk(
  "productList/updateProductList",
  async ({ id, data }, thunkAPI) => {
    try {
      return await productListServices.updateProductList(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const deleteProductList = createAsyncThunk(
  "productList/deleteProductList",
  async (id, thunkAPI) => {
    try {
      return await productListServices.deleteProductList(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const productListSlice = createSlice({
  name: "productList",
  initialState,
  reducers: {
    resetProductListState: (state) => {
      state.isLoading = false;
      state.selectedProductList = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductLists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProductLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productLists = action.payload.data;
        state.metadata = action.payload._metadata || {};
        state.message = action.payload?.message || "";
      })
      .addCase(getAllProductLists.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(getProductListById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductListById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProductList = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(getProductListById.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(createProductList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProductList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(createProductList.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(updateProductList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProductList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProductList = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(updateProductList.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(deleteProductList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProductList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(deleteProductList.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      });
  },
});

export const { resetProductListState } = productListSlice.actions;
export default productListSlice.reducer;
