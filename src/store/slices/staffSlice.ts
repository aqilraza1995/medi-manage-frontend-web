import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createStaffApi, deleteStaffApi, getAllStaffApi, getStaffByIdApi, updateStaffApi } from "@/api/staffApi";
import { createStaffData, GetStaffEditResponse, GetStaffResponse, ResponseData, staffData, StaffInitialState, updateStaffData } from "@/types/staffType";
import { AxiosError } from "axios";

export const createStaff = createAsyncThunk<ResponseData, createStaffData, { rejectValue: string }>(
  "staff/crateStaff",
  async (data, { rejectWithValue }) => {
    try {

      const response = await createStaffApi(data)
      return response?.data

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)

export const getAllStaff = createAsyncThunk<GetStaffResponse, void, { rejectValue: string }>(
  "staff/getAllStaff",
  async (_, { rejectWithValue }) => {
    try {

      const response = await getAllStaffApi()
      return response?.data

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)

export const getStaffById = createAsyncThunk<GetStaffEditResponse, string, { rejectValue: string }>(
  "staff/getStaffById",
  async (id, { rejectWithValue }) => {
    try {

      const response = await getStaffByIdApi(id)
      return response?.data

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)

export const updateStaff = createAsyncThunk<GetStaffEditResponse, updateStaffData, { rejectValue: string }>(
  "staff/updateStaff",
  async ({ id, data }, { rejectWithValue }) => {
    try {

      const response = await updateStaffApi(id, data);
      return response.data;

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  })

export const deleteStaff = createAsyncThunk<GetStaffEditResponse, string, { rejectValue: string }>(
  "staff/deleteStaff",
  async (id, { rejectWithValue }) => {
    try {

      const response = await deleteStaffApi(id)
      return response?.data

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)

const initialState: StaffInitialState = {
  loading: false,
  error: null,
  staff: []
}

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder

      // Create Staff
      .addCase(createStaff.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createStaff.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false
        state.error = action?.payload ?? "Something went wrong"
      })

      // Get All Staff
      .addCase(getAllStaff.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllStaff.fulfilled, (state, action) => {
        state.loading = false
        state.staff = action.payload?.data || []
      })
      .addCase(getAllStaff.rejected, (state, action) => {
        state.loading = false
        state.error = action?.payload ?? "Something went wrong"
      })

      // Get Staff By Id
      .addCase(getStaffById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStaffById.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getStaffById.rejected, (state, action) => {
        state.loading = false
        state.error = action?.payload ?? "Something went wrong"
      })

      // Update Staff
      .addCase(updateStaff.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStaff.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false
        state.error = action?.payload ?? "Something went wrong"
      })

      // Delete Staff
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteStaff.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false
        state.error = action?.payload ?? "Something went wrong"
      })

  }
})

export default staffSlice?.reducer