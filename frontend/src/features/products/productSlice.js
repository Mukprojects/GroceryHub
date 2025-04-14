import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getFeaturedProducts as getMockFeaturedProducts, 
  getProductBySlug as getMockProductBySlug,
  getAllProducts as getMockAllProducts
} from './mockProductsData';

// Initial state
const initialState = {
  products: [],
  selectedProduct: null,
  featuredProducts: [],
  loading: false,
  error: null,
  success: false,
  message: '',
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

// Get all products
export const getProducts = createAsyncThunk(
  'products/getAll',
  async (params, thunkAPI) => {
    try {
      // Using mock data instead of API call
      const { products, pagination } = getMockAllProducts(params);
      return { products, ...pagination };
    } catch (error) {
      console.error('Get products error:', error);
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

// Get featured products
export const getFeaturedProducts = createAsyncThunk(
  'products/getFeatured',
  async (limit = 8, thunkAPI) => {
    try {
      // Using mock data instead of API call
      return getMockFeaturedProducts().slice(0, limit);
    } catch (error) {
      console.error('Get featured products error:', error);
      // Return empty array instead of rejecting with error
      return [];
    }
  }
);

// Get product by slug
export const getProductBySlug = createAsyncThunk(
  'products/getBySlug',
  async (slug, thunkAPI) => {
    try {
      // Using mock data instead of API call
      const product = getMockProductBySlug(slug);
      if (!product) {
        return thunkAPI.rejectWithValue('Product not found');
      }
      return product;
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

// Add product review
export const addProductReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, reviewData }, thunkAPI) => {
    try {
      // For mock data, just return success
      return { success: true };
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

// Product slice
export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    resetProductDetail: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      })
      // Get featured products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.featuredProducts = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state) => {
        state.loading = false;
        state.featuredProducts = [];
      })
      // Get product by slug
      .addCase(getProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(getProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedProduct = null;
      })
      // Add product review
      .addCase(addProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState, resetProductDetail } = productSlice.actions;
export default productSlice.reducer; 