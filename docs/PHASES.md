# PHASES — Implementation Execution Plan
## Professional Multi-Organization, Multi-Industry ERP & Business Management Platform

**Status:** Proposed execution plan  
**Project name:** Undecided — do not invent or apply a brand name  
**Purpose:** Convert the supplied specifications into a dependency-aware, testable, phase-by-phase implementation programme.  
**Companion document:** `IMPLEMENTATION-ROADMAP.md` (high-level milestones and governance)

---

## 1. How to use this file

This document is the detailed execution plan. It is intentionally more granular than the high-level roadmap. A phase is a bounded delivery unit, not a promise of a fixed calendar duration. Split a phase into smaller work items whenever its acceptance criteria cannot be implemented and verified safely in one iteration.

For every phase:

1. Read the relevant source specifications and inspect the actual repository before editing.
2. Produce a short phase plan identifying scope, source sections, dependencies, files likely to change, risks, and acceptance tests.
3. Confirm the phase is **Ready** before implementation. Record unresolved decisions instead of guessing.
4. Implement in small, reviewable vertical slices. Keep business logic on the authoritative server side.
5. Run the relevant unit, integration, authorization, tenant-isolation, regression, accessibility, and end-to-end tests.
6. Update API contracts, data model documentation, user-facing help, and this phase tracker when behavior changes.
7. Report changed files, commands run, results, known gaps, and the next safe phase.
8. Do not mark a phase complete because the app builds or the screen renders. It is complete only when its acceptance evidence passes.

### Phase status vocabulary

- **Proposed** — included in the plan but not ready to start.
- **Ready** — scope, dependencies, decisions, and acceptance criteria are clear.
- **In progress** — implementation has started.
- **Blocked** — a dependency, conflict, or approval is outstanding.
- **Implemented** — code exists; verification is incomplete.
- **Verified** — required tests and acceptance evidence pass.
- **Approved** — the user accepts the verified result.
- **Closed** — documentation, known issues, and handoff are complete.

Track status in a separate implementation log or update the checklist here. Never claim tests passed unless they were actually run and their results inspected.

---

## 2. Source-of-truth and non-negotiable rules

Read and follow, at minimum:

- `00-MASTER-INSTRUCTIONS.md`
- `docs/00-MASTER-INSTRUCTIONS.md`
- `docs/IMPLEMENTATION-MASTER-INSTRUCTIONS.md`
- `docs/DOCUMENTATION-AUDIT.md`
- `docs/PROJECT-IDENTITY.md`
- `docs/01-PROJECT-VISION.md`
- `docs/02-PRODUCT-REQUIREMENTS.md`
- `docs/03-ARCHITECTURE.md`
- `docs/04-TECH-STACK.md`
- `docs/05-DESIGN-SYSTEM.md`
- `docs/06-UI-UX-SPECIFICATION.md`
- `docs/07-THEME-SYSTEM.md`
- `docs/08-ANIMATION-MOTION.md`
- `docs/09-AUTH-SECURITY.md`
- `docs/10-MULTI-TENANCY.md`
- `docs/11-CUSTOMIZATION-ENGINE.md`
- `docs/12-WORKFLOW-APPROVAL-ENGINE.md`
- `docs/13-DATA-MODEL.md`
- `docs/14-API-SPECIFICATION.md`
- `docs/15-OFFLINE-SYNC.md`
- `docs/16-NOTIFICATIONS.md`
- `docs/17-INTEGRATIONS.md`
- `docs/18-AI-AUTOMATION.md`
- `docs/19-REPORTING-BI.md`
- `docs/20-TESTING-QA.md`
- `docs/21-DEPLOYMENT-DEVOPS.md`
- `docs/22-MOBILE-FUTURE.md`
- `docs/modules/23-MODULES-SPECIFICATION.md`
- `docs/industries/24-INDUSTRY-SPECIFICATION.md`
- `docs/features/25-FEATURE-SPECIFICATION.md`
- `docs/26-USER-ROLES-PERMISSIONS-SPECIFICATION.md`
- every `docs/development/01` through `09` rule document
- `docs/PRD/Master_ERP_Web_Platform_PRD_100plus_pages.md`
- `docs/IMPLEMENTATION-ROADMAP.md`

### Constraints

- Use JavaScript; do not convert the project to TypeScript.
- Use React and Next.js for the primary website application, as specified.
- Use custom CSS, CSS Modules, and CSS variables. **Do not use Tailwind CSS.**
- Use PostgreSQL. Add Redis or other infrastructure only when justified by approved requirements and architecture.
- Use versioned REST APIs as specified.
- Preserve server-side authorization and tenant isolation. Frontend visibility is not a security boundary.
- Use transactions, constraints, idempotency, audit trails, and reversals for business operations where required.
- Do not hard-code industry assumptions into the universal platform core.
- Do not implement fake buttons, placeholder success flows, mock persistence disguised as real functionality, or silently incomplete workflows.
- Do not silently remove requirements or substitute a preferred technology.
- The product name and branding remain undecided until the user explicitly approves them.

### Source conflicts to resolve before dependent implementation

The archive includes both a root-level master-instructions file and a second master file under `docs/`; the audit also flags an original/enhanced master-instructions conflict. Compare them and record the canonical authority and any unique requirements. Do not silently merge, delete, or elevate one file. The PRD exists in more than one representation; compare for meaningful differences and do not count copies as independent requirements. Confirm the actual archive structure and the existence of separate module/industry files. The module specification contains **47 module headings**, while other project planning notes may use a different module count; reconcile the authoritative scope and identifiers during the audit. The existing 29-phase roadmap is a broad outline, not proof that every module has been delivered.

---

## 3. Delivery model: milestone layers

The phases are grouped into these layers:

1. **Governance and foundations** — requirements, architecture, repository, database, API, identity, tenant security.
2. **Shared platform capabilities** — design system, audit, files, configuration, workflow, notifications, search.
3. **Core business verticals** — master data, inventory, purchasing, sales, POS, finance.
4. **Operational and enterprise modules** — CRM, HR/payroll, manufacturing, supply chain, assets, projects, service, contracts, marketing, commerce.
5. **Industry templates** — reusable industry packs built on proven universal capabilities.
6. **Intelligence and ecosystem** — reporting, integrations, offline synchronization, governed AI, mobile readiness.
7. **Release and operations** — hardening, pilot, production, support, recovery, continuous improvement.

Dependencies are not all strictly linear. Parallel work is allowed only when module boundaries, API/data contracts, ownership, security constraints, and integration tests are agreed.

---

# PART I — GOVERNANCE AND TECHNICAL FOUNDATIONS

## Phase 00 — Documentation, archive, and repository audit

**Objective:** establish an accurate baseline before coding.

**Scope**
- Inventory all archive entries and document locations.
- Compare original and enhanced master instructions; document proposed canonical source and conflicts.
- Compare the PRD Markdown/PDF representations for meaningful discrepancies.
- Inspect the actual repository, if present, before creating or replacing files.
- Validate links, file references, numbering, missing files, duplicated material, and mismatched module counts.
- Reconcile the 47 modules listed in the module specification with any other module inventory.
- Identify open product, architecture, legal, tax, privacy, and operational decisions.
- Confirm the project identity remains undecided.
- Create a requirements traceability register mapping each requirement to source, affected module, phase, and verification evidence.

**Deliverables:** archive inventory, audit report, conflict/decision register, requirement traceability matrix, repository baseline, risk register.

**Exit criteria:** critical ambiguities for foundational work are resolved or explicitly blocked; no document is silently treated as authoritative when the archive indicates a conflict.

## Phase 01 — Requirements decomposition and acceptance mapping

**Objective:** turn prose requirements into implementable, verifiable units.

**Scope**
- Classify requirements as core, standard, advanced, configurable, industry-specific, optional, or future according to the feature specification.
- Give each requirement a stable identifier without changing source meaning.
- Map module-to-module dependencies, shared capabilities, data ownership, events, and API contracts.
- Define acceptance criteria and negative/security tests for high-risk requirements.
- Separate universal platform behavior from industry-template behavior and organization-level customization.
- Mark unresolved choices, assumptions, external dependencies, and release-critical requirements.

**Deliverables:** requirement catalogue, module dependency map, acceptance-test map, decision log.

**Exit criteria:** every in-scope requirement has an owner/module, dependency path, and planned verification method.

## Phase 02 — Architecture and ADR approval

**Objective:** translate the architecture specification into an implementation blueprint.

**Scope**
- Validate modular boundaries, domain ownership, allowed module communication, and dependency direction.
- Confirm frontend, backend, database, background-job, file-storage, caching, and observability responsibilities.
- Define tenant context propagation across HTTP requests, jobs, events, exports, and storage.
- Define transaction, idempotency, concurrency, event/outbox, and error-handling patterns where required.
- Record architecture decision records (ADRs) for consequential decisions.
- Identify proof-of-concept spikes for risky areas before committing to large implementation.

**Deliverables:** approved architecture blueprint, ADRs, module map, initial API/data contracts.

**Exit criteria:** no foundational technology or architecture decision is left to an implementation agent's guess.

## Phase 03 — Repository and local developer environment

**Objective:** create a repeatable development setup without overwriting existing work.

**Scope**
- Inspect current repository state and preserve valid work.
- Establish the approved folder structure, package scripts, environment templates, and setup instructions.
- Configure formatting/linting and JavaScript quality checks.
- Add safe local defaults and environment-variable validation.
- Establish clean install, development run, test, build, and lint commands.
- Ensure credentials, local data, generated artifacts, and private files are excluded from version control.

**Deliverables:** documented repository structure, repeatable setup, baseline scripts.

**Exit criteria:** a clean checkout can be installed and validated from the written instructions without secrets committed.

## Phase 04 — Continuous integration and quality gates

**Objective:** prevent regressions from accumulating as modules grow.

**Scope**
- Configure automated lint, test, build, dependency checks, and migration checks as appropriate.
- Define pull-request/merge gates and test-report retention.
- Add static checks consistent with the JavaScript-only rule.
- Establish separate fast feedback and full verification suites.
- Ensure CI failures are actionable and cannot be ignored silently.

**Deliverables:** CI pipeline, quality-gate policy, documented commands.

**Exit criteria:** an intentional failing check blocks the pipeline, and a clean baseline passes.

## Phase 05 — PostgreSQL and migration foundation

**Objective:** establish reliable persistent storage.

**Scope**
- Configure PostgreSQL and the approved data-access layer.
- Define schema migrations, forward recovery, rollback policy, and migration review.
- Establish constraints, indexes, key, naming, timestamp, soft-delete/archive, and retention conventions.
- Define money/decimal precision, quantities, currencies, dates, time zones, and rounding rules.
- Establish test database lifecycle, seed fixtures, and migration verification.
- Avoid a single speculative mega-migration for every future module.

**Deliverables:** database connection, migration tooling, baseline schema, test utilities.

**Exit criteria:** migrations work on a clean database; constraints and transaction behavior are tested and reproducible.

## Phase 06 — API foundation and contract discipline

**Objective:** provide a consistent service boundary.

**Scope**
- Implement versioned REST routing and documented API conventions.
- Standardize validation, response/error formats, pagination, filtering, sorting, and correlation IDs.
- Define controller/application/domain/data-access responsibilities according to the approved architecture.
- Establish request-size limits, safe diagnostics, and rate-limiting where required.
- Define idempotency and concurrency controls for operations that need them.
- Ensure the frontend never accesses PostgreSQL directly.

**Deliverables:** API skeleton, contract documentation, integration-test harness.

**Exit criteria:** success, validation, authentication, authorization, not-found, conflict, and server-error paths are consistent and tested.

## Phase 07 — Authentication and account lifecycle

**Objective:** establish identity and session safety.

**Scope**
- Implement the specified registration/invitation entry points, login/logout, credential protection, session/token lifecycle, and account states.
- Implement password reset/verification and MFA where required by approved scope.
- Establish expiry, revocation, refresh/rotation, brute-force protection, and recovery safeguards as specified.
- Prevent sensitive values from appearing in logs or error responses.
- Test expired, revoked, invalid, disabled, and unauthenticated access.

**Deliverables:** authentication APIs/UI, session lifecycle, security tests.

**Exit criteria:** account and session lifecycle tests pass; authorization is not confused with authentication.

## Phase 08 — Organization hierarchy and tenant context

**Objective:** make multi-organization support foundational.

**Scope**
- Implement the approved organization/company/branch/location/department structure and related fiscal/currency/language settings.
- Implement organization membership and active-organization switching.
- Propagate trusted tenant context through APIs, services, jobs, files, search, exports, and caches.
- Enforce the selected tenant isolation model at the server/data-access boundary.
- Test cross-tenant reads and writes, guessed IDs, background tasks, and data exports.
- Never trust a tenant identifier supplied by the client without membership and scope validation.

**Deliverables:** organization model, tenant-context services, isolation tests.

**Exit criteria:** negative tests prove tenant separation across all implemented access paths.

## Phase 09 — Authorization, roles, and permission evaluation

**Objective:** enforce least privilege at every business-operation boundary.

**Scope**
- Implement roles, granular permissions, scopes, effective permission evaluation, and default-deny behavior.
- Apply organization/branch/record/action constraints from the permission specification.
- Implement permission administration and effective-permission preview where specified.
- Add maker-checker and segregation-of-duties protections for applicable high-risk operations.
- Ensure UI route hiding is only a usability aid; APIs enforce the same or stronger rules.
- Test privilege escalation, direct API access, self-approval, revoked grants, and scope changes.

**Deliverables:** authorization service, role/permission UI, negative security suite.

**Exit criteria:** unauthorized direct requests fail reliably and authorization is covered by automated tests.

## Phase 10 — Shared frontend shell and navigation

**Objective:** establish the common application experience.

**Scope**
- Build the approved Next.js/React application shell, route/layout conventions, navigation, breadcrumbs, organization context, and page-level access states.
- Establish reusable layout patterns for dashboards, lists, details, forms, settings, and transaction workspaces.
- Add loading, empty, validation, forbidden, offline, error, and retry states.
- Ensure state changes and API failures are handled predictably.

**Deliverables:** application shell, navigation, page templates.

**Exit criteria:** representative routes operate with real authentication/authorization and consistent UI states.

## Phase 11 — Design system, themes, responsive behavior, and accessibility

**Objective:** implement the design and interaction rules as shared infrastructure.

**Scope**
- Build custom CSS/CSS Modules/CSS variables; do not use Tailwind.
- Implement approved tokens, typography, spacing, forms, tables, dialogs, menus, notifications, and feedback components.
- Implement blue-led palettes and all approved theme combinations without changing business logic.
- Implement animation/motion rules and respect `prefers-reduced-motion`.
- Validate keyboard navigation, focus behavior, semantics, contrast, responsive layouts, and supported browsers.
- Ensure components support permission, loading, empty, error, and disabled states.

**Deliverables:** token system, reusable component library, theme system, accessibility checklist.

**Exit criteria:** design-system examples pass responsive and keyboard/accessibility checks and are reused rather than duplicated.

## Phase 12 — Observability, audit trail, and error handling

**Objective:** make system behavior traceable and diagnosable.

**Scope**
- Implement structured logs, correlation/request IDs, safe error handling, and health/readiness conventions.
- Implement audit events for actor, tenant, target, action, timestamp, outcome, and relevant change context.
- Define audit immutability, access restrictions, retention, and sensitive-field redaction.
- Distinguish business audit history from diagnostic logs.
- Establish operational alerts and error categorization without leaking secrets or personal data.

**Deliverables:** logging/error conventions, audit service, operational diagnostics.

**Exit criteria:** representative business changes are auditable, failures traceable, and sensitive values excluded from logs.

---

# PART II — SHARED PLATFORM CAPABILITIES

## Phase 13 — Master data and reference-data foundation

**Objective:** establish common business entities and validation rules.

**Scope**
- Implement product/service master data, categories, variants/attributes, identifiers/barcodes, units of measure, and attachments as specified.
- Implement customer and supplier foundations with consistent identities and relationship rules.
- Establish currency, tax, payment-term, address/contact, and reference-data structures to the approved scope.
- Add duplicate detection, import validation, search, audit, and access scopes.
- Avoid duplicate customer/product models inside individual modules.

**Dependencies:** Phases 05–09, 12.

**Exit criteria:** master records can be created, validated, searched, scoped, audited, and referenced consistently.

## Phase 14 — Document and file management foundation

**Objective:** support secure business documents and attachments.

**Scope**
- Implement file metadata, storage abstraction, upload/download authorization, size/type validation, and malware-scanning integration points where required.
- Define versioning, retention, archive, and deletion behavior.
- Enforce tenant/record access for files and prevent guessed-URL access.
- Add document links to business records through shared interfaces.

**Exit criteria:** files cannot be accessed across tenant or record boundaries; upload and download errors are handled safely.

## Phase 15 — Configuration and feature/module registry

**Objective:** enable controlled configuration without bypassing invariants.

**Scope**
- Implement configuration hierarchy and validation rules from the customization specification.
- Implement module registration/enablement, dependency checks, and feature flags.
- Establish configuration versioning, audit, safe rollout, and recovery.
- Define which settings are global, tenant, organization, branch, role, or user scoped.
- Ensure configuration changes cannot disable security, audit, or mandatory data integrity rules.

**Exit criteria:** a configuration change is validated, scoped, audited, and safely recovered; module dependencies are enforced.

## Phase 16 — Custom fields, forms, and metadata-driven customization

**Objective:** allow safe business-specific customization.

**Scope**
- Implement approved custom fields, field types, validation, visibility, requiredness, and metadata-driven form behavior.
- Define how custom fields are exposed through APIs, search, exports, permissions, and reports.
- Validate schema evolution and data retention for customized fields.
- Prevent custom configuration from injecting executable code or bypassing authorization.
- Defer advanced no-code builders until their runtime and governance are explicitly specified.

**Dependencies:** Phases 13 and 15.

**Exit criteria:** custom fields work consistently across UI/API and are validated, permission-aware, auditable, and tenant-scoped.

## Phase 17 — Workflow and approval engine foundation

**Objective:** provide governed workflow primitives before complex approvals are embedded in modules.

**Scope**
- Implement workflow definitions, versioning, states/transitions, conditions, approvers, delegation, escalation, timeouts, and cancellation where specified.
- Implement maker-checker/segregation-of-duties constraints.
- Define workflow evaluation determinism, authorization, audit, and safe failure behavior.
- Integrate workflows with notifications and business actions through stable interfaces.
- Test workflow changes while instances are in progress.

**Exit criteria:** a representative approval workflow cannot be bypassed by direct API calls and leaves a complete audit trail.

## Phase 18 — Notification engine

**Objective:** deliver user notifications reliably and securely.

**Scope**
- Implement in-app notifications, preferences, read/unread state, templates, event triggers, and delivery tracking as specified.
- Add email/SMS/push channels only when configured and supported.
- Implement retry, deduplication, failure visibility, and safe handling of sensitive content.
- Ensure notification recipients are authorized for the referenced record.

**Exit criteria:** notification delivery is traceable, deduplicated where required, and never leaks cross-tenant information.

## Phase 19 — Background jobs and reliable asynchronous work

**Objective:** support long-running and retryable operations safely.

**Scope**
- Establish job registration, scheduling, retries/backoff, idempotency, cancellation, dead-letter/failure inspection, and operational visibility.
- Define tenant context propagation and authorization for scheduled work.
- Add patterns for exports, notifications, integrations, and later sync/reporting workloads.
- Ensure a retry cannot double-post stock, money, or other business effects.

**Exit criteria:** representative job failure/retry tests prove safe recovery and no duplicate business effects.

## Phase 20 — Universal search, favorites, recents, and command palette

**Objective:** provide consistent cross-module navigation and discovery.

**Scope**
- Implement permission-aware global search and filters.
- Add favorites, recently accessed items, command palette, and command-center foundations as specified.
- Ensure search indexes, suggestions, and result actions respect tenant and record-level permissions.
- Define indexing/update/deletion consistency and failure recovery.

**Exit criteria:** search cannot expose unauthorized records and indexing behavior is tested against create/update/delete and permission changes.

---

# PART III — CORE BUSINESS MODULES

## Phase 21 — Inventory transaction engine

**Objective:** make stock changes controlled, atomic, and auditable.

**Scope**
- Implement stock movement records and a consistent authoritative stock-balance model.
- Support receipts, issues, transfers, reservations, adjustments, and reversals in the approved scope.
- Enforce units of measure, quantity precision, stock availability policies, concurrency control, and idempotency.
- Define negative stock, backdating, period locking, and correction policies explicitly.
- Implement stock history and reconciliation tools.
- Do not allow arbitrary balance edits to replace the transaction history.

**Dependencies:** Phases 05–09, 13, 19.

**Exit criteria:** concurrent and failed operations preserve stock integrity; every balance change is traceable to an authorized transaction.

## Phase 22 — Warehouse and location management

**Objective:** manage physical stock locations and controlled movements.

**Scope**
- Implement warehouses, locations/bins, warehouse access, transfers, picking/put-away concepts, and movement workflows as specified.
- Add lot/batch, serial, expiry, and traceability support according to approved requirements.
- Enforce source/destination authorization and movement state transitions.
- Integrate with inventory transactions rather than duplicating stock logic.

**Exit criteria:** transfers preserve quantities and traceability; unauthorized warehouse access is denied.

## Phase 23 — Purchasing and procurement

**Objective:** deliver traceable procurement from request through receipt.

**Scope**
- Implement purchase requests/orders, supplier terms, approval, partial receipts, discrepancies, cancellation, returns, and document history as specified.
- Integrate goods receipt with inventory through a single authoritative posting path.
- Define commitments and future accounts-payable handoff contracts.
- Test duplicate submissions, partial fulfillment, approval changes, and failed receipt transactions.

**Exit criteria:** approved purchase flows create correct stock effects exactly once and retain a clear lifecycle/audit trail.

## Phase 24 — Supplier management

**Objective:** provide supplier lifecycle and relationship capabilities shared by purchasing and finance.

**Scope**
- Implement supplier profiles, contacts, addresses, payment/credit terms, status, documents, performance measures, and history in the approved scope.
- Enforce duplicate detection, approval, restricted-field access, and change auditing.
- Connect supplier data to purchasing/AP without duplicating identities.

**Exit criteria:** supplier changes are permission-controlled, auditable, and consistently reflected in dependent workflows.

## Phase 25 — Sales order and fulfillment management

**Objective:** implement the standard sales lifecycle before specialized POS and commerce extensions.

**Scope**
- Implement quotations, orders, pricing, discounts, fulfillment, delivery handoff, invoicing handoff, returns, cancellation, and customer history according to requirements.
- Enforce stock reservation/availability and price/discount permissions.
- Define partial fulfillment and return rules.
- Integrate inventory and accounting through approved contracts, not ad hoc side effects.

**Exit criteria:** order lifecycle, stock reservation, fulfillment, cancellation, and returns are consistent and tested.

## Phase 26 — Point of sale (POS) core

**Objective:** deliver a reliable in-person sales experience.

**Scope**
- Implement register/session lifecycle, product lookup/barcodes, cart, pricing, discounts, taxes, payment tender, receipt, refund/void, and cashier permissions as specified.
- Define cash drawer and shift reconciliation where required.
- Enforce idempotent checkout and prevent duplicate sales on retries.
- Integrate posted sales with inventory and financial records through shared services.
- Design for keyboard/touch workflows and clear recovery from printer/payment failures.

**Exit criteria:** a complete POS sale and authorized reversal update the relevant domains once and reconcile correctly.

## Phase 27 — POS hardware and operational extensions

**Objective:** support approved peripherals and store operations.

**Scope**
- Implement supported receipt printing, barcode scanner, cash drawer, and payment-terminal integration points.
- Define device configuration, diagnostics, fallback, and failure handling.
- Add multi-register/store behavior and shift reconciliation as specified.
- Do not claim a hardware integration works without testing on the supported device or simulator contract.

**Exit criteria:** each supported device has a documented configuration and tested success/failure behavior.

## Phase 28 — Customer relationship management (CRM)

**Objective:** support customer lifecycle and sales relationship management.

**Scope**
- Implement leads, opportunities, activities, follow-ups, customer segmentation, communication history, and conversion where specified.
- Connect CRM identities to shared customer/master data.
- Enforce access scopes and consent/privacy requirements.
- Define handoffs to sales, marketing, and support.

**Exit criteria:** CRM lifecycle and handoffs are traceable, permission-aware, and do not create duplicate customer identities.

## Phase 29 — Accounting core and general ledger

**Objective:** establish financial integrity before advanced financial reporting.

**Scope**
- Implement chart of accounts, fiscal periods, journal entries, posting rules, balanced double-entry constraints, period close/lock, and reversal/correction workflows.
- Define precision, currency, exchange-rate, rounding, and posting-date rules.
- Establish immutable posted-entry behavior and audit evidence.
- Prevent direct editing/deletion of posted financial records; use approved reversals.
- Validate financial transaction atomicity and reconciliation.

**Exit criteria:** every posted journal balances, period rules are enforced, and corrections preserve the audit trail.

## Phase 30 — Accounts receivable and customer collections

**Objective:** manage customer invoices, receipts, credits, and outstanding balances.

**Scope**
- Implement receivables documents, payment allocation, partial payments, credit notes, aging, disputes, and customer statements as specified.
- Connect sales invoices and payments to the general ledger through posting rules.
- Ensure receipt retries cannot duplicate cash or reduce receivables twice.
- Reconcile subledger totals to control accounts.

**Exit criteria:** customer balances, allocations, aging, and GL control accounts reconcile under partial-payment and reversal scenarios.

## Phase 31 — Accounts payable and supplier payments

**Objective:** manage supplier liabilities and settlement.

**Scope**
- Implement supplier bills, payment scheduling, payment allocation, credit notes, withholding/tax handling where approved, and aging.
- Connect purchase receipts and supplier bills through explicit matching rules where specified.
- Enforce approval, segregation of duties, duplicate invoice checks, and payment idempotency.
- Reconcile AP subledger to the general ledger.

**Exit criteria:** AP balances reconcile and duplicate/unauthorized payments are blocked by server-side rules.

## Phase 32 — Cash, banking, and payment instruments

**Objective:** manage cash and bank activity consistently.

**Scope**
- Implement cash/bank accounts, receipts, disbursements, transfers, reconciliation, and payment references as specified.
- Define external payment provider integration boundaries separately from internal ledger posting.
- Ensure cash/bank postings and AR/AP allocations occur atomically or through a reliable recoverable workflow.
- Test bank reconciliation differences and reversal scenarios.

**Exit criteria:** cash/bank records reconcile to posted transactions and duplicate payment events do not duplicate accounting effects.

## Phase 33 — Expense management

**Objective:** manage operational expenses with authorization and financial traceability.

**Scope**
- Implement expense categories, submissions, receipts, approvals, reimbursements, allocation, and posting as specified.
- Apply budgets, cost centers, projects, and tax rules where supported.
- Enforce submission/approval/payment separation for applicable roles.
- Ensure edits after approval follow controlled resubmission or reversal.

**Exit criteria:** expense lifecycle, approval, reimbursement, and financial posting are auditable and reconciled.

## Phase 34 — Budgeting and cost controls

**Objective:** provide governed planning and variance controls.

**Scope**
- Implement budgets by approved dimensions such as organization, department, account, project, or period.
- Support revisions, approval, actual-vs-budget analysis, and configurable threshold alerts.
- Define whether budgets warn or block transactions; do not infer policy.
- Ensure calculations use authoritative posted data.

**Exit criteria:** budget versions and variance calculations are reproducible and policy enforcement is tested.

## Phase 35 — Tax configuration and tax processing

**Objective:** support configurable tax calculations without hard-coding a single jurisdiction.

**Scope**
- Implement configurable tax codes/rates, effective dates, inclusive/exclusive pricing, exemptions, rounding, and document-level tax breakdowns as specified.
- Define jurisdiction-specific requirements as approved configuration or separately reviewed extensions.
- Preserve tax evidence on posted transactions when rates later change.
- Test edge cases and avoid representing unverified tax rules as legal advice or universal defaults.

**Exit criteria:** tax calculation is deterministic, versioned, auditable, and covered by representative boundary tests.

---

# PART IV — PEOPLE, OPERATIONS, AND ENTERPRISE MODULES

## Phase 36 — HR and employee records

**Objective:** establish shared employee and HR data.

**Scope**
- Implement employee profiles, employment status, departments, positions, reporting relationships, documents, and lifecycle events as specified.
- Apply restricted access to personal and compensation data.
- Define effective dates, retention, and audit for employment changes.
- Connect employees to attendance, leave, payroll, and access management through explicit contracts.

**Exit criteria:** HR records are correctly scoped and sensitive fields are protected and audited.

## Phase 37 — Attendance, leave, and scheduling

**Objective:** manage attendance and leave according to configurable policies.

**Scope**
- Implement attendance capture, timesheets/shift rules, leave balances, requests, approvals, holidays, and corrections as specified.
- Define time zones, overnight shifts, rounding, and correction policy.
- Connect approved time data to payroll through validated period snapshots.
- Test duplicate imports, late corrections, overlapping leave, and approval boundaries.

**Exit criteria:** attendance and leave calculations are reproducible, approved, auditable, and safe for payroll consumption.

## Phase 38 — Payroll

**Objective:** implement controlled payroll calculation and settlement.

**Scope**
- Implement compensation structures, pay periods, earnings/deductions, payroll runs, review/approval, payslips, and posting/export as specified.
- Separate calculation, approval, and payment permissions.
- Version payroll inputs and preserve calculation snapshots.
- Treat country/jurisdiction rules as explicit approved requirements; do not invent statutory calculations.
- Test rounding, adjustments, reruns, termination, and correction workflows.

**Exit criteria:** payroll results are reproducible from recorded inputs, access is restricted, and approved outputs reconcile with financial postings.

## Phase 39 — Manufacturing and material requirements planning (MRP)

**Objective:** support controlled production planning and execution.

**Scope**
- Implement manufacturing orders, work centers/resources, routing, material demand, capacity assumptions, and order lifecycle as specified.
- Connect demand and supply to inventory and procurement using explicit reservations and movements.
- Define production cancellation, shortage, substitution, and rework rules.
- Prevent production from silently creating or consuming stock outside the transaction engine.

**Exit criteria:** a representative production order traces inputs, outputs, shortages, and resulting stock transactions.

## Phase 40 — Bill of materials (BOM) and product structures

**Objective:** manage versioned component structures.

**Scope**
- Implement BOM headers/lines, quantities, units, alternatives, effective dates, revisions, and approval where specified.
- Define explosion and quantity-rounding behavior.
- Preserve which BOM revision was used by a released production order.
- Test cycles, invalid units, obsolete revisions, and component shortages.

**Exit criteria:** BOM calculations are deterministic, versioned, and traceable to production orders.

## Phase 41 — Production planning and scheduling

**Objective:** plan capacity and production sequence within the approved scope.

**Scope**
- Implement demand inputs, planned orders, capacity constraints, scheduling, rescheduling, and exception visibility.
- Distinguish planning suggestions from committed transactions.
- Integrate with inventory, procurement, BOM, and work centers through defined contracts.
- Test shortage changes and re-planning without corrupting released orders.

**Exit criteria:** planning output is reproducible and cannot mutate committed stock or production without an authorized release action.

## Phase 42 — Quality management

**Objective:** introduce quality checkpoints and nonconformance control.

**Scope**
- Implement inspection plans, sampling/inspection results, pass/fail disposition, nonconformance, corrective actions, and traceability as specified.
- Connect quality holds/releases to inventory and production.
- Restrict overrides and preserve evidence of disposition.
- Test rejected/held stock cannot be consumed or shipped when policy forbids it.

**Exit criteria:** quality decisions affect the relevant workflow only through authorized, auditable transitions.

## Phase 43 — Supply chain management

**Objective:** coordinate demand, supply, replenishment, and supplier performance.

**Scope**
- Implement approved planning and replenishment features, supply exceptions, lead times, and supplier performance indicators.
- Consume authoritative inventory, sales, purchasing, and production data.
- Keep recommendations distinguishable from approved commitments.
- Add optimization only when its input quality and constraints are validated.

**Exit criteria:** supply chain recommendations can be explained and do not create unapproved transactions.

## Phase 44 — Logistics, delivery, and shipment tracking

**Objective:** manage fulfillment and delivery handoffs.

**Scope**
- Implement picking/packing/shipping status, delivery documents, tracking references, proof of delivery, failed delivery, and returns handoff as specified.
- Connect shipments to sales orders and inventory issues.
- Implement carrier integration through the integration framework, not module-specific secret handling.
- Test partial shipments, cancellation, and retry behavior.

**Exit criteria:** shipment status, inventory effects, and order fulfillment remain consistent across failure and retry paths.

## Phase 45 — Fleet management

**Objective:** manage vehicle and fleet operations where included.

**Scope**
- Implement vehicle records, assignments, usage, inspections, fuel/expense records, maintenance schedules, and compliance fields as specified.
- Integrate with logistics and asset/maintenance records without duplicating them.
- Restrict sensitive driver and location data.
- Keep jurisdiction-specific compliance requirements explicit and configurable.

**Exit criteria:** fleet activity and costs are traceable, permission-controlled, and linked to relevant assets/maintenance workflows.

## Phase 46 — Asset management

**Objective:** manage organization-owned assets through their lifecycle.

**Scope**
- Implement asset register, ownership/location, assignment, acquisition, depreciation handoff where approved, transfer, impairment/disposal, and audit history as specified.
- Connect asset financial treatment to accounting through approved posting rules.
- Define lifecycle and custody controls.

**Exit criteria:** asset changes and financial effects are traceable and reconciled where applicable.

## Phase 47 — Maintenance management

**Objective:** manage preventive and corrective maintenance.

**Scope**
- Implement maintenance plans, work orders, service history, parts consumption, labor, downtime, and closure criteria as specified.
- Connect maintenance to inventory, assets, and fleet where applicable.
- Test required inspections, overdue maintenance, and failed work orders.

**Exit criteria:** maintenance activity and parts consumption are auditable and tied to the correct asset/work order.

## Phase 48 — Project management

**Objective:** manage project delivery and resource/cost visibility.

**Scope**
- Implement projects, tasks, milestones, assignments, dependencies, timesheets, budgets, expenses, and status reporting in the approved scope.
- Connect projects to accounting, procurement, service, and employee records via contracts.
- Enforce project-level access and approved change controls.

**Exit criteria:** project status and cost reporting use authoritative records and are permission-aware.

## Phase 49 — Contract management

**Objective:** manage agreements, obligations, dates, and renewals.

**Scope**
- Implement contract records, parties, versions, effective/expiry dates, obligations, approvals, attachments, renewals, and alerts as specified.
- Restrict confidential clauses and documents.
- Link contracts to suppliers, customers, projects, service, and billing where approved.

**Exit criteria:** contract versions, approvals, obligations, and access are traceable.

## Phase 50 — Service management

**Objective:** manage service delivery and service commitments.

**Scope**
- Implement service requests/orders, assignments, service levels, labor/parts, completion evidence, customer acceptance, and billing handoff as specified.
- Connect service work to inventory, assets, projects, contracts, and finance through shared contracts.
- Define cancellation, rework, and warranty behavior if specified.

**Exit criteria:** service lifecycle and any stock/financial effects are traceable and authorized.

## Phase 51 — Help desk and support

**Objective:** provide controlled support-ticket handling.

**Scope**
- Implement ticket intake, categorization, assignment, priority, SLA timers, escalation, internal notes, customer-visible communication, and closure as specified.
- Enforce access to internal notes and sensitive attachments.
- Integrate notifications and service management through shared interfaces.

**Exit criteria:** ticket transitions and communications are auditable and respect internal/customer visibility boundaries.

## Phase 52 — Appointment management

**Objective:** manage bookable time and appointment lifecycles.

**Scope**
- Implement availability, scheduling, assignment, confirmations, rescheduling, cancellations, reminders, and no-show handling as specified.
- Define time-zone, conflict, capacity, and double-booking rules.
- Connect to CRM, service, or industry templates through approved contracts.

**Exit criteria:** concurrent booking tests prevent prohibited double bookings and reminders respect current appointment state.

## Phase 53 — Marketing management

**Objective:** support approved marketing operations without bypassing privacy controls.

**Scope**
- Implement campaign planning, audiences, segments, campaign events, lead attribution, and performance measures as specified.
- Define consent, suppression, opt-out, and data-retention behavior before outbound communication is enabled.
- Integrate CRM and notification providers through shared services.
- Do not send campaigns to real recipients during development without explicit authorization.

**Exit criteria:** audience selection is permission/consent-aware and campaign delivery is traceable.

## Phase 54 — E-commerce and commerce integrations

**Objective:** connect external commerce channels to core product/order data.

**Scope**
- Implement approved product/catalog synchronization, price/stock publication, order ingestion, status updates, returns, and reconciliation.
- Validate external identifiers, signatures/authentication, rate limits, idempotency, retries, and mapping errors.
- Keep external platform specifics behind integration adapters.
- Prevent external events from bypassing pricing, inventory, payment, or authorization rules.

**Exit criteria:** duplicate, delayed, malformed, and out-of-order external events are safely handled.

## Phase 55 — Document workflows and records lifecycle completion

**Objective:** complete business document lifecycle behavior across modules.

**Scope**
- Apply versioning, review/approval, retention, archival, retrieval, access logging, and links to relevant business records.
- Validate that documents follow the tenant/record authorization model.
- Add exportable document packages only where specified.
- Verify deletion/retention rules do not destroy legally or operationally required audit evidence.

**Exit criteria:** document access and lifecycle rules are consistent across the modules that use them.

---

# PART V — INDUSTRY TEMPLATES AND CROSS-CUTTING INTELLIGENCE

## Phase 56 — Industry-template engine and extension contracts

**Objective:** support industry-specific configurations without forking the platform.

**Scope**
- Implement template metadata, versioning, dependencies, recommended modules, configuration bundles, lifecycle, and upgrade/rollback behavior from the industry specification.
- Separate universal core, shared business modules, industry packs, and organization customization.
- Support a custom-industry configuration path only as specified.
- Define compatibility validation and migration behavior for template upgrades.
- Ensure templates cannot weaken security or financial/inventory invariants.

**Exit criteria:** a template can be installed/configured, validated, upgraded, and recovered without a platform fork.

## Phase 57 — Retail industry pack

**Scope:** retail defaults and workflows, store configuration, retail pricing/promotions, inventory/stock replenishment, POS setup, retail dashboards/KPIs, and approved retail-specific AI hooks.

**Dependencies:** master data, inventory, POS, sales, finance foundations, templates.

**Exit criteria:** a retail organization can be configured from the template and complete representative purchase-to-stock and sale-to-reconciliation scenarios.

## Phase 58 — Wholesale and distribution industry pack

**Scope:** wholesale pricing/tiers, bulk orders, customer credit/terms, fulfillment, distribution workflows, replenishment, and approved KPIs.

**Exit criteria:** a configured wholesale organization can execute a representative order-to-fulfillment-to-receivable scenario.

## Phase 59 — Manufacturing industry pack

**Scope:** manufacturing defaults for BOM, MRP, production, quality, supply chain, inventory, and manufacturing KPIs.

**Exit criteria:** a manufacturing template configures the shared modules and completes a traceable production scenario.

## Phase 60 — Restaurant and food-service industry pack

**Scope:** restaurant menu/product structures, table/order workflows, kitchen handoff, food inventory/recipe-related features only where specified, restaurant POS, and operational KPIs.

**Exit criteria:** representative order-to-kitchen-to-payment scenarios work with stock and financial effects consistent with core rules.

## Phase 61 — Hospitality industry pack

**Scope:** hospitality configuration and reservation/guest/room concepts only to the level specified in the industry requirements, plus approved integrations and KPIs.

**Exit criteria:** configured hospitality workflows preserve availability, booking, payment, and guest-data boundaries.

## Phase 62 — Healthcare industry pack

**Scope:** only the healthcare business capabilities explicitly approved in the specifications, such as appointment and relevant inventory workflows; treat clinical/medical-record capabilities as separate scope unless explicitly authorized.

**Exit criteria:** sensitive data has documented access, audit, retention, and integration controls; no unapproved clinical functionality is implied.

## Phase 63 — Education industry pack

**Scope:** education-oriented configuration and fee/business workflows specified by the industry document, with any student/academic extensions treated as explicit scope decisions.

**Exit criteria:** representative education business workflows run through shared platform rules without leaking data between organizations.

## Phase 64 — Construction industry pack

**Scope:** construction-oriented project, contract, purchasing, inventory, asset, cost, and reporting configurations described by the industry specification.

**Exit criteria:** representative project/cost workflows are auditable and use shared financial and inventory records.

## Phase 65 — Real-estate industry pack

**Scope:** real-estate configurations and explicitly specified property/lease/sales/service workflows, without assuming unapproved legal or financial features.

**Exit criteria:** configured workflows, documents, roles, and reports pass tenant/security tests.

## Phase 66 — Logistics industry pack

**Scope:** logistics-oriented warehouse, fleet, shipment, delivery, asset, and operational reporting configuration as specified.

**Exit criteria:** shipment and fleet workflows integrate with core inventory/order records and preserve traceability.

## Phase 67 — Professional-services industry pack

**Scope:** professional-services defaults for CRM, projects, contracts, appointments, service delivery, time/cost tracking, and reporting where specified.

**Exit criteria:** representative service/project delivery can be configured without duplicating universal business logic.

## Phase 68 — Multi-industry and custom-industry validation

**Objective:** verify industry coexistence and customization.

**Scope**
- Test organizations with multiple approved industry templates.
- Validate template compatibility, configuration precedence, module dependencies, and upgrade paths.
- Test organization-specific customizations against template updates.
- Ensure switching/adding a template cannot silently rewrite existing business records.

**Exit criteria:** multi-industry configuration is deterministic, reversible where specified, and cannot bypass access or data integrity rules.

## Phase 69 — Reporting, dashboards, and business intelligence

**Objective:** implement reliable, permission-aware operational and executive reporting.

**Scope**
- Implement shared reporting/query patterns and dashboards as specified.
- Add module reports for inventory, purchasing, sales, POS, finance, HR, manufacturing, projects, service, and industry packs as their source modules become verified.
- Define reporting periods, time zones, currency conversion, aggregation, and reconciliation.
- Implement configurable dashboards and export permissions.
- Separate operational reports from analytical models where required.
- Test report totals against authoritative source records and protect row/field-level access.

**Exit criteria:** representative reports reconcile to source records and cannot expose unauthorized data.

## Phase 70 — Advanced analytics and command center

**Objective:** provide cross-module operational visibility.

**Scope**
- Complete command-center widgets, exceptions, KPI definitions, saved views, drill-down, and action links as specified.
- Ensure KPI calculations are versioned/documented and consistent across dashboard/report views.
- Add performance safeguards and explain data freshness.
- Ensure a dashboard action still passes the underlying module's authorization and workflow rules.

**Exit criteria:** KPIs reconcile to defined sources and every drill-down/action respects permissions.

## Phase 71 — Integration framework and connector governance

**Objective:** support external systems through secure, maintainable adapters.

**Scope**
- Implement integration registry/configuration, credential/secret handling, connection status, scopes, health checks, rate limits, and mapping.
- Define inbound/outbound event handling, webhook verification, idempotency, retry, dead-letter visibility, reconciliation, and audit.
- Implement only the connectors explicitly prioritized and approved.
- Keep credentials server-side and never expose them to the browser.
- Add contract tests and sandbox tests where available.

**Exit criteria:** integrations can be configured and monitored, and malformed/repeated/out-of-order events cannot corrupt business state.

## Phase 72 — Notifications channel integrations and delivery hardening

**Objective:** complete approved email/SMS/push/provider delivery channels.

**Scope**
- Configure provider adapters, templates, preferences, retries, rate limits, suppression, and delivery outcomes.
- Validate recipient authorization and sensitive-content policies.
- Test provider outages, throttling, invalid credentials, and repeated delivery callbacks.

**Exit criteria:** notification failures are visible/recoverable and delivery cannot leak unauthorized records.

## Phase 73 — Offline capability and synchronization protocol

**Objective:** add offline behavior only after online business rules are authoritative.

**Scope**
- Identify approved offline-capable workflows, devices, and data subsets.
- Define local persistence, encryption, device identity, queued operations, sync cursor/version, conflict detection, retry, and recovery.
- Define conflict resolution per entity/operation; do not apply a universal last-write-wins policy to financial or stock transactions.
- Use idempotency keys and server-side revalidation on sync.
- Enforce tenant, user, permission, and device revocation rules during sync.
- Define offline limitations clearly in UI and documentation.
- Test duplicate, reordered, stale, conflicting, interrupted, and revoked-device synchronization.

**Exit criteria:** offline operations reconcile deterministically, conflicts are visible, and no offline client can bypass server authorization or posting rules.

## Phase 74 — POS offline mode and reconciliation

**Objective:** implement the separately tested offline POS subset.

**Scope**
- Define which product, pricing, customer, tax, and payment operations are allowed offline.
- Establish local transaction queueing, duplicate prevention, receipt identifiers, stock-risk policy, and synchronization behavior.
- Define tender types that cannot be safely accepted offline and how failed sync is surfaced.
- Test multi-terminal collision, stale prices, returns, partial sync, and device revocation.

**Exit criteria:** approved offline POS flows have explicit limitations and reconcile without silent duplicate sales or stock changes.

## Phase 75 — AI and automation governance foundation

**Objective:** add AI only behind approved permissions and deterministic business controls.

**Scope**
- Define approved AI use cases, data boundaries, provider abstraction, consent/retention, logging, cost limits, and fallback behavior.
- Establish prompt-injection and untrusted-input defenses for retrieved documents, emails, and external data.
- Ensure AI cannot grant permissions, bypass approval, post financial/stock transactions, or invoke privileged tools without explicit authorized workflow gates.
- Distinguish suggestions from executed actions and require confirmation for consequential actions.
- Establish evaluation datasets, quality thresholds, monitoring, and human review.

**Exit criteria:** AI capabilities have explicit safety boundaries, evaluations, auditability, and a non-AI fallback where required.

## Phase 76 — AI-assisted insights and governed automation

**Objective:** deliver only the AI features approved in the AI specification.

**Scope**
- Implement prioritized summaries, anomaly/forecast suggestions, natural-language reporting, and workflow assistance only where specified.
- Require provenance/source links for business insights where feasible.
- Validate outputs against source data and clearly identify estimates.
- Keep automation actions behind the workflow/permission engine.
- Test misleading input, low-confidence results, unavailable providers, and unauthorized data requests.

**Exit criteria:** AI output is bounded, evaluated, permission-aware, and cannot silently commit a consequential business action.

## Phase 77 — Mobile and external API ecosystem readiness

**Objective:** prepare supported APIs and UX for future clients without prematurely building a separate mobile product.

**Scope**
- Validate responsive web behavior and API contract stability.
- Define device/session security, API version compatibility, push-notification needs, and offline boundaries.
- Document future React Native readiness as specified.
- Build native mobile functionality only if separately approved and prioritized.

**Exit criteria:** documented API and security contracts support future clients without requiring unauthorized architecture changes.

---

# PART VI — RELEASE, HARDENING, AND OPERATIONS

## Phase 78 — End-to-end business scenarios and cross-module reconciliation

**Objective:** prove complete business journeys across module boundaries.

**Required scenario families**
- Organization setup → users/roles → tenant isolation.
- Product setup → purchase order → receipt → stock visibility.
- Quote/order → reservation/fulfillment → invoice → receipt → GL reconciliation.
- POS sale → payment → stock movement → receipt/shift reconciliation.
- Supplier bill → approval → payment → AP/GL reconciliation.
- Expense submission → approval → reimbursement/posting.
- Employee/time/leave → approved payroll run → financial handoff, where in scope.
- BOM/production order → component consumption → finished goods → quality disposition.
- Service/project/asset maintenance journeys where implemented.
- Industry-template setup → configuration → representative industry workflow.
- External integration event → idempotent processing → reconciliation.
- Offline queue → sync → conflict handling, where enabled.

**Exit criteria:** scenarios pass from UI/API entry through persisted records and downstream effects; all reconciliation differences are explained.

## Phase 79 — Security, privacy, and threat-model review

**Objective:** validate the security model beyond ordinary functional tests.

**Scope**
- Review authentication/session, authorization, tenant isolation, input validation, file access, secret handling, logs, exports, integrations, background jobs, and offline sync.
- Test privilege escalation, IDOR, CSRF/XSS/injection risks as applicable, replay, brute force, rate limits, and insecure direct object access.
- Review data minimization, retention, deletion, and sensitive-field access.
- Run dependency and vulnerability checks and remediate or document approved exceptions.
- Review audit tampering and privileged-administrator behavior.

**Exit criteria:** critical/high issues are fixed or explicitly accepted by an authorized decision-maker with mitigation and expiry.

## Phase 80 — Performance, scale, and reliability testing

**Objective:** establish evidence that the system meets agreed workload targets.

**Scope**
- Define measurable workload and response-time targets before benchmarking.
- Test database query plans, indexes, pagination, large tables, concurrent transactions, queue backlog, report workloads, and integration timeouts.
- Test tenant-scale behavior, noisy-neighbor risks, connection pools, cache isolation, and resource exhaustion.
- Test backups, restore, degraded dependencies, retry storms, and recovery procedures.
- Optimize based on measured evidence rather than premature infrastructure complexity.

**Exit criteria:** agreed performance/reliability targets pass or exceptions are explicitly documented with a remediation plan.

## Phase 81 — Accessibility, browser, and responsive release verification

**Objective:** verify user-facing quality across supported environments.

**Scope**
- Test the supported browsers, screen sizes, keyboard navigation, focus management, forms, dialogs, data tables, themes, and reduced-motion behavior.
- Validate accessible names, error associations, contrast, semantic structure, and zoom/responsive behavior.
- Test critical workflows using keyboard-only navigation and representative assistive-technology checks where available.

**Exit criteria:** release-blocking accessibility and compatibility defects are fixed or formally dispositioned.

## Phase 82 — Backup, disaster recovery, and operational runbooks

**Objective:** prepare for data loss, deployment failure, and service interruption.

**Scope**
- Define backup schedules, encryption, retention, restore tests, recovery objectives, and ownership.
- Document migration recovery, failed-job recovery, integration replay, tenant data export, and incident response.
- Test restore to an isolated environment and verify record counts/reconciliation.
- Establish health checks, alert routing, escalation, and access review.

**Exit criteria:** restore and recovery exercises have evidence and meet approved recovery objectives.

## Phase 83 — Staging and release-candidate validation

**Objective:** validate a production-like build before pilot use.

**Scope**
- Deploy to staging with production-like configuration and safe test data.
- Run migrations, smoke tests, critical end-to-end scenarios, security checks, performance checks, and rollback/recovery drills.
- Verify secrets, TLS, domain, storage, job processing, backups, monitoring, and external provider settings.
- Complete release notes, known-issues list, and support procedures.

**Exit criteria:** release candidate passes agreed gates and unresolved risks are explicitly approved.

## Phase 84 — Controlled pilot and user acceptance

**Objective:** validate real workflows with a bounded, approved pilot.

**Scope**
- Define pilot organizations, users, modules, data migration, training, support, and rollback criteria.
- Use explicit consent/authorization for production data and external communications.
- Collect issues with severity, reproduction steps, owner, and acceptance evidence.
- Verify permissions and tenant boundaries using pilot roles.
- Do not expand scope or tenant exposure implicitly during the pilot.

**Exit criteria:** pilot acceptance criteria pass, critical defects are closed, and the user approves the next rollout stage.

## Phase 85 — Production release and controlled rollout

**Objective:** release safely with observable health and a recovery plan.

**Scope**
- Execute approved deployment and migrations with pre/post checks.
- Verify backups and restore readiness before risky data changes.
- Use staged rollout/feature flags where supported.
- Monitor errors, latency, queue failures, database health, security events, and business reconciliation.
- Confirm rollback or forward-recovery decisions and communication responsibilities.
- Avoid claiming production readiness without verified deployment evidence.

**Exit criteria:** production health checks and critical workflows pass; rollback/recovery and ownership are clear.

## Phase 86 — Post-release stabilization and continuous delivery

**Objective:** operate the platform safely after launch.

**Scope**
- Monitor incidents, performance, security findings, job queues, integration errors, sync conflicts, and reconciliation exceptions.
- Establish support triage, patch cadence, dependency updates, user feedback, and regression coverage.
- Review phase outcomes and update requirements/roadmap based on approved decisions.
- Prioritize fixes without silently changing scope or weakening controls.

**Exit criteria:** stabilization targets are met and the product has an agreed maintenance and enhancement process.

---

# 4. Module coverage register

The supplied `docs/modules/23-MODULES-SPECIFICATION.md` contains the following module headings. Confirm these identifiers against the authoritative specification during Phase 00; do not assume other documents use the same count.

| Module specification heading | Primary implementation phase(s) |
|---|---|
| 01 Organization Management | 08; plus setup/onboarding slices |
| 02 User & Access Management | 07–09 |
| 03 Product & Service Management | 13 |
| 04 Inventory Management | 21 |
| 05 Warehouse Management | 22 |
| 06 Sales Management | 25 |
| 07 POS Management | 26–27; 74 for offline |
| 08 CRM | 28 |
| 09 Purchase Management | 23 |
| 10 Supplier Management | 24 |
| 11 Accounting & Finance | 29–35 |
| 12 Accounts Receivable | 30 |
| 13 Accounts Payable | 31 |
| 14 Cash & Banking | 32 |
| 15 Expense Management | 33 |
| 16 Budgeting | 34 |
| 17 Tax Management | 35 |
| 18 HR Management | 36 |
| 19 Employee Management | 36 |
| 20 Attendance & Leave | 37 |
| 21 Payroll | 38 |
| 22 Manufacturing / MRP | 39 |
| 23 Bill of Materials | 40 |
| 24 Production Planning | 41 |
| 25 Quality Management | 42 |
| 26 Supply Chain Management | 43 |
| 27 Logistics & Delivery | 44 |
| 28 Fleet Management | 45 |
| 29 Asset Management | 46 |
| 30 Maintenance Management | 47 |
| 31 Project Management | 48 |
| 32 Contract Management | 49 |
| 33 Service Management | 50 |
| 34 Help Desk / Support | 51 |
| 35 Appointment Management | 52 |
| 36 Document Management | 14, 55 |
| 37 Workflow & Approvals | 17, then integrated throughout |
| 38 Marketing Management | 53 |
| 39 E-commerce / Commerce Integration | 54 |
| 40 Reporting / BI | 69–70 |
| 41 Notification Management | 18, 72 |
| 42 Integration Management | 71 |
| 43 AI & Automation | 75–76 |
| 44 System Administration | 03–04, 12, 79–86; add a dedicated admin UI slice if required |
| 45 Configuration & Customization | 15–16 |
| 46 Audit & Activity Management | 12 |
| 47 Search & Command Center | 20, 70 |

This mapping is a planning index, not a replacement for each module's detailed requirements. Each module must still be implemented against its own entities, actors, workflows, business rules, edge cases, acceptance criteria, and security requirements.

---

# 5. Cross-cutting requirements that apply to every phase

The following are not one-time tasks. They must be checked in every affected module and release.

- **Multi-tenancy:** tenant scope in records, queries, jobs, cache keys, files, search, exports, reports, and integration events.
- **Authorization:** server-side permission checks on reads, writes, exports, approvals, and state transitions.
- **Auditability:** sensitive and consequential changes produce appropriate audit records.
- **Data integrity:** database constraints, transactions, idempotency, concurrency, and reversal/correction rules.
- **Configuration:** use approved configuration mechanisms rather than hard-coded tenant/industry assumptions.
- **API consistency:** validation, errors, pagination, versioning, contract tests, and documented permissions.
- **UI quality:** responsive states, accessibility, loading/error/empty states, keyboard support, reduced motion, and approved themes.
- **Reliability:** retries, failure visibility, recovery, safe reprocessing, and observability.
- **Privacy:** minimize sensitive data, restrict access, redact logs, and enforce retention/deletion policies.
- **Testing:** unit and integration tests for every change; security/regression/end-to-end tests where applicable.
- **Documentation:** update API, data model, configuration, setup, user guidance, and release notes as appropriate.
- **No fake completion:** every implemented behavior must be connected to real persistence/services and tested, or explicitly labeled as a prototype not ready for release.

---

# 6. Definition of done for every phase

A phase is not done until all applicable items below are true.

- [ ] Scope and source requirements are identified.
- [ ] Dependencies and unresolved decisions are recorded.
- [ ] Database/API/UI/business logic are implemented at the correct layers.
- [ ] Tenant isolation and authorization are enforced server-side.
- [ ] Validation, errors, loading/empty states, and recovery paths are implemented.
- [ ] Database migrations and rollback/recovery implications are reviewed.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Security/tenant tests pass where applicable.
- [ ] Regression and end-to-end tests pass where applicable.
- [ ] Lint/build/type-independent JavaScript quality checks pass.
- [ ] Accessibility/responsive checks pass for user-facing changes.
- [ ] API/data model/developer/user documentation is updated.
- [ ] No placeholder behavior is presented as complete.
- [ ] Known limitations and deferred requirements are listed.
- [ ] A completion report lists files changed, commands run, results, and next dependencies.
- [ ] User approval is obtained for any product-scope or architecture decision requiring it.

---

# 7. Recommended execution rules

1. Begin with Phases 00–02; do not jump straight to business modules.
2. Establish a thin, end-to-end vertical slice early to validate architecture, authentication, tenant context, authorization, persistence, audit, UI, and CI together.
3. Implement shared platform services before many modules independently recreate them.
4. Deliver business modules in coherent vertical slices, with explicit contracts between modules.
5. Treat accounting, inventory, permissions, tenant isolation, offline synchronization, and AI action execution as high-risk domains requiring stronger tests.
6. Build industry packs after the shared modules they configure are stable; do not fork core logic per industry.
7. Implement offline behavior only for explicitly approved workflows and only after online posting rules are authoritative.
8. Introduce AI after data permissions, audit, workflow approvals, and safe action boundaries exist.
9. Run cross-module reconciliation tests continuously; do not wait until launch.
10. A phase can be split further whenever it is too large to implement, review, and verify safely.
11. Do not interpret phase numbers as a calendar schedule or as authorization to implement every optional/future feature automatically.
12. Maintain an explicit deferred-scope list so a future feature is neither forgotten nor accidentally pulled into the current release.

---

# 8. Initial next action

**Start with Phase 00 — Documentation, archive, and repository audit.** The implementation agent should first inspect the actual repository and compare the conflicting source documents, reconcile module numbering, and produce the requirement traceability matrix. Only after those outputs are reviewed should the foundation phases be marked Ready.

The goal of this plan is completeness and controlled delivery, not a high phase count for its own sake. Add subphases whenever they improve dependency clarity, testability, or safe handoff.
