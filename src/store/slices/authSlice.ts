import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, regiterAPI } from "@/api/authApi"
import { AuthState, LoginPayload, RegisterPayload, registerResponse, ResponseData } from "@/types/authType";
import { AxiosError } from "axios";


export const registerUser = createAsyncThunk<ResponseData, RegisterPayload, { rejectValue: string }>(
  "auth/regiterUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await regiterAPI(data)
      return response.data as ResponseData;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  })

export const loginUser = createAsyncThunk<ResponseData, LoginPayload, { rejectValue: string }>(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginAPI(data)
      return response?.data as ResponseData;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  })


const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
  user: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.success = true;
      })
      .addCase(registerUser?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload ?? "Something went wrong"
      })

      // Login
      .addCase(loginUser?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false
        state.success = true;
      })
      .addCase(loginUser?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload ?? "Something went wrong"
      })
  }
})

export const { logout } = authSlice.actions;

export default authSlice.reducer;




// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface User {
//     id: string;
//     name: string;
//     email: string;
//     hasStore: boolean;
//     storeName?: string;
// }

// interface AuthState {
//     user: User | null;
//     isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//     user: null,
//     isAuthenticated: false,
// };

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         login: (state, action: PayloadAction<User>) => {
//             state.user = action.payload;
//             state.isAuthenticated = true;
//         },
//         logout: (state) => {
//             state.user = null;
//             state.isAuthenticated = false;
//         },
//         updateStoreStatus: (state, action: PayloadAction<{ hasStore: boolean; storeName?: string }>) => {
//             if (state.user) {
//                 state.user.hasStore = action.payload.hasStore;
//                 if (action.payload.storeName) {
//                     state.user.storeName = action.payload.storeName;
//                 }
//             }
//         },
//         updateProfile: (state, action: PayloadAction<Partial<User>>) => {
//             if (state.user) {
//                 state.user = { ...state.user, ...action.payload };
//             }
//         }
//     },
// });

// export const { login, logout, updateStoreStatus, updateProfile } = authSlice.actions;
// export default authSlice.reducer;
