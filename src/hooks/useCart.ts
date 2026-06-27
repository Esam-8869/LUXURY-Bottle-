import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from './useAuth'

export function useCart() {
  const store = useCartStore()
  const { showToast } = useUIStore()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Fetch cart
  const fetchCart = async () => {
    store.setLoading(true)
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        store.setCartData(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch cart', error)
    } finally {
      store.setLoading(false)
    }
  }

  // Auto fetch when auth status changes
  useEffect(() => {
    if (!authLoading) {
      fetchCart()
    }
  }, [isAuthenticated, authLoading])

  const addItem = async (productId: string, variantId: string, quantity: number) => {
    store.setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variantId, quantity })
      })
      const data = await res.json()
      if (res.ok) {
        store.setCartData(data.data)
        showToast('Added to cart', 'success')
        store.setOpen(true)
      } else {
        showToast(data.error || 'Failed to add item', 'error')
      }
    } catch (error) {
      showToast('Network error', 'error')
    } finally {
      store.setLoading(false)
    }
  }

  const updateItem = async (cartItemId: string, quantity: number) => {
    store.setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity })
      })
      const data = await res.json()
      if (res.ok) {
        store.setCartData(data.data)
      } else {
        showToast(data.error || 'Failed to update item', 'error')
      }
    } catch (error) {
      showToast('Network error', 'error')
    } finally {
      store.setLoading(false)
    }
  }

  const removeItem = (cartItemId: string) => updateItem(cartItemId, 0)

  const applyCoupon = async (code: string) => {
    store.setLoading(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: store.subtotal })
      })
      const data = await res.json()
      if (res.ok && data.data.valid) {
        store.setCoupon({
          code,
          type: data.data.discountType,
          discountValue: data.data.calculatedDiscount
        })
        showToast('Coupon applied', 'success')
      } else {
        showToast(data.error || data.data?.message || 'Invalid coupon', 'error')
      }
    } catch (error) {
      showToast('Network error', 'error')
    } finally {
      store.setLoading(false)
    }
  }

  const removeCoupon = () => store.setCoupon(null)

  const clearCart = async () => {
    try {
      await fetch('/api/cart', { method: 'DELETE' })
      store.setCartData({ items: [], subtotal: 0 })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    ...store,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  }
}

export function useCartCount() {
  return useCartStore(state => state.itemCount)
}

export function useCartItem(variantId: string) {
  return useCartStore(state => state.items.find(i => i.variantId === variantId))
}
