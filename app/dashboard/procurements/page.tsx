"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Eye,
  FileText,
  Building,
  Clock,
  Hash,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import NotificationCenter from "@/components/notification-center"

// Mock procurement data based on SECOP II structure
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
  },
  {
    id: "SECOP-2025-004",
    title: "Adquisición de Medicamentos y Dispositivos Médicos",
    entity: "Instituto Nacional de Salud",
    department: "Cundinamarca",
    value: 5200000000,
    description: "Suministro de medicamentos esenciales y dispositivos médicos para hospitales públicos",
    startDate: "2025-01-05",
    endDate: "2025-01-25",
    status: "Cerrado",
    category: "Salud",
    bidders: 22,
    processId: "PROC-2025-SAL-004",
  },
]

export default function ProcurementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedProcurement, setSelectedProcurement] = useState<(typeof mockProcurements)[0] | null>(null)

  const mockUser = { id: "test-user-id", email: "admin@test.com" }
  const mockProfile = {
    id: "test-user-id",
    full_name: "Administrador de Prueba",
    role: "administrator",
    company_name: "Empresa de Prueba",
    email: "admin@test.com",
  }

  const filteredProcurements = mockProcurements.filter((procurement) => {
    const matchesSearch =
      procurement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procurement.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procurement.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || procurement.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesCategory =
      categoryFilter === "all" || procurement.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesDepartment =
      departmentFilter === "all" || procurement.department.toLowerCase().includes(departmentFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesCategory && matchesDepartment
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
        return "bg-forest text-white"
      case "próximo a cerrar":
        return "bg-clay text-white"
      case "cerrado":
        return "bg-charcoal text-white"
      default:
        return "bg-mocha text-white"
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="neo-card border-b-4 border-charcoal rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link href="/dashboard">
                <Button className="neo-button-secondary p-2 sm:p-3">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} />
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal uppercase tracking-widest truncate">
                  PROCESOS DE CONTRATACIÓN
                </h1>
                <p className="text-charcoal/80 font-bold text-sm sm:text-base lg:text-lg uppercase truncate">
                  EXPLORA OPORTUNIDADES DE CONTRATACIÓN PÚBLICA DEL SISTEMA SECOP II
                </p>
              </div>
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

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Filters */}
        <div className="neo-card mb-6 sm:mb-8 p-4 sm:p-6 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
            <div className="sm:col-span-2 lg:col-span-2 min-w-0">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/60 h-4 w-4 z-10" />
                <Input
                  placeholder="BUSCAR PROCESOS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-4 border-charcoal focus:border-mocha font-bold uppercase w-full text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="min-w-0">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-4 border-charcoal font-bold w-full text-sm sm:text-base">
                  <SelectValue placeholder="ESTADO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">TODOS LOS ESTADOS</SelectItem>
                  <SelectItem value="abierto">ABIERTO</SelectItem>
                  <SelectItem value="próximo a cerrar">PRÓXIMO A CERRAR</SelectItem>
                  <SelectItem value="cerrado">CERRADO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-4 border-charcoal font-bold w-full text-sm sm:text-base">
                  <SelectValue placeholder="CATEGORÍA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">TODAS LAS CATEGORÍAS</SelectItem>
                  <SelectItem value="tecnología">TECNOLOGÍA</SelectItem>
                  <SelectItem value="infraestructura">INFRAESTRUCTURA</SelectItem>
                  <SelectItem value="consultoría">CONSULTORÍA</SelectItem>
                  <SelectItem value="salud">SALUD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="border-4 border-charcoal font-bold w-full text-sm sm:text-base">
                  <SelectValue placeholder="DEPARTAMENTO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">TODOS LOS DEPARTAMENTOS</SelectItem>
                  <SelectItem value="bogotá">BOGOTÁ D.C.</SelectItem>
                  <SelectItem value="antioquia">ANTIOQUIA</SelectItem>
                  <SelectItem value="valle">VALLE DEL CAUCA</SelectItem>
                  <SelectItem value="cundinamarca">CUNDINAMARCA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 sm:mb-6">
          <p className="text-charcoal font-black uppercase tracking-wide text-sm sm:text-base">
            MOSTRANDO {filteredProcurements.length} DE {mockProcurements.length} PROCESOS
          </p>
        </div>

        {/* Procurement Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {filteredProcurements.map((procurement) => (
            <Card
              key={procurement.id}
              className="neo-card hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0">
                  <Badge
                    className={`${getStatusColor(procurement.status)} border-2 border-charcoal text-xs sm:text-sm self-start`}
                  >
                    {procurement.status}
                  </Badge>
                  <span className="text-xs sm:text-sm font-mono text-charcoal/60">{procurement.processId}</span>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-charcoal leading-tight">
                  {procurement.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-charcoal/80">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{procurement.entity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal/80">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{procurement.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal/80">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span className="font-bold text-mocha text-sm sm:text-base">
                      {formatCurrency(procurement.value)}
                    </span>
                  </div>
                </div>

                <p className="text-charcoal/70 text-sm line-clamp-3">{procurement.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-charcoal/60 gap-2 sm:gap-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Cierra: {new Date(procurement.endDate).toLocaleDateString("es-CO")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>{procurement.bidders} oferentes</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="neo-button-primary flex-1 text-sm sm:text-base" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-cream border-4 border-charcoal mx-4">
                      <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-black text-charcoal uppercase tracking-wide">
                          DETALLES DEL PROCESO
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 sm:space-y-6">
                        {/* Process Header */}
                        <div className="neo-card p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-0">
                            <Badge
                              className={`${getStatusColor(procurement.status)} border-2 border-charcoal text-xs sm:text-sm self-start`}
                            >
                              {procurement.status}
                            </Badge>
                            <span className="text-xs sm:text-sm font-mono text-charcoal/60">
                              {procurement.processId}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-charcoal mb-2">{procurement.title}</h3>
                          <p className="text-charcoal/70 text-sm sm:text-base">{procurement.description}</p>
                        </div>

                        {/* Process Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="neo-card p-3 sm:p-4">
                            <h4 className="font-black text-charcoal mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2 text-sm sm:text-base">
                              <Building className="h-4 w-4" />
                              ENTIDAD CONTRATANTE
                            </h4>
                            <p className="text-charcoal font-medium text-sm sm:text-base">{procurement.entity}</p>
                            <p className="text-charcoal/70 text-xs sm:text-sm mt-1">{procurement.department}</p>
                          </div>

                          <div className="neo-card p-3 sm:p-4">
                            <h4 className="font-black text-charcoal mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2 text-sm sm:text-base">
                              <DollarSign className="h-4 w-4" />
                              VALOR ESTIMADO
                            </h4>
                            <p className="text-xl sm:text-2xl font-bold text-mocha">
                              {formatCurrency(procurement.value)}
                            </p>
                            <p className="text-charcoal/70 text-xs sm:text-sm mt-1">Valor total del contrato</p>
                          </div>

                          <div className="neo-card p-3 sm:p-4">
                            <h4 className="font-black text-charcoal mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2 text-sm sm:text-base">
                              <Clock className="h-4 w-4" />
                              CRONOGRAMA
                            </h4>
                            <div className="space-y-2 text-xs sm:text-sm">
                              <div className="flex justify-between">
                                <span className="text-charcoal/70">Inicio:</span>
                                <span className="font-medium text-charcoal">
                                  {new Date(procurement.startDate).toLocaleDateString("es-CO")}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-charcoal/70">Cierre:</span>
                                <span className="font-medium text-charcoal">
                                  {new Date(procurement.endDate).toLocaleDateString("es-CO")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="neo-card p-3 sm:p-4">
                            <h4 className="font-black text-charcoal mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2 text-sm sm:text-base">
                              <Users className="h-4 w-4" />
                              PARTICIPACIÓN
                            </h4>
                            <p className="text-xl sm:text-2xl font-bold text-forest">{procurement.bidders}</p>
                            <p className="text-charcoal/70 text-xs sm:text-sm mt-1">Oferentes registrados</p>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="neo-card p-3 sm:p-4">
                          <h4 className="font-black text-charcoal mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2 text-sm sm:text-base">
                            <Hash className="h-4 w-4" />
                            INFORMACIÓN ADICIONAL
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div>
                              <span className="text-charcoal/70">Categoría:</span>
                              <span className="ml-2 font-medium text-charcoal">{procurement.category}</span>
                            </div>
                            <div>
                              <span className="text-charcoal/70">ID del Proceso:</span>
                              <span className="ml-2 font-mono text-charcoal break-all">{procurement.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                          <Button
                            className="neo-button-primary flex-1 text-sm sm:text-base"
                            disabled={procurement.status === "Cerrado"}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            CREAR OFERTA
                          </Button>
                          <Button className="neo-button-secondary text-sm sm:text-base">DESCARGAR DOCUMENTOS</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="neo-button-secondary text-sm sm:text-base"
                    size="sm"
                    disabled={procurement.status === "Cerrado"}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ofertar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProcurements.length === 0 && (
          <div className="neo-card p-8 sm:p-12 text-center">
            <Filter className="h-12 w-12 sm:h-16 sm:w-16 text-charcoal/40 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-black text-charcoal mb-2 uppercase tracking-wide">
              NO SE ENCONTRARON PROCESOS
            </h3>
            <p className="text-charcoal/60 font-bold uppercase text-sm sm:text-base">
              INTENTA AJUSTAR LOS FILTROS DE BÚSQUEDA PARA ENCONTRAR MÁS OPORTUNIDADES
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
