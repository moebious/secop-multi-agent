import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Shield, Globe } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="neo-card border-b-4 border-charcoal rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-forest" />
              <h1 className="text-lg sm:text-2xl font-bold text-charcoal uppercase tracking-wide">
                <span className="hidden sm:inline">Contratación Multi-Agente</span>
                <span className="sm:hidden">Multi-Agente</span>
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <Link href="/dashboard" className="flex-1 sm:flex-none">
                <Button className="neo-button-primary w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6">
                  Acceder al Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4 sm:mb-6 uppercase tracking-tight leading-tight">
            Plataforma de Licitación Multi-Agente para <span className="text-mocha">SECOP II</span>
          </h1>
          <p className="text-lg sm:text-xl text-charcoal/80 mb-6 sm:mb-8 max-w-3xl mx-auto font-medium px-2">
            Conecta múltiples agentes para licitar en oportunidades de contratación colombiana. Optimiza tu proceso de
            licitación con integración de datos OCDS en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4 sm:px-0">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="neo-button-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 uppercase tracking-wide w-full sm:w-auto"
              >
                Acceder a la Plataforma
              </Button>
            </Link>
            <Link href="/dashboard/admin" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="neo-button-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 uppercase tracking-wide w-full sm:w-auto"
              >
                Panel de Administración
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="neo-card p-6 sm:p-8">
            <div className="bg-ocean w-12 h-12 border-4 border-charcoal flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-cream" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-charcoal mb-2 uppercase tracking-wide">
              Licitación en Tiempo Real
            </h3>
            <p className="text-charcoal/80 font-medium text-sm sm:text-base">
              Envía y gestiona ofertas en tiempo real con actualizaciones en vivo de los datos de contratación de SECOP
              II.
            </p>
          </div>

          <div className="neo-card p-6 sm:p-8">
            <div className="bg-forest w-12 h-12 border-4 border-charcoal flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-cream" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-charcoal mb-2 uppercase tracking-wide">
              Acceso Multi-Rol
            </h3>
            <p className="text-charcoal/80 font-medium text-sm sm:text-base">
              Soporte para licitadores, oficiales de contratación y administradores con permisos basados en roles.
            </p>
          </div>

          <div className="neo-card p-6 sm:p-8">
            <div className="bg-clay w-12 h-12 border-4 border-charcoal flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-cream" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-charcoal mb-2 uppercase tracking-wide">
              Integración OCDS
            </h3>
            <p className="text-charcoal/80 font-medium text-sm sm:text-base">
              Integración perfecta con el Estándar de Datos de Contratación Abierta para contratación transparente.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
