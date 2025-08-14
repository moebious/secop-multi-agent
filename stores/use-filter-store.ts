import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FilterState {
  // Procurement filters
  procurementFilters: {
    search: string
    status: string
    category: string
    department: string
    priority: string
  }
  // Bid filters
  bidFilters: {
    status: string
    procurement_id: string
  }
  // Notification filters
  notificationFilters: {
    unread_only: boolean
    type: string
  }
  // Pagination
  pagination: {
    procurements: { page: number; limit: number }
    bids: { page: number; limit: number }
    notifications: { page: number; limit: number }
  }
  // Actions
  setProcurementFilters: (filters: Partial<FilterState["procurementFilters"]>) => void
  setBidFilters: (filters: Partial<FilterState["bidFilters"]>) => void
  setNotificationFilters: (filters: Partial<FilterState["notificationFilters"]>) => void
  setPagination: (key: keyof FilterState["pagination"], pagination: { page?: number; limit?: number }) => void
  resetFilters: () => void
}

const initialFilters = {
  procurementFilters: {
    search: "",
    status: "all",
    category: "all",
    department: "all",
    priority: "all",
  },
  bidFilters: {
    status: "all",
    procurement_id: "",
  },
  notificationFilters: {
    unread_only: false,
    type: "all",
  },
  pagination: {
    procurements: { page: 1, limit: 20 },
    bids: { page: 1, limit: 20 },
    notifications: { page: 1, limit: 20 },
  },
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialFilters,
      setProcurementFilters: (filters) =>
        set((state) => ({
          procurementFilters: { ...state.procurementFilters, ...filters },
          pagination: {
            ...state.pagination,
            procurements: { ...state.pagination.procurements, page: 1 }, // Reset to first page
          },
        })),
      setBidFilters: (filters) =>
        set((state) => ({
          bidFilters: { ...state.bidFilters, ...filters },
          pagination: {
            ...state.pagination,
            bids: { ...state.pagination.bids, page: 1 },
          },
        })),
      setNotificationFilters: (filters) =>
        set((state) => ({
          notificationFilters: { ...state.notificationFilters, ...filters },
          pagination: {
            ...state.pagination,
            notifications: { ...state.pagination.notifications, page: 1 },
          },
        })),
      setPagination: (key, pagination) =>
        set((state) => ({
          pagination: {
            ...state.pagination,
            [key]: { ...state.pagination[key], ...pagination },
          },
        })),
      resetFilters: () => set(initialFilters),
    }),
    {
      name: "filter-storage",
      partialize: (state) => ({
        procurementFilters: state.procurementFilters,
        bidFilters: state.bidFilters,
        notificationFilters: state.notificationFilters,
      }),
    },
  ),
)
