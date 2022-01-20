import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
    }
})