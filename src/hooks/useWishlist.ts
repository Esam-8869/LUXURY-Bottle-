import { useEffect } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuth } from './useAuth'

export function useWishlist() {
  const store = useWishlistStore()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    async function fetchWishlist() {
      if (!isAuthenticated) return
      store.setLoading(true)
      try {
        const res = await fetch('/api/wishlist')
        if (res.ok) {
          const data = await res.json()
          store.setWishlist(data.data.map((item: any) => item.productId))
        }
      } catch (e) {
        console.error(e)
      } finally {
        store.setLoading(false)
      }
    }
    if (!authLoading) {
      fetchWishlist()
    }
  }, [isAuthenticated, authLoading, store.setWishlist, store.setLoading])

  return store
}

export function useIsWishlisted(productId: string) {
  const store = useWishlistStore()
  return store.productIds.has(productId)
}

export function useToggleWishlist(productId: string) {
  const store = useWishlistStore()
  const { isAuthenticated } = useAuth()

  return async () => {
    if (!isAuthenticated) {
      // Need login, maybe trigger auth modal here
      return
    }
    
    // Optimistic update
    const isCurrentlyWishlisted = store.productIds.has(productId)
    if (isCurrentlyWishlisted) {
      store.removeId(productId)
    } else {
      store.addId(productId)
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      if (!res.ok) {
        // Revert on failure
        if (isCurrentlyWishlisted) store.addId(productId)
        else store.removeId(productId)
      }
    } catch (e) {
      // Revert on failure
      if (isCurrentlyWishlisted) store.addId(productId)
      else store.removeId(productId)
    }
  }
}
