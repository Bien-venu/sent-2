import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiService,
  Product as ApiProduct,
  PaginatedResponse,
} from "../../utils/api";

export interface Product {
  id: number;
  product_name: string;
  description: string;
  price: string; // Backend returns as string
  image_url: string;
  stock: number;
  is_available: boolean;
  category: number; // Category ID
  user: number; // Seller ID
  created_date: string;
  seller_phone_number: string;
  // Optional frontend-only fields for compatibility
  sentiment?: {
    positive: number;
    negative: number;
    neutral: number;
  };
  reviews?: Review[];
}

export interface Review {
  id: number;
  username: string;
  user_email: string;
  user_role: "buyer" | "seller";
  comment: string;
  sentiment: "positive" | "negative" | "neutral";
  rating: number;
  source_url: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  selectedProduct: Product | null;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  selectedProduct: null,
  error: null,
};

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await apiService.getProducts();
    return response.data.results; // Extract results from paginated response
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id: number) => {
    const response = await apiService.getProduct(id);
    return response.data.product;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (
    productData: Omit<
      Product,
      "id" | "user" | "created_date" | "seller_phone_number"
    >
  ) => {
    const response = await apiService.createProduct(productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: number; data: Partial<Product> }) => {
    const response = await apiService.updateProduct(id, data);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number) => {
    await apiService.deleteProduct(id);
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export const {
  setProducts,
  setSelectedProduct,
  clearSelectedProduct,
  clearError,
} = productSlice.actions;
export default productSlice.reducer;
