import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createStaffApi } from "@/api/staffApi";
import { createStaffData, ResponseData, StaffInitialState } from "@/types/staffType";
import { AxiosError } from "axios";

export const createStaff = createAsyncThunk<ResponseData, createStaffData, { rejectValue: string }>(
  "staff/crateStaff",
  async (data, { rejectWithValue }) => {
    try {
      
      const response = await createStaffApi(data)
      console.log("response ====> ", response)
      return response?.data

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)

const initialState:StaffInitialState ={
  loading:false,
  error:null,
  staff:[]
}

const staffSlice = createSlice({
  name:"staff",
  initialState,
  reducers:{},
  extraReducers:(builder) =>{

    builder

    // Create Staff
    .addCase(createStaff.pending, (state)=>{
      state.loading = true
      state.error= null
    })
    .addCase(createStaff.fulfilled, (state)=>{
      state.loading = false
    })
    .addCase(createStaff.rejected, (state, action)=>{
      state.loading = false
      state.error= action?.payload ?? "Something went wrong"
    })

  }
})

export default staffSlice?.reducer