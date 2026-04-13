import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSubscriptionApi, getSubscriptionApi } from "../../api/subscriptionApi";
import { SubscriptionResponse, CreateSubscrptionPayload, SubscriptionState, GetSubscriptionResponse } from "@/types/subscriptionType";
import { AxiosError } from "axios";


export const createSubscription = createAsyncThunk<SubscriptionResponse, CreateSubscrptionPayload, { rejectValue: string }>(
  "subscription/createSubscription",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createSubscriptionApi(payload);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  })

  export const getSubscriptions = createAsyncThunk<GetSubscriptionResponse, void, { rejectValue: string }>(
  "subscription/getSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionApi();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  })

const initialState: SubscriptionState = {
    loading: false,
    error: null,
    success: false,
    data: []
}

  const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {},
    extraReducers: (builder) => { 
      builder

      // Create Subscription
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      builder.addCase(createSubscription.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      builder.addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create subscription";
        state.success = false;
      })

      // Get All Subscription
      .addCase(getSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      builder.addCase(getSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload?.data

      })
      builder.addCase(getSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create subscription";
        state.success = false;
      })
    }
  })

export default subscriptionSlice.reducer;