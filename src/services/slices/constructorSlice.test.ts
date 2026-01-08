import { expect, test, describe } from '@jest/globals';
import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';

const reducer = constructorSlice.reducer;

const initialState = {
  bun: null,
  ingredients: []
};

const mockBun = {
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
};

const mockIngredient = {
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
};

const mockSauce = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('constructorSlice', () => {
  test('должен вернуть начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('addIngredient должен добавить булку', () => {
    const action = addIngredient(mockBun);
    const state = reducer(initialState, action);

    expect(state.bun).not.toBeNull();
    expect(state.bun?.name).toBe('Краторная булка N-200i');
    expect(state.bun?.type).toBe('bun');
    expect(state.bun).toHaveProperty('id'); // nanoid добавляет id
  });

  test('addIngredient должен добавить начинку', () => {
    const action = addIngredient(mockIngredient);
    const state = reducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
    expect(state.ingredients[0]).toHaveProperty('id');
  });

  test('removeIngredient должен удалить ингредиент по id', () => {
    // Сначала добавляем ингредиент
    const addAction = addIngredient(mockIngredient);
    const stateWithIngredient = reducer(initialState, addAction);
    const ingredientId = stateWithIngredient.ingredients[0].id;

    // Удаляем ингредиент
    const removeAction = removeIngredient(ingredientId);
    const state = reducer(stateWithIngredient, removeAction);

    expect(state.ingredients).toHaveLength(0);
  });

  test('moveIngredient должен перемещать ингредиент', () => {
    // Добавляем два ингредиента
    let state = reducer(initialState, addIngredient(mockIngredient));
    state = reducer(state, addIngredient(mockSauce));

    const firstIngredientId = state.ingredients[0].id;
    const secondIngredientId = state.ingredients[1].id;

    // Перемещаем первый на место второго
    const moveAction = moveIngredient({ from: 0, to: 1 });
    state = reducer(state, moveAction);

    expect(state.ingredients[0].id).toBe(secondIngredientId);
    expect(state.ingredients[1].id).toBe(firstIngredientId);
  });

  test('clearConstructor должен очистить конструктор', () => {
    // Добавляем булку и ингредиент
    let state = reducer(initialState, addIngredient(mockBun));
    state = reducer(state, addIngredient(mockIngredient));

    expect(state.bun).not.toBeNull();
    expect(state.ingredients).toHaveLength(1);

    // Очищаем
    state = reducer(state, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
