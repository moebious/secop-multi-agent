export interface NotificationData {
  user_id: string
  title: string
  message: string
  type?: "info" | "success" | "warning" | "error"
  procurement_id?: string
  bid_id?: string
}

export class NotificationService {
  async createNotification(data: NotificationData) {
    try {
      // Mock notification creation
      console.log("Mock notification created:", data)
      return {
        id: Date.now().toString(),
        ...data,
        read: false,
        created_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Notification service error:", error)
      return null
    }
  }

  async createBulkNotifications(notifications: NotificationData[]) {
    try {
      // Mock bulk notification creation
      console.log("Mock bulk notifications created:", notifications.length)
      return notifications.map((data, index) => ({
        id: (Date.now() + index).toString(),
        ...data,
        read: false,
        created_at: new Date().toISOString(),
      }))
    } catch (error) {
      console.error("Bulk notification service error:", error)
      return null
    }
  }

  // Notification templates for common events
  async notifyBidSubmitted(bidId: string, procurementTitle: string, bidderName: string) {
    console.log(`Mock notification: Bid submitted by ${bidderName} for ${procurementTitle}`)
    return null
  }

  async notifyBidEvaluated(bidderId: string, procurementTitle: string, status: string, score?: number) {
    console.log(`Mock notification: Bid evaluated for ${procurementTitle} - Status: ${status}`)
    return null
  }

  async notifyProcurementClosing(procurementId: string, procurementTitle: string, closingDate: string) {
    console.log(`Mock notification: Procurement ${procurementTitle} closing on ${closingDate}`)
    return null
  }

  async notifyNewProcurement(procurementTitle: string, category: string) {
    console.log(`Mock notification: New procurement ${procurementTitle} in ${category}`)
    return null
  }
}

export const notificationService = new NotificationService()
