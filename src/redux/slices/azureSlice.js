import { createSlice } from '@reduxjs/toolkit';

export const azureSlice = createSlice({
    name: 'azureCredentials',
    initialState: {
        credentials: null,
    },
    reducers: {
        setAzureCredentials: (state, action) => {
            state.credentials = action.payload;
        }
    }
})

export const { setAzureCredentials } = azureSlice.actions;

export default azureSlice.reducer;