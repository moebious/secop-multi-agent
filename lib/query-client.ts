import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Cache time: how long data stays in cache when unused
      gcTime: 1000 * 60 * 30, // 30 minutes
      // Retry failed requests
      retry: 2,
      // Refetch on window focus for real-time updates
      refetchOnWindowFocus: true,
      // Background refetch interval for cron job updates
      refetchInterval: 1000 * 60 * 2, // 2 minutes
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
})
