import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryServices from "./categoryService";

const initialState = {
  categories: null,
  isLoading: false,
  metadata: {},
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
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;