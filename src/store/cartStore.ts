import { create } from 'zustand'

export interface CartItemType {
  id: string
  productId: string
  variantId: string
  quantity: string | number
  product: any
  variant: any
}

interface CartState {
  items: CartItemType[]
  itemCount: number
  subtotal: number
  isOpen: boolean
  isLoading: boolean
  coupon: { code: string; discountValue: number; type: string } | null
  setCartData: (data: { items: CartItemType[]; subtotal?: number }) => void
  setLoading: (loading: boolean) => void
  setOpen: (isOpen: boolean) => void
  setCoupon: (coupon: any) => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  itemCount: 0,
  subtotal: 0,
  isOpen: false,
  isLoading: false,
  coupon: null,
  setCartData: (data) =>
    set((state) => {
      const items = data.items || []
      const itemCount = items.reduce((acc, item) => acc + Number(item.quantity), 0)
      const subtotal =
        data.subtotal ||
        items.reduce((acc, item) => acc + Number(item.variant?.price || 0) * Number(item.quantity), 0)
      return { items, itemCount, subtotal }
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setOpen: (isOpen) => set({ isOpen }),
  setCoupon: (coupon) => set({ coupon }),
}))
