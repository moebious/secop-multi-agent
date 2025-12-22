import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unread_only") === "true"

    // Mock notifications data
    const mockNotifications = [
      {
        id: 1,
        user_id: "test-user",
        title: "Nueva Oferta Recibida",
        message: "Juan Pérez ha enviado una oferta para 'Servicios de Tecnología'",
        type: "info",
        read: false,
        created_at: new Date().toISOString(),
        procurement_id: "1",
        bid_id: "1",
      },
      {
        id: 2,
        user_id: "test-user",
        title: "Proceso Próximo a Cerrar",
        message: "El proceso 'Suministro de Equipos' cierra en 3 días",
        type: "warning",
        read: false,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        procurement_id: "2",
        bid_id: null,
      },
    ]

    // Apply filters
    let filteredNotifications = mockNotifications

    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter((n) => !n.read)
    }

    return NextResponse.json({
      notifications: filteredNotifications,
      pagination: {
        page,
        limit,
        total: filteredNotifications.length,
        totalPages: Math.ceil(filteredNotifications.length / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, title, message, type, procurement_id, bid_id } = body

    // Mock notification creation
    const mockNotification = {
      id: Date.now(),
      user_id,
      title,
      message,
      type: type || "info",
      procurement_id: procurement_id || null,
      bid_id: bid_id || null,
      read: false,
      created_at: new Date().toISOString(),
    }

    console.log("Mock notification created:", mockNotification)

    return NextResponse.json({ notification: mockNotification, message: "Notification created successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
