import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Mock SECOP II sync functionality
    const mockSyncedData = [
      {
        secop_id: "SECOP-001",
        title: "Servicios de Tecnología - Desarrollo de Software",
        description: "Contratación de servicios para desarrollo de aplicaciones web",
        buyer_name: "Ministerio de Tecnologías de la Información",
        buyer_id: "MIN-TIC-001",
        tender_value: 500000000,
        currency: "COP",
        status: "open",
        publication_date: new Date().toISOString(),
        closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Tecnología",
        location: "Bogotá, Colombia",
      },
      {
        secop_id: "SECOP-002",
        title: "Suministro de Equipos de Oficina",
        description: "Adquisición de mobiliario y equipos para oficinas públicas",
        buyer_name: "Alcaldía Mayor de Bogotá",
        buyer_id: "ALC-BOG-002",
        tender_value: 250000000,
        currency: "COP",
        status: "open",
        publication_date: new Date().toISOString(),
        closing_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Suministros",
        location: "Bogotá, Colombia",
      },
    ]

    console.log("Mock SECOP II sync completed:", mockSyncedData.length, "procurements")

    return NextResponse.json({
      success: true,
      synced: mockSyncedData.length,
      message: `Successfully synced ${mockSyncedData.length} procurement opportunities`,
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
