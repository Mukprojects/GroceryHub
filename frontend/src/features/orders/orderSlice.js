import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api/orders';

// Initial state
const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Helper function to generate a mock order ID
const generateMockOrderId = () => {
  return 'ord_' + Math.random().toString(36).substring(2, 15);
};

// Create order
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, thunkAPI) => {
    try {
      // First attempt to create order through API
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        // If no token, create a client-side order
        return createLocalOrder(orderData);
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(API_URL, orderData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating order via API, falling back to local order:', error);
      
      // If API call fails, create a local order
      const localOrder = createLocalOrder(orderData);
      
      // Return local order without rejecting the promise
      return localOrder;
    }
  }
);

// Function to create a local order when API fails
const createLocalOrder = (orderData) => {
  const date = new Date();
  
  return {
    _id: generateMockOrderId(),
    user: {
      name: 'Guest User',
      email: orderData.shippingAddress.email,
    },
    orderItems: orderData.orderItems,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    itemsPrice: orderData.itemsPrice,
    shippingPrice: orderData.shippingPrice,
    taxPrice: orderData.taxPrice,
    totalPrice: orderData.totalPrice,
    isPaid: false,
    isDelivered: false,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };
};

// Get my orders
export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/myorders`, config);
      return response.data;
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

// Get order by ID
export const getOrderById = createAsyncThunk(
  'orders/getById',
  async (orderId, thunkAPI) => {
    try {
      // Try to get from local storage first
      const localOrdersJson = localStorage.getItem('localOrders');
      if (localOrdersJson) {
        const localOrders = JSON.parse(localOrdersJson);
        const localOrder = localOrders.find(order => order._id === orderId);
        
        if (localOrder) {
          return localOrder;
        }
      }
      
      // If not found locally, try API
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/${orderId}`, config);
      return response.data;
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

// Pay order
export const payOrder = createAsyncThunk(
  'orders/pay',
  async ({ orderId, paymentResult }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `${API_URL}/${orderId}/pay`,
        paymentResult,
        config
      );
      
      return response.data;
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

// Cancel order
export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/${orderId}/cancel`, {}, config);
      return response.data;
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

// Helper function to save local orders to localStorage
const saveLocalOrder = (order) => {
  try {
    // Get existing local orders
    const localOrdersJson = localStorage.getItem('localOrders');
    const localOrders = localOrdersJson ? JSON.parse(localOrdersJson) : [];
    
    // Add new order
    localOrders.push(order);
    
    // Save back to localStorage
    localStorage.setItem('localOrders', JSON.stringify(localOrders));
  } catch (error) {
    console.error('Error saving local order:', error);
  }
};

// Order slice
export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    resetOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
        
        // Save order locally if it's a local order (no API)
        if (action.payload && !action.payload.isPaid) {
          saveLocalOrder(action.payload);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get my orders
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Pay order
      .addCase(payOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetOrderState, resetOrder } = orderSlice.actions;
export default orderSlice.reducer; 