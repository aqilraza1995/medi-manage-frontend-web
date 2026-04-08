import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import locationReducer from './slices/locationSlice';
import shopReducer from './slices/shopSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    location: locationReducer,
    shop: shopReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
