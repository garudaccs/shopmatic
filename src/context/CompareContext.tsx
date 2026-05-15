'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ProductFull } from '@/lib/types';

interface CompareContextType {
  selectedProducts: ProductFull[];
  addProduct: (product: ProductFull) => void;
  removeProduct: (slug: string) => void;
  clearAll: () => void;
  isSelected: (slug: string) => boolean;
  maxProducts: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = 'shopmatic_compare_products';
const MAX_PRODUCTS = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<ProductFull[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedProducts(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load comparison products from localStorage');
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when selection changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts));
      } catch (e) {
        console.warn('Failed to save comparison products to localStorage');
      }
    }
  }, [selectedProducts, isHydrated]);

  const addProduct = useCallback((product: ProductFull) => {
    setSelectedProducts(prev => {
      if (prev.length >= MAX_PRODUCTS) return prev;
      if (prev.some(p => p.slug === product.slug)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeProduct = useCallback((slug: string) => {
    setSelectedProducts(prev => prev.filter(p => p.slug !== slug));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const isSelected = useCallback((slug: string) => {
    return selectedProducts.some(p => p.slug === slug);
  }, [selectedProducts]);

  return (
    <CompareContext.Provider
      value={{
        selectedProducts,
        addProduct,
        removeProduct,
        clearAll,
        isSelected,
        maxProducts: MAX_PRODUCTS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}