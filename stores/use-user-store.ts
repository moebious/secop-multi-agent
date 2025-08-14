import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  full_name: string
  email: string
  company_name?: string
  role: "administrator" | "bidder" | "buyer" | "evaluator"
  avatar?: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  preferences: {
    language: string
    theme: string
    notifications: boolean
  }
  // Actions
  setUser: (user: User) => void
  clearUser: () => void
  updatePreferences: (preferences: Partial<UserState["preferences"]>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: "test-user",
        full_name: "Usuario Administrador",
        email: "admin@secop.gov.co",
        company_name: "SECOP II Platform",
        role: "administrator",
      },
      isAuthenticated: true,
      preferences: {
        language: "es",
        theme: "light",
        notifications: true,
      },
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
      }),
    },
  ),
)
