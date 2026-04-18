import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createPlanApi, deletePlanApi, getAllActivePlansApi, getPlanByIdApi, updatePlanApi } from "../../api/planApi";
import { EditPlanResponse, PlanData, PlanResponse, PlanState, UpdatePlanPayload } from "@/types/planType";
import { AxiosError } from "axios";


export const createPlan = createAsyncThunk<PlanResponse, PlanData, { rejectValue: string }>(
  "plan/createPlan",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createPlanApi(data);
      return response?.data
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      rejectWithValue(err?.response?.data?.message || "Something went wrong")
    }
  })

export const getAllActivePlans = createAsyncThunk<PlanResponse, void, { rejectValue: string }>(
  "plans/getAllActivePlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllActivePlansApi();
      return response.data as PlanResponse;

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  })

export const getPlanById = createAsyncThunk<EditPlanResponse, string, { rejectValue: string }>(
  "plan/getPlanById",
  async (planId, { rejectWithValue }) => {
    try {
      const res = await getPlanByIdApi(planId)
      return res?.data as EditPlanResponse
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Something went wrong")
    }
  })

  export const updatePlan = createAsyncThunk<PlanResponse, UpdatePlanPayload, { rejectValue: string }>(
  "plan/updatePlan",
  async ({planId, data}, { rejectWithValue }) => {
    try {
      const res = await updatePlanApi(planId, data)
      return res?.data as PlanResponse
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Something went wrong")
    }
  })

export const deletePlan = createAsyncThunk<PlanResponse, string, { rejectValue: string }>(
  "plans/deletePlan",
  async (planId, { rejectWithValue }) => {
    try {
      const response = await deletePlanApi(planId);
      return response.data as PlanResponse
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  })



const initialState: PlanState = {
  loading: false,
  editLoading:false,
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

      // Create plan
      .addCase(createPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create plan";
      })

      // Get all active plans
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

      // Get plan by Id
      .addCase(getPlanById.pending, (state) => {
        state.editLoading = true;
        state.error = null;
      })
      .addCase(getPlanById.fulfilled, (state, action) => {
        state.editLoading = false;
      })
      .addCase(getPlanById.rejected, (state, action) => {
        state.editLoading = false;
        state.error = action.payload || "Failed to fetch plan";
      })

      // Update plan
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update plan";
      })

      // Delete Plan
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete plan";
      });

  }
})

export default planSlice.reducer;