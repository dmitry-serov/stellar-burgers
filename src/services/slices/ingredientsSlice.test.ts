import { expect, test, describe } from '@jest/globals';
import { ingredientsSlice, fetchIngredients } from './ingredientsSlice';

const reducer = ingredientsSlice.reducer;

const initialState = {
  items: [],
  loading: false,
  error: null
};

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredientsSlice', () => {
  test('должен вернуть начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('тесты асинхронных экшенов fetchIngredients', () => {
    test('fetchIngredients.pending устанавливает loading в true', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fetchIngredients.fulfilled сохраняет ингредиенты', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = reducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('fetchIngredients.rejected устанавливает ошибку', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сервера' }
      };
      const state = reducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка сервера');
    });
  });
});
