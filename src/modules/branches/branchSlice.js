import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import branchServices from "./branchService";

const initialState = {
    branches: [],
    isLoading: false
}

export const getAllBranches = createAsyncThunk(
    "branches/getAllBranches",
    async (_, thunkAPI) => {
        try {
            return await branchServices.getAllBranches();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

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
            })
            .addCase(getAllBranches.rejected, (state) => {
                state.isLoading = false;
            })
    }
});

export default branchSlice.reducer;