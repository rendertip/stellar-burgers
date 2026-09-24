import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './slices/constructor-slice';
import feedReducer from './slices/feed-slice';
import ingredientsReducer from './slices/ingredients-slice';
import orderReducer from './slices/order-slice';
import userReducer from './slices/user-slice';

export const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  user: userReducer,
});
