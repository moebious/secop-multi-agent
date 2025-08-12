// SECOP II API integration utilities
export interface SecopProcurement {
  proceso_de_compra: string // Process ID
  entidad: string // Entity name
  objeto_del_contrato: string // Contract description
  valor_del_contrato: number // Contract value
  fecha_de_inicio: string // Start date
  fecha_de_fin: string // End date
  departamento: string // Department
  municipio?: string // Municipality
  estado_del_proceso: string // Process status
  modalidad_de_contratacion: string // Contract modality
  url_del_proceso?: string // Process URL
}

export interface ProcessedProcurement {
  secop_id: string
  title: string
  description: string
  buyer_name: string
  buyer_id: string
  tender_value: number
  currency: string
  status: "open" | "closed" | "awarded" | "cancelled"
  publication_date: string
  closing_date: string
  category: string
  location: string
  ocds_data: any
}

// Mock SECOP II API data for development
const MOCK_SECOP_DATA: SecopProcurement[] = [
  {
    proceso_de_compra: "SECOP-2024-001",
    entidad: "Ministerio de Tecnologías de la Información y las Comunicaciones",
    objeto_del_contrato: "Adquisición de equipos de cómputo para instituciones educativas",
    valor_del_contrato: 2500000000,
    fecha_de_inicio: "2024-01-15",
    fecha_de_fin: "2024-12-31",
    departamento: "Bogotá D.C.",
    estado_del_proceso: "Abierto",
    modalidad_de_contratacion: "Licitación Pública",
    url_del_proceso: "https://www.colombiacompra.gov.co/proceso/SECOP-2024-001",
  },
  {
    proceso_de_compra: "SECOP-2024-002",
    entidad: "Instituto Nacional de Vías",
    objeto_del_contrato: "Construcción y mantenimiento de vías rurales",
    valor_del_contrato: 15000000000,
    fecha_de_inicio: "2024-02-01",
    fecha_de_fin: "2025-01-31",
    departamento: "Antioquia",
    municipio: "Medellín",
    estado_del_proceso: "Abierto",
    modalidad_de_contratacion: "Concurso de Méritos",
    url_del_proceso: "https://www.colombiacompra.gov.co/proceso/SECOP-2024-002",
  },
  {
    proceso_de_compra: "SECOP-2024-003",
    entidad: "Ministerio de Salud y Protección Social",
    objeto_del_contrato: "Suministro de medicamentos para hospitales públicos",
    valor_del_contrato: 8500000000,
    fecha_de_inicio: "2024-01-20",
    fecha_de_fin: "2024-11-30",
    departamento: "Valle del Cauca",
    municipio: "Cali",
    estado_del_proceso: "En evaluación",
    modalidad_de_contratacion: "Licitación Pública",
    url_del_proceso: "https://www.colombiacompra.gov.co/proceso/SECOP-2024-003",
  },
  {
    proceso_de_compra: "SECOP-2024-004",
    entidad: "Servicio Nacional de Aprendizaje - SENA",
    objeto_del_contrato: "Servicios de capacitación técnica y tecnológica",
    valor_del_contrato: 3200000000,
    fecha_de_inicio: "2024-03-01",
    fecha_de_fin: "2024-12-15",
    departamento: "Cundinamarca",
    estado_del_proceso: "Abierto",
    modalidad_de_contratacion: "Selección Abreviada",
    url_del_proceso: "https://www.colombiacompra.gov.co/proceso/SECOP-2024-004",
  },
]

export class SecopApiClient {
  private baseUrl = "https://www.datos.gov.co/resource"

  // In production, this would fetch from the actual SECOP II API
  async fetchProcurements(limit = 50, offset = 0): Promise<SecopProcurement[]> {
    // For development, return mock data
    // In production, this would make actual API calls to:
    // `${this.baseUrl}/jbjy-vk9h.json?$limit=${limit}&$offset=${offset}`

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_SECOP_DATA.slice(offset, offset + limit))
      }, 1000) // Simulate API delay
    })
  }

  async fetchProcurementById(id: string): Promise<SecopProcurement | null> {
    const procurements = await this.fetchProcurements(1000)
    return procurements.find((p) => p.proceso_de_compra === id) || null
  }

  // Transform SECOP data to our internal format
  transformToProcessedProcurement(secopData: SecopProcurement): ProcessedProcurement {
    const statusMap: Record<string, "open" | "closed" | "awarded" | "cancelled"> = {
      Abierto: "open",
      "En evaluación": "open",
      Cerrado: "closed",
      Adjudicado: "awarded",
      Cancelado: "cancelled",
    }

    return {
      secop_id: secopData.proceso_de_compra,
      title: secopData.objeto_del_contrato,
      description: secopData.objeto_del_contrato,
      buyer_name: secopData.entidad,
      buyer_id: secopData.entidad.replace(/\s+/g, "_").toLowerCase(),
      tender_value: secopData.valor_del_contrato,
      currency: "COP",
      status: statusMap[secopData.estado_del_proceso] || "open",
      publication_date: secopData.fecha_de_inicio,
      closing_date: secopData.fecha_de_fin,
      category: secopData.modalidad_de_contratacion,
      location: `${secopData.departamento}${secopData.municipio ? `, ${secopData.municipio}` : ""}`,
      ocds_data: secopData,
    }
  }
}

export const secopApi = new SecopApiClient()
