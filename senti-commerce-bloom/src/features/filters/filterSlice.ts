
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  searchQuery: string;
  category: string;
  sentiment: string;
  minRating: number;
  priceRange: [number, number];
  sortBy: string;
}

const initialState: FiltersState = {
  searchQuery: '',
  category: 'all',
  sentiment: 'all',
  minRating: 0,
  priceRange: [0, 1000],
  sortBy: 'relevance',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSentiment: (state, action: PayloadAction<string>) => {
      state.sentiment = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearchQuery,
  setCategory,
  setSentiment,
  setMinRating,
  setPriceRange,
  setSortBy,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
