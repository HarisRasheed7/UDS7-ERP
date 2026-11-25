# ADR-005: Multi-Tenancy Isolation & Organizational Context Propagation

* **Status:** Proposed — Recommended for Project Owner Sign-off
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval
* **Resolves:** `DEC-P1-01` (from Phase 01)

## Context
Every organization's data must be strictly isolated across APIs, databases, background jobs, files, exports, search, and caches (`docs/10-MULTI-TENANCY.md`).

## Options Considered
* **Option A: Shared Database / Shared Schema (`organization_id`) + Defense-in-Depth PostgreSQL RLS** (explicitly recommended in `docs/10-MULTI-TENANCY.md` Sec 23–24.1 & 32).
* **Option B: Schema-per-tenant** (operational & migration overhead as tenant count grows).
* **Option C: Database-per-tenant** (excessive infrastructure cost and cross-tenant admin complexity at launch).

## Decision
**Adopt Option A: Shared PostgreSQL Schema with Mandatory `organization_id` + Defense-in-Depth PostgreSQL Row-Level Security (RLS).**
1. **Explicit Column & Composite Constraints:** Every tenant-owned table has `organization_id UUID NOT NULL REFERENCES organizations(id)`, composite unique keys `UNIQUE (organization_id, code)`, and composite indexes `(organization_id, ...)`.
2. **Server-Resolved Trusted Context:** Client-provided `organizationId` is treated as untrusted input and verified against active `organization_memberships` for the authenticated user before entering application services.
3. **PostgreSQL RLS Guardrail:** `db.withTenantTransaction(context, fn)` opens a transaction and executes `SELECT set_config('app.current_organization_id', $1, true)` (`SET LOCAL` scoped strictly to that transaction). RLS policies enforce `organization_id = current_setting(...)::uuid` on all tenant tables, preventing accidental cross-tenant leakage even if a repository query forgets a `WHERE` filter.
4. **Channel-Wide Isolation:**
   * Jobs/Outbox payloads propagate `organizationId` and re-establish `SET LOCAL` inside the worker transaction.
   * Storage object keys partition under `orgs/{organizationId}/...`.
   * Cache keys always prefix `org:{organizationId}:...`.

## Consequences
* Zero cross-tenant leakage risk under connection pooling (`SET LOCAL` resets automatically on `COMMIT`/`ROLLBACK` — validated by `SPIKE-01`).
* Preserves clear future evolution path (`docs/10-MULTI-TENANCY.md` Sec 25) to table partitioning or dedicated enterprise databases without rewriting domain business logic.
