import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockCategories } from '../products/mockProductsData';

// Initial state
const initialState = {
  categories: [],
  category: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all categories
export const getCategories = createAsyncThunk(
  'categories/getAll',
  async (_, thunkAPI) => {
    try {
      // Using mock data instead of API call
      return mockCategories;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get category by slug
export const getCategoryBySlug = createAsyncThunk(
  'categories/getBySlug',
  async (slug, thunkAPI) => {
    try {
      // Using mock data instead of API call
      const category = mockCategories.find(cat => cat.slug === slug);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Category slice
export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get category by slug
      .addCase(getCategoryBySlug.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoryBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.category = action.payload;
      })
      .addCase(getCategoryBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer; 