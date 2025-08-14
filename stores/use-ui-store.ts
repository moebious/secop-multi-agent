import { create } from "zustand"

interface UIState {
  // Modal states
  modals: {
    bidModal: boolean
    detailsModal: boolean
    confirmModal: boolean
  }
  // Loading states
  loading: {
    global: boolean
    sync: boolean
    submit: boolean
  }
  // Toast notifications
  toasts: Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    duration?: number
  }>
  // Mobile navigation
  mobileMenuOpen: boolean
  // Actions
  openModal: (modal: keyof UIState["modals"]) => void
  closeModal: (modal: keyof UIState["modals"]) => void
  setLoading: (key: keyof UIState["loading"], value: boolean) => void
  addToast: (toast: Omit<UIState["toasts"][0], "id">) => void
  removeToast: (id: string) => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  modals: {
    bidModal: false,
    detailsModal: false,
    confirmModal: false,
  },
  loading: {
    global: false,
    sync: false,
    submit: false,
  },
  toasts: [],
  mobileMenuOpen: false,
  openModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: true },
    })),
  closeModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: false },
    })),
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: Date.now().toString(),
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  toggleMobileMenu: () =>
    set((state) => ({
      mobileMenuOpen: !state.mobileMenuOpen,
    })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}))
