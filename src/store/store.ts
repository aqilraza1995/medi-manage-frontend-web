import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import locationReducer from './slices/locationSlice';
import shopReducer from './slices/shopSlice';
import planReducer from './slices/planSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import staffReducer from "./slices/staffSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    location: locationReducer,
    shop: shopReducer,
    plans: planReducer,
    subscription: subscriptionReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
