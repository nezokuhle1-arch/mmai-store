import { createContext, useContext, useReducer } from 'react';

/* ============================================================
   MMAI — CART CONTEXT
   Holds cart items, each carrying an optional customization
   payload: { nameBadge, quote, placement, barcodeId, colorVariant }
   ============================================================ */

const CartContext = createContext(null);

const initialState = {
  items: [],       // [{ id, productId, title, price, size, qty, customization }]
  isOpen: false,   // controls CartDrawer visibility
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      return {
        ...state,
        items: [...state.items, action.payload],
        isOpen: true,
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, qty: action.payload.qty }
            : item
        ),
      };
    }

    case 'UPDATE_CUSTOMIZATION': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                customization: {
                  ...item.customization,
                  ...action.payload.customization,
                },
              }
            : item
        ),
      };
    }

    case 'TOGGLE_CART': {
      return { ...state, isOpen: !state.isOpen };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });

  const updateQuantity = (id, qty) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, qty } });

  const updateCustomization = (id, customization) =>
    dispatch({ type: 'UPDATE_CUSTOMIZATION', payload: { id, customization } });

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    updateCustomization,
    toggleCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
