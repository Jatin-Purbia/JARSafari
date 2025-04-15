import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Use the IP address that's working for your other routes
// For local development on Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, localhost works fine
const BASE_URL = "http://172.31.107.222:4000/api/v1";

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log(`Attempting to login to: ${BASE_URL}/auth/login`);
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        await SecureStore.setItemAsync("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      return { token, user };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ firstname, lastname, email, password }, { rejectWithValue }) => {
    try {
      console.log(`Attempting to register at: ${BASE_URL}/auth/register`);
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        firstname,
        lastname,
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        await SecureStore.setItemAsync("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      return { token, user };
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Registration failed. Please try again.");
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await SecureStore.deleteItemAsync("token");
    delete axios.defaults.headers.common["Authorization"];
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 