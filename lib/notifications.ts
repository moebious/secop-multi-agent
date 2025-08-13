import { createClient } from "@/lib/supabase/server"

export interface NotificationData {
  user_id: string
  title: string
  message: string
  type?: "info" | "success" | "warning" | "error"
  procurement_id?: string
  bid_id?: string
}

export class NotificationService {
  private supabase = createClient()

  async createNotification(data: NotificationData) {
    try {
      const { data: notification, error } = await this.supabase.from("notifications").insert(data).select().single()

      if (error) {
        console.error("Error creating notification:", error)
        return null
      }

      return notification
    } catch (error) {
      console.error("Notification service error:", error)
      return null
    }
  }

  async createBulkNotifications(notifications: NotificationData[]) {
    try {
      const { data, error } = await this.supabase.from("notifications").insert(notifications).select()

      if (error) {
        console.error("Error creating bulk notifications:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Bulk notification service error:", error)
      return null
    }
  }

  // Notification templates for common events
  async notifyBidSubmitted(bidId: string, procurementTitle: string, bidderName: string) {
    // Get procurement officers and admins to notify
    const { data: officers } = await this.supabase
      .from("profiles")
      .select("id")
      .in("role", ["administrator", "procurement_officer"])

    if (!officers) return

    const notifications = officers.map((officer) => ({
      user_id: officer.id,
      title: "Nueva Oferta Recibida",
      message: `${bidderName} ha enviado una oferta para "${procurementTitle}"`,
      type: "info" as const,
      bid_id: bidId,
    }))

    return this.createBulkNotifications(notifications)
  }

  async notifyBidEvaluated(bidderId: string, procurementTitle: string, status: string, score?: number) {
    const statusMessages = {
      accepted: "¡Felicitaciones! Tu oferta ha sido aceptada",
      rejected: "Tu oferta no ha sido seleccionada",
      under_review: "Tu oferta está siendo evaluada",
    }

    const message = statusMessages[status as keyof typeof statusMessages] || "Tu oferta ha sido actualizada"
    const scoreText = score ? ` (Puntuación: ${score})` : ""

    return this.createNotification({
      user_id: bidderId,
      title: "Evaluación de Oferta",
      message: `${message} para "${procurementTitle}"${scoreText}`,
      type: status === "accepted" ? "success" : status === "rejected" ? "error" : "info",
    })
  }

  async notifyProcurementClosing(procurementId: string, procurementTitle: string, closingDate: string) {
    // Get all bidders who have bids for this procurement
    const { data: bids } = await this.supabase
      .from("bids")
      .select("bidder_id")
      .eq("procurement_id", procurementId)
      .eq("status", "draft")

    if (!bids) return

    const uniqueBidders = [...new Set(bids.map((bid) => bid.bidder_id))]

    const notifications = uniqueBidders.map((bidderId) => ({
      user_id: bidderId,
      title: "Proceso Próximo a Cerrar",
      message: `El proceso "${procurementTitle}" cierra el ${new Date(closingDate).toLocaleDateString("es-CO")}. Asegúrate de enviar tu oferta.`,
      type: "warning" as const,
      procurement_id: procurementId,
    }))

    return this.createBulkNotifications(notifications)
  }

  async notifyNewProcurement(procurementTitle: string, category: string) {
    // Get all bidders to notify about new procurement
    const { data: bidders } = await this.supabase.from("profiles").select("id").eq("role", "bidder")

    if (!bidders) return

    const notifications = bidders.map((bidder) => ({
      user_id: bidder.id,
      title: "Nuevo Proceso Disponible",
      message: `Nuevo proceso de contratación disponible: "${procurementTitle}" en la categoría ${category}`,
      type: "info" as const,
    }))

    return this.createBulkNotifications(notifications)
  }
}

export const notificationService = new NotificationService()
