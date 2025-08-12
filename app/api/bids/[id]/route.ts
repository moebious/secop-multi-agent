import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bidId = params.id

    // Mock bid data
    const mockBid = {
      id: bidId,
      procurement_id: 1,
      bidder_id: "test-user",
      bid_amount: 450000000,
      notes: "Propuesta técnica completa con experiencia comprobada",
      status: "submitted",
      created_at: "2024-01-25",
      submitted_at: "2024-01-26",
      technical_score: 85,
      financial_score: 90,
      total_score: 87.5,
      procurement: {
        id: 1,
        title: "Servicios de Tecnología - Desarrollo de Software",
        description: "Contratación de servicios para desarrollo de aplicaciones web",
        buyer_name: "Ministerio de Tecnologías",
        status: "open",
        closing_date: "2024-02-15",
        tender_value: 500000000,
        currency: "COP",
      },
      bidder: {
        id: "test-user",
        full_name: "Juan Pérez",
        company_name: "TechSolutions S.A.S.",
        email: "juan@techsolutions.com",
      },
    }

    return NextResponse.json({ bid: mockBid })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bidId = params.id
    const body = await request.json()

    const { bid_amount, notes, status, technical_score, financial_score } = body

    // Mock bid update
    const updatedBid = {
      id: bidId,
      bid_amount: bid_amount ? Number.parseFloat(bid_amount) : 450000000,
      notes: notes || "Updated notes",
      status: status || "submitted",
      technical_score: technical_score ? Number.parseFloat(technical_score) : null,
      financial_score: financial_score ? Number.parseFloat(financial_score) : null,
      total_score:
        technical_score && financial_score
          ? (Number.parseFloat(technical_score) + Number.parseFloat(financial_score)) / 2
          : null,
      updated_at: new Date().toISOString(),
    }

    console.log("Mock bid updated:", updatedBid)

    return NextResponse.json({ bid: updatedBid, message: "Bid updated successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bidId = params.id

    console.log("Mock bid deleted:", bidId)

    return NextResponse.json({ message: "Bid deleted successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
