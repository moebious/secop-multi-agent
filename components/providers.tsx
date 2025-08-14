"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"
import { ThemeProvider } from "./theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each user session
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
