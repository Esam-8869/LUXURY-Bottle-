import { create } from 'zustand'

interface WishlistState {
  productIds: Set<string>
  isLoading: boolean
  setWishlist: (productIds: string[]) => void
  addId: (id: string) => void
  removeId: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useWishlistStore = create<WishlistState>((set) => ({
  productIds: new Set(),
  isLoading: false,
  setWishlist: (ids) => set({ productIds: new Set(ids) }),
  addId: (id) =>
    set((state) => {
      const next = new Set(state.productIds)
      next.add(id)
      return { productIds: next }
    }),
  removeId: (id) =>
    set((state) => {
      const next = new Set(state.productIds)
      next.delete(id)
      return { productIds: next }
    }),
  setLoading: (isLoading) => set({ isLoading }),
}))
