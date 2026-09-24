import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

const getLocalImageUrl = (url: string): string =>
  url.replace('https://code.s3.yandex.net', '/ingredient-images');

export const fetchIngredients = createAsyncThunk('ingredients/fetchAll', async () => {
  const ingredients = await getIngredientsApi();

  return ingredients.map((ingredient) => ({
    ...ingredient,
    image: getLocalImageUrl(ingredient.image),
    image_large: getLocalImageUrl(ingredient.image_large),
    image_mobile: getLocalImageUrl(ingredient.image_mobile),
  }));
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export default ingredientsSlice.reducer;
