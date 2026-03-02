
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.productId === product.id);

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: Math.random().toString(36).substr(2, 9),
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity
              }
            ]
          });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          )
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'commerce-stream-cart'
    }
  )
);
