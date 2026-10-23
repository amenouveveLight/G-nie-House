import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'glamor_cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { items: [], promoCode: null, discount: 0 };
  } catch {
    return { items: [], promoCode: null, discount: 0 };
  }
}

function saveCart(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* silently fail */ }
}

function cartReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        const newQty = Math.min(existing.quantity + (action.payload.quantity || 1), action.payload.maxStock || 99);
        newState = {
          ...state,
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: newQty }
              : i
          )
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, {
            productId: action.payload.productId,
            name: action.payload.name,
            price: action.payload.price,
            image: action.payload.image,
            quantity: action.payload.quantity || 1,
            maxStock: action.payload.maxStock || 99
          }]
        };
      }
      break;
    }
    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload)
      };
      break;
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        newState = {
          ...state,
          items: state.items.filter(i => i.productId !== productId)
        };
      } else {
        newState = {
          ...state,
          items: state.items.map(i =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          )
        };
      }
      break;
    }
    case 'APPLY_PROMO':
      newState = {
        ...state,
        promoCode: action.payload.code,
        discount: action.payload.discount,
        discountType: action.payload.type
      };
      break;
    case 'REMOVE_PROMO':
      newState = { ...state, promoCode: null, discount: 0, discountType: null };
      break;
    case 'CLEAR_CART':
      newState = { items: [], promoCode: null, discount: 0, discountType: null };
      break;
    default:
      return state;
  }
  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadCart);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  let discountAmount = 0;
  if (state.promoCode) {
    if (state.discountType === 'percentage') {
      discountAmount = Math.round(subtotal * state.discount / 100);
    } else {
      discountAmount = state.discount;
    }
  }

  const value = {
    items: state.items,
    promoCode: state.promoCode,
    discountType: state.discountType,
    discountPercent: state.discount,
    totalItems,
    subtotal,
    discountAmount,
    addItem: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
    removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId }),
    updateQuantity: (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
    applyPromo: (code, discount, type) => dispatch({ type: 'APPLY_PROMO', payload: { code, discount, type } }),
    removePromo: () => dispatch({ type: 'REMOVE_PROMO' }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
