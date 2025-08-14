"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Eye,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  Archive,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react"
import Link from "next/link"

// Mock procurement data with admin-specific fields
const mockProcurements = [
  {
    id: "SECOP-2025-001",
    title: "Suministro de Equipos de Cómputo para Entidades Públicas",
    entity: "Ministerio de Tecnologías de la Información",
    department: "Bogotá D.C.",
    value: 2500000000,
    description: "Adquisición de equipos de cómputo, servidores y equipos de red para modernización tecnológica",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    status: "Abierto",
    category: "Tecnología",
    bidders: 12,
    processId: "PROC-2025-TI-001",
    createdBy: "admin@mintic.gov.co",
    lastSync: "2025-01-13T10:30:00Z",
    adminStatus: "Aprobado",
    priority: "Alta",
  },
  {
    id: "SECOP-2025-002",
    title: "Construcción de Infraestructura Vial Rural",
    entity: "Instituto Nacional de Vías",
    department: "Antioquia",
    value: 15000000000,
    description: "Construcción y mejoramiento de vías rurales en municipios de Antioquia",
    startDate: "2025-01-10",
    endDate: "2025-03-10",
    status: "Abierto",
    category: "Infraestructura",
    bidders: 8,
    processId: "PROC-2025-INF-002",
    createdBy: "admin@invias.gov.co",
    lastSync: "2025-01-12T15:45:00Z",
    adminStatus: "Pendiente Revisión",
    priority: "Media",
  },
  {
    id: "SECOP-2025-003",
    title: "Servicios de Consultoría en Gestión Ambiental",
    entity: "Ministerio de Ambiente y Desarrollo Sostenible",
    department: "Valle del Cauca",
    value: 800000000,
    description: "Consultoría especializada para implementación de políticas ambientales",
    startDate: "2025-01-20",
    endDate: "2025-02-20",
    status: "Próximo a cerrar",
    category: "Consultoría",
    bidders: 15,
    processId: "PROC-2025-AMB-003",
    createdBy: "admin@minambiente.gov.co",
    lastSync: "2025-01-13T09:15:00Z",
    adminStatus: "Aprobado",
    priority: "Alta",
  },
]

export default function AdminProcurementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [adminStatusFilter, setAdminStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedProcurements, setSelectedProcurements] = useState<string[]>([])

  const filteredProcurements = mockProcurements.filter((procurement) => {
    const matchesSearch =
      procurement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procurement.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procurement.processId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || procurement.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesCategory =
      categoryFilter === "all" || procurement.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesAdminStatus =
      adminStatusFilter === "all" || procurement.adminStatus.toLowerCase() === adminStatusFilter.toLowerCase()
    const matchesPriority =
      priorityFilter === "all" || procurement.priority.toLowerCase() === priorityFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesCategory && matchesAdminStatus && matchesPriority
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "abierto":
        return "bg-green-100 text-green-800"
      case "próximo a cerrar":
        return "bg-yellow-100 text-yellow-800"
      case "cerrado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getAdminStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprobado":
        return "bg-green-100 text-green-800"
      case "pendiente revisión":
        return "bg-yellow-100 text-yellow-800"
      case "rechazado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProcurements(filteredProcurements.map((p) => p.id))
    } else {
      setSelectedProcurements([])
    }
  }

  const handleSelectProcurement = (procurementId: string, checked: boolean) => {
    if (checked) {
      setSelectedProcurements([...selectedProcurements, procurementId])
    } else {
      setSelectedProcurements(selectedProcurements.filter((id) => id !== procurementId))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedProcurements)
    setSelectedProcurements([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Procesos</h1>
              <p className="text-gray-600">Administra procesos de contratación SECOP II</p>
            </div>
            <Link href="/dashboard/admin">
              <Button variant="outline">Volver al Admin</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Actions Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Administrativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Proceso
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar SECOP II
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reportes
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Buscar y Filtrar Procesos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar procesos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="abierto">Abierto</SelectItem>
                  <SelectItem value="próximo a cerrar">Próximo a cerrar</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={adminStatusFilter} onValueChange={setAdminStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado Admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="pendiente revisión">Pendiente</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="tecnología">Tecnología</SelectItem>
                  <SelectItem value="infraestructura">Infraestructura</SelectItem>
                  <SelectItem value="consultoría">Consultoría</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedProcurements.length > 0 && (
          <Card className="mb-6 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-900">{selectedProcurements.length} proceso(s) seleccionado(s)</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleBulkAction("approve")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("reject")}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                    <Archive className="h-4 w-4 mr-1" />
                    Archivar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Mostrando {filteredProcurements.length} de {mockProcurements.length} procesos
          </p>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedProcurements.length === filteredProcurements.length && filteredProcurements.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">Seleccionar todos</span>
          </div>
        </div>

        {/* Procurement List */}
        <Card>
          <CardHeader>
            <CardTitle>Procesos ({filteredProcurements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProcurements.length > 0 ? (
                filteredProcurements.map((procurement) => (
                  <div
                    key={procurement.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <Checkbox
                        checked={selectedProcurements.includes(procurement.id)}
                        onCheckedChange={(checked) => handleSelectProcurement(procurement.id, checked as boolean)}
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{procurement.title}</h3>
                          <Badge className={getStatusColor(procurement.status)}>{procurement.status}</Badge>
                          <Badge className={getAdminStatusColor(procurement.adminStatus)}>
                            {procurement.adminStatus}
                          </Badge>
                          <Badge className={getPriorityColor(procurement.priority)}>{procurement.priority}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Entidad:</span>
                            <p>{procurement.entity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Valor:</span>
                            <p className="font-semibold text-blue-600">{formatCurrency(procurement.value)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Oferentes:</span>
                            <p>{procurement.bidders}</p>
                          </div>
                          <div>
                            <span className="font-medium">ID Proceso:</span>
                            <p className="font-mono text-xs">{procurement.processId}</p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-2">
                          <div>Creado por: {procurement.createdBy}</div>
                          <div>Última sincronización: {new Date(procurement.lastSync).toLocaleString("es-CO")}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Gestión del Proceso</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">{procurement.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600">{procurement.description}</p>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>

                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>

                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron procesos</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda o crear un nuevo proceso.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
