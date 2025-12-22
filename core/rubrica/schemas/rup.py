"""
RUP (Registro Único de Proponentes) Pydantic Schemas

This module defines the data structures for Colombian procurement registry data.
All schemas ensure type safety and validation for deterministic processing.
"""

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


class TipoPersona(str, Enum):
    """Type of legal entity"""
    NATURAL = "NATURAL"
    JURIDICA = "JURIDICA"


class TipoDocumento(str, Enum):
    """Colombian identification document types"""
    NIT = "NIT"
    CC = "CC"
    CE = "CE"
    PASAPORTE = "PASAPORTE"


class ProveedorInfo(BaseModel):
    """
    Supplier/Provider basic information from RUP registry
    """
    model_config = ConfigDict(frozen=True)  # Immutable for deterministic processing

    documento_tipo: TipoDocumento
    documento_numero: str = Field(..., description="ID/NIT number")
    razon_social: str = Field(..., description="Legal business name")
    tipo_persona: TipoPersona
    fecha_registro: date = Field(..., description="RUP registration date")
    email: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    municipio: Optional[str] = None
    departamento: Optional[str] = None


class ExperienciaInfo(BaseModel):
    """
    Historical contract experience
    """
    model_config = ConfigDict(frozen=True)

    contrato_id: str = Field(..., description="SECOP contract ID")
    entidad_contratante: str = Field(..., description="Contracting entity")
    objeto_contrato: str = Field(..., description="Contract purpose")
    valor_contrato: Decimal = Field(..., ge=0, description="Contract value in COP")
    fecha_inicio: date
    fecha_fin: date
    estado: str = Field(..., description="Contract status")
    codigo_unspsc: Optional[List[str]] = Field(default_factory=list, description="UNSPSC codes")


class CapacidadFinanciera(BaseModel):
    """
    Financial capacity metrics
    """
    model_config = ConfigDict(frozen=True)

    anio_reportado: int = Field(..., ge=2000, le=2100)
    activos_corrientes: Decimal = Field(..., ge=0)
    activos_totales: Decimal = Field(..., ge=0)
    pasivos_corrientes: Decimal = Field(..., ge=0)
    pasivos_totales: Decimal = Field(..., ge=0)
    patrimonio: Decimal = Field(...)
    ingresos_operacionales: Decimal = Field(..., ge=0)
    utilidad_operacional: Optional[Decimal] = None
    
    # Calculated ratios (computed deterministically)
    @property
    def liquidez(self) -> Decimal:
        """Current ratio: Current Assets / Current Liabilities"""
        if self.pasivos_corrientes == 0:
            return Decimal('0')
        return self.activos_corrientes / self.pasivos_corrientes
    
    @property
    def endeudamiento(self) -> Decimal:
        """Debt ratio: Total Liabilities / Total Assets"""
        if self.activos_totales == 0:
            return Decimal('0')
        return self.pasivos_totales / self.activos_totales


class CapacidadOrganizacional(BaseModel):
    """
    Organizational capabilities
    """
    model_config = ConfigDict(frozen=True)

    anio_reportado: int = Field(..., ge=2000, le=2100)
    numero_empleados: int = Field(..., ge=0)
    numero_profesionales: int = Field(..., ge=0)
    numero_tecnicos: int = Field(..., ge=0)
    tiene_sistema_calidad: bool = False
    certificaciones_iso: List[str] = Field(default_factory=list)


class RUPSchema(BaseModel):
    """
    Main RUP (Registro Único de Proponentes) Schema
    
    This is the primary data structure for Colombian procurement registry entries.
    Designed for deterministic validation and processing.
    """
    model_config = ConfigDict(frozen=True, validate_assignment=True)

    # Core identification
    rup_id: str = Field(..., description="Unique RUP registry ID")
    version: str = Field(default="1.0", description="Schema version")
    fecha_extraccion: datetime = Field(
        default_factory=datetime.now,
        description="Data extraction timestamp"
    )
    
    # Main data sections
    proveedor: ProveedorInfo
    experiencia: List[ExperienciaInfo] = Field(default_factory=list)
    capacidad_financiera: List[CapacidadFinanciera] = Field(default_factory=list)
    capacidad_organizacional: List[CapacidadOrganizacional] = Field(default_factory=list)
    
    # Metadata
    estado_rup: str = Field(default="ACTIVO", description="RUP registry status")
    observaciones: Optional[str] = None

    def get_latest_financial(self) -> Optional[CapacidadFinanciera]:
        """Get most recent financial capacity data"""
        if not self.capacidad_financiera:
            return None
        return max(self.capacidad_financiera, key=lambda x: x.anio_reportado)
    
    def get_latest_organizational(self) -> Optional[CapacidadOrganizacional]:
        """Get most recent organizational capacity data"""
        if not self.capacidad_organizacional:
            return None
        return max(self.capacidad_organizacional, key=lambda x: x.anio_reportado)
    
    def total_contract_value(self) -> Decimal:
        """Calculate total historical contract value (deterministic)"""
        return sum(exp.valor_contrato for exp in self.experiencia)
