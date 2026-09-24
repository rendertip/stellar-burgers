import {
  forgotPasswordApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TOrder, TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  orders: TOrder[];
  isAuthChecked: boolean;
  isLoading: boolean;
  isOrdersLoading: boolean;
  error: string | null;
  updateError: string | null;
};

const initialState: TUserState = {
  user: null,
  orders: [],
  isAuthChecked: false,
  isLoading: false,
  isOrdersLoading: false,
  error: null,
  updateError: null,
};

const saveTokens = (response: { accessToken: string; refreshToken: string }): void => {
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response);
    return response.user;
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  saveTokens(response);
  return response.user;
});

export const fetchUser = createAsyncThunk('user/fetch', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const fetchUserOrders = createAsyncThunk('user/fetchOrders', getOrdersApi);

export const requestPasswordReset = createAsyncThunk(
  'user/requestPasswordReset',
  forgotPasswordApi
);

export const resetPassword = createAsyncThunk('user/resetPassword', resetPasswordApi);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось авторизоваться';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateError = action.error.message ?? 'Не удалось обновить профиль';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isOrdersLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isOrdersLoading = false;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isOrdersLoading = false;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.error = action.error.message ?? 'Не удалось отправить письмо';
      })
      .addCase(resetPassword.pending, (state) => {
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message ?? 'Не удалось изменить пароль';
      })
      .addCase(logoutUser.fulfilled, () => ({ ...initialState, isAuthChecked: true }));
  },
});

export default userSlice.reducer;
