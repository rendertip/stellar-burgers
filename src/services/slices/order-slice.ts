import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TOrderState = {
  current: TOrder | null;
  created: TOrder | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  current: null,
  created: null,
  isLoading: false,
  isCreating: false,
  error: null,
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] ?? null;
  }
);

export const createOrder = createAsyncThunk('order/create', orderBurgerApi);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCreatedOrder: (state) => {
      state.created = null;
    },
    clearCurrentOrder: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.current = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказ';
      })
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.created = action.payload.order;
        state.isCreating = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const { clearCreatedOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
