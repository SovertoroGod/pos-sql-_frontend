import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryServices from "./categoryService";

const initialState = {
  categories: null,
  selectedCategory: null,
  subcategories: null,
  isLoading: false,
  metadata: {},
  message: "",
};

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (data, thunkAPI) => {
    try {
      return await categoryServices.createCategory(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async (params, thunkAPI) => {
    try {
      return await categoryServices.getAllCategories(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getCategoryById = createAsyncThunk(
  "categories/getCategoryById",
  async (id, thunkAPI) => {
    try {
      return await categoryServices.getCategoryId(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const getSubcategoriesByParentId = createAsyncThunk(
  "categories/getSubcategoriesByParentId",
  async (parentId, thunkAPI) => {
    try {
      return await categoryServices.getAllCategories({ parent_id: parentId });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, data }, thunkAPI) => {
    try {
      return await categoryServices.updateCategory(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.isLoading = false;
      state.categories = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state, action) => {
        state.isLoading = true;
        state.message = action.payload?.message || "";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(getAllCategories.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        state.metadata = action.payload._metadata || {};
        state.message = action.payload?.message || "";
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(getCategoryById.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      })
      .addCase(getSubcategoriesByParentId.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getSubcategoriesByParentId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories = action.payload.data;
        state.message = action.payload?.message || "";
      })
      .addCase(getSubcategoriesByParentId.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "";
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
