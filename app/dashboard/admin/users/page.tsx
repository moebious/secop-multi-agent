import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Building, Shield, User } from "lucide-react"
import Link from "next/link"

export default function AdminUsersPage() {
  const mockProfile = {
    id: "test-admin-id",
    full_name: "Test Administrator",
    role: "administrator",
    company_name: "Test Company",
  }

  // Mock users data
  const mockUsers = [
    {
      id: "user-1",
      full_name: "Juan Pérez",
      email: "juan@techsolutions.com",
      role: "bidder",
      company_name: "TechSolutions S.A.S.",
      created_at: "2024-01-15",
    },
    {
      id: "user-2",
      full_name: "María González",
      email: "maria@procurement.gov.co",
      role: "procurement_officer",
      company_name: "Ministerio de Tecnologías",
      created_at: "2024-01-10",
    },
    {
      id: "user-3",
      full_name: "Carlos Admin",
      email: "carlos@admin.com",
      role: "administrator",
      company_name: null,
      created_at: "2024-01-01",
    },
  ]

  // Mock role statistics
  const roleStats = [
    { role: "administrator", count: 1 },
    { role: "procurement_officer", count: 1 },
    { role: "bidder", count: 1 },
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "administrator":
        return Shield
      case "procurement_officer":
        return User
      case "bidder":
        return Building
      default:
        return User
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "administrator":
        return "bg-purple-100 text-purple-800"
      case "procurement_officer":
        return "bg-blue-100 text-blue-800"
      case "bidder":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "administrator":
        return "Administrador"
      case "procurement_officer":
        return "Oficial de Compras"
      case "bidder":
        return "Oferente"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600">Administra usuarios y roles de la plataforma</p>
            </div>
            <Link href="/dashboard/admin">
              <Button variant="outline">Volver al Admin</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roleStats.map(({ role, count }) => {
            const Icon = getRoleIcon(role)
            return (
              <Card key={role}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{getRoleLabel(role)}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">usuarios activos</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Buscar Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar por nombre, email o empresa..." className="pl-10" />
              </div>
              <Button variant="outline">Filtrar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Usuarios ({mockUsers?.length || 0})</span>
              <Button className="bg-blue-600 hover:bg-blue-700">Invitar Usuario</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers && mockUsers.length > 0 ? (
                mockUsers.map((userProfile) => (
                  <div
                    key={userProfile.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{userProfile.full_name || "Sin nombre"}</h3>
                        <p className="text-sm text-gray-600">{userProfile.email}</p>
                        {userProfile.company_name && (
                          <p className="text-xs text-gray-500">{userProfile.company_name}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getRoleColor(userProfile.role)}>{getRoleLabel(userProfile.role)}</Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Registrado: {new Date(userProfile.created_at).toLocaleDateString("es-CO")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
                  <p className="text-gray-600">Los usuarios registrados aparecerán aquí.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
