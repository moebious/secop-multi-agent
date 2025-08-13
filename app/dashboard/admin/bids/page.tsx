import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, Star, Eye, Edit } from "lucide-react"
import Link from "next/link"

export default async function AdminBidsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has admin or procurement officer role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !["administrator", "procurement_officer"].includes(profile.role)) {
    redirect("/dashboard")
  }

  // Get all bids with related data
  const { data: bids } = await supabase
    .from("bids")
    .select(
      `
      *,
      procurement:procurements(id, title, buyer_name, status, closing_date, tender_value, currency),
      bidder:profiles(id, full_name, company_name, email)
    `,
    )
    .order("created_at", { ascending: false })

  // Get bid statistics
  const bidStats =
    bids?.reduce(
      (acc, bid) => {
        acc[bid.status] = (acc[bid.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Borrador"
      case "submitted":
        return "Enviada"
      case "under_review":
        return "En Revisión"
      case "accepted":
        return "Aceptada"
      case "rejected":
        return "Rechazada"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evaluación de Ofertas</h1>
              <p className="text-gray-600">Revisa y evalúa las ofertas de los procesos</p>
            </div>
            <Link href="/dashboard/admin">
              <Button variant="outline">Volver al Admin</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bid Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {Object.entries(bidStats).map(([status, count]) => (
            <Card key={status}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{getStatusText(status)}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">ofertas</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Buscar Ofertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar por proceso, empresa o oferente..." className="pl-10" />
              </div>
              <Button variant="outline">Filtrar por Estado</Button>
              <Button variant="outline">Filtrar por Proceso</Button>
            </div>
          </CardContent>
        </Card>

        {/* Bids List */}
        <Card>
          <CardHeader>
            <CardTitle>Ofertas ({bids?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bids && bids.length > 0 ? (
                bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-medium text-gray-900">{bid.procurement?.title}</h3>
                        <Badge className={getStatusColor(bid.status)}>{getStatusText(bid.status)}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Oferente:</span>
                          <p>{bid.bidder?.full_name}</p>
                          <p className="text-xs">{bid.bidder?.company_name}</p>
                        </div>
                        <div>
                          <span className="font-medium">Monto:</span>
                          <p className="font-semibold text-blue-600">
                            {formatCurrency(bid.bid_amount, bid.procurement?.currency || "COP")}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Fecha:</span>
                          <p>{new Date(bid.created_at).toLocaleDateString("es-CO")}</p>
                        </div>
                        <div>
                          <span className="font-medium">Puntuación:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{bid.total_score ? bid.total_score.toFixed(1) : "Sin evaluar"}</span>
                          </div>
                        </div>
                      </div>

                      {bid.notes && <p className="text-sm text-gray-600 mt-2 italic">Notas: {bid.notes}</p>}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Link href={`/dashboard/admin/bids/${bid.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                      {bid.status === "submitted" && (
                        <Link href={`/dashboard/admin/bids/${bid.id}/evaluate`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Edit className="h-4 w-4 mr-1" />
                            Evaluar
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ofertas</h3>
                  <p className="text-gray-600">Las ofertas enviadas aparecerán aquí para evaluación.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
