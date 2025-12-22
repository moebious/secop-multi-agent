import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Mock procurement data
    const mockProcurements = [
      {
        id: 1,
        title: "Servicios de Tecnología - Desarrollo de Software",
        description: "Contratación de servicios para desarrollo de aplicaciones web",
        buyer_name: "Ministerio de Tecnologías de la Información",
        buyer_id: "MIN-TIC-001",
        tender_value: 500000000,
        currency: "COP",
        status: "open",
        publication_date: "2024-01-15",
        closing_date: "2024-02-15",
        category: "Tecnología",
        location: "Bogotá, Colombia",
      },
      {
        id: 2,
        title: "Suministro de Equipos de Oficina",
        description: "Adquisición de mobiliario y equipos para oficinas públicas",
        buyer_name: "Alcaldía Mayor de Bogotá",
        buyer_id: "ALC-BOG-002",
        tender_value: 250000000,
        currency: "COP",
        status: "open",
        publication_date: "2024-01-20",
        closing_date: "2024-02-20",
        category: "Suministros",
        location: "Bogotá, Colombia",
      },
    ]

    // Apply filters
    let filteredProcurements = mockProcurements

    if (status && status !== "all") {
      filteredProcurements = filteredProcurements.filter((p) => p.status === status)
    }

    if (search) {
      filteredProcurements = filteredProcurements.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.buyer_name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      procurements: filteredProcurements,
      pagination: {
        page,
        limit,
        total: filteredProcurements.length,
        totalPages: Math.ceil(filteredProcurements.length / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
