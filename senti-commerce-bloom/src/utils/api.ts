import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    const token = JSON.parse(storedToken);
    if (token && token.access) {
      config.headers.Authorization = `Bearer ${token.access}`;
    }
  }
  return config;
});

// Types matching real backend API
export interface Category {
  id: number;
  category_name: string;
  description: string;
  cat_image_url: string;
}

export interface Product {
  product: any;
  id: number;
  product_name: string;
  description: string;
  price: string; // Backend returns as string
  image_url: string;
  stock: number;
  is_available: boolean;
  category: number; // Category ID, not name
  user: number; // Seller ID
  created_date: string;
  seller_phone_number: string;
}

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

// Pagination wrapper for list responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Authentication types
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "buyer" | "seller";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  detail: string;
  token: {
    access: string;
    refresh: string;
  };
  user: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: "buyer" | "seller";
  };
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: "buyer" | "seller";
  is_active: boolean;
  date_joined: string;
}

// Order types
export interface Order {
  id: number;
  user_email: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  district: string;
  sector: string;
  cell: string;
  order_total: string;
  tax: string;
  status: "pending" | "processed" | "shipped" | "completed" | "canceled";
  order_number: string;
  is_ordered: boolean;
  created_at: string;
  updated_at: string;
  order_products: OrderProduct[];
  payment_details: Record<string, unknown> | null;
}

export interface OrderProduct {
  id: number;
  product: number;
  product_name: string;
  product_image: string;
  quantity: number;
  product_price: string;
  ordered: boolean;
  created_at: string;
}

export interface CreateOrderRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  district: string;
  sector: string;
  cell: string;
  order_items: {
    product_id: number;
    quantity: number;
  }[];
}

// API Service Functions
export const apiService = {
  // Authentication
  register: (data: RegisterRequest) =>
    api.post<{ detail: string; user: User }>("/accounts/register/", data),
  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/accounts/login/", data),
  refreshToken: (refresh: string) =>
    api.post("/accounts/token/refresh/", { refresh }),
  getUsers: () => api.get<User[]>("/accounts/users/"),

  // Categories
  getCategories: () => api.get<Category[]>("/store/categories/"),
  createCategory: (data: Omit<Category, "id">) =>
    api.post<Category>("/store/categories/", data),

  // Products
  getProducts: () => api.get<PaginatedResponse<Product>>("/store/products/"),
  getProduct: (id: number) => api.get<Product>(`/store/products/${id}/`),
  createProduct: (
    data: Omit<Product, "id" | "user" | "created_date" | "seller_phone_number">
  ) => api.post<Product>("/store/products/", data),
  updateProduct: (id: number, data: Partial<Product>) =>
    api.put<Product>(`/store/products/${id}/`, data),
  deleteProduct: (id: number) => api.delete(`/store/products/${id}/`),

  // Cart Operations
  getCartItems: () => api.get<CartItem[]>("/carts/items/"),
  addToCart: (data: { product: number; quantity: number }) =>
    api.post("/carts/items/add/", data),
  updateCartQuantity: (data: { cart_item_id: number; quantity: number }) =>
    api.put("/carts/items/update-quantity/", data),
  removeFromCart: (id: number) => api.delete(`/carts/items/remove/${id}/`),

  // Reviews
  getReviews: (params?: {
    user_role?: "buyer" | "seller";
    sentiment?: "positive" | "negative" | "neutral";
    rating?: number;
    search?: string;
    page?: number;
  }) => api.get<PaginatedResponse<Review>>("/kikuu/reviews/", { params }),
  createReview: (data: {
    comment: string;
    sentiment: "positive" | "negative" | "neutral";
    rating: number;
    source_url?: string;
  }) => api.post<{ message: string; review: Review }>("/kikuu/reviews/", data),
  updateReview: (id: number, data: Partial<Review>) =>
    api.patch<Review>(`/kikuu/reviews/${id}/`, data),
  deleteReview: (id: number) => api.delete(`/kikuu/reviews/${id}/`),
  getMyReviews: () => api.get<Review[]>("/kikuu/reviews/"),
  getReviewsByRole: (role: "buyer" | "seller") =>
    api.get<Review[]>(`/kikuu/reviews/role/${role}/`),
  getReviewStats: () => api.get("/kikuu/reviews/stats/"),

  // Orders
  getOrders: (params?: { status?: string; page?: number }) =>
    api.get<PaginatedResponse<Order>>("/orders/orders/", { params }),
  createOrder: (data: CreateOrderRequest) =>
    api.post<Order>("/orders/orders/", data),
  updateOrderStatus: (id: number, status: string) =>
    api.patch<Order>(`/orders/orders/${id}/`, { status }),
  getMyOrders: () => api.get<Order[]>("/orders/my-orders/"),
  getSellerOrders: () => api.get<Order[]>("/orders/aseller-orders/"),
  getOrderStats: () => api.get("/orders/orders/stats/"),
  deleteOrder: (id: number) => api.delete(`/orders/orders/${id}/`),

  // Health
  getHealth: () => api.get("/health/"),
  getDetailedHealth: () => api.get("/health/detailed/"),
};

export default api;
