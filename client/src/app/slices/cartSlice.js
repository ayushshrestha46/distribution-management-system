import { createSlice } from "@reduxjs/toolkit";

// Load cart items from localStorage based on userId
const loadCartFromStorage = (userId) => {
  try {
    if (!userId) return [];
    const storedCart = localStorage.getItem(`cart_${userId}`);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

// Save cart items to localStorage based on userId
const saveCartToStorage = (userId, items) => {
  try {
    if (!userId) return;
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

// Initial state
const initialState = {
  userId: JSON.parse(localStorage.getItem("user"))?._id || null, // Auto-load userId
  items:
    JSON.parse(
      localStorage.getItem(
        `cart_${JSON.parse(localStorage.getItem("user"))?._id}`
      )
    ) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Sync user ID with cart when authenticated
    setUser(state, action) {
      const userId = action.payload;
      state.userId = userId;
      state.items = loadCartFromStorage(userId); // Load cart for this user
    },

    addToCart: (state, action) => {
      if (!state.userId) return; // Prevent adding if no user
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.userId, state.items);
    },

    removeFromCart: (state, action) => {
      if (!state.userId) return;
      state.items = state.items.filter(
        (item) => item._id !== action.payload._id
      );
      saveCartToStorage(state.userId, state.items);
    },

    updateQuantity: (state, action) => {
      if (!state.userId) return;
      const { _id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === _id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      } else if (item && quantity <= 0) {
        state.items = state.items.filter((i) => i._id !== _id);
      }
      saveCartToStorage(state.userId, state.items);
    },

    clearCart: (state) => {
      if (!state.userId) return;
      state.items = [];
      saveCartToStorage(state.userId, state.items);
    },

    // Handle logout (clear user and cart)
    logout: (state) => {
      state.userId = null;
      state.items = [];
    },
  },
});

// Export actions
export const {
  setUser,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  logout,
} = cartSlice.actions;

// Selectors
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + (item.quantity || 0), 0);

export const selectCartItems = (state) => state.cart.items;
export const selectUserId = (state) => state.cart.userId;

export default cartSlice.reducer;
