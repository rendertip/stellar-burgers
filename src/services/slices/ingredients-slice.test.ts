import ingredientsReducer, { fetchIngredients } from './ingredients-slice';

import type { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://example.test/bun.png',
  image_large: 'https://example.test/bun-large.png',
  image_mobile: 'https://example.test/bun-mobile.png',
};

describe('Редьюсер ингредиентов', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает экшен fetchIngredients.pending', () => {
    expect(
      ingredientsReducer(
        { items: [ingredient], isLoading: false, error: 'Предыдущая ошибка' },
        fetchIngredients.pending('request-id')
      )
    ).toEqual({
      items: [ingredient],
      isLoading: true,
      error: null,
    });
  });

  it('обрабатывает экшен fetchIngredients.fulfilled', () => {
    expect(
      ingredientsReducer(
        { items: [], isLoading: true, error: null },
        fetchIngredients.fulfilled([ingredient], 'request-id')
      )
    ).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает экшен fetchIngredients.rejected', () => {
    expect(
      ingredientsReducer(
        { items: [ingredient], isLoading: true, error: null },
        fetchIngredients.rejected(new Error('Ошибка сети'), 'request-id')
      )
    ).toEqual({
      items: [ingredient],
      isLoading: false,
      error: 'Ошибка сети',
    });
  });
});
