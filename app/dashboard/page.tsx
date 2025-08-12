"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, FileText, Bell } from "lucide-react"
import Link from "next/link"
import NotificationCenter from "@/components/notification-center"

export default function DashboardPage() {
  const mockUser = { id: "test-user-id", email: "admin@test.com" }
  const mockProfile = {
    id: "test-user-id",
    full_name: "Administrador de Prueba",
    role: "administrator",
    company_name: "Empresa de Prueba",
    email: "admin@test.com",
  }

  // Get recent procurements
  const procurements = [
    {
      id: 1,
      title: "PROCESO DE CONTRATACIÓN #1",
      description: "DESCRIPCIÓN DEL PROCESO DE CONTRATACIÓN DE SERVICIOS TECNOLÓGICOS.",
      status: "ABIERTO",
      budget: "$500,000,000 COP",
    },
    {
      id: 2,
      title: "PROCESO DE CONTRATACIÓN #2",
      description: "DESCRIPCIÓN DEL PROCESO DE CONTRATACIÓN DE SERVICIOS TECNOLÓGICOS.",
      status: "ABIERTO",
      budget: "$500,000,000 COP",
    },
    {
      id: 3,
      title: "PROCESO DE CONTRATACIÓN #3",
      description: "DESCRIPCIÓN DEL PROCESO DE CONTRATACIÓN DE SERVICIOS TECNOLÓGICOS.",
      status: "ABIERTO",
      budget: "$500,000,000 COP",
    },
  ]

  // Get user's bids count
  const bidsCount = 5

  // Get total procurements count
  const procurementsCount = 12

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="neo-card border-b-4 border-charcoal rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal uppercase tracking-widest truncate">
                PANEL DE CONTROL
              </h1>
              <p className="text-charcoal/80 font-bold text-sm sm:text-base lg:text-lg uppercase truncate">
                BIENVENIDO, {mockProfile.full_name}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Badge className="neo-badge bg-mocha text-cream border-charcoal text-xs sm:text-sm">
                {mockProfile.role === "administrator"
                  ? "ADMINISTRADOR"
                  : mockProfile.role === "procurement_officer"
                    ? "OFICIAL DE COMPRAS"
                    : mockProfile.role === "bidder"
                      ? "LICITADOR"
                      : mockProfile.role}
              </Badge>
              <div className="flex items-center gap-2 sm:gap-4">
                <NotificationCenter />
                <Link href="/">
                  <Button className="neo-button-primary text-sm sm:text-base px-4 sm:px-6">INICIO</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          <Card className="neo-card bg-muted-pearl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-wide text-charcoal">
                PROCESOS ABIERTOS
              </CardTitle>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-mocha" strokeWidth={3} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-mocha">{procurementsCount || 0}</div>
              <p className="text-xs sm:text-sm font-bold text-charcoal/80 uppercase">OPORTUNIDADES DISPONIBLES</p>
            </CardContent>
          </Card>

          <Card className="neo-card bg-soft-sage">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-wide text-charcoal">
                MIS OFERTAS
              </CardTitle>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-forest" strokeWidth={3} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-forest">{bidsCount || 0}</div>
              <p className="text-xs sm:text-sm font-bold text-charcoal/80 uppercase">OFERTAS ENVIADAS</p>
            </CardContent>
          </Card>

          <Card className="neo-card bg-muted-stone">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-wide text-charcoal">
                EN EVALUACIÓN
              </CardTitle>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-ocean" strokeWidth={3} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-ocean">3</div>
              <p className="text-xs sm:text-sm font-bold text-charcoal/80 uppercase">OFERTAS EN REVISIÓN</p>
            </CardContent>
          </Card>

          <Card className="neo-card bg-soft-mocha">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-wide text-charcoal">
                NOTIFICACIONES
              </CardTitle>
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-clay" strokeWidth={3} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-clay">7</div>
              <p className="text-xs sm:text-sm font-bold text-charcoal/80 uppercase">MENSAJES NUEVOS</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal mb-4 sm:mb-6 uppercase tracking-widest">
            ACCIONES RÁPIDAS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4 lg:gap-6">
            <Link href="/dashboard/procurements" className="w-full lg:w-auto">
              <Button className="neo-button-secondary text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 w-full lg:w-auto">
                VER TODOS LOS PROCESOS
              </Button>
            </Link>
            {mockProfile.role === "bidder" && (
              <Link href="/dashboard/bids" className="w-full lg:w-auto">
                <Button className="neo-button-primary text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 w-full lg:w-auto">
                  MIS OFERTAS
                </Button>
              </Link>
            )}
            {["administrator", "procurement_officer"].includes(mockProfile.role) && (
              <Link href="/dashboard/admin" className="w-full lg:w-auto">
                <Button className="neo-button-primary text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 w-full lg:w-auto">
                  PANEL ADMIN
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Procurements */}
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal uppercase tracking-widest">
              PROCESOS RECIENTES
            </h2>
            <Link href="/dashboard/procurements">
              <Button className="neo-button-secondary text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto">
                VER TODOS
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {procurements.map((procurement, index) => (
              <Card
                key={procurement.id}
                className={`neo-card ${
                  index === 0 ? "bg-muted-sage" : index === 1 ? "bg-muted-stone" : "bg-soft-mocha"
                }`}
              >
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h3 className="font-black text-lg sm:text-xl mb-3 sm:mb-4 uppercase tracking-wide text-charcoal">
                    {procurement.title}
                  </h3>
                  <p className="text-charcoal/70 font-bold mb-4 sm:mb-6 uppercase text-xs sm:text-sm">
                    {procurement.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <Badge className="neo-badge bg-charcoal text-cream border-charcoal text-xs">
                      {procurement.status}
                    </Badge>
                    <span className="text-base sm:text-lg font-black text-mocha uppercase">{procurement.budget}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
