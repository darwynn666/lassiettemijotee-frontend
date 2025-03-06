import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: { 
        token: null, 
        expires: null 
    },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.value = action.payload
            // console.log('setAuth', state.value)
        },
        logout: (state, action) => {
            state.value = initialState
        }
    }
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer