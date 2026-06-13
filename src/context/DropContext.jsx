import { createContext, useContext, useState, useEffect } from 'react';
import products from '../data/products.json';

/* ============================================================
   MMAI — DROP CONTEXT
   Tracks the active drop, its products, and stock levels.
   Phase 1: reads from mock data. Phase 4: replace with
   Shopify Storefront API calls (see src/api/shopify.js).
   ============================================================ */

const DropContext = createContext(null);

export function DropProvider({ children }) {
  const [activeDrop, setActiveDrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Phase 1: mock data. Phase 4: fetch from Shopify.
    setActiveDrop({
      id: 'drop-001',
      name: 'Drop 001',
      isLive: true,
      closesAt: null, // set a Date for countdown
      products,
    });
    setLoading(false);
  }, []);

  const value = {
    activeDrop,
    loading,
  };

  return <DropContext.Provider value={value}>{children}</DropContext.Provider>;
}

export function useDrop() {
  const context = useContext(DropContext);
  if (!context) {
    throw new Error('useDrop must be used within a DropProvider');
  }
  return context;
}
