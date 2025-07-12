import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService, RegisterRequest, LoginRequest } from "../../utils/api";

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: "seller" | "buyer";
  is_active: boolean;
  date_joined: string;
}

interface AuthState {
  user: User | null;
  token: {
    access: string;
    refresh: string;
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Async thunks for authentication
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterRequest) => {
    const response = await apiService.register(userData);
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest) => {
    const response = await apiService.login(credentials);
    return response.data;
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string) => {
    const response = await apiService.refreshToken(refreshToken);
    return response.data;
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    loadUserFromStorage: (state) => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          const token = JSON.parse(storedToken);
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } catch (err) {
          console.error("Failed to parse user from storage", err);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // Registration successful, but user needs to login
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      })
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Map the API response to our User interface
        state.user = {
          id: 0, // Will be set by backend
          email: action.payload.user.email,
          username: action.payload.user.username,
          first_name: action.payload.user.first_name,
          last_name: action.payload.user.last_name,
          role: action.payload.user.role,
          is_active: true,
          date_joined: new Date().toISOString(),
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        if (state.token) {
          state.token.access = action.payload.access;
          localStorage.setItem("token", JSON.stringify(state.token));
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        // Token refresh failed, logout user
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  },
});

export const { logout, clearError, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
