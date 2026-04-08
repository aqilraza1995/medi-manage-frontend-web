import { createShopApi } from "@/api/shopApi";
import { createShopData, ResponseData, ShopInitialState } from "@/types/shopType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";




export const createShop = createAsyncThunk<ResponseData, createShopData, { rejectValue: string }>(
  "shop/crateShop",
  async (data, { rejectWithValue }) => {
    try {

      const response = await createShopApi(data);
      console.log("slice Shop created successfully:", response.data);
      return response.data as ResponseData;

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      console.log("err :", err)
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  })

const initialState: ShopInitialState = {
  loading: false,
  error: null,
  success: false,
  shop: []
}

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //create Shop
      .addCase(createShop?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShop?.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(createShop.rejected, (state, action) => {
        state.loading = false;
        console.log("extra reducer  action?.payload :", action?.payload)
        state.error = action?.payload ?? "Something went wrong"
      })
  }
})

export default shopSlice?.reducer