import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import notificationServices from "./notificationService";

export const getMyNotifications = createAsyncThunk(
  "notification/getMyNotifications",
  async (params, thunkAPI) => {
    try {
      return await notificationServices.getMyNotifications(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, thunkAPI) => {
    try {
      return await notificationServices.markAsRead(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      return await notificationServices.markAllAsRead();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  metadata: {},
  isLoading: false,
  message: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    resetNotifMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.data;
        state.metadata = action.payload._metadata || {};
        state.unreadCount = (action.payload.data || []).filter(
          (n) => !n.is_read,
        ).length;
      })
      .addCase(getMyNotifications.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.notifications = state.notifications.map((n) =>
          n.id === updated.id ? { ...n, is_read: true } : n,
        );
        state.unreadCount = state.notifications.filter((n) => !n.is_read).length;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          is_read: true,
        }));
        state.unreadCount = 0;
        state.message = action.payload.message;
      });
  },
});

export const { resetNotifMessage } = notificationSlice.actions;
export default notificationSlice.reducer;
