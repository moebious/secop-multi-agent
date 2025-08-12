import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Building, DollarSign, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Procurement {
  id: string
  secop_id: string
  title: string
  description: string
  buyer_name: string
  tender_value: number
  currency: string
  status: string
  publication_date: string
  closing_date: string
  category: string
  location: string
}

interface ProcurementCardProps {
  procurement: Procurement
  showBidButton?: boolean
}

export default function ProcurementCard({ procurement, showBidButton = true }: ProcurementCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "awarded":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Abierto"
      case "closed":
        return "Cerrado"
      case "awarded":
        return "Adjudicado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{procurement.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">ID: {procurement.secop_id}</p>
          </div>
          <Badge className={getStatusColor(procurement.status)}>{getStatusText(procurement.status)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm line-clamp-3">{procurement.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Building className="h-4 w-4" />
            <span className="truncate">{procurement.buyer_name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{procurement.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">{formatCurrency(procurement.tender_value, procurement.currency)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Cierra: {formatDate(procurement.closing_date)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-xs">
            {procurement.category}
          </Badge>

          {showBidButton && procurement.status === "open" && (
            <div className="flex gap-2">
              <Link href={`/dashboard/procurements/${procurement.id}`}>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ver detalles
                </Button>
              </Link>
              <Link href={`/dashboard/bids/create?procurement=${procurement.id}`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Ofertar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
