# Workflows - Inngest Durable Execution

This directory contains Inngest workflow definitions for durable execution with Human-in-the-Loop (HITL) capabilities.

## Overview

Workflows orchestrate the audit pipeline with:
- **Durable Execution**: Workflows survive process restarts
- **HITL Checkpoints**: Human approval for critical decisions
- **Error Recovery**: Automatic retries and error handling
- **Event-Driven**: React to RUP data updates

## Structure

```
workflows/
├── audit-pipeline.ts      # Main audit workflow
├── data-ingestion.ts      # Multi-feed data ingestion
├── notifications.ts       # Alert and notification workflows
└── README.md             # This file
```

## Key Workflows

### 1. Audit Pipeline (`audit-pipeline.ts`)

Main workflow that:
1. Receives RUP data
2. Validates schema
3. Executes deterministic audit
4. Waits for human approval (if needed)
5. Publishes results

### 2. Data Ingestion (`data-ingestion.ts`)

Handles multi-source data:
- RUP API polling
- SECOP I/II webhooks
- Manual file uploads
- Data normalization

### 3. Notifications (`notifications.ts`)

Manages alerts:
- Audit completion
- Critical findings
- Human review required
- System status

## Usage

### Running Workflows

```bash
# Install dependencies
pnpm install

# Start Inngest dev server
pnpm inngest-dev

# Trigger a workflow
pnpm trigger-audit --rup-id=12345
```

### Testing Workflows

```bash
# Run workflow tests
pnpm test:workflows
```

## Configuration

Workflows require:
- `INNGEST_API_KEY`: Inngest API key
- `CORE_API_URL`: Rúbrica core service URL
- `NOTIFICATION_WEBHOOK`: Webhook for notifications

## Development

### Adding a New Workflow

1. Create a new `.ts` file in this directory
2. Define the workflow using Inngest SDK
3. Register in `index.ts`
4. Add tests

### Best Practices

- Use TypeScript for type safety
- Add retry logic for external calls
- Log all important steps
- Use HITL for critical decisions
- Test error scenarios

## TODO

- [ ] Implement audit pipeline workflow
- [ ] Add data ingestion workflows
- [ ] Set up notification system
- [ ] Add workflow monitoring
- [ ] Implement error recovery strategies
- [ ] Add workflow tests
