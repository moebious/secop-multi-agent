import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { secopApi } from "@/lib/secop-api"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check if user is authenticated and has admin/procurement officer role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check user role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["administrator", "procurement_officer"].includes(profile.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Fetch procurement data from SECOP II
    const secopData = await secopApi.fetchProcurements(100)
    const processedData = secopData.map((data) => secopApi.transformToProcessedProcurement(data))

    // Upsert procurement data
    const { data: insertedData, error: insertError } = await supabase.from("procurements").upsert(
      processedData.map((proc) => ({
        secop_id: proc.secop_id,
        title: proc.title,
        description: proc.description,
        buyer_name: proc.buyer_name,
        buyer_id: proc.buyer_id,
        tender_value: proc.tender_value,
        currency: proc.currency,
        status: proc.status,
        publication_date: proc.publication_date,
        closing_date: proc.closing_date,
        category: proc.category,
        location: proc.location,
        ocds_data: proc.ocds_data,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "secop_id" },
    )

    if (insertError) {
      console.error("Error syncing procurement data:", insertError)
      return NextResponse.json({ error: "Failed to sync data" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      synced: processedData.length,
      message: `Successfully synced ${processedData.length} procurement opportunities`,
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
