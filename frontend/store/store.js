import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import dataReducer from './features/dataSlice';
import claimsReducer from './features/claimsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    claims: claimsReducer,
  },
});
