## Overview
This service processes inbound lead messages using a fixed, multi-step AI workflow.

## Workflow Design
Each lead creates a workflow instance with three explicit steps:
1. Intent classification
2. Structured data extraction
3. Routing decision

Each step is executed asynchronously and persisted independently.

## AI Reliability
LLM outputs are treated as untrusted input.
All responses are validated using strict schemas.
Invalid outputs fail the step and workflow safely.

## Failure Handling
- Partial failures are persisted
- Failed steps include error messages
- Workflows do not retry infinitely

## Architecture Tradeoffs
- Explicit workflow over autonomous agents
- Thin queue processor, thick domain service
- JSONB used for non-queried AI outputs

## Running Locally
```bash
docker-compose up --build
