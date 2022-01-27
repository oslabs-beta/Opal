import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

let biscuit;

if (Cookies.get('userCookie')) {
    biscuit = JSON.parse(Cookies.get('userCookie'));
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: biscuit || null,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            Cookies.set('userCookie', JSON.stringify(state.user));
        },
        logout: (state) => {
            state.user = null;
            Cookies.remove('userCookie');
        }
    }
})

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;