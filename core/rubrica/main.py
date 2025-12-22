"""
Main FastAPI application for Rúbrica Core Service

Provides REST API endpoints for audit operations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from rubrica import __version__
from rubrica.auditor.base import DeterministicAuditor
from rubrica.schemas.rup import RUPSchema

app = FastAPI(
    title="Rúbrica API",
    description="Deterministic AI Audit Engine for Colombian Public Procurement",
    version=__version__,
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://web:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize auditor
auditor = DeterministicAuditor(use_sandbox=False)  # TODO: Enable E2B sandbox


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Rúbrica Core API",
        "version": __version__,
        "status": "operational",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": __version__}


@app.post("/audit")
async def audit_rup(rup_data: RUPSchema):
    """
    Execute a deterministic audit on RUP data
    
    Args:
        rup_data: Validated RUP schema data
        
    Returns:
        AuditResult with findings and scores
    """
    try:
        result = await auditor.audit(rup_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audit failed: {str(e)}")


@app.get("/schemas/rup")
async def get_rup_schema():
    """
    Get the RUP schema definition
    
    Returns:
        JSON schema for RUP data structure
    """
    return RUPSchema.model_json_schema()


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
