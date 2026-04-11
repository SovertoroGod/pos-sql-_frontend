import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
  users: [],
  selectedUser: null,
  metadata: {},
  filters: {
    page: 1,
    limit: 10,
    full_name: "",
    username: "",
    email: "",
    role: "",
    is_active: "",
    branch_id: "",
  },
  isLoading: false,
};

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (filters, thunkAPI) => {
    try {
      return await userService.getAllUsers(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (id, thunkAPI) => {
    try {
      return await userService.getUserById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, thunkAPI) => {
    try {
      // console.log("updateUser async thunk - ID:", id, "Data:", data);
      return await userService.updateUser({ id, data });
    } catch (error) {
      console.error("updateUser error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, thunkAPI) => {
    try {
      return await userService.deleteUser(id);
    } catch (error) {
      console.error("updateUser error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (data, thunkAPI) => {
    try {
      return await userService.createUser(data);
    } catch (error) {
      console.error("createUser error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.metadata = action.payload._metadata;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload.data[0];
        state.isLoading = false;
      })
      .addCase(getUserById.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload.data;
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload.data;
        state.isLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        console.log("Delete user failed : ", action.payload);
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.unshift(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        console.log("Create User Error: ", action.payload);
      });
  },
});

export const { setFilters } = userSlice.actions;
export default userSlice.reducer;
