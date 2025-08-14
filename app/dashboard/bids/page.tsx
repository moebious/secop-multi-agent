import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Building, Eye, Edit } from "lucide-react"
import Link from "next/link"

export default function BidsPage() {
  const mockProfile = {
    id: "test-user-id",
    full_name: "Test User",
    role: "bidder",
    company_name: "Test Company",
  }

  const mockBids = [
    {
      id: 1,
      bid_amount: 450000000,
      notes: "Propuesta técnica completa",
      status: "submitted",
      created_at: "2024-01-25",
      submitted_at: "2024-01-26",
      procurement: {
        id: 1,
        title: "Servicios de Tecnología - Desarrollo de Software",
        buyer_name: "Ministerio de Tecnologías",
        status: "open",
        closing_date: "2024-02-15",
        tender_value: 500000000,
        currency: "COP",
      },
    },
  ]

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
              <h1 className="text-2xl font-bold text-gray-900">Mis Ofertas</h1>
              <p className="text-gray-600">Gestiona tus ofertas de contratación</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ofertas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockBids?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Borradores</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockBids?.filter((b) => b.status === "draft").length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviadas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockBids?.filter((b) => b.status === "submitted").length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aceptadas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockBids?.filter((b) => b.status === "accepted").length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bids List */}
        <div className="space-y-6">
          {mockBids && mockBids.length > 0 ? (
            mockBids.map((bid) => (
              <Card key={bid.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {bid.procurement?.title || "Proceso no disponible"}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {bid.procurement?.buyer_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Creada: {new Date(bid.created_at).toLocaleDateString("es-CO")}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(bid.status)}>{getStatusText(bid.status)}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Mi Oferta:</span>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatCurrency(bid.bid_amount, bid.procurement?.currency || "COP")}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Valor Estimado:</span>
                      <p className="text-gray-600">
                        {bid.procurement?.tender_value
                          ? formatCurrency(bid.procurement.tender_value, bid.procurement.currency)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Cierre:</span>
                      <p className="text-gray-600">
                        {bid.procurement?.closing_date
                          ? new Date(bid.procurement.closing_date).toLocaleDateString("es-CO")
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Estado Proceso:</span>
                      <p className="text-gray-600 capitalize">{bid.procurement?.status || "N/A"}</p>
                    </div>
                  </div>

                  {bid.notes && (
                    <div>
                      <span className="font-medium text-gray-700">Notas:</span>
                      <p className="text-gray-600 text-sm mt-1">{bid.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {bid.submitted_at
                        ? `Enviada: ${new Date(bid.submitted_at).toLocaleDateString("es-CO")}`
                        : "No enviada"}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/bids/${bid.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                      {bid.status === "draft" && (
                        <Link href={`/dashboard/bids/${bid.id}/edit`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes ofertas</h3>
                <p className="text-gray-600 mb-4">Comienza explorando los procesos de contratación disponibles.</p>
                <Link href="/dashboard/procurements">
                  <Button className="bg-blue-600 hover:bg-blue-700">Explorar Procesos</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
