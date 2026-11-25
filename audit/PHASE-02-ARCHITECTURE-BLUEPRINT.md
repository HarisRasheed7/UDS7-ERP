# PHASE 02 — ARCHITECTURE BLUEPRINT

**Project:** Multi-Organization, Multi-Industry ERP & Business Management Platform  
**Project Name Status:** TBD (Neutral Engineering Baseline per `docs/PROJECT-IDENTITY.md`)  
**Phase:** Phase 02 — Architecture and ADR Approval (`docs/PHASES.md`, Stage 3 of `IMPLEMENTATION-ROADMAP-STAGES.md`)  
**Authority:** `docs/00-MASTER-INSTRUCTIONS.md`, `docs/03-ARCHITECTURE.md`, `docs/04-TECH-STACK.md`, `docs/10-MULTI-TENANCY.md`, `docs/13-DATA-MODEL.md`, `docs/14-API-SPECIFICATION.md`, `docs/development/02-folder-structure.md`  
**Date:** November 2026  

---

## 1. Purpose & Architectural Objective

This blueprint translates the approved platform specifications into a concrete, implementable engineering architecture. Its exit criterion is that **no foundational technology, module boundary, data-access, tenancy, transaction, or security decision is left to an implementation agent's guess**.

The platform is engineered as a **Multi-Tenant Modular Monolith First** (`docs/03-ARCHITECTURE.md` Sec 34–35; `docs/development/02-folder-structure.md` Sec 1):
* Strong internal module and layer boundaries enable future service extraction without premature distributed-systems complexity.
* Every runtime layer is strictly JavaScript (`ES6+`), Next.js + React + custom CSS Modules on the client, Node.js (`Fastify` recommended in ADR-003) on the server, and PostgreSQL as the single authoritative transactional database.

---

## 2. Logical & Physical System Topology

```text
                        ┌───────────────────────────────────────┐
                        │     Users / Browsers / Future Mobile  │
                        └───────────────────┬───────────────────┘
                                            │ HTTPS (REST / JSON + HttpOnly Cookies)
                                            ▼
                        ┌───────────────────────────────────────┐
                        │      Reverse Proxy / TLS Gateway      │
                        └───────────────┬───────────────────────┘
                                        │
                  ┌─────────────────────┴─────────────────────┐
                  ▼                                           ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│   CLIENT APPLICATION (client/)    │       │   SERVER MONOLITH (server/)       │
│   Next.js (App Router) + React    │──────▶│   Node.js REST API (/api/v1)      │
│   CSS Modules + Design Tokens     │ HTTP  │   Fastify (ADR-003)               │
│   TanStack Query + Zustand        │ Only  │                                   │
│   IndexedDB (Offline Queue Ph 73) │       │   Middleware Pipeline:            │
└───────────────────────────────────┘       │    1. Request/Correlation ID      │
       ❌ NO Direct PostgreSQL Access       │    2. Security Headers & RateLimit│
                                            │    3. Auth & Session Verification │
                                            │    4. Trusted Tenant Context      │
                                            │    5. RBAC/ABAC Authorization     │
                                            │    6. Zod Payload Validation      │
                                            │                                   │
                                            │   Module Application & Domain     │
                                            │   Repositories & UnitOfWork       │
                                            └─────────────────┬─────────────────┘
                                                              │ Parameterized SQL (pg)
                                                              │ SET LOCAL RLS Context
                                                              ▼
                                            ┌───────────────────────────────────┐
                                            │       PostgreSQL (Authoritative)  │
                                            │  - Relational Schemas + FKs       │
                                            │  - Row-Level Security (RLS)       │
                                            │  - Immutability Triggers          │
                                            │  - Transactional Outbox Table     │
                                            └─────────────────┬─────────────────┘
                                                              │
                              ┌───────────────────────────────┼───────────────────────────────┐
                              ▼                               ▼                               ▼
                 ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
                 │  File Storage Adapter  │      │   Background Workers   │      │  Cache / Queue Layer   │
                 │  Dev: Local Private FS │      │  Phase 06-18: PG Outbox│      │  Phase 19+: Redis +    │
                 │  Prod: S3 / MinIO      │      │  Phase 19+: BullMQ     │      │  BullMQ (ADR-008)      │
                 └────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

---

## 3. Layer Responsibilities & Dependency Direction

Strict inward dependency direction prevents circular imports, leaked domain rules, and client-side security bypasses (`docs/development/02-folder-structure.md` Sec 87–99):

```text
[Client Presentation Layer]
  Page -> Module UI Components -> Shared UI Components -> Primitive UI
  Page -> Module API Service -> HTTP API Client (/api/v1)
       │
       ▼ (HTTPS JSON Boundary — Never direct DB)
[Server HTTP & Boundary Layer]
  Route -> Middleware (Auth / TenantContext / AuthZ / Validator) -> Thin Controller
       │
       ▼
[Server Application Layer]
  Application Services / Commands / Queries -> Transaction Coordinator (Unit of Work)
       │
       ▼
[Server Domain Layer]
  Domain Entities, Value Objects (Money/Quantity), Invariants, State Machines, Domain Events
       │
       ▼
[Server Infrastructure & Persistence Layer]
  Module Repositories -> PostgreSQL Connection Pool (pg) / File Adapter / Event Outbox
```

### Mandatory Layer Invariants
1. **UI Components & Pages (`client/`):** Own presentation, local UI state, accessibility, loading/empty/error states, and UX pre-validation only. Never own authoritative financial totals, stock rules, authorization decisions, or database credentials.
2. **Routes & Controllers (`server/src/api/`, `modules/*/api/`):** Thin HTTP adapters only. Extract validated inputs, invoke Application Services, map domain errors to HTTP statuses, and serialize output via explicit allowlist serializers. Zero business rules or raw SQL.
3. **Application Services (`modules/*/application/`):** Orchestrate use cases, start/commit database transactions, invoke cross-module public interfaces, record audit logs, and enqueue outbox events.
4. **Domain Layer (`modules/*/domain/`):** Pure business logic, invariants (e.g., double-entry balance $\sum Debit = \sum Credit$, negative stock guards, SoD checks), and state transitions. Zero dependency on HTTP framework (`fastify`/`express`) or raw SQL pool.
5. **Repositories (`modules/*/infrastructure/repositories/`):** Private to the owning module. Every tenant-scoped query requires validated `organizationId` and executes inside the active transaction client when part of a Unit of Work.

---

## 4. Module Boundaries & Allowed Cross-Module Communication

Each module owns its internal domain logic, repositories, and database tables (`docs/03-ARCHITECTURE.md` Sec 6; `docs/development/02-folder-structure.md` Sec 98–99):

| Pattern | Allowed? | Rule & Mechanism |
|---|---|---|
| **Public Module Interface (`modules/<name>/index.js`)** | **ALLOWED** | Synchronous cross-module queries or transactional commands (e.g. `inventoryModule.reserveStock(tx, ctx, items)`). |
| **Transactional Domain Events (Outbox)** | **ALLOWED** | Asynchronous decoupled reactions (e.g. `SalesOrderConfirmed` $\to$ Notification, Search Indexer, Analytics). |
| **Shared Kernel (`shared/` & `server/src/domain/`)** | **ALLOWED** | Platform-neutral contracts, error classes, money/quantity value objects, permission constants, Zod schemas. |
| **Importing another module's internal `repositories/`** | **FORBIDDEN** | Violates encapsulation; prevents future service extraction. |
| **Direct SQL `JOIN` / `UPDATE` mutating another module's tables** | **FORBIDDEN** | Mutations to another domain's state must flow through that domain's Application Service inside the shared transaction or via events. |
| **Circular Module Dependencies (`A -> B -> A`)** | **FORBIDDEN** | Break cycles using Domain Events or moving pure shared value objects to `server/src/domain/`. |

*(See [PHASE-02-MODULE-MAP.md](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/PHASE-02-MODULE-MAP.md) for the complete 47-module boundary & dependency table.)*

---

## 5. Trusted Tenant Context Propagation

Per `docs/10-MULTI-TENANCY.md` Sec 3 & 29–40, **every execution path** propagates an immutable, server-verified `tenantContext`:

```javascript
// Conceptual TenantContext Shape (Server-Side Only)
{
  requestId: 'req_01...',
  correlationId: 'corr_01...',
  actorType: 'USER', // 'USER' | 'SYSTEM_JOB' | 'INTEGRATION_WEBHOOK' | 'AI_TOOL'
  userId: 'uuid',
  sessionId: 'uuid',
  organizationId: 'uuid', // Primary tenant boundary (never blindly trusted from client)
  activeCompanyId: 'uuid | null',
  activeBranchId: 'uuid | null',
  allowedScopes: { companies: ['...'], branches: ['...'], warehouses: ['...'] },
  effectivePermissions: ['inventory.stock.view', ...]
}
```

### Propagation Matrix Across All 6 Platform Channels
1. **HTTP API Requests:**
   * `authMiddleware` verifies session/JWT $\to$ `tenantContextMiddleware` checks requested org header/route param against `organization_memberships` (active user + active org) $\to$ opens PostgreSQL transaction/client context and sets `SET LOCAL app.current_organization_id = '<uuid>'` for PostgreSQL RLS.
2. **Database Queries (Defense-in-Depth):**
   * Layer 1: Repository methods require `(context, ...)` and explicitly filter `WHERE organization_id = $1`.
   * Layer 2: PostgreSQL RLS policies (`USING (organization_id = current_setting('app.current_organization_id', true)::uuid)`) prevent accidental leak even if a developer omits a `WHERE` clause.
3. **Background Jobs & Outbox Events:**
   * Enqueued payloads carry `{ organizationId, actorId, correlationId, companyId, branchId }`. Workers re-verify organization active status and set PostgreSQL RLS `app.current_organization_id` before executing any handler.
4. **File Storage & Downloads:**
   * Object keys are strictly partitioned under `orgs/{organization_id}/{module}/{entity_id}/{file_uuid}`. Downloads validate authentication, tenant membership, and record-level authorization before streaming or issuing a short-lived signed URL.
5. **Exports & Reports:**
   * Export jobs capture `tenantContext` + actor permissions snapshot at request time; queries enforce organization + branch/warehouse ABAC filters; generated files inherit record access rules.
6. **Cache Keys (Redis / Memory):**
   * Every tenant-owned cache key must be prefixed with `org:{organizationId}:` (e.g., `org:{orgId}:perm:user:{userId}`). Global platform keys use `platform:` prefix and never hold tenant data.

---

## 6. Core Architectural Patterns

### 6.1 Transaction Boundaries (Unit of Work)
* Multi-step mutations (e.g., POS sale = sale header + sale lines + stock movement + payment + GL journal + audit record + outbox event) run inside a single PostgreSQL transaction via `db.withTransaction(async (tx) => { ... })`.
* Any invariant failure or exception executes an automatic `ROLLBACK`, leaving zero partial records.

### 6.2 Idempotency Pattern
* All state-critical mutation endpoints (`POST /api/v1/pos/sales`, `/payments`, `/journal-entries/*/post`, `/sync/push`, `/webhooks/*`) inspect the `Idempotency-Key` header.
* Table `idempotency_keys (organization_id, idempotency_key, route_signature, request_hash, response_status, response_body, status, expires_at)` is checked inside the transaction:
  * Same key + same request hash + `COMPLETED` $\to$ return stored response immediately without re-executing business logic.
  * Same key + different request hash $\to$ return `422 / 409 CONFLICT (IDEMPOTENCY_KEY_REUSED)`.
  * Same key + `IN_PROGRESS` $\to$ return `409 CONFLICT (CONCURRENT_REQUEST_IN_PROGRESS)`.

### 6.3 Concurrency Control Strategy
* **Pessimistic Locking (`SELECT ... FOR UPDATE`):** Mandatory for inventory stock balances (`inventory_balances`), cash drawer shifts, and business document numbering sequences (`document_sequences`). Lock acquisition follows deterministic key ordering (e.g., sort `product_id` ASC before locking multi-line orders) to prevent PostgreSQL deadlocks.
* **Optimistic Locking (`version` integer + `If-Match` ETag):** Applied to editable documents/master records (Customers, Draft Orders, Workflow Definitions, Custom Field Schemas) using `UPDATE ... SET version = version + 1 WHERE id = $1 AND version = $2`, returning `409 CONFLICT` on stale edits.

### 6.4 Transactional Outbox Pattern
* To prevent "dual-write" inconsistency (DB commits, event bus fails; or DB rolls back after email was sent), asynchronous side effects are inserted into `domain_outbox_events` inside the **exact same PostgreSQL transaction** as the domain mutation.
* A background dispatcher polls/listens (`LISTEN/NOTIFY` or worker loop) and publishes with at-least-once delivery; downstream consumers enforce idempotency via `event_id`.

### 6.5 Error Handling & Safe Diagnostics
* Domain errors subclass a shared `AppError(code, httpStatus, message, details, isOperational)`.
* Central Fastify error handler formats all errors into the standardized envelope (`docs/14-API-SPECIFICATION.md` Sec 36) with `requestId`, logs full internal diagnostics + stack trace via `pino` (redacting passwords, tokens, API keys, PII), and strips stack traces/SQL internals from HTTP responses.

---

## 7. Architecture Decision Records (ADRs) Index

Every consequential technology and architecture decision is formally documented in `audit/adr/`:

| ADR ID | Decision Title | Status | Summary of Decision |
|---|---|---|---|
| **[ADR-001](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-001-governance-and-specs.md)** | Authoritative Specifications & Project Identity | Proposed / Aligned | Designates `docs/00-MASTER-INSTRUCTIONS.md` & `docs/PHASES.md` as canonical; keeps consolidated modules spec & neutral naming. |
| **[ADR-002](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-002-frontend-stack-and-styling.md)** | JavaScript-Only Frontend, Next.js App Router & CSS Modules | Approved by Spec | JavaScript (`.js`/`.jsx`) strictly; Next.js App Router (`client/src/app/`); CSS Modules + Design Tokens; zero TypeScript/Tailwind. |
| **[ADR-003](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-003-backend-modular-monolith.md)** | Modular Monolith Backend Framework (Node.js + Fastify) | Proposed — Recommended | Standalone `server/` modular monolith using **Fastify** (`/api/v1`) with strict controller/service/domain/repository layering. |
| **[ADR-004](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-004-postgresql-data-access-and-precision.md)** | PostgreSQL Data Access (`pg` + SQL Migrations) & Numeric Precision | Proposed — Recommended | **`node-postgres` (`pg`)** + versioned SQL migrations over heavy ORMs; `NUMERIC(20, 4)` + `decimal.js` for money/quantities; UTC `TIMESTAMPTZ`. |
| **[ADR-005](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-005-multi-tenancy-isolation.md)** | Shared DB / Shared Schema + Defense-in-Depth PostgreSQL RLS | Proposed — Recommended | Shared PostgreSQL schema with mandatory `organization_id` + PostgreSQL Row-Level Security (`SET LOCAL`) + repository guards. |
| **[ADR-006](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-006-auth-sessions-and-authorization.md)** | Dual-Token/Session Auth & Granular RBAC + ABAC + SoD | Approved by Spec | `HttpOnly` rotating session/refresh tokens + short-lived access tokens; Argon2id; dot-notation `module.resource.action` permissions + SoD. |
| **[ADR-007](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-007-transactions-immutability-concurrency-outbox.md)** | Atomic Transactions, Immutable Ledgers, Locking & Outbox | Approved by Spec | Unit-of-Work transactions; DB triggers blocking `UPDATE`/`DELETE` on posted ledgers/audit; `SELECT FOR UPDATE`; idempotency keys; outbox. |
| **[ADR-008](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-008-infrastructure-jobs-cache-storage.md)** | Staged Infrastructure (PG Outbox First, Redis/BullMQ Later) & Storage | Proposed — Recommended | Start Phases 03–18 with Node.js + PostgreSQL only (outbox worker); add Redis/BullMQ when justified; abstract local FS / S3 storage. |
| **[ADR-009](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-009-observability-audit-and-errors.md)** | Dual-Stream Audit Trail, Structured Logging & Error Envelope | Approved by Spec | Immutable DB `audit_logs` distinct from `pino` structured JSON diagnostic logs; correlation IDs; sanitized JSON error envelopes. |
| **[ADR-010](file:///c:/Users/HARIS%20RASHEED%207/Desktop/UDS7%20ERP/audit/adr/ADR-010-testing-and-quality-gates.md)** | Testing Stack, Lint Tooling & JS-Only Static Guardrails | Proposed — Recommended | **Vitest** + **React Testing Library** + **Playwright** + **ESLint/Prettier** + automated JS-only/no-Tailwind guardrails. |

---

## 8. High-Risk Proof-of-Concept (PoC) Spikes

Before committing large feature modules onto foundational patterns, the following targeted PoC spikes are scheduled at their corresponding foundation phases:

| Spike ID | Target Phase | Risk Area Being Proven | Acceptance Criterion for Spike |
|---|---|---|---|
| **SPIKE-01** | Phase 05 / 08 | **Connection-Pooled PostgreSQL RLS Isolation** | Prove `pg` pool transaction wrapper executes `SET LOCAL app.current_organization_id` cleanly, resets on release, and blocks cross-tenant queries under 50 concurrent mixed-tenant requests. |
| **SPIKE-02** | Phase 05 / 21 | **Deadlock-Free Pessimistic Stock Locking & Immutability Triggers** | Prove sorted-ID `SELECT ... FOR UPDATE` prevents overselling under 50 concurrent requests and DB triggers abort direct `UPDATE`/`DELETE` on posted financial/audit rows. |
| **SPIKE-03** | Phase 10 / 11 | **Next.js App Router + CSS Modules + 10-Theme Token Engine** | Prove dynamic runtime switching across 10 CSS-variable themes (`data-theme`) with SSR hydration parity, `prefers-reduced-motion`, and zero Tailwind CSS. |
| **SPIKE-04** | Phase 73 | **Offline IndexedDB Outbox & Server Reconciliation** | Prove deterministic replay of queued POS transactions with `Idempotency-Key` and explicit conflict surfacing without bypassing server stock/auth rules. |

---

## 9. Phase 02 Exit Criteria Verification

* [x] Modular boundaries, domain ownership, allowed communication, and inward dependency direction defined.
* [x] Responsibilities confirmed for client, backend API, PostgreSQL, background jobs, file storage, caching, and observability.
* [x] Tenant context propagation defined across HTTP, PostgreSQL RLS, jobs, events, storage, exports, and caches.
* [x] Transaction boundaries, idempotency, pessimistic/optimistic concurrency, transactional outbox, and error-handling patterns formalized.
* [x] 10 formal ADRs recorded in `audit/adr/` leaving zero foundational decisions to implementation guesswork.
* [x] 4 high-risk PoC spikes identified with explicit target phases and proof criteria.
* [x] Complete 47-module map and initial API/Data contracts produced.
