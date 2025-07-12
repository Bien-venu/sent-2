
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Review } from '@/features/products/productSlice';
import { fetchSentimentOverview, fetchReviews, PaginatedReviews } from '@/data/mockSentimentData';

interface SentimentDashboardState {
  overview: {
    totalReviews: number;
    averageSentiment: number;
    sentimentDistribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
  };
  filters: {
    sentiment: string;
    search: string;
  };
  loading: boolean;
}

const initialState: SentimentDashboardState = {
  overview: {
    totalReviews: 0,
    averageSentiment: 0,
    sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
  },
  reviews: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
  },
  filters: {
    sentiment: 'all',
    search: '',
  },
  loading: false,
};

export const getSentimentData = createAsyncThunk(
  'adminSentiment/getData',
  async (_, { getState }) => {
    const { adminSentiment } = getState() as { adminSentiment: SentimentDashboardState };
    const { currentPage } = adminSentiment.pagination;
    const { filters } = adminSentiment;
    const [overview, reviewsData] = await Promise.all([
      fetchSentimentOverview(),
      fetchReviews(currentPage, 10, filters),
    ]);
    return { overview, reviewsData };
  }
);

export const getFilteredReviews = createAsyncThunk(
    'adminSentiment/getFilteredReviews',
    async (_, { getState }) => {
        const { adminSentiment } = getState() as { adminSentiment: SentimentDashboardState };
        const { filters } = adminSentiment;
        // Reset to page 1 for new filter actions
        const reviewsData = await fetchReviews(1, 10, filters);
        return reviewsData;
    }
);


const sentimentDashboardSlice = createSlice({
  name: 'adminSentiment',
  initialState,
  reducers: {
    setSentimentFilter: (state, action: PayloadAction<string>) => {
      state.filters.sentiment = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
        state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSentimentData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSentimentData.fulfilled, (state, action) => {
        state.overview = action.payload.overview;
        state.reviews = action.payload.reviewsData.reviews;
        state.pagination = action.payload.reviewsData.pagination;
        state.loading = false;
      })
      .addCase(getFilteredReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFilteredReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
  },
});

export const { setSentimentFilter, setSearchFilter, setCurrentPage } = sentimentDashboardSlice.actions;

export default sentimentDashboardSlice.reducer;
