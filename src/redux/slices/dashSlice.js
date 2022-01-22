import { createSlice } from '@reduxjs/toolkit';

export const dashSlice = createSlice({
    name: 'Dashboard',
    initialState: {
        tab: 'Overview'
    },
    reducers: {
        changeTab: (state, action) => {
            state.tab = action.payload;
        }
    }
})

export const { changeTab } = dashSlice.actions;

export default dashSlice.reducer;