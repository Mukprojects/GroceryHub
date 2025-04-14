import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URLs
const PRODUCTS_API_URL = 'http://localhost:5000/api/products';
const ORDERS_API_URL = 'http://localhost:5000/api/orders';

// Initial state
const initialState = {
  allProducts: [],
  allOrders: [],
  selectedProduct: null,
  orderStats: {
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  },
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all orders (admin)
export const getAllOrders = createAsyncThunk(
  'admin/getAllOrders',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Try to get from API first
      try {
        const response = await axios.get(`${ORDERS_API_URL}/admin`, config);
        return response.data;
      } catch (apiError) {
        console.error('Error fetching orders from API, using local orders:', apiError);
        
        // Fallback to local orders if API fails
        const localOrdersJson = localStorage.getItem('localOrders');
        if (localOrdersJson) {
          return JSON.parse(localOrdersJson);
        }
        
        // If no local orders, return empty array
        return [];
      }
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

// Create product (admin)
export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      
      // Try to create via API
      try {
        const response = await axios.post(PRODUCTS_API_URL, productData, config);
        return response.data;
      } catch (apiError) {
        console.error('Error creating product via API, saving locally:', apiError);
        
        // Create local product with mock ID
        const newProduct = {
          ...productData,
          _id: 'prod_' + Math.random().toString(36).substring(2, 15),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Save to local storage
        const localProductsJson = localStorage.getItem('localProducts');
        const localProducts = localProductsJson ? JSON.parse(localProductsJson) : [];
        localProducts.push(newProduct);
        localStorage.setItem('localProducts', JSON.stringify(localProducts));
        
        return newProduct;
      }
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

// Get product by ID (admin)
export const getProductById = createAsyncThunk(
  'admin/getProductById',
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Try to get from API first
      try {
        const response = await axios.get(`${PRODUCTS_API_URL}/${productId}`, config);
        return response.data;
      } catch (apiError) {
        console.error('Error fetching product from API, checking local products:', apiError);
        
        // Fallback to local products if API fails
        const localProductsJson = localStorage.getItem('localProducts');
        if (localProductsJson) {
          const localProducts = JSON.parse(localProductsJson);
          const product = localProducts.find(p => p._id === productId);
          if (product) {
            return product;
          }
        }
        
        // If no product found, try mock data
        try {
          const { getMockProductBySlug } = require('../products/mockProductsData');
          const mockProducts = getMockProductBySlug(productId);
          if (mockProducts) {
            return mockProducts;
          }
        } catch (mockError) {
          console.error('Error getting mock product:', mockError);
        }
        
        return thunkAPI.rejectWithValue('Product not found');
      }
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

// Update product (admin)
export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, productData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      
      // Try to update via API
      try {
        const response = await axios.put(`${PRODUCTS_API_URL}/${id}`, productData, config);
        return response.data;
      } catch (apiError) {
        console.error('Error updating product via API, updating locally:', apiError);
        
        // Update in local storage
        const localProductsJson = localStorage.getItem('localProducts');
        if (localProductsJson) {
          const localProducts = JSON.parse(localProductsJson);
          const index = localProducts.findIndex(p => p._id === id);
          
          if (index !== -1) {
            // Create updated product
            const updatedProduct = {
              ...localProducts[index],
              ...productData,
              updatedAt: new Date().toISOString(),
            };
            
            // Update in array
            localProducts[index] = updatedProduct;
            
            // Save back to localStorage
            localStorage.setItem('localProducts', JSON.stringify(localProducts));
            
            return updatedProduct;
          }
        }
        
        return thunkAPI.rejectWithValue('Product not found for update');
      }
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

// Get all products (admin)
export const getAllProducts = createAsyncThunk(
  'admin/getAllProducts',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Try to get from API first
      try {
        const response = await axios.get(`${PRODUCTS_API_URL}/admin`, config);
        return response.data;
      } catch (apiError) {
        console.error('Error fetching products from API, using local products:', apiError);
        
        // Fallback to local products if API fails
        const localProductsJson = localStorage.getItem('localProducts');
        if (localProductsJson) {
          return JSON.parse(localProductsJson);
        }
        
        // If no local products, try to return products from the product slice mock data
        try {
          const { getMockAllProducts } = require('../products/mockProductsData');
          const { products } = getMockAllProducts({});
          return products;
        } catch (mockError) {
          console.error('Error getting mock products:', mockError);
          return [];
        }
      }
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

// Get order statistics
export const getOrderStatistics = createAsyncThunk(
  'admin/getOrderStatistics',
  async (_, thunkAPI) => {
    try {
      // First try to get all orders
      const orders = await thunkAPI.dispatch(getAllOrders()).unwrap();
      
      // Calculate statistics
      const totalOrders = orders.length;
      const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const pendingOrders = orders.filter(order => !order.isDelivered).length;
      const deliveredOrders = orders.filter(order => order.isDelivered).length;
      
      return {
        totalOrders,
        totalSales,
        pendingOrders,
        deliveredOrders,
      };
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Error fetching order statistics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Admin slice
export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allOrders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allProducts.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get product by ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.selectedProduct = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.selectedProduct = null;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedProduct = action.payload;
        
        // Also update the product in allProducts list
        const index = state.allProducts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.allProducts[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get all products
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allProducts = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get order statistics
      .addCase(getOrderStatistics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOrderStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orderStats = action.payload;
      })
      .addCase(getOrderStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAdminState, clearSelectedProduct } = adminSlice.actions;
export default adminSlice.reducer; 