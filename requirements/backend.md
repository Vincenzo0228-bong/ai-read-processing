# Backend Requirements (Primary Focus)

The backend is the core of this assessment. The goal is to design and implement a reliable, observable, AI-driven workflow system that processes inbound lead messages through a fixed sequence of steps, persists state, and exposes progress and results to the frontend.

## Core Concepts

- Each submitted lead creates a workflow instance

- A workflow progresses through multiple explicit steps

- Each step:

  - Uses AI where appropriate

  - Produces structured output

  - Can succeed or fail independently

- The system must tolerate AI unreliability and partial failure

## 1. Authentication & Authorization

Implement simple, production-style authentication.

### Requirements

- Email + password signup and login

- Issue a JWT access token on successful authentication

- Protect all lead and workflow endpoints

- Enforce row-level ownership (users may only access their own workflows and leads)

### Minimal user model

- `id`

- `email`

- `password_hash`

- `created_at`

Authentication should be functional but intentionally simple.

## 2. Lead Submission

Provide an endpoint to submit a new inbound lead message (simulating WhatsApp, web chat, etc.).

On submission:

- Persist the raw input data (name, contact channel, message, user)

- Create a new workflow instance associated with the authenticated user

- Set the initial workflow status to `pending` or `queued`

- Trigger asynchronous workflow execution (must not block the request)

## 3. Workflow Orchestration (Core of the Assessment)

Implement a fixed, explicit, multi-step workflow. **Do not use a black-box or fully autonomous agent.**

### Workflow Stages

You may rename or slightly adjust steps, but the workflow must include the following logical stages:

#### **1. Intent Classification**

- Determine what the message is about

- Choose exactly one category from a predefined set (see Appendix section)

#### **2. Structured Data Extraction**

- Extract structured fields from the message

- Always attempt a defined core schema

- Extract category-specific fields when applicable

#### **3. Decision / Recommendation**

- Produce a routing decision and recommended next actions

- Combine deterministic rules with AI-driven judgment

### Workflow Step Requirements

Each step must:

- Be explicitly defined in code (not implicit or combined)

- Have clear inputs and outputs

- Validate outputs strictly before persisting

- Update workflow state independently

- Persist both successful outputs and failure reasons

## 4. AI Integration

- Use an LLM of your choice (API or SDK)

- Use structured outputs (e.g. JSON schema, function calling, or equivalent)

- Validate all AI responses strictly:

  - Using NestJS features or third-party library
  
  - Incorrect shape, missing fields, or invalid types must fail the step

- Do not assume AI responses are correct, complete, or well-formed

Handling AI unreliability is a key evaluation area.

## 5. Workflow State & Persistence

Persist, at a minimum:

- Workflow instance

- Current overall workflow status (`pending | processing | completed | failed`)

- Per-step status (`not_started | processing | completed | failed | skipped`) and outputs

- AI responses per step (or derived structured outputs)

- Error or failure reasons per step

Requirements:

- Use a relational database (PostgreSQL preferred)

- JSON columns are acceptable where appropriate for non-queried data

- Workflow state must be queryable by the frontend

## 6. Failure Handling & Reliability

Your system must explicitly handle:

- AI call failures

- Invalid AI responses

- Partial completion (earlier steps succeed, later steps fail)

- Any other error from the time of receiving the message to relaying the final response

You must clearly define:

- When a workflow is considered `failed`

- Whether and how retries occur (simple retry logic is sufficient)

- How failures and errors are exposed to the frontend

This is a key evaluation area.

## 7. Background Processing

- Workflow execution must occur asynchronously

- Each workflow step must begin from a queue (e.g. BullMQ/Redis)

- API requests must not block on AI processing or workflow execution

## 8. API Endpoints (Suggested, Not Prescriptive)

At minimum, provide endpoints to:

- `POST /leads` - submit a new lead message

- `GET /leads` - list all workflows for the authenticated user

- `GET /leads/:id` - retrieve workflow details, including step states and outputs

You may add additional endpoints as needed.

## 9. Appendix

### 1. Intent Categories (AI Stage 1)

Use the following fixed set of categories for intent classification:

1. `sales_new` - new lead asking about pricing, availability, or services

2. `sales_existing` - existing customer requesting changes, upgrades, or add-ons

3. `support` - help request related to an existing booking or service issue

4. `spam` - irrelevant, promotional, or malicious content

5. `unknown` - genuinely unclear or insufficient information

Each workflow must be classified into exactly one category.

### 2. Structured Data Extraction (AI Stage 2)

#### A) Core Fields (Always Attempted)

Each workflow must attempt to extract the following core fields:

- `customer_name` (optional)

- `contact_channel` (enum: `whatsapp | webchat | email | other`)

- `service_interest` (optional short string)

- `location` (optional)

- `urgency` (enum: `low | medium | high`)

- `timeline` (enum: `now | <1w | 1-4w | >1m | unknown`)

- `budget_range` (enum: `<500 | 500-2000 | 2000-10000 | >10000 | unknown`)

- `language` (optional)

- `confidence` (number between 0 and 1)

#### B) Category-Specific Fields (Validated When Applicable)

Depending on the classified category:

- `sales_new`

  - `lead_type` (enum: `quote_request | availability | pricing | comparison | other`)

  - `service_date` (optional ISO date)

- `sales_existing`

  - `account_hint` (optional: order ID, booking ID, phone, etc.)

  - `change_request` (enum: `reschedule | upgrade | add_on | cancel | other`)

- `support`

  - `issue_type` (enum: `billing | scheduling | service_quality | technical | other`)

  - `severity` (enum: `low | medium | high`)

- `spam`

  - `spam_reason` (enum: `promo | phishing | irrelevant | abusive | other`)

- `unknown`

  - `missing_info` (array of enums: `service_type | budget | timeline | contact | other`)

### 3. Routing Decisions (AI Stage 3)

Routing should use a hybrid approach: deterministic defaults plus AI-driven nuance.

#### A) Routing Decision Schema

Each workflow must produce a routing decision with the following structure:

- `queue` (enum: `sales | support | ignore | needs_clarification`)

- `priority` (enum: `p0 | p1 | p2`)

  - **p0** - highest priority (critical / immediate)

  - **p1** - high priority

  - **p2** - normal or low priority

- `sla_minutes` (integer)

- `recommended_next_action` (short string)

- `required_followups` (array of short strings, optional)

- `explanation` (1-2 sentence justification)

#### B) Deterministic Defaults + AI Judgment

Default `queue` by category:

- `sales_new` → `sales`

- `sales_existing` → `sales` (or `support`, depending on interpretation)

- `support` → `support`

- `spam` → `ignore`

- `unknown` → `needs_clarification`

The AI must determine:

- `priority`

- `sla_minutes`

- `recommended_next_action`

- `required_followups` (if any)

- `explanation`

#### C) AI Requirement

Priority and routing decisions must not be hardcoded via simple keyword rules.

They should consider multiple signals, such as:

- Urgency language (“ASAP”, “today”, etc.)

- Budget or deal size implications

- Churn risk (“cancel”, “refund”, complaints)

- Timeline proximity

- Sentiment or emotional tone

### 4. Workflow Output Contract (Reference)

Each step should produce validated output roughly equivalent to:

- Step 1:  

  `{ category, confidence, rationale }`

- Step 2:  

  `{ extracted_fields: Core + CategorySpecific, confidence }`

- Step 3:  

  `{ routing_decision }`

Any step may fail if validation fails, and failures must be persisted and surfaced.
