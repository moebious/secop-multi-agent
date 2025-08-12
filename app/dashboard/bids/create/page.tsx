import { notFound } from "next/navigation"
import BidForm from "@/components/bid-form"

interface PageProps {
  searchParams: { procurement?: string }
}

export default function CreateBidPage({ searchParams }: PageProps) {
  const mockProfile = {
    id: "test-user-id",
    full_name: "Test User",
    role: "bidder",
    company_name: "Test Company",
  }

  const procurementId = searchParams.procurement
  if (!procurementId) {
    notFound()
  }

  // Mock procurement details
  const mockProcurement = {
    id: procurementId,
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
        <BidForm procurement={mockProcurement} mode="create" />
      </main>
    </div>
  )
}
