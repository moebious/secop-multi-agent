# Rúbrica - AI Deterministic Audit Engine for Colombian Bidding

## Overview

**Rúbrica** is a deterministic audit system designed for Colombia's public procurement platform (SECOP). Built on the principle of **"Deterministic Truth"**, it eliminates AI hallucinations through math-based sandboxing and provides transparent, auditable analysis of government bidding processes.

## Core Philosophy: Deterministic Truth

Traditional AI systems introduce uncertainty through probabilistic reasoning. Rúbrica takes a different approach:

- **Zero Hallucinations**: Mathematical operations run in isolated E2B sandboxes
- **Verifiable Results**: Every calculation can be traced and audited
- **Durable Execution**: Human-in-the-Loop (HITL) checkpoints ensure oversight
- **Multi-Feed Ingestion**: Process RUP (Registro Único de Proponentes) data from multiple sources

## Architecture

```
┌─────────────────┐
│   Multi-Feed    │ RUP XML/JSON/CSV
│   Ingestion     │──────────┐
└─────────────────┘          │
                             ▼
┌─────────────────────────────────────┐
│      Core Python Engine             │
│  ┌──────────┐      ┌─────────────┐ │
│  │ Pydantic │      │   Polars    │ │
│  │ Schemas  │──────│  Analytics  │ │
│  └──────────┘      └─────────────┘ │
│         │                  │        │
│         ▼                  ▼        │
│  ┌──────────────────────────────┐  │
│  │   Deterministic Auditor      │  │
│  │   (Math in E2B Sandbox)      │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│    Workflows (Inngest)              │
│    - Durable Execution              │
│    - HITL Checkpoints               │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│    Next.js Frontend (Vercel AI SDK) │
│    - Real-time audit dashboards     │
│    - Human approval interfaces      │
└─────────────────────────────────────┘
```

## Technology Stack

### Backend (Python)
- **Polars**: High-performance DataFrame operations for large-scale data
- **Pydantic**: Type-safe schemas for RUP data structures
- **E2B**: Isolated code execution sandboxes for mathematical operations

### Frontend (Next.js)
- **Vercel AI SDK**: Streaming AI responses with deterministic backend
- **Inngest**: Durable workflow execution with HITL support
- **React**: Modern UI for audit visualization

## Project Structure

```
/
├── core/                    # Python core logic
│   ├── rubrica/
│   │   ├── schemas/        # Pydantic models for RUP data
│   │   ├── auditor/        # Deterministic audit engine
│   │   └── __init__.py
│   ├── pyproject.toml      # Python dependencies
│   └── README.md
│
├── apps/
│   └── web/                # Next.js web application
│       ├── app/            # Next.js app directory
│       ├── components/     # React components
│       └── package.json
│
├── workflows/              # Inngest workflow definitions
│   ├── audit-pipeline.ts   # Main audit workflow
│   └── README.md
│
├── docker-compose.yml      # Development environment
└── README.md              # This file
```

## Multi-Feed Ingestion

Rúbrica supports multiple data sources for Colombian procurement:

1. **RUP API**: Real-time procurement registry data
2. **SECOP I**: Legacy system integration
3. **SECOP II**: Current platform data feeds
4. **Manual Uploads**: CSV/Excel file processing

All feeds are normalized to unified Pydantic schemas, ensuring consistency.

## Deterministic Processing

### How We Ensure Zero Hallucinations

1. **Schema Validation**: All input data validated against Pydantic models
2. **Math Sandboxing**: Numerical operations executed in E2B isolated environments
3. **Audit Trail**: Every calculation logged with inputs/outputs
4. **Human Checkpoints**: Critical decisions require HITL approval via Inngest

### Example Workflow

```python
# Pseudo-code illustration
async def audit_bid(rup_data: RUPSchema) -> AuditResult:
    # 1. Validate input
    validated = RUPValidator.validate(rup_data)
    
    # 2. Execute math in sandbox
    financial_score = await e2b_sandbox.run(
        calculate_financial_score,
        validated.financial_data
    )
    
    # 3. HITL checkpoint
    if financial_score.requires_review:
        await inngest.wait_for_human_approval(financial_score)
    
    # 4. Return deterministic result
    return AuditResult(
        score=financial_score,
        audit_trail=sandbox.get_logs()
    )
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- pnpm

### Quick Start

```bash
# Clone repository
git clone https://github.com/moebious/secop-multi-agent.git
cd secop-multi-agent

# Start development environment
docker-compose up -d

# Install Python dependencies
cd core
pip install -e .

# Install frontend dependencies
cd ../apps/web
pnpm install

# Start development servers
pnpm dev
```

### Development Workflow

1. **Backend Changes**: Edit Python code in `/core`
2. **Frontend Changes**: Edit Next.js code in `/apps/web`
3. **Workflows**: Define durable workflows in `/workflows`
4. **Testing**: Run `pytest` for Python, `pnpm test` for TypeScript

## RUP Data Schema

The Colombian RUP (Registro Único de Proponentes) contains:

- **Proveedor Info**: Supplier identification and legal data
- **Experiencia**: Historical contract experience
- **Capacidad Financiera**: Financial capacity metrics
- **Capacidad Organizacional**: Organizational capabilities

All fields are typed and validated through Pydantic.

## Roadmap

- [x] Initial project scaffolding
- [ ] RUP schema implementation
- [ ] E2B sandbox integration
- [ ] Basic auditor logic
- [ ] Inngest workflow setup
- [ ] Frontend dashboard
- [ ] Multi-feed connectors
- [ ] Production deployment

## Contributing

This is an initial scaffolding. Contributions welcome as we build out the deterministic audit capabilities.

## License

MIT

## Contact

For questions about Colombian procurement or the Rúbrica system, please open an issue.
