"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      title: "Nueva Oferta Recibida",
      message: "Juan Pérez ha enviado una oferta para 'Servicios de Tecnología - Desarrollo de Software'",
      type: "info",
      read: false,
      created_at: new Date().toISOString(),
      procurement_id: "1",
      bid_id: "1",
    },
    {
      id: 2,
      title: "Proceso Próximo a Cerrar",
      message: "El proceso 'Suministro de Equipos de Oficina' cierra el 20 de febrero. Asegúrate de enviar tu oferta.",
      type: "warning",
      read: false,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      procurement_id: "2",
      bid_id: null,
    },
    {
      id: 3,
      title: "Evaluación de Oferta",
      message: "Tu oferta ha sido aceptada para 'Servicios de Consultoría' (Puntuación: 92.5)",
      type: "success",
      read: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      procurement_id: "3",
      bid_id: "3",
    },
  ]

  const unreadCount = mockNotifications?.filter((n) => !n.read).length || 0

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "error":
        return "border-l-red-500 bg-red-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : "Todas las notificaciones leídas"}
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockNotifications?.length || 0}</div>
              <p className="text-xs text-muted-foreground">notificaciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Leer</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">pendientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{(mockNotifications?.length || 0) - unreadCount}</div>
              <p className="text-xs text-muted-foreground">completadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Todas las Notificaciones</CardTitle>
              {unreadCount > 0 && (
                <Button variant="outline" onClick={() => fetch("/api/notifications/mark-all-read", { method: "PUT" })}>
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotifications && mockNotifications.length > 0 ? (
                mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 rounded-r-lg ${getNotificationColor(notification.type)} ${
                      !notification.read ? "bg-opacity-100" : "bg-opacity-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{formatDate(notification.created_at)}</span>
                            {!notification.read && <Badge className="bg-blue-100 text-blue-800 text-xs">Nueva</Badge>}
                          </div>
                        </div>
                        <p className={`text-sm ${!notification.read ? "text-gray-700" : "text-gray-500"}`}>
                          {notification.message}
                        </p>
                        {(notification.procurement_id || notification.bid_id) && (
                          <div className="mt-3 flex gap-2">
                            {notification.bid_id && (
                              <Link href={`/dashboard/bids/${notification.bid_id}`}>
                                <Button size="sm" variant="outline">
                                  Ver Oferta
                                </Button>
                              </Link>
                            )}
                            {notification.procurement_id && !notification.bid_id && (
                              <Link href={`/dashboard/procurements/${notification.procurement_id}`}>
                                <Button size="sm" variant="outline">
                                  Ver Proceso
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes notificaciones</h3>
                  <p className="text-gray-600">Las notificaciones aparecerán aquí cuando tengas actividad.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
