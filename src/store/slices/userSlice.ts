import { updateUserApi } from "@/api/userApi";
import { UpdateUserPayload, UpdateUserResponseData, } from "@/types/authType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";


export const updateUser = createAsyncThunk<UpdateUserResponseData, UpdateUserPayload, { rejectValue: string }>(
  "auth/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {

      const response = await updateUserApi(id, data)
      return response?.data as UpdateUserResponseData;

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong")
    }
  })

