import { createShopApi, deleteShopApi, getShopApi, getShopByIdApi, getShopByOwnerApi, updateshopApi } from "@/api/shopApi";
import { createShopData, ResponseData, ShopInitialState, updateShopData } from "@/types/shopType";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";




export const createShop = createAsyncThunk<ResponseData, createShopData, { rejectValue: string }>(
  "shop/crateShop",
  async (data, { rejectWithValue }) => {
    try {

      const response = await createShopApi(data);
      return response.data as ResponseData;

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  })

export const getShops = createAsyncThunk<ResponseData, void, { rejectValue: string }>(
  "shop/getShop",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getShopApi()
      return response?.data as ResponseData
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)

export const getShopsById = createAsyncThunk<ResponseData, string, { rejectValue: string }>(
  "shop/getShopByIdApi",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getShopByIdApi(id)
      return response?.data as ResponseData
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)

export const getShopsByOwnerId = createAsyncThunk<ResponseData, string, { rejectValue: string }>(
  "shop/getShopsByOwnerId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getShopByOwnerApi(id)
      return response?.data as ResponseData
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)

export const updateShop = createAsyncThunk<ResponseData, updateShopData, { rejectValue: string }>(
  "shop/updateShop",
  async ({ id, data }, { rejectWithValue }) => {
    try {

      const response = await updateshopApi(id, data);
      return response.data as ResponseData;

    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  })

export const deleteShop = createAsyncThunk<ResponseData, string, { rejectValue: string }>(
  "shop/deleteShop",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteShopApi(id)
      return response?.data as ResponseData
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err?.response?.data?.message || "Something went wrong");
    }
  }
)


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
        state.error = action?.payload ?? "Something went wrong"
      })

      //Get all Shop
      .addCase(getShops?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShops?.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.shop = action?.payload?.data
      })
      .addCase(getShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload ?? "Something went wrong"
      })

      //Get Shop By ShopId
      .addCase(getShopsById?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShopsById?.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getShopsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload ?? "Something went wrong"
      })

      //Get Shop By OwnerId
      .addCase(getShopsByOwnerId?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShopsByOwnerId?.fulfilled, (state, action) => {
        state.loading = false
        state.shop = action?.payload?.data
      })
      .addCase(getShopsByOwnerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload ?? "Something went wrong"
      })

      // Update Shop
      .addCase(updateShop?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShop?.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload ?? "Something went wrong"
      })

      // Delete Shop
      .addCase(deleteShop?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShop?.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload ?? "Something went wrong"
      })
  }
})

export default shopSlice?.reducer