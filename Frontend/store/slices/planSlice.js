import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "http://localhost:4000/api/v1";

// Async thunks
export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      console.log(`Fetching plans from: ${BASE_URL}/plans`);
      const response = await axios.get(`${BASE_URL}/plans`);
      return response.data;
    } catch (error) {
      console.error("Fetch plans error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch plans");
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  'plans/fetchPlanById',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/plans/${planId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch plan details");
    }
  }
);

export const createPlan = createAsyncThunk(
  'plans/createPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/plans`, planData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create plan");
    }
  }
);

export const updatePlan = createAsyncThunk(
  'plans/updatePlan',
  async ({ planId, planData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update plan");
    }
  }
);

export const deletePlan = createAsyncThunk(
  'plans/deletePlan',
  async (planId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/plans/${planId}`);
      return planId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete plan");
    }
  }
);

// Initial state
const initialState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
};

// Slice
const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Plan By Id
      .addCase(fetchPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Plan
      .addCase(createPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.push(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Plan
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.plans.findIndex(plan => plan._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        if (state.currentPlan && state.currentPlan._id === action.payload._id) {
          state.currentPlan = action.payload;
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Plan
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.filter(plan => plan._id !== action.payload);
        if (state.currentPlan && state.currentPlan._id === action.payload) {
          state.currentPlan = null;
        }
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPlan } = planSlice.actions;
export default planSlice.reducer; 