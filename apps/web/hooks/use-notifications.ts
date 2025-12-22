import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Types
interface Notification {
  id: number
  user_id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
  procurement_id?: string
  bid_id?: string
}

interface NotificationsResponse {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface NotificationsParams {
  page?: number
  limit?: number
  unread_only?: boolean
}

interface CreateNotificationData {
  user_id: string
  title: string
  message: string
  type?: string
  procurement_id?: string
  bid_id?: string
}

// API functions
const fetchNotifications = async (params: NotificationsParams = {}): Promise<NotificationsResponse> => {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set("page", params.page.toString())
  if (params.limit) searchParams.set("limit", params.limit.toString())
  if (params.unread_only) searchParams.set("unread_only", "true")

  const response = await fetch(`/api/notifications?${searchParams}`)
  if (!response.ok) throw new Error("Failed to fetch notifications")
  return response.json()
}

const markNotificationAsRead = async (id: string): Promise<{ notification: Notification; message: string }> => {
  const response = await fetch(`/api/notifications/${id}/read`, { method: "PUT" })
  if (!response.ok) throw new Error("Failed to mark notification as read")
  return response.json()
}

const markAllNotificationsAsRead = async (): Promise<{ message: string }> => {
  const response = await fetch("/api/notifications/mark-all-read", { method: "PUT" })
  if (!response.ok) throw new Error("Failed to mark all notifications as read")
  return response.json()
}

const createNotification = async (
  data: CreateNotificationData,
): Promise<{ notification: Notification; message: string }> => {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create notification")
  return response.json()
}

// Hooks
export const useNotifications = (params: NotificationsParams = {}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => fetchNotifications(params),
    staleTime: 1000 * 30, // 30 seconds for real-time notifications
    refetchInterval: 1000 * 60, // 1 minute
  })
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export const useCreateNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
