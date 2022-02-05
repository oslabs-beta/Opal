import { createSlice } from '@reduxjs/toolkit';

export const awsSlice = createSlice({
    name: 'awsCredentials',
    initialState: {
        credentials: null,
    },
    reducers: {
        setAwsCredentials: (state, action) => {
            state.credentials = action.payload;
        }
    }
});

export const { setAwsCredentials } = awsSlice.actions;

export default awsSlice.reducer;