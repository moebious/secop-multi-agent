# Rúbrica Core - Python Backend

This is the core Python backend for the Rúbrica deterministic audit engine.

## Structure

```
core/
├── rubrica/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── rup.py           # RUP Pydantic models
│   └── auditor/
│       ├── __init__.py
│       └── base.py          # Deterministic auditor
├── pyproject.toml           # Python dependencies
└── README.md               # This file
```

## Installation

### Local Development

```bash
# Install in editable mode
pip install -e .

# Install with dev dependencies
pip install -e ".[dev]"
```

### Docker

```bash
# Build image
docker build -t rubrica-core .

# Run container
docker run -p 8000:8000 rubrica-core
```

## Running the Service

```bash
# Start FastAPI server
python -m uvicorn rubrica.main:app --reload

# Or use the main module
python -m rubrica.main
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## Key Components

### RUP Schema (`rubrica.schemas.rup`)

Pydantic models for Colombian procurement data:
- `RUPSchema`: Main registry entry
- `ProveedorInfo`: Supplier information
- `ExperienciaInfo`: Contract history
- `CapacidadFinanciera`: Financial metrics
- `CapacidadOrganizacional`: Organizational capabilities

### Deterministic Auditor (`rubrica.auditor.base`)

Zero-hallucination audit engine:
- `DeterministicAuditor`: Main audit class
- `AuditResult`: Audit execution results
- `AuditFinding`: Individual findings

All calculations are:
1. Deterministic (same input → same output)
2. Logged for audit trail
3. Executed in sandboxes (TODO: E2B integration)

## Development

### Code Quality

```bash
# Format code
black rubrica/

# Lint
ruff rubrica/

# Type checking
mypy rubrica/
```

### Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=rubrica tests/
```

## TODO

- [ ] Implement E2B sandbox integration
- [ ] Add comprehensive audit rules
- [ ] Implement financial scoring algorithms
- [ ] Add database persistence
- [ ] Add authentication/authorization
- [ ] Add rate limiting
- [ ] Add request validation middleware
- [ ] Complete test coverage
