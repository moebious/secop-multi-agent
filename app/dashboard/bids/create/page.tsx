import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import BidForm from "@/components/bid-form"

interface PageProps {
  searchParams: { procurement?: string }
}

export default async function CreateBidPage({ searchParams }: PageProps) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a bidder
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "bidder") {
    redirect("/dashboard")
  }

  const procurementId = searchParams.procurement
  if (!procurementId) {
    redirect("/dashboard/procurements")
  }

  // Get procurement details
  const { data: procurement } = await supabase.from("procurements").select("*").eq("id", procurementId).single()

  if (!procurement) {
    notFound()
  }

  // Check if user already has a bid for this procurement
  const { data: existingBid } = await supabase
    .from("bids")
    .select("id")
    .eq("procurement_id", procurementId)
    .eq("bidder_id", user.id)
    .single()

  if (existingBid) {
    redirect(`/dashboard/bids/${existingBid.id}/edit`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Oferta</h1>
              <p className="text-gray-600">Envía tu propuesta para este proceso de contratación</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BidForm procurement={procurement} mode="create" />
      </main>
    </div>
  )
}
