"use client"

import { Badge } from "@/components/ui/badge"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, FileText, Bell } from "lucide-react"
import Link from "next/link"
import ProcurementCard from "@/components/procurement-card"
import NotificationCenter from "@/components/notification-center"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Get recent procurements
  const { data: procurements } = await supabase
    .from("procurements")
    .select("*")
    .eq("status", "open")
    .order("publication_date", { ascending: false })
    .limit(6)

  // Get user's bids count
  const { count: bidsCount } = await supabase
    .from("bids")
    .select("*", { count: "exact", head: true })
    .eq("bidder_id", user.id)

  // Get total procurements count
  const { count: procurementsCount } = await supabase
    .from("procurements")
    .select("*", { count: "exact", head: true })
    .eq("status", "open")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bienvenido, {profile.full_name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 capitalize">{profile.role.replace("_", " ")}</Badge>
              <NotificationCenter />
              <Link href="/auth/login">
                <Button variant="outline" onClick={() => {}}>
                  Cerrar sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procesos Abiertos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{procurementsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Oportunidades disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mis Ofertas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bidsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Ofertas enviadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Evaluación</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Ofertas en revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Mensajes nuevos</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/procurements">
              <Button className="bg-blue-600 hover:bg-blue-700">Ver Todos los Procesos</Button>
            </Link>
            {profile.role === "bidder" && (
              <Link href="/dashboard/bids">
                <Button variant="outline">Mis Ofertas</Button>
              </Link>
            )}
            {["administrator", "procurement_officer"].includes(profile.role) && (
              <Button variant="outline" onClick={() => fetch("/api/procurements/sync", { method: "POST" })}>
                Sincronizar SECOP II
              </Button>
            )}
          </div>
        </div>

        {/* Recent Procurements */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Procesos Recientes</h2>
            <Link href="/dashboard/procurements">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </div>

          {procurements && procurements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {procurements.map((procurement) => (
                <ProcurementCard
                  key={procurement.id}
                  procurement={procurement}
                  showBidButton={profile.role === "bidder"}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay procesos disponibles</h3>
                <p className="text-gray-600 mb-4">
                  No se encontraron procesos de contratación abiertos en este momento.
                </p>
                {["administrator", "procurement_officer"].includes(profile.role) && (
                  <Button onClick={() => fetch("/api/procurements/sync", { method: "POST" })}>
                    Sincronizar SECOP II
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
