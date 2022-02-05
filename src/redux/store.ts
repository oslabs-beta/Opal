import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import dashReducer from './slices/dashSlice';
import awsReducer from './slices/awsSlice';
import azureReducer from './slices/azureSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        dash: dashReducer,
        azure: azureReducer,
        aws: awsReducer,
    }
})

/**
 * @method { getState }
 * @method { dispatch }
 * 
 * both exist as prototype methods on the configureStore store object
*/

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {aws: awsState, dash: dashState, users: UsersState, azure: azureState}
export type AppDispatch = typeof store.dispatch
