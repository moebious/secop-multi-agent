import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Types
interface Procurement {
  id: number
  title: string
  description: string
  buyer_name: string
  buyer_id: string
  tender_value: number
  currency: string
  status: string
  publication_date: string
  closing_date: string
  category: string
  location: string
}

interface ProcurementsResponse {
  procurements: Procurement[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface ProcurementsParams {
  page?: number
  limit?: number
  status?: string
  search?: string
}

// API functions
const fetchProcurements = async (params: ProcurementsParams = {}): Promise<ProcurementsResponse> => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set("page", params.page.toString())
  if (params.limit) searchParams.set("limit", params.limit.toString())
  if (params.status) searchParams.set("status", params.status)
  if (params.search) searchParams.set("search", params.search)

  const response = await fetch(`/api/procurements?${searchParams}`)
  if (!response.ok) throw new Error("Failed to fetch procurements")
  return response.json()
}

const syncProcurements = async (): Promise<{ success: boolean; synced: number; message: string }> => {
  const response = await fetch("/api/procurements/sync", { method: "POST" })
  if (!response.ok) throw new Error("Failed to sync procurements")
  return response.json()
}

// Hooks
export const useProcurements = (params: ProcurementsParams = {}) => {
  return useQuery({
    queryKey: ["procurements", params],
    queryFn: () => fetchProcurements(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // 2 minutes for real-time updates
  })
}

export const useSyncProcurements = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: syncProcurements,
    onSuccess: () => {
      // Invalidate and refetch procurements after sync
      queryClient.invalidateQueries({ queryKey: ["procurements"] })
    },
  })
}
