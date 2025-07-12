import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService, CartItem as ApiCartItem } from "../../utils/api";

export interface CartItem {
  id: number;
  product: {
    id: number;
    product_name: string;
    price: string;
    image_url: string;
  };
  quantity: number;
  is_active: boolean;
  sub_total: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
  loading: false,
  error: null,
};

// Async thunks for cart operations
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const response = await apiService.getCartItems();
    return response.data;
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (data: { product: number; quantity: number }) => {
    const response = await apiService.addToCart(data);
    return response.data;
  }
);

export const updateCartQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async (data: { cart_item_id: number; quantity: number }) => {
    const response = await apiService.updateCartQuantity(data);
    return response.data;
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (id: number) => {
    await apiService.removeFromCart(id);
    return id;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce(
          (sum, item) => sum + parseFloat(item.sub_total),
          0
        );
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart items";
      })
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Handle successful cart addition - you might want to refetch cart items
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add to cart";
      })
      // Update cart quantity
      .addCase(updateCartQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Handle successful quantity update
      })
      .addCase(updateCartQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update quantity";
      })
      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total = state.items.reduce(
          (sum, item) => sum + parseFloat(item.sub_total),
          0
        );
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove from cart";
      });
  },
});

export const { toggleCart, clearCart, setCartItems, clearError } =
  cartSlice.actions;
export default cartSlice.reducer;
