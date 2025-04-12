import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import planReducer from './slices/planSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plans: planReducer,
  },
}); 