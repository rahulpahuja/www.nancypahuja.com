import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'np.cart';

type CartItems = Record<string, number>;

interface CartContextValue {
  items: CartItems;
  /** Number of distinct products in the bag. */
  uniqueCount: number;
  /** Total quantity across all products. */
  totalCount: number;
  addItem: (product: string, quantity?: number) => void;
  removeItem: (product: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItems {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CartItems;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItems>(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart stays in-memory for this session */
    }
  }, [items]);

  const addItem = useCallback((product: string, quantity = 1) => {
    const key = product.trim();
    if (!key) return;
    setItems((current) => ({ ...current, [key]: (current[key] ?? 0) + quantity }));
  }, []);

  const removeItem = useCallback((product: string) => {
    setItems((current) => {
      const next = { ...current };
      delete next[product.trim()];
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    uniqueCount: Object.keys(items).length,
    totalCount: Object.values(items).reduce((sum, quantity) => sum + quantity, 0),
    addItem,
    removeItem,
    clear,
  }), [items, addItem, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
