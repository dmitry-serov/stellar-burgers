import { expect, test, describe } from '@jest/globals';
import { rootReducer } from './store';

describe('rootReducer', () => {
  test('должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      user: {
        isAuthChecked: false,
        isAuthenticated: false,
        user: null,
        orders: [],
        ordersLoading: false,
        loginUserRequest: false,
        loginUserError: null
      }
    });
  });
});
