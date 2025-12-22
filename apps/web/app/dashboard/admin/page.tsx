"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, TrendingUp, Building, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AdminDashboardPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  const mockUser = { id: "test-admin-id", email: "admin@test.com" }
  const mockProfile = {
    id: "test-admin-id",
    full_name: "Test Administrator",
    role: "administrator",
    company_name: "Test Company",
    email: "admin@test.com",
  }

  const totalUsers = 25
  const totalProcurements = 15
  const totalBids = 48
  const activeProcurements = 8
  const pendingBids = 12

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/procurements/sync", { method: "POST" })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (response.ok) {
        setToastMessage("¡Sincronización con SECOP II completada exitosamente!")
        setToastType("success")
      } else {
        setToastMessage("Error al sincronizar con SECOP II. Intenta nuevamente.")
        setToastType("error")
      }
    } catch (error) {
      setToastMessage("Error de conexión. Verifica tu conexión a internet.")
      setToastType("error")
    } finally {
      setIsSyncing(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
    }
  }

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
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "awarded":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div
            className={`neo-card p-4 max-w-sm ${
              toastType === "success" ? "bg-soft-sage border-forest" : "bg-clay/20 border-clay"
            }`}
          >
            <div className="flex items-center gap-3">
              {toastType === "success" ? (
                <CheckCircle className="h-5 w-5 text-forest" strokeWidth={3} />
              ) : (
                <AlertCircle className="h-5 w-5 text-clay" strokeWidth={3} />
              )}
              <p className="font-bold text-sm text-charcoal uppercase">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      <header className="neo-card border-b-4 border-charcoal rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal uppercase tracking-widest">
                PANEL DE ADMINISTRACIÓN
              </h1>
              <p className="text-charcoal/80 font-bold text-sm sm:text-base uppercase">
                GESTIONA LA PLATAFORMA DE CONTRATACIÓN
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Badge className="neo-badge bg-mocha text-cream border-charcoal text-xs sm:text-sm uppercase">
                {mockProfile.role.replace("_", " ")}
              </Badge>
              <Link href="/dashboard">
                <Button className="neo-button-primary text-sm sm:text-base px-4 sm:px-6 w-full sm:w-auto">
                  DASHBOARD PRINCIPAL
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="neo-card bg-muted-pearl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-black uppercase tracking-wide text-charcoal">
                TOTAL USUARIOS
              </CardTitle>
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-mocha" strokeWidth={3} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-black text-mocha">{totalUsers}</div>
              <p className="text-xs sm:text-sm font-bold text-charcoal/80 uppercase">USUARIOS REGISTRADOS</p>
            </CardContent>
          </Card>

          <Card className="neo-card bg-soft-sage">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-black uppercase tracking-wide text-charcoal">
                PROCESOS ACTIVOS
              </CardTitle>
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-forest" strokeWidth={3} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-black text-forest">{activeProcurements}</div>
              <p className="text-xs sm:text-sm font-bold text-charcoal/80 uppercase">DE {totalProcurements} TOTALES</p>
            </CardContent>
          </Card>

          <Card className="neo-card bg-muted-stone">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-black uppercase tracking-wide text-charcoal">
                OFERTAS PENDIENTES
              </CardTitle>
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-ocean" strokeWidth={3} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-black text-ocean">{pendingBids}</div>
              <p className="text-xs sm:text-sm font-bold text-charcoal/80 uppercase">DE {totalBids} TOTALES</p>
            </CardContent>
          </Card>

          <Card className="neo-card bg-soft-mocha">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-black uppercase tracking-wide text-charcoal">
                SINCRONIZACIÓN
              </CardTitle>
              <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 text-clay" strokeWidth={3} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-black text-clay">SECOP II</div>
              <p className="text-xs sm:text-sm font-bold text-charcoal/80 uppercase">ÚLTIMA SYNC: HOY</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-charcoal mb-4 uppercase tracking-widest">
            ACCIONES RÁPIDAS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link href="/dashboard/admin/users">
              <Button className="neo-button-secondary w-full justify-start text-sm sm:text-base px-4 py-3">
                <Users className="h-4 w-4 mr-2" strokeWidth={3} />
                <span className="truncate">GESTIONAR USUARIOS</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/procurements">
              <Button className="neo-button-secondary w-full justify-start text-sm sm:text-base px-4 py-3">
                <Building className="h-4 w-4 mr-2" strokeWidth={3} />
                <span className="truncate">GESTIONAR PROCESOS</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/bids">
              <Button className="neo-button-secondary w-full justify-start text-sm sm:text-base px-4 py-3">
                <FileText className="h-4 w-4 mr-2" strokeWidth={3} />
                <span className="truncate">EVALUAR OFERTAS</span>
              </Button>
            </Link>
            <Button
              className="neo-button-primary w-full justify-start text-sm sm:text-base px-4 py-3"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} strokeWidth={3} />
              <span className="truncate">{isSyncing ? "SINCRONIZANDO..." : "SINCRONIZAR SECOP II"}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <Card className="neo-card bg-muted-pearl">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <span className="font-black text-charcoal uppercase tracking-wide text-base sm:text-lg">
                  OFERTAS RECIENTES
                </span>
                <Link href="/dashboard/admin/bids">
                  <Button className="neo-button-secondary text-xs sm:text-sm px-3 py-2 w-full sm:w-auto">
                    VER TODAS
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((id) => (
                  <div key={id} className="neo-card bg-cream p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm sm:text-base text-charcoal uppercase truncate">
                          PROCESO DE CONTRATACIÓN #{id}
                        </p>
                        <p className="text-xs sm:text-sm text-charcoal/70 font-bold uppercase">EMPRESA TEST S.A.S.</p>
                        <p className="text-xs text-charcoal/60 font-bold">$150,000,000 COP • HOY</p>
                      </div>
                      <Badge className="neo-badge bg-ocean text-cream border-charcoal text-xs self-start sm:self-center">
                        ENVIADA
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="neo-card bg-soft-sage">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <span className="font-black text-charcoal uppercase tracking-wide text-base sm:text-lg">
                  PROCESOS RECIENTES
                </span>
                <Link href="/dashboard/admin/procurements">
                  <Button className="neo-button-secondary text-xs sm:text-sm px-3 py-2 w-full sm:w-auto">
                    VER TODAS
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((id) => (
                  <div key={id} className="neo-card bg-cream p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm sm:text-base text-charcoal uppercase truncate">
                          SERVICIOS DE TECNOLOGÍA #{id}
                        </p>
                        <p className="text-xs sm:text-sm text-charcoal/70 font-bold uppercase">
                          MINISTERIO DE TECNOLOGÍAS
                        </p>
                        <p className="text-xs text-charcoal/60 font-bold">$500,000,000 COP • HOY</p>
                      </div>
                      <Badge className="neo-badge bg-forest text-cream border-charcoal text-xs self-start sm:self-center">
                        ABIERTO
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
