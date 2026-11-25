# PHASE 02 — INITIAL API & DATA CONTRACTS

**Project:** Multi-Organization, Multi-Industry ERP & Business Management Platform  
**Authority:** `docs/13-DATA-MODEL.md`, `docs/14-API-SPECIFICATION.md`, `docs/09-AUTH-SECURITY.md`, `docs/development/05-database-rules.md`, `docs/development/06-api-rules.md`  
**Phase:** Phase 02 — Architecture and ADR Approval  

---

## 1. Global API Contract Standards (`/api/v1`)

### 1.1 Base Path & Resource Naming
* Base path: `/api/v1`
* Resource paths: lowercase, plural nouns, hyphen-separated (`/api/v1/sales-orders`, `/api/v1/journal-entries`).
* Non-CRUD domain actions use explicit command sub-paths: `POST /api/v1/journal-entries/:id/post`, `POST /api/v1/journal-entries/:id/reverse`.
* `GET` requests are strictly side-effect free.

### 1.2 Standard HTTP Headers
| Header | Direction | Purpose & Authority Rule |
|---|---|---|
| `Authorization` | Request | `Bearer <jwt>` (or `HttpOnly` session cookie for web browser clients). |
| `X-Organization-Id` | Request | Optional active organization selector; server **always** validates membership & active status before trusting. |
| `Idempotency-Key` | Request | UUIDv4 required on retriable mutations (payments, POS checkout, journal posting, sync push). |
| `If-Match` | Request | Optimistic concurrency version tag (`"<version>"`) for `PATCH` / `PUT` updates. |
| `X-Request-ID` | Request/Response | Unique per-HTTP-request trace identifier (`req_<uuid>`). |
| `X-Correlation-ID` | Request/Response | Propagated end-to-end across API $\to$ Outbox $\to$ Background Jobs $\to$ Audit Log. |

### 1.3 Standardized JSON Envelopes
**Single Resource / Command Success (`200 OK`, `201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "019363f2-7c90-7000-8000-000000000001"
  },
  "requestId": "req_9e1c..."
}
```

**Paginated Collection Success (`200 OK`):**
```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 140,
    "totalPages": 6,
    "hasNext": true
  },
  "requestId": "req_9e1c..."
}
```
*(Maximum `pageSize` capped at `100` server-side; cursor pagination supported via `?cursor=...` for `audit-logs`, `inventory-movements`, and `notifications`.)*

**Standardized Error Envelope (`4xx` / `5xx`):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action.",
    "details": []
  },
  "requestId": "req_9e1c..."
}
```

### 1.4 Machine-Readable Error Code Registry
| Error Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | `400` | Zod schema or domain input validation failure (returns field-level `details`). |
| `AUTHENTICATION_REQUIRED` | `401` | Missing, expired, or revoked authentication session/token. |
| `FORBIDDEN` | `403` | Missing `module.resource.action` permission, wrong tenant/branch scope, or SoD violation. |
| `NOT_FOUND` | `404` | Resource absent **or** belongs to another tenant (never confirm cross-tenant existence). |
| `CONFLICT` | `409` | Optimistic lock mismatch (`If-Match`), duplicate unique key, or idempotency key collision. |
| `BUSINESS_RULE_VIOLATION` | `422` | Valid syntax, but domain invariant violated (e.g., unbalanced journal, insufficient stock). |
| `WORKFLOW_REQUIRED` | `409` | State transition requires active approval workflow completion first. |
| `RATE_LIMIT_EXCEEDED` | `429` | Brute-force or API rate throttle triggered. |
| `INTERNAL_ERROR` | `500` | Unhandled server error (details redacted; logged internally with `requestId`). |

---

## 2. Global PostgreSQL Data Contract Standards

Per `docs/development/05-database-rules.md` and `docs/10-MULTI-TENANCY.md`:
* **Naming:** `snake_case`, plural table names (`organizations`, `user_sessions`, `journal_entries`, `audit_logs`).
* **Primary Keys:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` (or server-generated UUIDv7 for B-tree locality). Business numbers (`invoice_number`, `order_number`) are separate unique columns generated via concurrency-safe sequence locks, never primary keys.
* **Timestamps:** `TIMESTAMPTZ NOT NULL DEFAULT NOW()` in UTC for instants; `DATE` for calendar dates (`fiscal_start_date`, `birth_date`).
* **Monetary & Quantity Columns:** `NUMERIC(20, 4) NOT NULL` for currency amounts and stock quantities; `NUMERIC(18, 6)` for currency exchange rates. Floating-point `REAL` / `DOUBLE PRECISION` is **strictly prohibited** for money or inventory.
* **Tenant Scope Column:** Every tenant-owned table includes `organization_id UUID NOT NULL REFERENCES organizations(id)`, composite unique constraints `UNIQUE (organization_id, ...)`, composite indexes `(organization_id, created_at DESC)`, and PostgreSQL Row-Level Security (RLS) policy:
  ```sql
  ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
  ALTER TABLE <table_name> FORCE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation_policy ON <table_name>
    USING (organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid)
    WITH CHECK (organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid);
  ```

---

## 3. Initial Contracts: First Vertical Slice (Phases 05–12)

*(Onboarding Organization $\to$ Auth & Session $\to$ RBAC Permissions $\to$ Immutable Audit Trail)*

### 3.1 Core Data Tables (Conceptual DDL Contracts)

#### `organizations` (Tenant Root)
| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | Primary tenant boundary ID. |
| `code` | `VARCHAR(64)` | `NOT NULL UNIQUE` | Immutable slug/code. |
| `name` | `VARCHAR(200)` | `NOT NULL` | Display name. |
| `legal_name` | `VARCHAR(255)` | `NULL` | Registered entity name. |
| `status` | `VARCHAR(32)` | `NOT NULL CHECK (status IN ('ACTIVE','SUSPENDED','ARCHIVED'))` | Default `'ACTIVE'`. |
| `default_currency` | `CHAR(3)` | `NOT NULL` | ISO-4217 currency code (e.g., `'USD'`). |
| `timezone` | `VARCHAR(64)` | `NOT NULL DEFAULT 'UTC'` | IANA timezone identifier. |
| `locale` | `VARCHAR(16)` | `NOT NULL DEFAULT 'en-US'` | Default formatting locale. |
| `version` | `INTEGER` | `NOT NULL DEFAULT 1` | Optimistic lock counter. |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Audit timestamps. |

#### `users` & `user_sessions` (Platform Identity)
* `users`: `id UUID PK`, `email VARCHAR(255) UNIQUE NOT NULL`, `password_hash TEXT NOT NULL` (Argon2id), `full_name VARCHAR(200) NOT NULL`, `status VARCHAR(32) NOT NULL` (`ACTIVE`, `PENDING_VERIFICATION`, `LOCKED`, `DISABLED`), `mfa_enabled BOOLEAN DEFAULT FALSE`, `created_at`, `updated_at`.
* `user_sessions`: `id UUID PK`, `user_id UUID FK`, `active_organization_id UUID FK`, `refresh_token_hash TEXT NOT NULL`, `token_family_id UUID NOT NULL`, `expires_at TIMESTAMPTZ NOT NULL`, `revoked_at TIMESTAMPTZ NULL`, `ip_address INET`, `user_agent TEXT`.

#### `organization_memberships` (User $\leftrightarrow$ Tenant Bridge)
* `id UUID PK`, `organization_id UUID FK`, `user_id UUID FK`, `status VARCHAR(32)` (`ACTIVE`, `INVITED`, `SUSPENDED`), `is_default BOOLEAN`, `UNIQUE (organization_id, user_id)`.

#### `roles`, `permissions`, `role_permissions`, `user_role_assignments`
* `permissions`: `id UUID PK`, `code VARCHAR(120) UNIQUE NOT NULL` (strict dot-notation: `module.resource.action`, e.g., `organization.settings.manage`, `users.roles.assign`, `audit.logs.view`), `module_slug VARCHAR(64)`, `description TEXT`.
* `roles`: `id UUID PK`, `organization_id UUID FK`, `name VARCHAR(100) NOT NULL`, `is_system BOOLEAN DEFAULT FALSE`, `UNIQUE (organization_id, name)`.
* `role_permissions`: `(role_id, permission_id) PK`.
* `user_role_assignments`: `id UUID PK`, `organization_id UUID FK`, `user_id UUID FK`, `role_id UUID FK`, `scope_type VARCHAR(32)` (`ORGANIZATION`, `COMPANY`, `BRANCH`, `WAREHOUSE`), `scope_id UUID NULL`.

#### `audit_logs` (Strictly Immutable Append-Only)
* `id UUID PK`, `organization_id UUID NULL` (NULL only for platform-level auth events), `actor_user_id UUID NULL`, `actor_type VARCHAR(32) NOT NULL`, `action VARCHAR(100) NOT NULL`, `entity_type VARCHAR(100) NOT NULL`, `entity_id UUID NULL`, `previous_state JSONB NULL`, `new_state JSONB NULL`, `request_id VARCHAR(128)`, `correlation_id VARCHAR(128)`, `ip_address INET`, `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
* **Immutability Enforcement:** PostgreSQL trigger `trg_audit_logs_immutable` rejects any `UPDATE` or `DELETE` with SQLSTATE `23514` (`AUDIT_LOG_IMMUTABLE`).

---

### 3.2 Initial REST Endpoint Contracts

| Endpoint | Method | Auth / Permission Required | Request Body / Params | Success Response |
|---|---|---|---|---|
| `/api/v1/health/live` | `GET` | Public | None | `200 { success: true, data: { status: "alive" } }` |
| `/api/v1/health/ready` | `GET` | Public | None | `200` (if DB reachable) / `503` |
| `/api/v1/auth/login` | `POST` | Public (Rate-limited) | `{ email, password }` | `200 { user, activeOrganization, organizations }` + `Set-Cookie` |
| `/api/v1/auth/refresh` | `POST` | Refresh Cookie | Cookie token | `200` (rotates session family) / `401` |
| `/api/v1/auth/logout` | `POST` | Authenticated | None | `200` (revokes current session) |
| `/api/v1/auth/switch-organization` | `POST` | Authenticated | `{ organizationId }` | `200` (verifies active membership, updates session context) |
| `/api/v1/organizations` | `POST` | Platform / Onboarding Auth | `{ name, code, defaultCurrency, timezone }` | `201 { organization }` + seeds system roles + audit log |
| `/api/v1/organizations/current` | `GET` | Authenticated + Tenant Context | None | `200 { organization }` |
| `/api/v1/roles` | `GET` / `POST` | `users.roles.view` / `users.roles.manage` | `{ name, permissionCodes[], scope }` | `200` / `201` + audit log |
| `/api/v1/users/:userId/roles` | `POST` | `users.roles.assign` | `{ roleId, scopeType, scopeId }` | `201` (denies cross-tenant user/role) + audit log |
| `/api/v1/audit-logs` | `GET` | `audit.logs.view` | `?cursor=...&entity_type=...` | `200 { data: [...], meta }` (strictly scoped to `organizationId`) |
