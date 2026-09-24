import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { TConstructorState, TIngredient } from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = { ...action.payload, id: nanoid() };
      } else {
        state.ingredients.push({ ...action.payload, id: nanoid() });
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const [item] = state.ingredients.splice(action.payload.from, 1);
      if (item) state.ingredients.splice(action.payload.to, 0, item);
    },
    clearConstructor: () => initialState,
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;
export default constructorSlice.reducer;
