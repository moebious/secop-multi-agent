"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  Upload,
  CheckCircle,
  ArrowRight,
  StepBack,
  Loader2,
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

  const [biddingProcurement, setBiddingProcurement] = useState<(typeof mockProcurements)[0] | null>(null)
  const [bidStep, setBidStep] = useState(1)
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const [bidSubmitted, setBidSubmitted] = useState(false)

  const [bidForm, setBidForm] = useState({
    companyName: "",
    companyNIT: "",
    legalRepresentative: "",
    email: "",
    phone: "",
    bidAmount: "",
    deliveryTime: "",
    technicalProposal: "",
    economicProposal: "",
    documents: [] as File[],
  })

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

  const handleStartBidding = (procurement: (typeof mockProcurements)[0]) => {
    setBiddingProcurement(procurement)
    setBidStep(1)
    setBidSubmitted(false)
    setBidForm({
      companyName: "",
      companyNIT: "",
      legalRepresentative: "",
      email: "",
      phone: "",
      bidAmount: "",
      deliveryTime: "",
      technicalProposal: "",
      economicProposal: "",
      documents: [],
    })
  }

  const handleNextStep = () => {
    setBidStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrevStep = () => {
    setBidStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmitBid = async () => {
    setIsSubmittingBid(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmittingBid(false)
    setBidSubmitted(true)
  }

  const handleCloseBidModal = () => {
    setBiddingProcurement(null)
    setBidStep(1)
    setBidSubmitted(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setBidForm((prev) => ({ ...prev, documents: [...prev.documents, ...files] }))
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          bidForm.companyName && bidForm.companyNIT && bidForm.legalRepresentative && bidForm.email && bidForm.phone
        )
      case 2:
        return bidForm.bidAmount && bidForm.deliveryTime && bidForm.technicalProposal && bidForm.economicProposal
      case 3:
        return true
      default:
        return false
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
              <Link href="/">
                <Button className="neo-button-primary text-sm sm:text-base px-4 sm:px-6">INICIO</Button>
              </Link>
              <div className="flex items-center gap-2 sm:gap-4">
                <NotificationCenter />
                <Badge className="neo-badge bg-mocha text-cream border-charcoal text-xs sm:text-sm">
                  {mockProfile.role === "administrator"
                    ? "ADMINISTRADOR"
                    : mockProfile.role === "procurement_officer"
                      ? "OFICIAL DE COMPRAS"
                      : mockProfile.role === "bidder"
                        ? "LICITADOR"
                        : mockProfile.role}
                </Badge>
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
              className="neo-card hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-full flex flex-col"
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

              <CardContent className="flex flex-col flex-1 justify-between space-y-3 sm:space-y-4">
                <div className="space-y-3 sm:space-y-4 flex-1">
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

                  <div className="flex-1">
                    <p className="text-charcoal/70 text-sm line-clamp-3">{procurement.description}</p>
                  </div>

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
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
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
                            onClick={() => handleStartBidding(procurement)}
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
                    onClick={() => handleStartBidding(procurement)}
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

        <Dialog open={!!biddingProcurement} onOpenChange={handleCloseBidModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-cream border-4 border-charcoal mx-4">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-black text-charcoal uppercase tracking-wide">
                {bidSubmitted ? "OFERTA ENVIADA" : "CREAR OFERTA"}
              </DialogTitle>
            </DialogHeader>

            {bidSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-forest mx-auto mb-4" />
                <h3 className="text-xl font-black text-charcoal mb-2 uppercase">¡OFERTA ENVIADA EXITOSAMENTE!</h3>
                <p className="text-charcoal/70 mb-6">
                  Tu oferta para "{biddingProcurement?.title}" ha sido registrada correctamente.
                </p>
                <Button onClick={handleCloseBidModal} className="neo-button-primary">
                  CERRAR
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full border-2 border-charcoal flex items-center justify-center font-bold text-sm ${
                          step <= bidStep ? "bg-mocha text-cream" : "bg-cream text-charcoal"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-1 mx-2 ${step < bidStep ? "bg-mocha" : "bg-charcoal/30"}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                {bidStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-charcoal uppercase">INFORMACIÓN DE LA EMPRESA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-charcoal font-bold uppercase">Nombre de la Empresa</Label>
                        <Input
                          value={bidForm.companyName}
                          onChange={(e) => setBidForm((prev) => ({ ...prev, companyName: e.target.value }))}
                          className="border-2 border-charcoal"
                          placeholder="Ingresa el nombre de tu empresa"
                        />
                      </div>
                      <div>
                        <Label className="text-charcoal font-bold uppercase">NIT</Label>
                        <Input
                          value={bidForm.companyNIT}
                          onChange={(e) => setBidForm((prev) => ({ ...prev, companyNIT: e.target.value }))}
                          className="border-2 border-charcoal"
                          placeholder="123456789-0"
                        />
                      </div>
                      <div>
                        <Label className="text-charcoal font-bold uppercase">Representante Legal</Label>
                        <Input
                          value={bidForm.legalRepresentative}
                          onChange={(e) => setBidForm((prev) => ({ ...prev, legalRepresentative: e.target.value }))}
                          className="border-2 border-charcoal"
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div>
                        <Label className="text-charcoal font-bold uppercase">Email</Label>
                        <Input
                          type="email"
                          value={bidForm.email}
                          onChange={(e) => setBidForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="border-2 border-charcoal"
                          placeholder="empresa@ejemplo.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-charcoal font-bold uppercase">Teléfono</Label>
                        <Input
                          value={bidForm.phone}
                          onChange={(e) => setBidForm((prev) => ({ ...prev, phone: e.target.value }))}
                          className="border-2 border-charcoal"
                          placeholder="+57 300 123 4567"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {bidStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-charcoal uppercase">DETALLES DE LA OFERTA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-charcoal font-bold uppercase">Valor de la Oferta (COP)</Label>
                        <Input
                          type="number"
                          value={bidForm.bidAmount}
                          onChange={(e) => setBidForm((prev) => ({ ...prev, bidAmount: e.target.value }))}
                          className="border-2 border-charcoal"
                          placeholder="2500000000"
                        />
                      </div>
                      <div>
                        <Label className="text-charcoal font-bold uppercase">Tiempo de Entrega (días)</Label>
                        <Input
                          type="number"
                          value={bidForm.deliveryTime}
                          onChange={(e) => setBidForm((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                          className="border-2 border-charcoal"
                          placeholder="90"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-charcoal font-bold uppercase">Propuesta Técnica</Label>
                      <Textarea
                        value={bidForm.technicalProposal}
                        onChange={(e) => setBidForm((prev) => ({ ...prev, technicalProposal: e.target.value }))}
                        className="border-2 border-charcoal min-h-[100px]"
                        placeholder="Describe tu propuesta técnica..."
                      />
                    </div>
                    <div>
                      <Label className="text-charcoal font-bold uppercase">Propuesta Económica</Label>
                      <Textarea
                        value={bidForm.economicProposal}
                        onChange={(e) => setBidForm((prev) => ({ ...prev, economicProposal: e.target.value }))}
                        className="border-2 border-charcoal min-h-[100px]"
                        placeholder="Describe tu propuesta económica..."
                      />
                    </div>
                    <div>
                      <Label className="text-charcoal font-bold uppercase">Documentos</Label>
                      <div className="border-2 border-dashed border-charcoal p-4 text-center">
                        <Upload className="h-8 w-8 text-charcoal/60 mx-auto mb-2" />
                        <p className="text-charcoal/60 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                        <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                        <Button
                          type="button"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="neo-button-secondary"
                        >
                          SELECCIONAR ARCHIVOS
                        </Button>
                        {bidForm.documents.length > 0 && (
                          <div className="mt-2 text-left">
                            {bidForm.documents.map((file, index) => (
                              <p key={index} className="text-sm text-charcoal">
                                {file.name}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {bidStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-charcoal uppercase">REVISAR OFERTA</h3>
                    <div className="neo-card p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-charcoal">Proceso:</h4>
                        <p className="text-charcoal/70">{biddingProcurement?.title}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">Empresa:</h4>
                        <p className="text-charcoal/70">
                          {bidForm.companyName} - {bidForm.companyNIT}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">Valor Ofertado:</h4>
                        <p className="text-charcoal/70 font-bold text-mocha">
                          {formatCurrency(Number.parseInt(bidForm.bidAmount) || 0)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">Tiempo de Entrega:</h4>
                        <p className="text-charcoal/70">{bidForm.deliveryTime} días</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">Documentos:</h4>
                        <p className="text-charcoal/70">{bidForm.documents.length} archivo(s) adjunto(s)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button onClick={handlePrevStep} disabled={bidStep === 1} className="neo-button-secondary">
                    <StepBack className="h-4 w-4 mr-2" />
                    ANTERIOR
                  </Button>

                  {bidStep < 3 ? (
                    <Button onClick={handleNextStep} disabled={!isStepValid(bidStep)} className="neo-button-primary">
                      SIGUIENTE
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitBid} disabled={isSubmittingBid} className="neo-button-primary">
                      {isSubmittingBid ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ENVIANDO...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          ENVIAR OFERTA
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
