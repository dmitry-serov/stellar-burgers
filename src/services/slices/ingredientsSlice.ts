import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Async thunk для загрузки ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => getIngredientsApi()
);

// Типы состояния
type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null
};

// Slice
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.items,
    selectIngredientsLoading: (state) => state.loading,
    selectIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ингредиентов';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  }
});

// Экспорт селекторов
export const {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} = ingredientsSlice.selectors;
