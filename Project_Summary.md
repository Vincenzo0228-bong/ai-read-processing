# AI Lead Processing System - Concise Project Summary

## Overview

A production-grade full-stack application that processes customer messages through a 3-step AI workflow with real-time status updates. Built with NestJS, React, PostgreSQL, Redis, and OpenAI integration.

**Tech Stack:** NestJS (TypeORM, BullMQ) • React (Vite, MUI, Zustand) • PostgreSQL • Redis • Docker • OpenAI API

---

## System Flow

User submits message → Lead created → Workflow enqueued (BullMQ)
↓
Worker processes 3 steps: Intent → Extraction → Routing
↓
Results persisted to PostgreSQL + Real-time updates via WebSocket
↓
Frontend displays live status + final output


---

## Core Workflow: 3-Step AI Pipeline

### Step 1: Intent Classification
- **Input:** Customer message
- **Output:** Category (`sales_new`, `sales_existing`, `support`, `spam`, `unknown`) + confidence + rationale
- **Validation:** Zod schema ensures strict typing

### Step 2: Data Extraction
- **Input:** Message + intent category
- **Output:** Structured fields (name, urgency, timeline, budget, location, etc.) + confidence
- **Validation:** All core fields validated against schema

### Step 3: Routing Decision
- **Input:** Full context (message + intent + extraction)
- **Output:** Queue assignment, priority (p0/p1/p2), SLA minutes, recommended actions
- **Logic:** Deterministic defaults + AI judgment for priority/urgency

**Implementation:** `src/workflows/workflow.service.ts` - Each step is a separate method with explicit error handling

---

## Key Architecture Patterns

### Async Processing with BullMQ
- **HTTP endpoint** creates workflow + enqueues job → returns immediately
- **Worker process** picks up job → executes 3 steps → updates status
- **Why:** Non-blocking, horizontally scalable, survives restarts

### Real-Time Updates (Redis Pub/Sub → WebSocket)

Workflow Service → Redis Pub/Sub → WebSocket Gateway → Frontend

- Status published to Redis channel after each step
- Gateway subscribes and broadcasts to connected clients
- Frontend updates UI in real-time via Socket.io

### Data Persistence
- **Workflows table:** Stores status + JSONB context (accumulated results)
- **Workflow Steps table:** Individual step status + output + errors
- **Why JSONB:** Flexible schema, full execution history, easy debugging

### AI Integration with Validation
- **Development:** Mock responses for 10 sample messages (no API calls)
- **Production:** OpenAI API with temperature=0 for deterministic output
- **All responses validated with Zod schemas before persistence**
- **Failures:** Invalid AI output → step fails → workflow fails → error persisted

---

## Authentication & Security

- **JWT-based auth:** Signup/login returns token stored in localStorage
- **Row-level ownership:** Users only see their own leads/workflows
- **Protected routes:** `@UseGuards(JwtAuthGuard)` on all lead endpoints

---

## Frontend Architecture

**Components:**
- `Dashboard.tsx` - Main page with lead list + WebSocket listener
- `LeadList.tsx` - Paginated table with search/filter
- `LeadModal.tsx` - Form to submit new lead
- `WorkflowDetail.tsx` - Shows JSON output + step timeline

**State Management:**
- **Auth:** Zustand (persisted to localStorage)
- **Leads:** React hooks + real-time Socket.io updates

**API Client:** Centralized `apiFetch()` with automatic JWT header injection

---

## Error Handling Strategy

**Multi-Layer Failure Handling:**
1. **Step-level:** Invalid AI output → step marked `failed` + error saved
2. **Workflow-level:** Any step fails → entire workflow marked `failed`
3. **Status broadcast:** Failure status published to Redis → frontend notified
4. **No retries:** Failures are terminal (can be extended with retry logic)

**Handled Scenarios:**
- AI API timeout/failure
- Invalid JSON response
- Schema validation failure
- Missing required fields
- Database errors

---

## Database Schema (Simplified)

```sql
users: id, email, password_hash
leads: id, user_id, name, contact_channel, message
workflows: id, lead_id, user_id, status, context (JSONB), error
workflow_steps: id, workflow_id, step_type, status, output (JSONB), error

{
  "message": "...",
  "intent": { "category": "sales_new", "confidence": 0.98, ... },
  "extraction": { "extracted_fields": {...}, "confidence": 0.95 },
  "routing": { "queue": "sales", "priority": "p1", ... }
}

Docker Setup
Services: PostgreSQL • Redis • Backend (API) • Worker (BullMQ processor) • PgAdmin

# Start everything
docker-compose up --build

# Backend available at http://localhost:3000
# Frontend runs separately: cd assessment-frontend && npm run dev

DB_HOST=postgres
REDIS_HOST=redis
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...
MOCK_AI=true  # Use mock responses in development

Testing & Sample Data
Unit Tests: workflow.service.spec.ts - Workflow execution with mocked repos

Sample Messages: 10 test cases in sample-messages.md + outputs.md

New customer inquiry
Urgent support request
Billing complaint
Spam/phishing
Vague questions
etc.

# Backend + Worker + Databases
docker-compose up --build

# Frontend (separate terminal)
cd assessment-frontend
npm install
npm run dev

POST /auth/signup - Create account
POST /auth/login - Get JWT token
POST /leads - Submit new lead (requires auth)
GET /leads - List user's leads
GET /leads/:id - Get workflow details


Production Readiness
✅ TypeScript type safety
✅ JWT authentication + row-level access
✅ Async queue with BullMQ
✅ Real-time WebSocket updates
✅ Comprehensive error handling
✅ Structured logging
✅ Schema validation (Zod)
✅ Docker containerization
✅ Unit tests

Summary
This system demonstrates production-grade AI workflow orchestration with:

Explicit, fixed pipeline (not a black box)
Reliable AI integration (strict validation, graceful failures)
Async processing (non-blocking, scalable)
Real-time updates (WebSocket via Redis Pub/Sub)
Full observability (persistent state, structured logging)
The architecture prioritizes reliability, debuggability, and maintainability over flexibility, using industry-standard patterns throughout.