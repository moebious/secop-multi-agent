import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const bidId = params.id

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Build query with proper access control
    let query = supabase
      .from("bids")
      .select(
        `
        *,
        procurement:procurements(*),
        bidder:profiles(id, full_name, company_name, email)
      `,
      )
      .eq("id", bidId)

    // Apply access control based on role
    if (profile.role === "bidder") {
      query = query.eq("bidder_id", user.id)
    }
    // Procurement officers and administrators can see all bids

    const { data: bid, error } = await query.single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Bid not found or access denied" }, { status: 404 })
      }
      console.error("Error fetching bid:", error)
      return NextResponse.json({ error: "Failed to fetch bid" }, { status: 500 })
    }

    return NextResponse.json({ bid })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const bidId = params.id
    const body = await request.json()

    const { bid_amount, notes, status, technical_score, financial_score } = body

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile and existing bid
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    const { data: existingBid } = await supabase.from("bids").select("*").eq("id", bidId).single()

    if (!profile || !existingBid) {
      return NextResponse.json({ error: "Bid not found or access denied" }, { status: 404 })
    }

    // Prepare update data based on user role
    let updateData: any = { updated_at: new Date().toISOString() }

    if (profile.role === "bidder" && existingBid.bidder_id === user.id) {
      // Bidders can only update their own bids and only if in draft status
      if (existingBid.status !== "draft") {
        return NextResponse.json({ error: "Cannot modify submitted bid" }, { status: 400 })
      }
      updateData = {
        ...updateData,
        bid_amount: bid_amount ? Number.parseFloat(bid_amount) : existingBid.bid_amount,
        notes: notes !== undefined ? notes : existingBid.notes,
        status: status === "submitted" ? "submitted" : existingBid.status,
        submitted_at: status === "submitted" ? new Date().toISOString() : existingBid.submitted_at,
      }
    } else if (["procurement_officer", "administrator"].includes(profile.role)) {
      // Procurement officers can update scores and status
      updateData = {
        ...updateData,
        technical_score:
          technical_score !== undefined ? Number.parseFloat(technical_score) : existingBid.technical_score,
        financial_score:
          financial_score !== undefined ? Number.parseFloat(financial_score) : existingBid.financial_score,
        status: status || existingBid.status,
      }

      // Calculate total score if both scores are provided
      if (updateData.technical_score !== null && updateData.financial_score !== null) {
        updateData.total_score = (updateData.technical_score + updateData.financial_score) / 2
      }
    } else {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Update the bid
    const { data: updatedBid, error: updateError } = await supabase
      .from("bids")
      .update(updateData)
      .eq("id", bidId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating bid:", updateError)
      return NextResponse.json({ error: "Failed to update bid" }, { status: 500 })
    }

    return NextResponse.json({ bid: updatedBid, message: "Bid updated successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const bidId = params.id

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile and existing bid
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    const { data: existingBid } = await supabase.from("bids").select("*").eq("id", bidId).single()

    if (!profile || !existingBid) {
      return NextResponse.json({ error: "Bid not found or access denied" }, { status: 404 })
    }

    // Only bidders can delete their own bids, and only if in draft status
    if (profile.role !== "bidder" || existingBid.bidder_id !== user.id) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    if (existingBid.status !== "draft") {
      return NextResponse.json({ error: "Cannot delete submitted bid" }, { status: 400 })
    }

    // Delete the bid
    const { error: deleteError } = await supabase.from("bids").delete().eq("id", bidId)

    if (deleteError) {
      console.error("Error deleting bid:", deleteError)
      return NextResponse.json({ error: "Failed to delete bid" }, { status: 500 })
    }

    return NextResponse.json({ message: "Bid deleted successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
