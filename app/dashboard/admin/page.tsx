"use client"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, TrendingUp, Building, RefreshCw } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
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

  // Get platform statistics
  const [
    { count: totalUsers },
    { count: totalProcurements },
    { count: totalBids },
    { count: activeProcurements },
    { count: pendingBids },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("procurements").select("*", { count: "exact", head: true }),
    supabase.from("bids").select("*", { count: "exact", head: true }),
    supabase.from("procurements").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("bids").select("*", { count: "exact", head: true }).eq("status", "submitted"),
  ])

  // Get recent activity
  const { data: recentBids } = await supabase
    .from("bids")
    .select(
      `
      *,
      procurement:procurements(title, buyer_name),
      bidder:profiles(full_name, company_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentProcurements } = await supabase
    .from("procurements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona la plataforma de contratación</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-100 text-purple-800 capitalize">{profile.role.replace("_", " ")}</Badge>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard Principal</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Usuarios registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procesos Activos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProcurements || 0}</div>
              <p className="text-xs text-muted-foreground">De {totalProcurements || 0} totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ofertas Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBids || 0}</div>
              <p className="text-xs text-muted-foreground">De {totalBids || 0} totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sincronización</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SECOP II</div>
              <p className="text-xs text-muted-foreground">Última sync: Hoy</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/admin/users">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gestionar Usuarios
              </Button>
            </Link>
            <Link href="/dashboard/admin/procurements">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Building className="h-4 w-4 mr-2" />
                Gestionar Procesos
              </Button>
            </Link>
            <Link href="/dashboard/admin/bids">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Evaluar Ofertas
              </Button>
            </Link>
            <Button
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              onClick={() => fetch("/api/procurements/sync", { method: "POST" })}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar SECOP II
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bids */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ofertas Recientes</span>
                <Link href="/dashboard/admin/bids">
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBids && recentBids.length > 0 ? (
                  recentBids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{bid.procurement?.title}</p>
                        <p className="text-xs text-gray-600">
                          {bid.bidder?.full_name} - {bid.bidder?.company_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(bid.bid_amount, "COP")} •{" "}
                          {new Date(bid.created_at).toLocaleDateString("es-CO")}
                        </p>
                      </div>
                      <Badge className={getStatusColor(bid.status)} size="sm">
                        {bid.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay ofertas recientes</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Procurements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Procesos Recientes</span>
                <Link href="/dashboard/admin/procurements">
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProcurements && recentProcurements.length > 0 ? (
                  recentProcurements.map((procurement) => (
                    <div key={procurement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{procurement.title}</p>
                        <p className="text-xs text-gray-600">{procurement.buyer_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(procurement.tender_value, procurement.currency)} •{" "}
                          {new Date(procurement.publication_date).toLocaleDateString("es-CO")}
                        </p>
                      </div>
                      <Badge className={getStatusColor(procurement.status)} size="sm">
                        {procurement.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay procesos recientes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
