import { configureStore } from "@reduxjs/toolkit";
import auth from '@/features/auth/authSlice'
import filters from '@/features/filters/filtersSlice'

export const store = configureStore({
    reducer: {
        auth,
        filters,
    },
  })
  