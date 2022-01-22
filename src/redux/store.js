import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import dashReducer from './slices/dashSlice.js';
import awsReducer from './slices/awsSlice.js';
import azureReducer from './slices/azureSlice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
        dash: dashReducer,
        azure: azureReducer,
        aws: awsReducer,
    }
})