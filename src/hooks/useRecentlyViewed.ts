import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

export function useRecentlyViewed() {
  const { user, isAuthenticated } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      if (isAuthenticated && user?.id) {
        try {
          const res = await fetch(`/api/history/${user.id}`)
          if (res.ok) {
            const data = await res.json()
            setItems(data.data)
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        // Guest mode fallback (localStorage)
        try {
          const local = localStorage.getItem('recentlyViewed')
          if (local) setItems(JSON.parse(local))
        } catch (e) {}
      }
      setLoading(false)
    }
    load()
  }, [isAuthenticated, user?.id])

  const addView = async (product: any) => {
    if (isAuthenticated) {
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        })
      } catch (e) {
        console.error(e)
      }
    } else {
      // LocalStorage update
      try {
        let local: any[] = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        local = local.filter((i) => i.id !== product.id)
        local.unshift(product)
        if (local.length > 10) local.pop()
        localStorage.setItem('recentlyViewed', JSON.stringify(local))
        setItems(local)
      } catch (e) {}
    }
  }

  return { items, loading, addView }
}
