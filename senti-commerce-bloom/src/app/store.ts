import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import productSlice from "../features/products/productSlice";
import cartSlice from "../features/cart/cartSlice";
import sentimentSlice from "../features/sentiment/sentimentSlice";
import filtersSlice from "../features/filters/filterSlice";
import orderSlice from "../features/orders/orderSlice";
import customerSlice from "../features/customers/customerSlice";
import sentimentDashboardSlice from "../features/admin/sentimentDashboardSlice";
import wishlistSlice from "../features/wishlist/wishlistSlice";
import categorySlice from "../features/categories/categorySlice";
import reviewSlice from "../features/reviews/reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    sentiment: sentimentSlice,
    filters: filtersSlice,
    orders: orderSlice,
    customers: customerSlice,
    adminSentiment: sentimentDashboardSlice,
    categories: categorySlice,
    reviews: reviewSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
