
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SentimentData {
  productId: string;
  summary: {
    positive: number;
    negative: number;
    neutral: number;
  };
  trends: {
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }[];
}

interface SentimentState {
  data: SentimentData[];
  loading: boolean;
  overview: {
    totalReviews: number;
    averageSentiment: number;
    positivePercent: number;
    negativePercent: number;
    neutralPercent: number;
  };
}

const initialState: SentimentState = {
  data: [],
  loading: false,
  overview: {
    totalReviews: 0,
    averageSentiment: 0,
    positivePercent: 0,
    negativePercent: 0,
    neutralPercent: 0,
  },
};

const sentimentSlice = createSlice({
  name: 'sentiment',
  initialState,
  reducers: {
    setSentimentData: (state, action: PayloadAction<SentimentData[]>) => {
      state.data = action.payload;
    },
    setOverview: (state, action: PayloadAction<typeof initialState.overview>) => {
      state.overview = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSentimentData, setOverview, setLoading } = sentimentSlice.actions;
export default sentimentSlice.reducer;
