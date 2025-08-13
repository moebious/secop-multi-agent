import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const procurementId = searchParams.get("procurement_id")

    const offset = (page - 1) * limit

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Build query based on user role
    let query = supabase
      .from("bids")
      .select(
        `
        *,
        procurement:procurements(id, title, buyer_name, status, closing_date),
        bidder:profiles(id, full_name, company_name)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter based on user role
    if (profile.role === "bidder") {
      query = query.eq("bidder_id", user.id)
    } else if (profile.role === "procurement_officer") {
      // Procurement officers can see all bids
    } else if (profile.role !== "administrator") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Apply additional filters
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (procurementId) {
      query = query.eq("procurement_id", procurementId)
    }

    const { data: bids, error, count } = await query

    if (error) {
      console.error("Error fetching bids:", error)
      return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
    }

    return NextResponse.json({
      bids,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { procurement_id, bid_amount, notes } = body

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is a bidder
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "bidder") {
      return NextResponse.json({ error: "Only bidders can create bids" }, { status: 403 })
    }

    // Validate procurement exists and is open
    const { data: procurement } = await supabase
      .from("procurements")
      .select("id, status, closing_date")
      .eq("id", procurement_id)
      .single()

    if (!procurement) {
      return NextResponse.json({ error: "Procurement not found" }, { status: 404 })
    }

    if (procurement.status !== "open") {
      return NextResponse.json({ error: "Procurement is not open for bidding" }, { status: 400 })
    }

    // Check if closing date has passed
    if (new Date(procurement.closing_date) < new Date()) {
      return NextResponse.json({ error: "Procurement bidding period has closed" }, { status: 400 })
    }

    // Check if user already has a bid for this procurement
    const { data: existingBid } = await supabase
      .from("bids")
      .select("id")
      .eq("procurement_id", procurement_id)
      .eq("bidder_id", user.id)
      .single()

    if (existingBid) {
      return NextResponse.json({ error: "You already have a bid for this procurement" }, { status: 400 })
    }

    // Create the bid
    const { data: bid, error: insertError } = await supabase
      .from("bids")
      .insert({
        procurement_id,
        bidder_id: user.id,
        bid_amount: Number.parseFloat(bid_amount),
        notes,
        status: "draft",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating bid:", insertError)
      return NextResponse.json({ error: "Failed to create bid" }, { status: 500 })
    }

    return NextResponse.json({ bid, message: "Bid created successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
