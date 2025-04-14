import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import productReducer from './features/products/productSlice';
import categoryReducer from './features/categories/categorySlice';
import orderReducer from './features/orders/orderSlice';
import adminReducer from './features/admin/adminSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  categories: categoryReducer,
  orders: orderReducer,
  admin: adminReducer,
});

// Create store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 