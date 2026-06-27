import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '@/types';

export type CartItemWithDetails = CartItem & {
  Product: Product;
  ProductVariant: ProductVariant;
};

interface CartState {
  items: CartItemWithDetails[];
  isOpen: boolean;
  addItem: (item: CartItemWithDetails) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.variant_id === item.variant_id
          );
          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return { items: updatedItems };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === cartItemId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = Number(item.ProductVariant.price);
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'luxury-bottle-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
);
