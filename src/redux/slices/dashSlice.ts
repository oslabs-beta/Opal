import { createSlice } from '@reduxjs/toolkit';

let session;

if (sessionStorage.getItem('disabled')) {
    session = sessionStorage.getItem('disabled');
}

export const dashSlice = createSlice({
    name: 'Dashboard',
    initialState: {
        disabled: (session || true)
    },
    reducers: {
        activeDash: (state) => {
            state.disabled = 'false';
            sessionStorage.setItem('disabled', "false");
        }
    }
})

export const { activeDash } = dashSlice.actions;

export default dashSlice.reducer;