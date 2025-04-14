import { createSlice } from '@reduxjs/toolkit';

// Get cart items from localStorage
const loadCartFromStorage = () => {
  try {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Save cart items to localStorage
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Initial state
const initialState = {
  cartItems: loadCartFromStorage(),
  loading: false,
  error: null,
};

// Cart slice
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, image, price, quantity = 1 } = action.payload;
      
      // Check if item already exists in cart
      const existingItem = state.cartItems.find(
        (item) => item.productId === productId
      );
      
      if (existingItem) {
        // If item exists, update quantity
        existingItem.quantity += quantity;
      } else {
        // If item doesn't exist, add it to cart
        state.cartItems.push({
          productId,
          name,
          image,
          price,
          quantity,
        });
      }
      
      // Save updated cart to localStorage
      saveCartToStorage(state.cartItems);
    },
    
    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload;
      
      // Find the item to update
      const itemToUpdate = state.cartItems.find(
        (item) => item.productId === productId
      );
      
      if (itemToUpdate) {
        // Update item quantity
        itemToUpdate.quantity = quantity;
      }
      
      // Save updated cart to localStorage
      saveCartToStorage(state.cartItems);
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      
      // Filter out the item to remove
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      );
      
      // Save updated cart to localStorage
      saveCartToStorage(state.cartItems);
    },
    
    clearCart: (state) => {
      // Clear cart
      state.cartItems = [];
      
      // Clear localStorage
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 