"""
Rúbrica - Deterministic AI Audit Engine for Colombian Public Procurement

This package provides a zero-hallucination audit system for SECOP/RUP data.
"""

__version__ = "0.1.0"
__author__ = "Rúbrica Team"

from rubrica.schemas.rup import RUPSchema, ProveedorInfo, ExperienciaInfo
from rubrica.auditor.base import DeterministicAuditor

__all__ = [
    "RUPSchema",
    "ProveedorInfo",
    "ExperienciaInfo",
    "DeterministicAuditor",
]
