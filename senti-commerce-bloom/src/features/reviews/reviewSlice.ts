import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService, Review, PaginatedResponse } from "../../utils/api";

interface ReviewState {
  items: Review[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}

const initialState: ReviewState = {
  items: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
};

// Async thunks for review operations
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (params?: {
    user_role?: "buyer" | "seller";
    sentiment?: "positive" | "negative" | "neutral";
    rating?: number;
    search?: string;
    page?: number;
  }) => {
    const response = await apiService.getReviews(params);
    return response.data;
  }
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (data: {
    comment: string;
    sentiment: "positive" | "negative" | "neutral";
    rating: number;
    source_url?: string;
  }) => {
    const response = await apiService.createReview(data);
    return response.data;
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, data }: { id: number; data: Partial<Review> }) => {
    const response = await apiService.updateReview(id, data);
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id: number) => {
    await apiService.deleteReview(id);
    return id;
  }
);

export const fetchMyReviews = createAsyncThunk(
  "reviews/fetchMyReviews",
  async () => {
    const response = await apiService.getMyReviews();
    return response.data.results;
  }
);

export const fetchReviewStats = createAsyncThunk(
  "reviews/fetchReviewStats",
  async () => {
    const response = await apiService.getReviewStats();
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.items = action.payload;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.items.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
      })
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.review);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create review";
      })
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update review";
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete review";
      })
      // Fetch my reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch my reviews";
      });
  },
});

export const { setReviews, addReview, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
