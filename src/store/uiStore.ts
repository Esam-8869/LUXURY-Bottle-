import { create } from 'zustand'

interface Toast {
  id: string
  message: string
  type?: 'success' | 'error' | 'info'
}

interface UiState {
  isSidebarOpen: boolean
  isSearchOpen: boolean
  activeModal: string | null
  toasts: Toast[]
  
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  toggleSearch: () => void
  setSearchOpen: (isOpen: boolean) => void
  setActiveModal: (modal: string | null) => void
  showToast: (message: string, type?: Toast['type']) => void
  dismissToast: (id: string) => void
}

export const useUIStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  isSearchOpen: false,
  activeModal: null,
  toasts: [],
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  
  setActiveModal: (activeModal) => set({ activeModal }),
  
  showToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },
  
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
}))
