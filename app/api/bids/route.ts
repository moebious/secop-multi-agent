import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const procurementId = searchParams.get("procurement_id")

    // Mock bids data
    const mockBids = [
      {
        id: 1,
        procurement_id: 1,
        bidder_id: "test-bidder-1",
        bid_amount: 450000000,
        notes: "Propuesta técnica completa con experiencia comprobada",
        status: "submitted",
        created_at: "2024-01-25",
        procurement: {
          id: 1,
          title: "Servicios de Tecnología - Desarrollo de Software",
          buyer_name: "Ministerio de Tecnologías",
          status: "open",
          closing_date: "2024-02-15",
        },
        bidder: {
          id: "test-bidder-1",
          full_name: "Juan Pérez",
          company_name: "TechSolutions S.A.S.",
        },
      },
    ]

    // Apply filters
    let filteredBids = mockBids

    if (status && status !== "all") {
      filteredBids = filteredBids.filter((b) => b.status === status)
    }

    if (procurementId) {
      filteredBids = filteredBids.filter((b) => b.procurement_id.toString() === procurementId)
    }

    return NextResponse.json({
      bids: filteredBids,
      pagination: {
        page,
        limit,
        total: filteredBids.length,
        totalPages: Math.ceil(filteredBids.length / limit),
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
    const { procurement_id, bid_amount, notes } = body

    // Mock bid creation
    const mockBid = {
      id: Date.now(),
      procurement_id,
      bidder_id: "test-user",
      bid_amount: Number.parseFloat(bid_amount),
      notes,
      status: "draft",
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({ bid: mockBid, message: "Bid created successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
