import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        date: null,
        period: 'week',
        types: ['client', 'volunteer', 'employee', 'external']
    },
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setDateSlice: (state, action) => {
            state.value.date = action.payload
            // console.log(action.payload)
        },
        setPeriodSlice: (state, action) => {
            state.value.period = action.payload
        },
        setTypesSlice: (state, action) => {
            state.value.types = action.payload
        }
    }
})

export const { setDateSlice, setPeriodSlice, setTypesSlice } = filtersSlice.actions
export default filtersSlice.reducer