import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiService,
  Order,
  CreateOrderRequest,
  PaginatedResponse,
} from "../../utils/api";

// Export OrderStatus type for components
export type OrderStatus =
  | "pending"
  | "processed"
  | "shipped"
  | "completed"
  | "canceled";

interface OrderState {
  items: Order[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}

// Async thunks for order operations
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (params?: { status?: string; page?: number }) => {
    const response = await apiService.getOrders(params);
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: CreateOrderRequest) => {
    const response = await apiService.createOrder(orderData);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }: { id: number; status: string }) => {
    const response = await apiService.updateOrderStatus(id, status);
    return response.data;
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async () => {
    const response = await apiService.getMyOrders();
    return response.data;
  }
);

export const fetchSellerOrders = createAsyncThunk(
  "orders/fetchSellerOrders",
  async () => {
    const response = await apiService.getSellerOrders();
    return response.data;
  }
);

export const fetchOrderStats = createAsyncThunk(
  "orders/fetchOrderStats",
  async () => {
    const response = await apiService.getOrderStats();
    return response.data;
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id: number) => {
    await apiService.deleteOrder(id);
    return id;
  }
);

const initialState: OrderState = {
  items: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create order";
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update order status";
      })
      // Fetch my orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch my orders";
      })
      // Fetch seller orders
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch seller orders";
      })
      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((o) => o.id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete order";
      });
  },
});

export const { clearError, setCurrentPage } = orderSlice.actions;
export default orderSlice.reducer;
