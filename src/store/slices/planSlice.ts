import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllActivePlansApi } from "../../api/planApi";
import { PlanResponse, PlanState } from "@/types/planType";
import { AxiosError } from "axios";

export const getAllActivePlans = createAsyncThunk<PlanResponse, void, { rejectValue: string }>(
  "plans/getAllActivePlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllActivePlansApi();
      console.log("API Response:", response.data); // Debug log
      return response.data as PlanResponse;

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  })


const initialState: PlanState = {
  loading: false,
  error: null,
  success: false,
  data: []
}

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllActivePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllActivePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getAllActivePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch plans";
      })

  }
})

export default planSlice.reducer;