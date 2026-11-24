# IMPLEMENTATION ROADMAP
## Professional Multi-Organization, Multi-Industry ERP & Business Management Platform

**Status:** Draft for review and approval  
**Project name:** TBD — do not invent or assign a product name  
**Related Document**: PHASES.md
**Purpose:** Convert the approved specification repository into a dependency-aware, testable implementation sequence.

---

## 1. Purpose and scope

This roadmap governs the order in which the platform is implemented. It complements, and does not replace, the PRD, architecture specification, technical specifications, module specification, industry specification, permissions specification, or development rules.

The PRD already describes a high-level ten-phase future roadmap. This document expands that broad sequence into implementation phases, gates, and workstreams. The exact task list for each phase must be refined after the coding agent audits the complete, canonical documentation set and the actual code repository.

This roadmap is not permission to build every feature immediately. It establishes sequencing, dependencies, and acceptance requirements.

## 2. Mandatory planning rules

1. Treat the approved specification repository as the product and technical source of truth.
2. Keep the project name undecided until the user explicitly approves one.
3. Use JavaScript, not TypeScript; use React/Next.js and custom CSS as specified; do not use Tailwind CSS.
4. Use PostgreSQL as the primary relational database.
5. Prefer a modular monolith initially. Do not introduce microservices without a documented, approved justification.
6. Implement server-side authorization and tenant isolation before exposing tenant-owned business data.
7. Build financial and inventory behavior around validated transactions, concurrency controls, and auditability—not arbitrary editable balances or quantities.
8. Do not implement placeholder screens, fake integrations, fake data persistence, or success messages for operations that did not succeed.
9. Every phase must include relevant tests, documentation updates, security review, and demonstrable acceptance evidence.
10. A phase is not complete merely because the application compiles or its screens render.
11. Do not silently resolve conflicts among specifications. Record the conflict, affected requirements, options, risk, and decision needed.
12. Build shared capabilities once and reuse them; avoid duplicated business rules across modules.
13. Implement offline, AI, integration, and industry-specific behavior only after the relevant authoritative server-side business rules and safety boundaries exist.
14. The roadmap is dependency-aware, not a promise that every phase is strictly linear. Parallel work is allowed only when dependencies, interfaces, ownership, and integration tests are clear.
15. Do not change the product scope, stack, or architecture without an explicit, recorded approval.

## 3. Documentation authority and conflict resolution

Use the following operational rule:

- Explicit, current user decisions govern project identity and approved changes.
- The canonical `00-MASTER-INSTRUCTIONS.md` governs non-negotiable product and technology constraints.
- `IMPLEMENTATION-MASTER-INSTRUCTIONS.md` governs how the implementation agent works.
- `01-PROJECT-VISION.md` and `02-PRODUCT-REQUIREMENTS.md` define product intent and requirements.
- The approved technical specifications govern their respective domains: architecture, stack, design, UI/UX, security, tenancy, customization, workflows, data, APIs, offline, notifications, integrations, AI, BI, testing, deployment, and mobile.
- Module and industry specifications define domain-specific behavior and dependencies.
- Development rules define coding, component, database, API, security, testing, and feature-delivery practices.
- The PRD PDF and Markdown version are reference copies of the same PRD unless an audit proves otherwise. Do not count them as two independent authorities.

**Important:** the supplied archive contains `00-MASTER-INSTRUCTIONS.md` . Do not treat both as simultaneously canonical. Compare them, identify any unique requirements or conflicts, and ask for approval of the canonical file. Until approved, use the original master as the current canonical file and treat the enhanced version as a proposed replacement—not as an additional higher-priority instruction. Do not delete either file during the audit.

When two approved documents conflict, the agent must not guess. Produce a decision record with:
- conflicting statements and exact file/section references;
- affected behavior or architecture;
- risk of each option;
- recommended resolution;
- whether user approval is required.

## 4. Phase delivery protocol

Every phase must have a written phase plan containing:

- phase objective and business outcome;
- in-scope requirements with source file/section references;
- out-of-scope items;
- prerequisites and dependency checks;
- database, API, frontend, security, operations, and documentation work;
- migration and compatibility impact;
- unit, integration, security, regression, and end-to-end tests as applicable;
- acceptance criteria with observable evidence;
- known risks and unresolved decisions;
- rollback or recovery plan for risky changes;
- completion report and next-phase recommendation.

### Phase gate states

1. **Proposed** — not yet approved for implementation.
2. **Ready** — requirements, dependencies, and acceptance criteria are clear.
3. **In progress** — implementation is underway.
4. **Blocked** — a dependency, contradiction, or decision prevents safe progress.
5. **Implemented** — code exists but validation is not complete.
6. **Verified** — tests and acceptance evidence pass.
7. **Approved** — the user accepts the phase or milestone.
8. **Closed** — documentation, known issues, and handoff are complete.

A phase must not be marked Verified or Approved based only on an agent's assertion. Provide test commands/results, changed-file summary, and any remaining limitations.

---

# 5. Implementation phases

## Phase 0 — Documentation and repository audit

**Goal:** establish an accurate baseline before changing code.

### Work
- Inventory every file in the supplied documentation archive and actual repository.
- Verify whether separate module/industry files exist outside the supplied archive.
- Compare the original and enhanced master instructions.
- Check the PRD PDF against its Markdown version for meaningful content differences.
- Check references, file paths, numbering, and links.
- Identify duplicated requirements, contradictory requirements, missing decisions, unclear terms, and dependencies.
- Verify that project identity remains TBD.
- Confirm technology constraints: JavaScript only, Next.js/React, custom CSS, no Tailwind, PostgreSQL, approved backend architecture.
- Produce a requirements traceability index mapping requirements to specifications and likely implementation phases.
- Produce a conflict/decision register and documentation-completeness report.
- Inspect the code repository if one exists; do not overwrite or scaffold over existing work.

### Deliverables
- Documentation audit report.
- Canonical-document decision list.
- Requirements traceability matrix.
- Conflict and open-decision register.
- Repository state report.
- Proposed phase dependency graph.

### Exit gate
No critical source-of-truth ambiguity remains for the foundation work. All remaining questions are explicitly recorded with an owner and decision point. No feature implementation is authorized merely by completing this audit.

## Phase 1 — Architecture validation and delivery blueprint

**Goal:** turn the specifications into an implementable architecture without silently changing them.

### Work
- Validate modular-monolith boundaries and allowed module communication.
- Confirm frontend/backend responsibilities and the chosen backend framework from the approved stack.
- Validate tenant context propagation, authorization boundaries, transaction boundaries, domain events, background jobs, file storage, caching, and observability approaches.
- Define the approved repository structure using `development/02-folder-structure.md`.
- Establish dependency order among modules and identify minimum vertical slices needed to prove the architecture.
- Decide how schema migrations, test data, API contracts, and configuration are managed.
- Define environments and secret-handling practices.
- Identify high-risk areas requiring design spikes or proof-of-concept tests.
- Record architecture decisions (ADRs) for consequential choices.

### Deliverables
- Approved implementation blueprint.
- Architecture decision records.
- Module dependency graph.
- Initial data/API contract plan.
- Risk register and release strategy.

### Exit gate
The foundation architecture and first implementation milestones are approved. The agent has not substituted its preferences for specified technology choices.

## Phase 2 — Repository and developer-experience foundation

**Goal:** create a reproducible, reviewable development environment.

### Work
- Create or validate the repository layout from the approved folder-structure specification.
- Establish package scripts, dependency management, environment-variable validation, `.gitignore`, README, and local setup instructions.
- Configure formatting/linting and JavaScript quality checks consistent with the coding rules.
- Configure automated test commands and CI checks.
- Separate development, test, staging, and production configuration.
- Establish secure secret handling and safe local defaults.
- Add health/readiness conventions and structured logging foundations where appropriate.
- Ensure generated artifacts, credentials, local databases, and private files are not committed.
- Do not add infrastructure products without an approved reason.

### Deliverables
- Reproducible repository.
- Working install, run, lint, and test commands.
- CI baseline.
- Environment setup documentation.

### Exit gate
A clean checkout can be installed and validated using documented commands. No secrets are tracked.

## Phase 3 — Database, migration, and transaction foundation

**Goal:** establish safe persistent storage before business modules depend on it.

### Work
- Configure PostgreSQL and the approved data-access approach.
- Establish schema migration and rollback/forward-recovery conventions.
- Define primary-key, foreign-key, unique, check-constraint, index, naming, and timestamp conventions.
- Establish transaction boundaries and concurrency-control patterns.
- Define money, decimal quantity, currency, date/time, timezone, and precision rules.
- Define deletion, archival, retention, and immutable-record conventions.
- Establish test database creation, cleanup, seeding, and migration verification.
- Verify connection management and failure handling.
- Do not implement a speculative complete schema for every future module in one migration.

### Deliverables
- Working database connection.
- Migration framework and baseline schema.
- Transaction and precision conventions.
- Database test utilities and backup/restore development procedure.

### Exit gate
Migrations can be applied to a clean database; constraints and transaction tests pass; schema changes are repeatable and documented.

## Phase 4 — Backend/API foundation

**Goal:** provide a consistent and secure service boundary.

### Work
- Implement the approved API versioning and routing conventions.
- Establish request validation, response/error formats, pagination, filtering, sorting, and API documentation.
- Establish controller/application/domain/repository boundaries as required by the architecture.
- Implement centralized error handling, request correlation, structured logs, and safe diagnostics.
- Establish idempotency and concurrency conventions for operations that require them.
- Establish rate-limiting and request-size controls where appropriate.
- Ensure the frontend never accesses the database directly.
- Establish API integration-test patterns.

### Deliverables
- Versioned API skeleton.
- Standard error/validation behavior.
- API documentation baseline.
- Backend integration-test harness.

### Exit gate
Representative success, validation-failure, authorization-failure, conflict, and server-error cases behave consistently and are tested.

## Phase 5 — Authentication and session lifecycle

**Goal:** establish identity safely without confusing authentication with authorization.

### Work
- Implement approved sign-in, sign-out, session/token lifecycle, credential protection, and account-state handling.
- Add secure password reset and verification flows if specified.
- Establish session revocation, expiry, refresh/rotation behavior, and brute-force protections as appropriate.
- Protect secrets and sensitive authentication responses.
- Test unauthenticated, expired, revoked, and invalid sessions.
- Do not use frontend route hiding as the security boundary.

### Deliverables
- Authentication services and UI.
- Session lifecycle and account recovery flows in scope.
- Security tests and operational guidance.

### Exit gate
Authentication and session lifecycle tests pass, including invalid and revoked access. Business authorization remains a separate enforcement layer.

## Phase 6 — Organizations, tenant context, and isolation

**Goal:** make multi-organization support foundational, not retrofitted.

### Work
- Implement organization/company/branch/location structures required by the approved model.
- Establish organization membership and active-organization selection.
- Propagate trusted tenant context through requests, services, jobs, and data access.
- Define the approved data-isolation strategy and enforce it at the server/data-access boundary.
- Test cross-tenant reads, writes, exports, search, files, jobs, caches, and background tasks.
- Establish organization lifecycle, invitations, and onboarding only to the extent specified and approved.
- Ensure tenant context cannot be trusted merely because a client supplied an ID.

### Deliverables
- Tenant-aware organization model.
- Tenant context services and data-access safeguards.
- Cross-tenant security test suite.

### Exit gate
Automated negative tests prove that one tenant cannot read or mutate another tenant's protected data through APIs, background work, search, exports, or file access in the tested scope.

## Phase 7 — Authorization, roles, permissions, and governance

**Goal:** enforce permissions consistently across all server-side operations.

### Work
- Implement roles, permissions, scopes, effective permission evaluation, and default-deny behavior.
- Enforce tenant, organization, branch, record, and action scope as specified.
- Implement permission checks at APIs and business-operation boundaries.
- Implement segregation-of-duties and maker-checker rules needed for privileged/high-risk actions.
- Define delegation, temporary grants, access review, and break-glass behavior if in scope.
- Build permission-aware navigation and UI only as a usability layer on top of server enforcement.
- Test direct API calls, privilege escalation, scope changes, self-approval, and revoked permissions.

### Deliverables
- Authorization service and permission model.
- Role/permission administration capabilities in the approved scope.
- Authorization and tenant-scope tests.

### Exit gate
The test suite proves default-deny behavior and enforces permissions on direct requests—not only in the UI.

## Phase 8 — Shared frontend shell and design system

**Goal:** establish a coherent application experience before implementing many module screens.

### Work
- Implement the approved app shell, navigation, organization context, page layout, and route protection.
- Build reusable components using the specified JavaScript/React stack and custom CSS.
- Establish design tokens, typography, spacing, forms, tables, dialogs, feedback, loading/empty/error states, and responsive patterns.
- Implement the approved theme mechanism and ensure theme changes do not alter business behavior.
- Address keyboard use, focus management, semantic structure, reduced motion, and accessibility.
- Ensure loading, permission-denied, empty, validation, offline, and error states are designed—not just success states.
- Avoid building every screen before reusable patterns are verified.

### Deliverables
- Shared application shell.
- Core component library.
- Design tokens and theme infrastructure.
- Responsive/accessibility checks.

### Exit gate
Representative pages work across supported screen sizes, keyboard navigation, themes, and common UI states.

## Phase 9 — Shared platform services

**Goal:** create reusable cross-module capabilities required by subsequent workflows.

### Work
- Implement audit/activity logging with actor, tenant, target, timestamp, and outcome context as specified.
- Implement configuration/feature-flag conventions.
- Implement document/file metadata, access checks, upload validation, and storage abstraction where in scope.
- Implement notification delivery abstractions and in-app notification foundations.
- Implement background-job conventions, retries, idempotency, failure visibility, and safe reprocessing.
- Establish domain-event/outbox patterns only as required by the approved architecture.
- Implement common numbering, reference generation, and status-transition helpers where specified.
- Establish shared import/export and search foundations when their prerequisites are clear.

### Deliverables
- Shared service interfaces and implementations.
- Security and reliability tests for shared services.
- Developer documentation for module reuse.

### Exit gate
At least one approved vertical slice demonstrates the shared services end-to-end; reusable behavior is not duplicated in each module.

## Phase 10 — Configuration and customization foundation

**Goal:** enable safe, governed configuration without allowing customization to bypass security or business integrity.

### Work
- Implement the approved configuration hierarchy and validation.
- Establish custom fields and metadata-driven forms only according to the customization specification.
- Define safe customization versioning, validation, rollback, and audit.
- Implement module enablement and feature flags with dependency validation.
- Define how labels, numbering, statuses, menus, and business rules are configured.
- Ensure custom fields and configuration respect tenant isolation, access controls, reporting, and API validation.
- Defer advanced no-code workflow/form builders until their platform dependencies are stable.

### Deliverables
- Initial configuration/customization engine.
- Versioning and validation rules.
- Configuration security tests.

### Exit gate
A representative configuration change can be validated, audited, safely applied, and reversed or recovered without bypassing authorization or integrity constraints.

## Phase 11 — Master data and shared business primitives

**Goal:** create the common records that business workflows depend on.

### Work
- Implement product/service master data, categories, units of measure, attributes, identifiers/barcodes, and pricing foundations as specified.
- Implement customers and suppliers at the level needed for dependent workflows.
- Implement currency/tax/reference data only to the approved scope and legal configuration requirements.
- Establish organization/branch ownership and access scope.
- Validate imports, duplicate handling, search, and audit behavior.
- Avoid creating separate conflicting customer, supplier, or product concepts in every module.

### Deliverables
- Master-data workflows and APIs.
- Validated core entities and relationships.
- Import/search and audit tests for in-scope entities.

### Exit gate
Master data can be created, updated, searched, scoped, and audited with validated relationships and permissions.

## Phase 12 — Inventory and warehouse foundation

**Goal:** implement inventory as a transaction-driven domain.

### Work
- Implement warehouses, locations/bins if specified, stock balances derived or maintained consistently from the authoritative transaction model, and stock movement records.
- Implement receipts, issues, transfers, reservations, adjustments, batches/lots, serial numbers, expiry, and valuation only according to the approved inventory scope.
- Establish atomic posting, concurrency control, idempotency, reversal/correction, and audit behavior.
- Define negative-stock policy and permissions explicitly.
- Implement inventory history and reconciliation checks.
- Test simultaneous stock operations and failed/partial transactions.

### Deliverables
- Inventory movement/posting services.
- Warehouse and stock workflows in scope.
- Reconciliation and concurrency test suite.

### Exit gate
Stock cannot be silently changed through an arbitrary balance edit; ledger/balance consistency, authorization, concurrency, and reversal tests pass.

## Phase 13 — Purchasing, procurement, and supplier workflows

**Goal:** implement procurement with traceable receipt and financial handoff.

### Work
- Implement purchase requests/orders and approval paths as specified.
- Implement supplier terms and supplier records required by purchasing.
- Implement goods receipt and discrepancies, including the inventory handoff.
- Define cancellation, partial receipt, return, and correction rules.
- Establish the future accounts-payable/accounting integration contract without faking the downstream module.
- Test approval enforcement, duplicate submissions, partial completion, and audit trail.

### Deliverables
- Purchase-to-receipt workflow.
- Supplier/procurement APIs and UI.
- Cross-module integration tests for inventory handoff.

### Exit gate
Approved purchase flows produce correct, auditable stock effects exactly once and expose clear statuses and exceptions.

## Phase 14 — Sales, customer, order, and returns workflows

**Goal:** implement sales operations and their inventory/customer handoffs.

### Work
- Implement quotations, orders, fulfillment/delivery states, customer pricing, discounts, and sales documents as specified.
- Implement returns, exchanges, cancellations, and credit/adjustment paths.
- Enforce approval and discount limits.
- Define posting boundaries and idempotency for stock and future finance effects.
- Test partial fulfillment, invalid transitions, concurrent updates, and permission failures.

### Deliverables
- Sales and customer workflows in the approved scope.
- Inventory integration.
- Sales lifecycle and return tests.

### Exit gate
Sales state transitions and inventory effects are correct, auditable, permission-controlled, and tested.

## Phase 15 — POS and payment workflow

**Goal:** deliver a reliable point-of-sale workflow on top of the established master-data, inventory, customer, and sales foundations.

### Work
- Implement register/session and cash-drawer concepts if specified.
- Implement barcode lookup, cart, price/discount/tax calculations, payment methods, receipts, suspended sales, returns/refunds/exchanges, and cash reconciliation as specified.
- Make posting atomic or use the approved recoverable transaction pattern across affected records.
- Use idempotency for payment/checkout requests and handle timeouts/duplicate submissions safely.
- Define external payment-provider boundaries without pretending a provider is connected.
- Design offline POS only after the authoritative online transaction and synchronization rules are established; explicitly distinguish permitted offline actions from server-authoritative actions.
- Test price changes, tax/discount edge cases, duplicate payment callbacks, stock races, refund controls, and recovery.

### Deliverables
- End-to-end POS workflow.
- Receipt and cash-session behavior in scope.
- Payment/checkout recovery and integration tests.

### Exit gate
Checkout cannot produce duplicate business effects; stock, sale, payment state, receipts, and audit records reconcile under tested success and failure scenarios.

## Phase 16 — Accounting and financial foundations

**Goal:** introduce financial posting with controlled, traceable accounting semantics.

### Work
- Implement the approved chart of accounts, fiscal periods, journals, double-entry posting, posting validation, and period controls.
- Establish immutable posted records and reversal/adjustment/correction flows.
- Implement receivables, payables, cash/banking, expenses, tax, budgets, and reconciliation in dependency order according to the module specifications.
- Integrate purchasing, sales, POS, and inventory through explicit posting contracts.
- Establish decimal precision, currency handling, rounding, and reporting reconciliation rules.
- Test balanced journals, closed periods, duplicate postings, concurrent posting, reversal, and cross-module reconciliation.
- Do not claim full accounting compliance without jurisdictional and business-specific validation.

### Deliverables
- Accounting posting engine and core ledger.
- In-scope finance modules.
- Reconciliation reports and financial-integrity tests.

### Exit gate
Financial postings are balanced and auditable, duplicate postings are prevented, posted history is corrected through approved mechanisms, and cross-module totals reconcile.

## Phase 17 — Workflow, approvals, and business-rule engine

**Goal:** enable configurable business processes without bypassing module invariants.

### Work
- Implement workflow definitions, versions, status transitions, approval assignments, delegation, escalation, and rejection/return paths according to the specification.
- Implement maker-checker and segregation-of-duties rules for applicable operations.
- Ensure a workflow configuration cannot grant permissions or bypass domain validation.
- Integrate workflows into purchase, sales, finance, HR, and other modules as they become available.
- Test workflow changes during in-flight records, unauthorized transitions, self-approval, and failed notification delivery.

### Deliverables
- Workflow/approval engine.
- Versioning and transition safeguards.
- Cross-module approval tests.

### Exit gate
Only authorized transitions occur, workflow versions behave predictably, and business rules remain enforced independently of workflow configuration.

## Phase 18 — HR, employee, attendance, leave, payroll, and related administration

**Goal:** implement people-management modules after access, audit, and financial foundations are dependable.

### Work
- Implement employee records and scoped access.
- Implement attendance, leave, shifts, and payroll in the specified dependency order.
- Enforce sensitive-data permissions, approvals, audit, retention, and export controls.
- Integrate payroll posting with accounting through defined contracts.
- Test payroll calculations against approved examples, period locks, corrections, access segregation, and duplicate posting.
- Keep jurisdiction-specific payroll/tax assumptions explicit and configurable where required.

### Deliverables
- Approved HR submodules and cross-module accounting handoff.
- Sensitive-data security tests.
- Payroll validation evidence.

### Exit gate
Sensitive HR data is scoped and protected, payroll calculations are verified against approved rules, and financial posting reconciles.

## Phase 19 — Manufacturing, BOM, production planning, and quality

**Goal:** implement production capabilities on top of inventory, purchasing, and financial primitives.

### Work
- Implement bills of materials, versions, work orders, production consumption/output, planning, and quality workflows according to module specifications.
- Define scrap, yield, substitutions, batch/serial traceability, and cost behavior where specified.
- Integrate material reservations, stock movement, and accounting through explicit transactions.
- Test partial production, rework, quality rejection, material shortage, and concurrent reservations.

### Deliverables
- Manufacturing/MRP workflows in scope.
- Production and inventory integration.
- Traceability and costing tests.

### Exit gate
Production movements are auditable and reconciled, and failed/reversed operations do not silently lose material or production history.

## Phase 20 — Extended operational modules

**Goal:** add the remaining approved operational modules in dependency order.

Potential subphases include:
- supply chain and logistics;
- delivery, fleet, and shipment tracking;
- assets and maintenance;
- projects, tasks, contracts, and time/expense;
- service management, help desk, and appointments;
- marketing and commerce/e-commerce integration;
- document-management extensions;
- remaining administration and configuration capabilities.

For each module, create a separate phase plan from the approved module specification. Do not implement all modules as one undifferentiated batch.

### Exit gate
Each module passes its own acceptance criteria and its cross-module integration tests before being marked complete.

## Phase 21 — Industry template and extension delivery

**Goal:** validate the platform's multi-industry promise using reusable templates rather than hard-coded separate products.

### Work
- Finalize the core-versus-industry extension boundary.
- Implement template packaging, versioning, installation, validation, update, conflict handling, and migration behavior.
- Select a small, explicitly approved pilot set of industries based on product priorities and available workflows.
- Validate each pilot industry against its module matrix, terminology, configuration, workflow, roles, reports, dashboards, and acceptance criteria.
- Ensure industry templates cannot weaken tenant isolation, permissions, financial rules, or inventory rules.
- Add remaining industry templates incrementally, with their own tests and release gates.

### Deliverables
- Industry-template engine and package conventions.
- Approved pilot industry packs.
- Industry regression suite and process for adding future packs.

### Exit gate
At least the approved pilot industries are demonstrably configurable on the shared core, and adding a template does not fork or weaken core business logic.

## Phase 22 — Reporting, analytics, search, and command center

**Goal:** provide trusted, permission-aware access to operational and analytical information.

### Work
- Implement reusable reporting/query conventions and permission-aware filtering.
- Validate reports against authoritative business transactions and accounting balances.
- Implement dashboards, KPIs, saved views, exports, and large-report processing as specified.
- Implement global search and command-center actions with tenant and permission filtering.
- Ensure exports and background report jobs preserve access controls at execution and download time.
- Test reconciliation, large datasets, pagination, export authorization, and stale/cache behavior.

### Deliverables
- Core reporting and BI capabilities.
- Search and command-center capabilities in approved scope.
- Reconciliation and access-control tests.

### Exit gate
Reports reconcile to source-of-truth records; unauthorized rows and actions are not exposed through search, dashboards, exports, or asynchronous jobs.

## Phase 23 — Integrations, notifications, and automation hardening

**Goal:** connect external systems through governed, observable boundaries.

### Work
- Implement provider abstractions and configuration/secrets handling.
- Add only integrations that are explicitly prioritized and whose provider credentials/contracts are available.
- Implement webhook verification, idempotent processing, retry policies, replay protection, error queues, and integration monitoring as specified.
- Verify notification preferences, templates, delivery state, and failure handling.
- Ensure external systems cannot bypass domain validation, approval, tenant isolation, accounting, inventory, or audit.
- Test timeouts, duplicate callbacks, invalid signatures, provider outages, and recovery.

### Deliverables
- Approved integrations and notification channels.
- Operational monitoring and recovery procedures.
- Integration contract tests.

### Exit gate
Each enabled integration has verified authentication, authorization, replay/duplicate handling, failure recovery, audit, and support guidance.

## Phase 24 — Offline capability and synchronization

**Goal:** deliver selective offline workflows only where business safety permits them.

### Work
- Choose explicitly approved offline-capable workflows.
- Implement local storage and queue behavior according to the approved architecture.
- Define offline authentication/device trust, data minimization, encryption where required, expiry, revocation, and local-data clearing.
- Implement sync identity, idempotency, retry, ordering, conflict detection/resolution, and visible failure states.
- Keep server-authoritative actions server-authoritative; do not silently finalize high-risk financial/inventory actions offline unless the approved specification explicitly defines a safe model.
- Test duplicate sync, out-of-order events, device revocation, conflict resolution, connectivity loss, and recovery.

### Deliverables
- Approved offline workflows.
- Synchronization service and diagnostics.
- Conflict, security, and recovery tests.

### Exit gate
Offline actions have explicit authority rules, recoverable synchronization, visible conflicts, and no silent data loss in tested scenarios.

## Phase 25 — AI and governed automation

**Goal:** add AI as a controlled assistant, not as an authority over business data.

### Work
- Implement only approved AI use cases with measurable business value.
- Use permission-aware, allowlisted application tools; no direct database access, arbitrary SQL, arbitrary shell, or unrestricted code execution.
- Validate all AI-proposed actions through normal authorization, domain validation, approval, transaction, and audit paths.
- Protect tenant data and sensitive information in prompts, retrieval, logs, and provider integrations.
- Require confirmation/approval for consequential actions as specified.
- Test prompt injection, unauthorized data retrieval, cross-tenant leakage, malformed outputs, provider outage, and unsafe action proposals.

### Deliverables
- Approved AI use cases.
- Tool allowlist and governance rules.
- Security and behavior evaluation suite.

### Exit gate
AI cannot bypass existing business rules or permissions, and unsafe/incorrect outputs fail safely.

## Phase 26 — Mobile/API ecosystem readiness

**Goal:** prepare or deliver mobile capabilities according to the approved priority, without duplicating backend business logic.

### Work
- Verify API contracts, authentication, device/session management, permissions, and mobile-compatible workflows.
- Decide whether actual mobile application implementation is in scope for the current release or remains future work.
- If approved, implement mobile capabilities in a separate sequenced plan using the shared backend.
- Test device loss/revocation, offline boundaries, synchronization, accessibility, and supported device sizes.

### Deliverables
- Mobile-readiness report or approved mobile release.
- Shared API contract tests and device-security tests.

### Exit gate
Mobile is either explicitly deferred with its API dependencies documented or released against verified shared business services.

## Phase 27 — Security, performance, accessibility, and resilience hardening

**Goal:** validate the integrated platform under realistic failure and workload conditions.

### Work
- Run threat modeling and security review across authentication, authorization, tenant isolation, files, exports, integrations, offline, and AI.
- Run dependency and secret scans, static checks, and applicable dynamic security tests.
- Test performance, query plans, indexes, pagination, caching, background jobs, and large reports.
- Test accessibility and responsive behavior across representative workflows.
- Test backup restoration, migration recovery, rollback/forward-fix, disaster-recovery assumptions, and operational alerts.
- Verify retention, deletion, archival, and data export controls.
- Fix critical/high-severity issues before release.

### Deliverables
- Security and performance findings.
- Accessibility and resilience reports.
- Verified backup/restore and release procedures.

### Exit gate
No unresolved release-blocking issue remains; acceptance thresholds are agreed, measured, and documented.

## Phase 28 — Staging, pilot, and production release

**Goal:** release in a controlled manner with observable business outcomes and recovery capability.

### Work
- Provision the approved staging/production environments.
- Validate environment separation, secrets, TLS, access policies, backups, alerts, logging, and operational runbooks.
- Run production-like migrations and smoke/regression tests.
- Perform pilot onboarding and approved end-to-end business scenarios.
- Verify support, incident response, restore, rollback, and release communication.
- Use feature flags and staged rollout where appropriate.
- Monitor actual outcomes and fix defects before expanding access.

### Deliverables
- Release candidate.
- Deployment and recovery runbooks.
- Pilot/release acceptance report.
- Post-release monitoring and support plan.

### Exit gate
The release is explicitly approved, recoverable, monitored, and supported. Deployment success alone does not mean the product is business-ready.

---

## 6. Cross-cutting workstreams

These workstreams begin early and continue through all phases; they are not postponed to the final phase.

### Security and tenant isolation
Required from authentication and tenant foundations onward. Re-test after each module, integration, export, and background-job change.

### Audit and data integrity
Build audit conventions early. Each business module defines its own immutable history, correction, reversal, and reconciliation rules.

### Testing and quality
Every phase adds tests to a persistent regression suite. Avoid deferring all testing until the end.

### UI/UX and accessibility
Shared design patterns are established early; each module must meet the same standards.

### Documentation and traceability
Update API contracts, data models, ADRs, setup instructions, test instructions, and feature status whenever implementation changes them.

### Observability and operations
Logging, health checks, diagnostics, alerting, backups, and recovery mature as the system grows.

### Performance
Measure at each relevant phase; do not rely only on a final performance pass.

### Internationalization and localization
Build currency, date, timezone, number-formatting, translation, and layout conventions into the foundation. Validate industry/jurisdiction-specific behavior explicitly.

## 7. Suggested release strategy

Do not equate the whole roadmap with one release. Use verified, useful increments:

- **Foundation release:** secure application skeleton, tenant-aware identity, authorization, migrations, audit, and shared UI.
- **Core operations release:** approved master data, inventory, purchasing, sales, and POS workflows.
- **Financial release:** accounting and the required sales/purchasing/POS financial integrations, validated against approved accounting rules.
- **Operational expansion releases:** HR, manufacturing, logistics, assets, projects, service, and other prioritized modules.
- **Industry releases:** a limited approved pilot set first, then additional industry packs.
- **Advanced capability releases:** reporting/BI, integrations, selective offline, AI, and mobile according to priority and readiness.
- **Production hardening/release:** security, performance, recovery, support, and operational acceptance.

The exact scope of each release must be approved after Phase 0 and Phase 1. Do not promise dates until estimates, staffing, unknowns, and acceptance scope are assessed.

## 8. Phase planning template

Use this template for every major phase and subphase:

```markdown
# Phase [N] — [Name]

## Objective
## Business outcome
## Source requirements
- [file + section]
## Prerequisites
## In scope
## Out of scope
## Architecture and design decisions
## Database and migration changes
## API/backend changes
## Frontend/UI changes
## Security and tenant-isolation requirements
## Integrations and operational changes
## Testing strategy
## Acceptance criteria
## Evidence required
## Risks and open decisions
## Rollback/recovery
## Documentation updates
## Deliverables
## Exit gate
## Completion report
```

## 9. Phase completion report template

At the end of each phase, the coding agent must report:

1. Phase status and whether it is blocked, implemented, verified, or ready for approval.
2. Requirements completed, with source references.
3. Files created/changed and why.
4. Database migrations and rollback/recovery notes.
5. Tests run, exact commands, and results.
6. Security and tenant-isolation checks performed.
7. Known limitations, skipped items, and unresolved decisions.
8. Manual verification still required.
9. Any changes to the roadmap or architecture and their approval status.
10. Recommendation for the next phase.

The agent must never claim a test passed if it did not run it, or claim a feature is complete if it is only a placeholder.

## 10. What must happen immediately

The next step is **Phase 0 only**:

1. Compare `00-MASTER-INSTRUCTIONS.md` with `00-MASTER-INSTRUCTIONS-enhanced.md`.
2. Verify the PRD PDF and Markdown copy.
3. Audit all document references and the actual file set.
4. Confirm whether separate module and industry files exist elsewhere.
5. Produce the requirements traceability matrix, conflict register, and dependency graph.
6. Present unresolved decisions for approval.
7. Stop before broad implementation until the Phase 0 report is reviewed.

Do not create a new project name. Do not begin Phase 1 or scaffold/overwrite an existing application until the user approves the audit outcome and the next phase.
