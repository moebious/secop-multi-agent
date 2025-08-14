import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Types
interface Bid {
  id: number
  procurement_id: number
  bidder_id: string
  bid_amount: number
  notes: string
  status: string
  created_at: string
  submitted_at?: string
  technical_score?: number
  financial_score?: number
  total_score?: number
  procurement?: {
    id: number
    title: string
    description: string
    buyer_name: string
    status: string
    closing_date: string
    tender_value: number
    currency: string
  }
  bidder?: {
    id: string
    full_name: string
    company_name: string
    email: string
  }
}

interface BidsResponse {
  bids: Bid[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface BidsParams {
  page?: number
  limit?: number
  status?: string
  procurement_id?: string
}

interface CreateBidData {
  procurement_id: number
  bid_amount: number
  notes: string
}

interface UpdateBidData {
  bid_amount?: number
  notes?: string
  status?: string
  technical_score?: number
  financial_score?: number
}

// API functions
const fetchBids = async (params: BidsParams = {}): Promise<BidsResponse> => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set("page", params.page.toString())
  if (params.limit) searchParams.set("limit", params.limit.toString())
  if (params.status) searchParams.set("status", params.status)
  if (params.procurement_id) searchParams.set("procurement_id", params.procurement_id)

  const response = await fetch(`/api/bids?${searchParams}`)
  if (!response.ok) throw new Error("Failed to fetch bids")
  return response.json()
}

const fetchBid = async (id: string): Promise<{ bid: Bid }> => {
  const response = await fetch(`/api/bids/${id}`)
  if (!response.ok) throw new Error("Failed to fetch bid")
  return response.json()
}

const createBid = async (data: CreateBidData): Promise<{ bid: Bid; message: string }> => {
  const response = await fetch("/api/bids", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create bid")
  return response.json()
}

const updateBid = async ({ id, data }: { id: string; data: UpdateBidData }): Promise<{ bid: Bid; message: string }> => {
  const response = await fetch(`/api/bids/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update bid")
  return response.json()
}

const deleteBid = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`/api/bids/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete bid")
  return response.json()
}

// Hooks
export const useBids = (params: BidsParams = {}) => {
  return useQuery({
    queryKey: ["bids", params],
    queryFn: () => fetchBids(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useBid = (id: string) => {
  return useQuery({
    queryKey: ["bid", id],
    queryFn: () => fetchBid(id),
    enabled: !!id,
  })
}

export const useCreateBid = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bids"] })
    },
  })
}

export const useUpdateBid = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBid,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bids"] })
      queryClient.invalidateQueries({ queryKey: ["bid", variables.id] })
    },
  })
}

export const useDeleteBid = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bids"] })
    },
  })
}
