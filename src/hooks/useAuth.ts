import { useEffect } from 'react'
import { useAuthStore, User } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading } = useAuthStore()
  const { showToast } = useUIStore()

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    if (isLoading) {
      init()
    }
  }, [isLoading, setUser, setLoading])

  const login = async (data: any) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (res.ok) {
        setUser(result.user)
        showToast('Logged in successfully', 'success')
        return { success: true }
      }
      showToast(result.error || 'Login failed', 'error')
      return { success: false, error: result.error }
    } catch (e) {
      showToast('Network error', 'error')
      return { success: false, error: 'Network error' }
    }
  }

  const register = async (data: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (res.ok) {
        setUser(result.user)
        showToast('Registered successfully', 'success')
        return { success: true }
      }
      showToast(result.error || 'Registration failed', 'error')
      return { success: false, error: result.error }
    } catch (e) {
      showToast('Network error', 'error')
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      showToast('Logged out', 'success')
    } catch (e) {
      console.error(e)
    }
  }

  return { user, isAuthenticated, isLoading, login, register, logout }
}
