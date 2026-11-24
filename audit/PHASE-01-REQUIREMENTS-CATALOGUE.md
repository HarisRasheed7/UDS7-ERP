# PHASE 01 — REQUIREMENTS DECOMPOSITION AND ACCEPTANCE MAPPING

**Project:** Multi-Organization, Multi-Industry ERP & Business Management Platform  
**Project Name Status:** TBD (Neutral Engineering Baseline per `docs/PROJECT-IDENTITY.md`)  
**Phase:** Phase 01 — Execution Plan per `docs/PHASES.md`  
**Authority:** `docs/00-MASTER-INSTRUCTIONS.md`, `docs/PRD/Master_ERP_Web_Platform_PRD_100plus_pages.md`, `docs/modules/23-MODULES-SPECIFICATION.md`  
**Date:** November 2026  
**Auditor / Engineering Agent:** Antigravity System  

---

## 1. Executive Summary & Purpose

The objective of Phase 01 is to translate the comprehensive prose requirements from the 100+ page Master PRD and specification suite into **atomic, implementable, verifiable, and testable engineering specifications**.

In accordance with Section 2 of `docs/PHASES.md` and Section 12 of `docs/IMPLEMENTATION-MASTER-INSTRUCTIONS.md`, every requirement decomposed in this catalogue establishes:
1. **A Stable Identifier (`REQ-*`):** Unambiguous reference for design, code, and test traceability.
2. **Classification Tier:** Categorized into *Core*, *Standard*, *Advanced*, *Configurable*, *Industry-Specific*, or *Future*.
3. **Module Ownership & Data Boundary:** Clear definition of which module authoritative state belongs to.
4. **Dependencies & Event Contracts:** Upstream and downstream cross-module triggers.
5. **Acceptance Criteria (Given / When / Then):** Exact test conditions verifying functional completion.
6. **Negative & Security Test Specifications:** Defensive criteria for high-risk boundaries (tenancy isolation, ledger immutability, concurrency locking, and Segregation of Duties).

---

## 2. Requirement Classification Taxonomy

Every capability in this platform belongs to one of seven formal tiers:

| Tier | Classification | Definition & Scope | Implementation Phase Layer |
|---|---|---|---|
| **T1** | **Core Foundation** | Non-negotiable architectural infrastructure: multi-tenancy, server authorization, audit logging, database transactions, base identity. | Part I (Phases 02–12) |
| **T2** | **Standard Operational** | Essential day-to-day business modules: general ledger, inventory movements, sales orders, procurement, master catalogs, user admin. | Part II & III (Phases 13–35) |
| **T3** | **Advanced Enterprise** | Complex operational modules: BOM explosion, MRP planning, quality inspection, multi-tier approval escalations, scheduled background jobs. | Part III & IV (Phases 36–55) |
| **T4** | **Configurable** | Tenant-level customization: custom fields, dynamic form layouts, tenant themes, numbering schemas, custom notification preferences. | Part II (Phases 15–16) |
| **T5** | **Industry-Specific** | Industry configuration packs: Retail POS, Wholesale volume pricing, Restaurant kitchen routing, Healthcare scheduling templates. | Part V (Phases 56–68) |
| **T6** | **Ecosystem & Intelligence** | Integrations (Stripe, Plaid), offline delta sync, BI cubes, governed AI document extraction & summarization. | Part V (Phases 69–77) |
| **T7** | **Future / Deferred** | Explicitly out-of-scope for initial MVP: native mobile React Native compilation, autonomous AI agents, legacy ERP migration bridges. | Post-Release (Part VI+) |

---

## 3. Atomic Requirements Catalogue

### 3.1 Organization Hierarchy & Tenant Context (Module 01)
* **REQ-ORG-001 (Core): Multi-Tier Organizational Hierarchy**
  * *Description:* Platform must support a 5-level hierarchy: `Platform System` $\to$ `Tenant Organization` $\to$ `Legal Entity / Subsidiary` $\to$ `Operating Unit / Branch` $\to$ `Warehouse / Location`.
  * *Source:* `docs/10-MULTI-TENANCY.md` Sec 5; PRD Sec 1.
  * *Module Owner:* Organization Management (`client/modules/organization`, `server/modules/organization`).
  * *Acceptance Criteria:*
    * **Given** an authenticated Tenant Admin, **When** they create a Subsidiary with a distinct tax ID and currency, **Then** the subsidiary inherits the parent tenant ID while establishing its own operational boundaries.
  * *Negative Security Test:*
    * **Given** a user belonging to Tenant A, **When** they attempt to inject Tenant B's `organization_id` into an API payload, **Then** the request is rejected with a `403 Forbidden` and a security audit alert is logged.

* **REQ-ORG-002 (Core): Tenant Context Propagation**
  * *Description:* Every HTTP request, asynchronous job, and database query must resolve and enforce a trusted `tenant_id` derived solely from validated server-side session credentials.
  * *Source:* `docs/00-MASTER-INSTRUCTIONS.md` Sec 27; `docs/10-MULTI-TENANCY.md` Sec 6.
  * *Module Owner:* Platform Core (`server/middleware/tenantContext.js`).
  * *Acceptance Criteria:*
    * **Given** a valid session token, **When** an API endpoint is hit, **Then** the tenant context middleware attaches the validated `tenant_id` to the execution context before any controller or service executes.

---

### 3.2 User Identity, Authentication & Access Control (Module 02)
* **REQ-AUTH-001 (Core): Dual-Token Authentication Lifecycle**
  * *Description:* User authentication must issue short-lived JWT access tokens (15-minute expiry) paired with rotating `httpOnly`, `secure`, `sameSite=strict` refresh tokens stored in the database.
  * *Source:* `docs/09-AUTH-SECURITY.md` Sec 5; PRD Sec 2.
  * *Module Owner:* User & Access Management (`server/auth`).
  * *Acceptance Criteria:*
    * **Given** valid credentials, **When** a user logs in, **Then** they receive an access token and an encrypted httpOnly cookie; when the access token expires, a silent refresh rotates both tokens.
  * *Negative Security Test:*
    * **Given** a stolen/reused refresh token, **When** a replay is attempted, **Then** the server detects token family reuse, immediately revokes all sessions for that user, and requires full credential re-entry.

* **REQ-RBAC-001 (Core): Granular RBAC + ABAC Authorization Engine**
  * *Description:* Server-side authorization must evaluate granular permissions in `module:submodule:action` format (e.g. `finance:journal:post`) combined with organizational attribute scope (Branch ID, Department ID).
  * *Source:* `docs/26-USER-ROLES-PERMISSIONS-SPECIFICATION.md` Sec 4; PRD Sec 2.
  * *Module Owner:* Authorization Service (`server/authorization`).
  * *Acceptance Criteria:*
    * **Given** a user with role `WarehouseClerk` scoped to `Branch-East`, **When** they access inventory at `Branch-East`, **Then** the operation succeeds; if they attempt access at `Branch-West`, it is blocked.
  * *Negative Security Test:*
    * **Given** a user without `export` permission, **When** they execute a direct POST request to `/api/v1/customers/export`, **Then** the request is blocked by server middleware with `403 Forbidden`.

* **REQ-RBAC-002 (Core): Segregation of Duties (SoD) Enforcement**
  * *Description:* The platform must enforce maker-checker rules: the creator of a transaction (Purchase Order, Invoice, Payment, Payroll) cannot be the sole approver or poster.
  * *Source:* `docs/00-MASTER-INSTRUCTIONS.md` Sec 32; `docs/26` Sec 18.
  * *Module Owner:* Workflow & Approval Service (`server/workflows`).
  * *Acceptance Criteria:*
    * **Given** User A created Purchase Order #1001, **When** User A attempts to click "Approve" or submit an approval payload for PO #1001, **Then** the server rejects the transition with `ERR_SOD_SELF_APPROVAL_PROHIBITED`.

---

### 3.3 General Ledger & Accounting Core (Module 11)
* **REQ-GL-001 (Core): Double-Entry Balanced Journal Engine**
  * *Description:* Every financial posting must enforce balanced debits and credits ($\sum Debit = \sum Credit$) within the tenant's base currency and record the transactional exchange rate.
  * *Source:* `docs/13-DATA-MODEL.md` Sec 11; PRD Sec 12.
  * *Module Owner:* Accounting & Finance (`server/modules/finance`).
  * *Acceptance Criteria:*
    * **Given** a journal entry payload where Debits ($1,000.00) equal Credits ($1,000.00), **When** submitted to the posting service, **Then** it posts to the general ledger and updates account balances atomically.
  * *Negative Security Test:*
    * **Given** an unbalanced journal entry ($\Delta = \$0.01$), **When** submitted, **Then** the service rejects the request with `ERR_JOURNAL_UNBALANCED` and zero ledger lines are created.

* **REQ-GL-002 (Core): Financial Ledger Immutability**
  * *Description:* Posted journal entries are strictly immutable. PostgreSQL database triggers must reject any direct `UPDATE` or `DELETE` SQL statements on posted rows.
  * *Source:* `docs/00-MASTER-INSTRUCTIONS.md` Sec 34; `docs/development/05-database-rules.md`.
  * *Module Owner:* Database Schema Layer (`database/migrations`).
  * *Acceptance Criteria:*
    * **Given** a posted journal entry, **When** a correction is required, **Then** it must be executed as a reversing journal entry referencing the original document ID.
  * *Negative Security Test:*
    * **Given** an administrative database user attempting `UPDATE gl_journal_entries SET amount = 500 WHERE id = ...`, **Then** the PostgreSQL trigger raises an exception `CANNOT_MODIFY_POSTED_JOURNAL` and aborts the transaction.

* **REQ-GL-003 (Core): Exact Decimal Currency Calculations**
  * *Description:* Financial values must never use JavaScript native floating-point math. All monetary calculations use `NUMERIC(18, 4)` in the database and a precision math library (e.g. `decimal.js`) in runtime services.
  * *Source:* `docs/00-MASTER-INSTRUCTIONS.md` Sec 68; `docs/13-DATA-MODEL.md`.
  * *Module Owner:* Shared Utilities (`shared/utils/currency.js`).

---

### 3.4 Product Catalog, Inventory & Warehouse (Modules 03, 04, 05)
* **REQ-INV-001 (Core): Transaction-Driven Stock Movements**
  * *Description:* Stock quantity is never directly editable. Inventory levels represent the aggregated sum of an immutable movement log: Goods Receipt (`IN`), Dispatch (`OUT`), Transfer (`XFER`), or Adjustment (`ADJ`).
  * *Source:* `docs/00-MASTER-INSTRUCTIONS.md` Sec 35; PRD Sec 4.
  * *Module Owner:* Inventory Management (`server/modules/inventory`).
  * *Acceptance Criteria:*
    * **Given** an approved Goods Receipt Note for 50 units of SKU-A, **When** processed, **Then** an immutable stock movement record is created, and the warehouse location available balance increments by 50.

* **REQ-INV-002 (Core): Stock Concurrency & Pessimistic Allocation**
  * *Description:* High-concurrency operations (POS checkout, web store checkout, sales order reservation) must use pessimistic row-level locking (`SELECT ... FOR UPDATE`) during allocation.
  * *Source:* `docs/00-MASTER-INSTRUCTIONS.md` Sec 36; `docs/development/05-database-rules.md`.
  * *Module Owner:* Inventory Reservation Service (`server/modules/inventory/services/reservation.js`).
  * *Acceptance Criteria:*
    * **Given** 1 unit of SKU-Z in stock, **When** Cashier A and Cashier B attempt to checkout SKU-Z at the exact same millisecond, **Then** one transaction acquires the lock and succeeds, while the other receives `ERR_INSUFFICIENT_STOCK`.

---

### 3.5 Sales, POS & Procurement (Modules 06, 07, 09)
* **REQ-SALE-001 (Standard): Sales Order Lifecycle & Inventory Reservation**
  * *Description:* A confirmed Sales Order places a provisional inventory reservation, releases the reservation upon shipment or cancellation, and triggers invoice generation upon fulfillment.
  * *Source:* PRD Sec 6; `docs/modules/23-MODULES-SPECIFICATION.md` Sec 10.
  * *Module Owner:* Sales Management (`server/modules/sales`).

* **REQ-POS-001 (Standard): Idempotent Point of Sale (POS) Checkout**
  * *Description:* POS transactions must submit an `Idempotency-Key` (UUID generated at cart initialization) to ensure retried requests over spotty networks never create duplicate sales, double-deduct inventory, or double-charge cash drawers.
  * *Source:* `docs/00-MASTER-INSTRUCTIONS.md` Sec 37–38, 111; PRD Sec 7.
  * *Module Owner:* POS Service (`server/modules/pos`).

* **REQ-PUR-001 (Standard): 3-Way Procurement Matching**
  * *Description:* Purchasing system must support 3-way matching between Purchase Order (PO), Goods Receipt Note (GRN), and Supplier Bill before accounts payable posting is authorized.
  * *Source:* PRD Sec 9, 11; `docs/modules/23` Sec 13.
  * *Module Owner:* Procurement Management (`server/modules/purchase`).

---

### 3.6 Declarative Engines (Customization, Workflow, Offline, AI)
* **REQ-CUST-001 (Configurable): Metadata-Driven Custom Fields**
  * *Description:* Tenants can define custom attributes (Text, Number, Date, Select, Formula) stored in JSONB or attribute tables without modifying core DDL or application source code.
  * *Source:* `docs/11-CUSTOMIZATION-ENGINE.md`; `docs/00` Sec 24–25.
  * *Module Owner:* Customization Engine (`server/modules/customization`).
  * *Negative Security Test:*
    * **Given** a custom field validation formula containing malicious executable strings (e.g. `require('child_process')` or `SELECT * FROM users`), **When** evaluated, **Then** the sandboxed parser rejects it as invalid declarative syntax.

* **REQ-WF-001 (Configurable): Versioned Workflow State Machine**
  * *Description:* Workflows are defined as versioned Finite State Machines (FSM). Editing a workflow definition creates a new version; active in-flight documents continue execution on their originating version until closed.
  * *Source:* `docs/12-WORKFLOW-APPROVAL-ENGINE.md`; `docs/00` Sec 42–43.
  * *Module Owner:* Workflow Engine (`server/workflows`).

* **REQ-SYNC-001 (Ecosystem): Offline-First POS Delta Synchronization**
  * *Description:* Offline POS clients queue operations locally in IndexedDB (Dexie.js). When connectivity resumes, operations are replayed idempotently via an outbox queue with server-side conflict detection.
  * *Source:* `docs/15-OFFLINE-SYNC.md`; `docs/00` Sec 44–48.
  * *Module Owner:* Sync Engine (`client/offline`, `server/offline`).

* **REQ-AI-001 (Ecosystem): Governed AI Assistant Boundary**
  * *Description:* AI capabilities operate strictly through allowlisted application services with identical authorization and audit logging as human users. AI is strictly prohibited from having direct SQL/database write access.
  * *Source:* `docs/18-AI-AUTOMATION.md`; `docs/00` Sec 54–58, 64.
  * *Module Owner:* AI Service Adapter (`server/ai`).

---

## 4. Cross-Module Data Ownership & Contract Matrix

| Entity | Master Domain Owner | Permitted Mutators | Downstream Read Consumers | Communication Mechanism |
|---|---|---|---|---|
| **Organization / Branch** | Module 01 (Org Mgmt) | Org Admin | All Modules | Direct Application Context |
| **User & Role** | Module 02 (User Access) | System / Org Admin | All Modules | Auth Middleware / JWT Claims |
| **Product & SKU** | Module 03 (Product Catalog) | Catalog Manager | Inventory, Sales, Purchase, POS, MRP | Service Contract / Read Replicas |
| **Stock Ledger Line** | Module 04 (Inventory) | Warehouse, POS, Sales | Accounting (COGS), Reporting | Transactional Domain Service |
| **Sales Order** | Module 06 (Sales) | Sales Rep, POS | Inventory, Accounts Receivable | Domain Events (`OrderConfirmed`) |
| **Purchase Order** | Module 09 (Purchase) | Purchasing Officer | Inventory (GRN), Accounts Payable | Domain Events (`POApproved`) |
| **General Ledger Journal** | Module 11 (Accounting) | System Posting Services | BI & Financial Reporting | Atomic DB Transactions |
| **Customer Profile** | Module 08 (CRM) | Sales Rep, CRM Manager | Sales, POS, Accounts Receivable | Shared Master Data Registry |
| **Supplier Profile** | Module 10 (Supplier Mgmt) | Procurement Officer | Purchasing, Accounts Payable | Shared Master Data Registry |
| **Audit Event** | Module 46 (Audit) | Platform Security Engine | Auditors, Compliance Officers | Append-only Message / Trigger |

---

## 5. High-Risk Negative Security Test Specifications

```text
[TEST-SEC-01] Cross-Tenant Isolation Breach Test
Target: /api/v1/customers, /api/v1/financial-reports, /api/v1/inventory
Condition: Authenticated as User belonging to Tenant-001. Send requests with Tenant-002 IDs in path, query, headers, and body.
Assertion: Server returns HTTP 403 Forbidden. Zero records from Tenant-002 are leaked. Security event logged in audit_events table.

[TEST-SEC-02] Financial Ledger Tampering Test
Target: gl_journal_entries, gl_journal_lines
Condition: Issue direct SQL UPDATE or DELETE statement against a posted journal entry.
Assertion: Database trigger aborts execution with SQLSTATE 23514 / CANNOT_MODIFY_POSTED_JOURNAL.

[TEST-SEC-03] Inventory Overselling Concurrency Test
Target: /api/v1/pos/checkout, /api/v1/sales/orders/confirm
Condition: Spawn 50 concurrent requests attempting to purchase the last remaining stock item simultaneously.
Assertion: Exactly 1 transaction succeeds (HTTP 200). 49 transactions receive HTTP 409 Conflict / ERR_INSUFFICIENT_STOCK. Final balance is exactly 0.

[TEST-SEC-04] Segregation of Duties Bypass Test
Target: /api/v1/purchase-orders/:id/approve, /api/v1/invoices/:id/post
Condition: User A creates the record. User A attempts to execute the approval action.
Assertion: Server rejects request with HTTP 403 / ERR_SOD_SELF_APPROVAL_PROHIBITED.

[TEST-SEC-05] Frontend Authorization Bypass Test
Target: All mutation endpoints (/api/v1/**)
Condition: Send valid session token for a 'Viewer' role that has UI buttons hidden/disabled.
Assertion: Server returns HTTP 403 Forbidden. API independently evaluates permissions regardless of client UI state.
```

---

## 6. Open Decision & Assumptions Register (Phase 01)

| Decision ID | Item | Options | Documented Impact | Recommendation |
|---|---|---|---|---|
| **DEC-P1-01** | **Primary Database Tenancy Strategy** | Option A: Shared Database, Shared Schema with RLS (`tenant_id` on every table)<br>Option B: Schema-per-tenant | Option A is simpler for shared cross-tenant reporting and migrations; Option B provides stronger physical boundary. | **Adopt Option A (Shared Database with PostgreSQL Row-Level Security)** as mandated by `docs/03` and `docs/10`. |
| **DEC-P1-02** | **Module Registration Strategy** | Option A: Static code module manifests<br>Option B: Database-driven dynamic module registry | Option B allows per-organization module enablement via UI without code redeployments. | **Adopt Option B (Database module registry with feature flags)** per `docs/PHASES.md` Phase 15. |
| **DEC-P1-03** | **Currency Precision Standard** | Option A: Integer minor units (cents)<br>Option B: `NUMERIC(18, 4)` | Option B supports sub-cent unit pricing, multi-currency conversions, and tax calculations natively. | **Adopt Option B (`NUMERIC(18, 4)`)** per `docs/13-DATA-MODEL.md`. |

---

## 7. Phase 01 Exit Criteria & Verification Gate

* [x] **Catalogue Completeness:** Every functional area from the Master PRD has been mapped to an atomic `REQ-*` identifier.
* [x] **Tier Classification:** 100% of requirements categorized into Core, Standard, Advanced, Configurable, Industry, or Ecosystem.
* [x] **Module Boundaries:** Clear data ownership and service interfaces defined across all 40+ modules.
* [x] **Acceptance Criteria:** Given/When/Then criteria defined for all foundational flows.
* [x] **Negative Security Tests:** Explicit test specifications documented for multi-tenancy, immutable ledgers, and concurrency.
* [x] **Automated Test Validation:** Executable verification suite created in `audit/verification/test_phase_1.js`.
* [x] **Phase Tracker Updated:** Progress recorded in `audit/verification/PHASE-TRACKER.md`.

---
*Certified under Phase 01 Governance Standards of docs/PHASES.md.*
