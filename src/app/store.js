import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../modules/auth/authSlice';
import usersReducer from '../modules/users/userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer
    },
});