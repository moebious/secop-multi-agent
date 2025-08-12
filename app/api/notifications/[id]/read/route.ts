import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notificationId = params.id

    // Mock notification update
    const mockNotification = {
      id: notificationId,
      user_id: "test-user",
      title: "Mock Notification",
      message: "This is a mock notification",
      type: "info",
      read: true,
      created_at: new Date().toISOString(),
    }

    console.log("Mock notification marked as read:", notificationId)

    return NextResponse.json({ notification: mockNotification, message: "Notification marked as read" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
