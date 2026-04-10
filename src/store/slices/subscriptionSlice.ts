import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSubscriptionApi } from "../../api/subscriptionApi";
import { CreateSubscriptionResponse, CreateSubscrptionPayload, SubscriptionState } from "@/types/subscriptionType";
import { AxiosError } from "axios";


export const createSubscription = createAsyncThunk<CreateSubscriptionResponse, CreateSubscrptionPayload, { rejectValue: string }>(
  "subscription/createSubscription",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createSubscriptionApi(payload);
      return response.data as CreateSubscriptionResponse;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  })

const initialState: SubscriptionState = {
    loading: false,
    error: null,
    success: false,
    data: null
}

  const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {},
    extraReducers: (builder) => { 
      builder
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
    }
  })

export default subscriptionSlice.reducer;