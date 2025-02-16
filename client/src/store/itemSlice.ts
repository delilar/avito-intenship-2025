import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/axios';
import { Item } from '../types';

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  selectedCategory: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
  selectedCategory: null,
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { signal }) => {
    const response = await api.get<Item[]>('/items', {
      signal // Используем signal напрямую
    });
    return response.data;
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalItems = action.payload.length;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        // Игнорируем ошибку если запрос был отменен
        if (action.error.name === 'AbortError') {
          state.error = null;
        } else {
          state.error = action.error.message || 'Failed to fetch items';
        }
      });
  }
});

export const { setCurrentPage, setSelectedCategory } = itemsSlice.actions;
export default itemsSlice.reducer;