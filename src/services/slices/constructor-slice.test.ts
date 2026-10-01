import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from './constructor-slice';

import type { TConstructorIngredient, TIngredient } from '@utils-types';

const bun: TIngredient = {
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

const filling: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
};

const constructorFilling: TConstructorIngredient = {
  ...filling,
  id: 'filling-id',
};

describe('Редьюсер конструктора бургера', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('добавляет булку', () => {
    const action = addIngredient(bun);
    const state = constructorReducer(undefined, action);

    expect(state.bun).toMatchObject(bun);
    expect(state.bun?.id).toEqual(expect.any(String));
    expect(state.ingredients).toEqual([]);
  });

  it('добавляет начинку', () => {
    const state = constructorReducer(undefined, addIngredient(filling));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(filling);
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  it('удаляет начинку по её идентификатору в конструкторе', () => {
    const secondFilling: TConstructorIngredient = {
      ...constructorFilling,
      id: 'second-filling-id',
    };
    const state = constructorReducer(
      { bun: null, ingredients: [constructorFilling, secondFilling] },
      removeIngredient(constructorFilling.id)
    );

    expect(state.ingredients).toEqual([secondFilling]);
  });

  it('перемещает начинку', () => {
    const secondFilling: TConstructorIngredient = {
      ...constructorFilling,
      id: 'second-filling-id',
    };
    const state = constructorReducer(
      { bun: null, ingredients: [constructorFilling, secondFilling] },
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients).toEqual([secondFilling, constructorFilling]);
  });

  it('очищает конструктор', () => {
    const state = constructorReducer(
      { bun: { ...bun, id: 'bun-id' }, ingredients: [constructorFilling] },
      clearConstructor()
    );

    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
