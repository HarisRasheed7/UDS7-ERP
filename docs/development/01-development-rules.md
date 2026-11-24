# DEVELOPMENT RULES

## Professional ERP & Business Management Platform

**Document:** `development/01-development-rules.md`
**Status:** Development Standard
**Version:** 1.0
**Purpose:** Define the mandatory engineering and implementation rules that govern development of the platform.

---

# 1. DOCUMENT PURPOSE

This document defines the development rules that every developer, contributor, automation system, code-generation system, and future development team member must follow when building or modifying the platform.

These rules translate the platform's architecture, product requirements, security requirements, module specifications, feature specifications, customization model, workflow model, and operational requirements into practical development constraints.

This document is an implementation standard.

It is not intended to replace:

* Product Requirements
* System Architecture
* Data Model
* API Specification
* Module Specification
* Feature Specification
* Security Specification
* Workflow Specification
* Customization Specification

Instead, it explains **how those specifications must be implemented in code**.

---

# 2. DEVELOPMENT STATUS

This document is mandatory for development.

A feature must not be considered correctly implemented merely because:

* the UI exists;
* the API returns data;
* the database table exists;
* CRUD operations work;
* the feature works in one happy-path scenario.

A professional feature must satisfy all applicable layers:

```text
Requirement
    ↓
Domain Model
    ↓
Database
    ↓
Application Services
    ↓
Authorization
    ↓
Business Rules
    ↓
Workflow / Approval
    ↓
API
    ↓
UI
    ↓
Audit
    ↓
Notifications
    ↓
Reporting
    ↓
Offline / Sync
    ↓
Testing
```

Not every feature requires every layer, but every applicable layer must be intentionally addressed.

---

# 3. SOURCE-OF-TRUTH HIERARCHY

When implementing functionality, developers must use the project documentation as the source of truth.

The general priority is:

```text
1. Explicit approved product requirement
2. Product Requirements Specification
3. System Architecture
4. Module Specification
5. Feature Specification
6. Data Model
7. API Specification
8. Workflow & Approval Specification
9. Customization Specification
10. Security Specification
11. Development Rules
12. Implementation details
```

If implementation details conflict with an approved requirement, the implementation must be changed.

Existing code must not automatically be treated as the correct specification.

Legacy behavior must be reviewed against current requirements before being preserved.

---

# 4. STRICT REQUIREMENT ALIGNMENT

Development must remain strictly aligned with the approved product scope.

Developers must not independently expand the platform by adding unrelated functionality merely because it appears useful.

Before introducing a new capability, determine:

* Is it explicitly required?
* Is it part of an approved module?
* Is it required by another approved feature?
* Is it a necessary technical dependency?
* Is it an approved extensibility mechanism?
* Is it explicitly marked as future functionality?

If none apply, the functionality must not be added without approval.

---

# 5. NO SCOPE CREEP

The platform is intended to become a large enterprise system, but development must remain controlled.

Do not introduce:

* random ERP features;
* unrelated SaaS features;
* unnecessary social features;
* unrelated collaboration systems;
* arbitrary AI functionality;
* unnecessary microservices;
* unnecessary infrastructure;
* experimental libraries without justification;
* duplicate systems;
* undocumented business logic.

Future capabilities may be represented through:

* extension points;
* configuration;
* interfaces;
* module boundaries;
* feature flags;
* integration adapters;
* documented future extensions.

Future functionality must not be silently implemented as active core functionality.

---

# 6. TECHNOLOGY RULES

The current development stack is mandatory unless officially changed.

## 6.1 Frontend

Use:

* React
* Next.js where applicable
* JavaScript
* Custom CSS
* approved UI/component architecture

Do not introduce:

* TypeScript
* Tailwind CSS
* arbitrary CSS frameworks
* uncontrolled component libraries
* duplicated styling systems

### TypeScript prohibition

The current platform is intentionally specified for JavaScript.

Do not convert:

```text
.js
.jsx
```

into:

```text
.ts
.tsx
```

without an explicit project-level technology decision.

---

# 7. NO TAILWIND CSS

The design system uses custom CSS and design tokens.

Do not introduce Tailwind CSS.

Styling must use the project's defined:

* CSS architecture;
* design tokens;
* theme variables;
* component styles;
* responsive rules;
* semantic colors;
* spacing system;
* typography system;
* motion system.

Do not create isolated visual systems inside individual modules.

---

# 8. BACKEND TECHNOLOGY RULES

Backend development must remain JavaScript-based.

The backend must use clear separation between:

```text
Routes
    ↓
Controllers
    ↓
Application Services
    ↓
Domain Logic
    ↓
Repositories
    ↓
Database
```

A route must not become the location for all business logic.

A controller must not directly implement complex domain behavior.

A frontend component must never directly access the database.

---

# 9. MODULAR ARCHITECTURE

The platform must be developed as a modular system.

Modules must have clearly defined:

* responsibilities;
* entities;
* services;
* APIs;
* permissions;
* workflows;
* events;
* dependencies;
* integration points.

A module must not casually access another module's internal implementation.

Prefer:

```text
Module A
    ↓
Public Application Service / API
    ↓
Module B
```

over:

```text
Module A
    ↓
Module B private database/service internals
```

---

# 10. MODULAR MONOLITH FIRST

The initial platform architecture should remain a modular monolith unless there is a documented reason to introduce separate services.

Do not split functionality into microservices merely because the platform is large.

The codebase must first achieve:

* strong module boundaries;
* clear application services;
* domain separation;
* repository separation;
* event boundaries;
* API boundaries;
* background job boundaries.

These boundaries should allow future extraction if required.

---

# 11. FEATURE OWNERSHIP

Every feature must have a clearly identifiable owning module.

For example:

```text
Stock Transfer
→ Inventory Management

Customer Credit
→ Accounts Receivable

Supplier Bill
→ Accounts Payable

Employee Leave
→ Attendance & Leave

Production Order
→ Production Planning
```

Cross-module behavior must be coordinated through defined services/events/workflows.

Do not duplicate ownership.

---

# 12. SINGLE SOURCE OF BUSINESS LOGIC

Business rules must not be duplicated across:

* React components;
* API routes;
* controllers;
* background jobs;
* reports;
* integrations;
* offline clients.

Business logic should live in the appropriate application/domain layer.

For example:

```text
UI
 ↓
API
 ↓
Application Service
 ↓
Domain Rule
```

The same rule must not be rewritten independently in multiple locations.

---

# 13. FRONTEND/BACKEND SEPARATION

The frontend is responsible for:

* presentation;
* user interaction;
* local UI state;
* client-side validation;
* user feedback;
* navigation;
* permission-aware rendering.

The backend is responsible for:

* authentication;
* authorization;
* tenant isolation;
* business rules;
* transaction integrity;
* database access;
* authoritative validation;
* workflow enforcement;
* audit;
* security.

Client-side validation improves UX.

It never replaces server-side validation.

---

# 14. NEVER TRUST THE CLIENT

The server must assume that every client request may be malicious or incorrect.

Never trust:

* user IDs;
* organization IDs;
* branch IDs;
* permission values;
* prices;
* quantities;
* tax values;
* account IDs;
* warehouse IDs;
* approval states;
* workflow states;
* role information;
* hidden fields;
* disabled UI controls.

A user hiding a button does not remove the permission requirement.

---

# 15. AUTHORIZATION IS SERVER-SIDE

Every protected operation must be authorized on the server.

Authorization must consider, where applicable:

```text
User
Role
Permission
Organization
Company
Branch
Department
Warehouse
Location
Ownership
Record
Field
Action
Workflow state
Approval authority
```

Example:

A user seeing a "Delete" button does not mean they are allowed to delete the record.

The API must independently verify authorization.

---

# 16. DEFAULT DENY

Protected capabilities must follow:

```text
No explicit authorization
        ↓
Access denied
```

Do not design security around:

```text
Everyone can access unless explicitly blocked
```

Permissions must be granted intentionally.

---

# 17. TENANT AWARENESS

Every tenant-sensitive operation must operate inside an explicit tenant context.

The application must know:

```text
Current User
Current Organization
Current Company
Current Branch
```

where applicable.

A request must never be allowed to retrieve another organization's records merely because the attacker knows the record ID.

---

# 18. DATA OWNERSHIP

Database queries must include appropriate organizational and access scope.

Bad:

```text
SELECT * FROM invoices WHERE id = ?
```

when the record is tenant-sensitive.

Preferred conceptual approach:

```text
SELECT *
FROM invoices
WHERE id = ?
AND organization_id = ?
```

Additional scope conditions must be applied where required.

---

# 19. APPLICATION SERVICE RULE

Application services are responsible for orchestrating business operations.

For example:

```text
createSale()
completeSale()
returnSale()
receivePurchase()
transferStock()
postJournal()
approveExpense()
approvePurchaseOrder()
processPayroll()
```

An application service may coordinate:

* authorization;
* validation;
* domain rules;
* repositories;
* transactions;
* workflows;
* events;
* audit;
* notifications.

---

# 20. DOMAIN INTEGRITY

Core business entities must maintain their invariants.

Examples:

### Inventory

Stock cannot become inconsistent merely because a client submits:

```text
quantity = -999999
```

### Accounting

A journal entry must satisfy:

```text
Total Debits = Total Credits
```

### Approval

A user cannot approve their own transaction when maker-checker rules prohibit it.

### Tenant Isolation

A record belonging to organization A cannot be modified by organization B.

---

# 21. FINANCIAL DATA RULES

Financial data is high-integrity data.

Do not implement financial records as ordinary CRUD.

Do not allow arbitrary mutation of posted financial records.

Use mechanisms such as:

* reversal;
* adjustment;
* correcting journal;
* compensating transaction;
* controlled cancellation;
* period-aware correction.

Every financial posting must be:

* authorized;
* validated;
* auditable;
* transaction-safe;
* traceable.

---

# 22. INVENTORY INTEGRITY RULES

Inventory quantity must not be treated as an arbitrary editable number.

Inventory should be derived or controlled through stock movements such as:

* receipt;
* issue;
* transfer;
* adjustment;
* return;
* reservation;
* production consumption;
* production output;
* count reconciliation.

Every material stock change must have a traceable reason and source transaction.

---

# 23. TRANSACTION BOUNDARIES

Operations that must remain consistent must execute within appropriate database transactions.

Example:

```text
Complete Sale
    ↓
Create Sale
    ↓
Create Sale Lines
    ↓
Reduce Inventory
    ↓
Create Payment
    ↓
Create Accounting Entries
    ↓
Write Audit
```

If required operations cannot safely complete together, the system must not leave the database in a partially committed state.

Use explicit compensation patterns where distributed operations are unavoidable.

---

# 24. IDEMPOTENCY

Operations that may be retried must be designed for idempotency.

This is particularly important for:

* payments;
* webhooks;
* integrations;
* offline synchronization;
* imports;
* background jobs;
* external API calls.

Repeated requests must not accidentally create duplicate financial or inventory transactions.

---

# 25. CONCURRENCY CONTROL

Assume that multiple users, devices, tabs, jobs, or integrations may operate on the same data.

Use appropriate:

* database constraints;
* transactions;
* row locking;
* optimistic concurrency;
* version numbers;
* unique keys;
* idempotency keys.

Do not assume:

```text
Only one user will edit this record.
```

---

# 26. VALIDATION RULES

Validation must exist at multiple levels.

## Client validation

Used for:

* immediate feedback;
* required fields;
* formatting;
* obvious invalid input;
* usability.

## Server validation

Used for:

* authoritative validation;
* authorization;
* business rules;
* data integrity.

## Database validation

Used for:

* constraints;
* uniqueness;
* relationships;
* required values;
* critical invariants.

No single validation layer is sufficient by itself.

---

# 27. ERROR HANDLING

Errors must be intentional and actionable.

Do not expose:

* database stack traces;
* internal file paths;
* SQL statements;
* secrets;
* internal infrastructure details;
* authentication internals.

Users should receive meaningful messages.

Developers should receive detailed diagnostic information through secure logs.

---

# 28. STANDARD ERROR CATEGORIES

Errors should be distinguishable conceptually as:

```text
Validation Error
Authentication Error
Authorization Error
Not Found
Conflict
Business Rule Violation
Concurrency Conflict
Rate Limit
Integration Failure
System Failure
```

The API must use appropriate HTTP status codes.

---

# 29. LOGGING RULES

Logs must support diagnosis without becoming a security risk.

Important operations should include:

* timestamp;
* request/correlation ID;
* actor;
* organization;
* action;
* module;
* result;
* relevant entity;
* error category.

Never log:

* passwords;
* authentication secrets;
* private tokens;
* encryption keys;
* unnecessary personal data;
* sensitive financial information unless explicitly required and protected.

---

# 30. AUDIT REQUIREMENT

Important business operations must be auditable.

Audit records should capture, where applicable:

```text
Actor
Organization
Timestamp
Action
Entity
Entity ID
Previous State
New State
Source
IP
Device
Request ID
Operation ID
Reason
```

Audit logging must not depend solely on frontend behavior.

---

# 31. NO DESTRUCTIVE SHORTCUTS

Do not solve difficult business problems by deleting data.

Examples:

Do not:

```text
DELETE posted journal
```

when the correct solution is a reversal.

Do not:

```text
DELETE stock movement
```

when the correct solution is a correcting movement.

Do not:

```text
DELETE audit history
```

to hide an error.

Deletion must follow the entity's defined lifecycle.

---

# 32. SOFT DELETE AND ARCHIVAL

Soft deletion should be used only where appropriate.

Do not automatically add:

```text
deleted_at
```

to every table without considering the business meaning.

Some data should instead be:

* archived;
* deactivated;
* cancelled;
* closed;
* reversed;
* retained permanently.

Financial and audit records require special treatment.

---

# 33. CUSTOMIZATION OVER HARDCODING

The platform is intended to support multiple industries.

Where behavior is legitimately configurable, prefer:

```text
Configuration
+
Templates
+
Metadata
+
Rules
+
Workflows
```

over hardcoded industry-specific branches.

Avoid patterns such as:

```javascript
if (businessType === "restaurant") {
   ...
} else if (businessType === "pharmacy") {
   ...
} else if (businessType === "garment") {
   ...
}
```

when the behavior should actually be represented through configuration.

Hardcoded domain logic is appropriate when the underlying business invariant is universal.

---

# 34. INDUSTRY NEUTRALITY

Core entities should remain industry-neutral where possible.

Industry-specific behavior should preferably be provided through:

* industry templates;
* optional modules;
* configurable fields;
* workflows;
* statuses;
* business rules;
* document templates;
* terminology;
* dashboards;
* reports;
* integrations.

Do not create completely separate applications for each industry unless explicitly required.

---

# 35. REUSABLE COMPONENTS

Common functionality must use reusable components.

Examples:

```text
DataTable
Form
Modal
Drawer
ConfirmationDialog
SearchBar
FilterBar
DatePicker
Select
MultiSelect
Tabs
Timeline
StatusBadge
MetricCard
FileUploader
DocumentViewer
NotificationCenter
CommandPalette
PermissionGate
```

A developer should not recreate the same component independently in every module.

---

# 36. UI CONSISTENCY

All modules must use the shared design system.

Do not introduce:

* unrelated colors;
* random spacing;
* inconsistent buttons;
* arbitrary typography;
* unrelated form patterns;
* different table behavior;
* random modal behavior.

The application must feel like one professional platform.

---

# 37. BUSINESS LOGIC MUST NOT LIVE IN UI

Avoid:

```text
React component
    ↓
complex accounting calculation
    ↓
database mutation
```

Preferred:

```text
React
    ↓
API
    ↓
Application Service
    ↓
Domain Logic
    ↓
Repository
```

The UI should request operations rather than become the source of business truth.

---

# 38. API-FIRST DEVELOPMENT

Features that require server persistence should be designed around an API contract.

Before implementing the UI, determine:

* resource;
* actions;
* request structure;
* response structure;
* validation;
* permissions;
* errors;
* pagination;
* concurrency;
* audit;
* workflow;
* offline behavior.

The frontend must not invent undocumented backend behavior.

---

# 39. API CONTRACT STABILITY

Once an API is used by multiple clients, changes must be backward compatible where possible.

Do not silently rename or remove:

* fields;
* endpoints;
* status values;
* permissions;
* response structures.

Breaking changes require:

* versioning;
* migration;
* compatibility planning;
* documentation.

---

# 40. OFFLINE DEVELOPMENT RULES

Offline capability must be explicitly designed.

Do not assume:

```text
Offline = cache everything
```

Instead classify operations:

```text
Offline-safe
Offline-draft
Offline-queueable
Online-required
```

Each module must define which operations belong to each category.

---

# 41. OFFLINE DATA SAFETY

Offline clients may contain sensitive data.

Therefore:

* minimize locally stored sensitive data;
* protect local storage;
* partition data by organization;
* expire unnecessary cached data;
* clear data on logout where required;
* protect local queues;
* use operation IDs;
* maintain sync state;
* detect conflicts.

Offline data must never weaken tenant isolation.

---

# 42. OFFLINE MUTATION QUEUES

Queued operations must have deterministic states.

Example:

```text
pending
syncing
succeeded
failed
conflict
blocked
cancelled
```

Queued operations must preserve dependency order.

Example:

```text
Create Customer
      ↓
Create Sale
      ↓
Create Payment
```

The sale cannot be synchronized before its required customer dependency exists.

---

# 43. SERVER AUTHORITY

Offline clients may capture operations, but the server remains authoritative when synchronization occurs unless a specific subsystem has a formally defined local authority model.

This is especially important for:

* accounting;
* inventory;
* financial posting;
* permissions;
* approvals.

---

# 44. WORKFLOW DEVELOPMENT

Workflow behavior must not be hidden inside UI components.

Workflow logic belongs in controlled backend services.

Workflows must support, where applicable:

* states;
* transitions;
* conditions;
* assignments;
* approvals;
* rejection;
* escalation;
* delegation;
* deadlines;
* notifications;
* audit;
* versioning.

---

# 45. APPROVAL DEVELOPMENT

Approval requirements must be enforced server-side.

Do not allow:

```text
UI says "approved"
```

to become:

```text
database status = approved
```

without verifying:

* approver identity;
* permission;
* scope;
* authority;
* workflow state;
* approval limits;
* maker-checker;
* segregation of duties;
* concurrency.

---

# 46. AI DEVELOPMENT RULES

AI is an assistive layer.

AI must never bypass:

* authorization;
* tenant isolation;
* workflows;
* accounting controls;
* inventory controls;
* audit;
* security.

AI must not receive unrestricted:

* SQL execution;
* JavaScript execution;
* shell execution;
* database access.

AI actions must use allowlisted application tools.

Preferred:

```text
AI
 ↓
Allowed Tool
 ↓
Application Service
 ↓
Authorization
 ↓
Business Rules
 ↓
Audit
```

---

# 47. NO DIRECT AI DATABASE ACCESS

AI must never be implemented as:

```text
AI → Database
```

or:

```text
AI → arbitrary SQL
```

The safe architecture is:

```text
AI
 ↓
Tool
 ↓
Application API
 ↓
Authorization
 ↓
Domain Rules
 ↓
Repository
```

---

# 48. INTEGRATION RULES

External integrations must be isolated behind adapters.

Do not spread provider-specific logic throughout the application.

Preferred:

```text
Application
    ↓
Integration Interface
    ↓
Provider Adapter
```

Examples:

```text
PaymentProvider
BankProvider
EmailProvider
ShippingProvider
StorageProvider
OCRProvider
AIProvider
```

Provider replacement should not require rewriting the business domain.

---

# 49. BACKGROUND JOBS

Long-running operations should not block normal API requests.

Use background jobs for appropriate operations such as:

* large exports;
* report generation;
* scheduled reports;
* synchronization;
* webhook processing;
* notifications;
* OCR;
* imports;
* batch processing;
* reconciliation;
* maintenance.

Jobs must support:

* retries;
* idempotency;
* failure states;
* logging;
* monitoring;
* cancellation where appropriate.

---

# 50. FILE HANDLING

Uploaded files must be treated as untrusted input.

Validate:

* file type;
* extension;
* MIME type;
* size;
* filename;
* storage location.

Protect against:

* executable uploads;
* path traversal;
* malicious documents;
* oversized files;
* unauthorized access.

File permissions must follow application authorization.

---

# 51. DATABASE ACCESS RULE

Only appropriate backend layers may access the database.

Do not allow:

```text
React → SQL
Controller → arbitrary SQL
AI → SQL
Workflow expression → SQL
```

Database access must occur through controlled repository/data-access mechanisms.

---

# 52. QUERY SAFETY

Queries must:

* use parameterization;
* respect tenant scope;
* use appropriate indexes;
* avoid unnecessary full-table scans;
* avoid N+1 patterns;
* paginate large collections;
* respect authorization.

Never concatenate untrusted user input into SQL.

---

# 53. PERFORMANCE RULES

Performance must be considered during feature development.

Developers must avoid:

* unnecessary API calls;
* repeated database queries;
* N+1 queries;
* oversized payloads;
* rendering thousands of rows unnecessarily;
* synchronous heavy processing;
* blocking the main UI thread;
* unnecessary re-renders.

Use:

* pagination;
* caching;
* lazy loading;
* virtualization where appropriate;
* efficient queries;
* background jobs;
* appropriate indexes.

---

# 54. ACCESSIBILITY

Accessibility is part of feature completeness.

Interactive components must support:

* keyboard navigation;
* visible focus;
* meaningful labels;
* accessible names;
* appropriate semantic HTML;
* screen-reader compatibility where applicable;
* sufficient contrast;
* error identification;
* reduced-motion preferences.

Accessibility must not be added only at the end.

---

# 55. RESPONSIVE DEVELOPMENT

Features must be designed for supported viewport classes.

At minimum consider:

```text
Desktop
Laptop
Tablet
Mobile
```

Complex enterprise interfaces may adapt behavior rather than merely shrink.

For example:

```text
Desktop DataGrid
        ↓
Tablet condensed grid
        ↓
Mobile record cards / responsive detail layout
```

---

# 56. LOADING, EMPTY, ERROR AND SUCCESS STATES

Every major UI operation must intentionally handle:

```text
Loading
Success
Empty
Error
Permission Denied
Not Found
Offline
Syncing
Conflict
```

Do not leave users staring at a blank screen.

---

# 57. CONFIRMATION RULES

Confirmation must be used for destructive or high-impact actions.

Examples:

* deleting records;
* cancelling transactions;
* reversing financial entries;
* posting accounting transactions;
* completing inventory adjustments;
* changing critical settings.

Confirmation messages must clearly explain the consequence.

---

# 58. NOTIFICATION RULES

Notifications must communicate meaningful events.

Do not create notification spam.

Notifications should have:

* event;
* recipient;
* priority;
* read/unread state;
* timestamp;
* link/context;
* tenant scope;
* permission awareness.

---

# 59. DOCUMENTATION REQUIREMENT

New functionality must be documented.

Depending on feature complexity, documentation may include:

* module documentation;
* API documentation;
* database migration notes;
* configuration instructions;
* workflow documentation;
* permission documentation;
* integration documentation;
* operational notes.

Undocumented behavior should not become permanent system behavior.

---

# 60. DATABASE MIGRATION RULES

Schema changes must use controlled migrations.

Do not manually modify production schemas without a migration process.

Each migration must be:

* versioned;
* reproducible;
* reviewed;
* tested;
* reversible where practical;
* safe for existing data.

Data migrations must be considered separately from schema migrations when appropriate.

---

# 61. MIGRATION SAFETY

Before a migration:

```text
Backup
 ↓
Validate
 ↓
Test
 ↓
Apply
 ↓
Verify
```

For large production changes, use staged migration strategies.

Do not deploy code that assumes a new schema before the schema compatibility strategy has been addressed.

---

# 62. SEED DATA

Seed data must be distinguishable from production data.

Examples:

* system roles;
* default permissions;
* base configuration;
* default statuses;
* reference data.

Do not insert fake business transactions into production through ordinary seeds.

---

# 63. CONFIGURATION MANAGEMENT

Environment-specific values must not be hardcoded.

Use configuration for:

* database URLs;
* secrets;
* API keys;
* external provider settings;
* feature configuration;
* environment-specific endpoints.

Never commit secrets to source control.

---

# 64. SECRET MANAGEMENT

Secrets must:

* remain outside source code;
* be stored securely;
* be rotated where appropriate;
* have limited access;
* never appear in logs;
* never be returned through APIs.

Examples:

```text
Database passwords
JWT secrets
OAuth secrets
Encryption keys
Webhook secrets
AI provider keys
Payment provider keys
```

---

# 65. DEPENDENCY RULES

Do not add a dependency merely because it makes one small task easier.

Before adding a package, consider:

* necessity;
* maintenance;
* security;
* license;
* bundle impact;
* compatibility;
* project standards;
* long-term support.

Remove unused dependencies.

Keep dependencies updated through controlled maintenance.

---

# 66. NO DUPLICATE SYSTEMS

Before creating a new utility, component, service, or helper, search the existing codebase.

Do not create:

```text
formatCurrency()
formatMoney()
moneyFormatter()
currencyFormat()
```

for the same responsibility.

Reuse or consolidate existing functionality.

---

# 67. NAMING CONSISTENCY

Names must communicate responsibility.

Use consistent naming for:

* modules;
* components;
* services;
* repositories;
* controllers;
* routes;
* database tables;
* variables;
* functions;
* permissions;
* events.

Avoid vague names such as:

```text
helper
misc
stuff
temp
manager
data
common2
newService
```

unless the name genuinely represents the responsibility.

---

# 68. NO GIANT FILES BY DEFAULT

Large files must be decomposed when they contain multiple unrelated responsibilities.

Examples of decomposition:

```text
HugePage
    ↓
Page
 ├── Header
 ├── FilterBar
 ├── DataTable
 ├── DetailDrawer
 └── Actions
```

Backend:

```text
HugeController
    ↓
Controller
Application Service
Domain Service
Repository
Validator
```

Do not split files artificially. Split by responsibility.

---

# 69. STATE MANAGEMENT

State must have an intentional owner.

Classify state as:

```text
Local UI State
Form State
Server State
Global Application State
Session State
Offline State
```

Do not place every piece of state into a global store.

Avoid duplicated server state across multiple stores.

---

# 70. FORM DEVELOPMENT

Forms must define:

* fields;
* validation;
* defaults;
* required fields;
* permissions;
* loading state;
* error state;
* submission behavior;
* unsaved-change behavior;
* success behavior;
* accessibility.

Forms must not silently discard user input.

---

# 71. DATA TABLE DEVELOPMENT

Enterprise tables should support appropriate features such as:

* pagination;
* sorting;
* filtering;
* search;
* column visibility;
* saved views;
* bulk actions;
* selection;
* export;
* responsive behavior;
* permission-aware actions.

Do not load enormous datasets into the browser unnecessarily.

---

# 72. SEARCH DEVELOPMENT

Search must respect:

* tenant isolation;
* permissions;
* record visibility;
* archived state;
* module scope.

Global search must never become a security bypass.

---

# 73. BULK OPERATION RULES

Bulk operations must be explicitly authorized.

Examples:

* bulk update;
* bulk archive;
* bulk export;
* bulk approve;
* bulk assignment.

Bulk operations must consider:

* validation;
* partial failures;
* transaction boundaries;
* audit;
* permissions;
* performance;
* concurrency.

---

# 74. IMPORT RULES

Imports must not directly bypass business logic.

Import flow should conceptually be:

```text
Upload
 ↓
Parse
 ↓
Validate
 ↓
Preview
 ↓
Authorize
 ↓
Process
 ↓
Audit
 ↓
Report Results
```

Large imports should use background processing.

---

# 75. EXPORT RULES

Exports must respect:

* authorization;
* tenant scope;
* record scope;
* field-level visibility;
* sensitive-data rules.

Large exports should be processed asynchronously.

Export activity should be auditable where required.

---

# 76. REPORT DEVELOPMENT

Reports must not bypass domain rules.

A report must respect:

* permissions;
* tenant isolation;
* data visibility;
* financial integrity;
* filters;
* date/timezone rules.

Reports should identify their data freshness where appropriate.

---

# 77. EVENT DEVELOPMENT

Domain/application events should represent meaningful business events.

Examples:

```text
SaleCompleted
PurchaseReceived
StockTransferred
InvoicePosted
PaymentReceived
EmployeeCreated
LeaveApproved
WorkflowApproved
```

Events should not be created merely for every internal function call.

Event payloads must respect security and tenant boundaries.

---

# 78. EVENT IDEMPOTENCY

Event consumers must assume events can potentially be delivered more than once.

Consumers should use:

* event IDs;
* deduplication;
* idempotent processing;
* transaction-safe handling.

---

# 79. AUDIT VS EVENT

Do not confuse:

```text
Audit Record
```

with:

```text
Business Event
```

Audit answers:

> What happened, who did it, and what changed?

Events answer:

> What business event occurred so other systems can react?

Both may be required.

---

# 80. FEATURE FLAGS

Feature flags must be controlled and documented.

Do not leave hidden flags indefinitely.

Each flag should have:

* purpose;
* owner;
* default;
* scope;
* rollout strategy;
* removal plan.

A feature flag must not become a permanent substitute for architecture.

---

# 81. BACKWARD COMPATIBILITY

Existing data must remain safe when features evolve.

Changes must consider:

* existing records;
* existing users;
* existing permissions;
* existing workflows;
* existing integrations;
* existing reports;
* existing offline queues.

Do not assume the database is empty.

---

# 82. LEGACY DATA

Legacy or migrated data must be handled intentionally.

Migration must define:

* source;
* mapping;
* transformation;
* validation;
* error handling;
* duplicates;
* reconciliation;
* audit;
* rollback strategy.

---

# 83. TEST BEFORE COMPLETION

A feature is not complete when it merely works manually once.

At minimum, applicable features must be tested for:

* happy path;
* validation;
* authorization;
* negative cases;
* edge cases;
* concurrency;
* failure;
* recovery;
* audit;
* related module behavior.

---

# 84. CODE REVIEW

Code review must verify more than syntax.

Reviewers should consider:

```text
Requirement alignment
Architecture
Security
Authorization
Tenant isolation
Business rules
Database integrity
API correctness
UI behavior
Performance
Accessibility
Testing
Audit
Offline behavior
Documentation
```

---

# 85. NO “TEMPORARY” SECURITY BYPASSES

Never commit:

```javascript
if (process.env.NODE_ENV === "development") {
    skipAuthorization();
}
```

or equivalent shortcuts that can accidentally reach production.

Development conveniences must be isolated and clearly controlled.

---

# 86. DEVELOPMENT-ONLY TOOLS

Development-only features must not accidentally become production capabilities.

Examples:

* debug endpoints;
* database reset routes;
* test impersonation;
* seed endpoints;
* verbose error output;
* fake payment operations.

These must be isolated and protected.

---

# 87. TRANSACTIONAL UI

When an operation changes important business state, the UI must clearly communicate:

```text
Draft
Processing
Completed
Failed
Requires Approval
Rejected
Cancelled
Synced
Conflict
```

Do not present an operation as successful before authoritative confirmation.

---

# 88. OFFLINE UI

Offline state must be visible when it affects behavior.

Users should be able to understand:

* whether they are offline;
* what can still be performed;
* what is queued;
* what is syncing;
* what failed;
* what conflicts exist.

Do not falsely display server-confirmed state when the operation is only locally queued.

---

# 89. SECURITY AND UX BALANCE

Security controls must not be bypassed for convenience.

However, secure workflows should still be usable.

Examples:

* clear permission errors;
* understandable approval messages;
* sensible session handling;
* controlled re-authentication;
* secure recovery flows.

---

# 90. ACCESS CONTROL IN UI

The UI should be permission-aware.

Use mechanisms such as:

```text
PermissionGate
```

to hide or disable unavailable actions where appropriate.

However:

> UI permission handling is a UX layer, not the security boundary.

The backend remains authoritative.

---

# 91. MODULE DEPENDENCY RULE

Before implementing a feature, identify its dependencies.

Example:

```text
Sales Invoice
    ↓
Customer
    ↓
Product
    ↓
Tax
    ↓
Inventory
    ↓
Accounts Receivable
    ↓
Accounting
```

Do not implement downstream behavior without understanding upstream dependencies.

---

# 92. CIRCULAR DEPENDENCY CONTROL

Avoid circular module dependencies.

Bad:

```text
A → B
B → C
C → A
```

Prefer:

```text
A → Shared Contract
B → Shared Contract
C → Shared Contract
```

or controlled domain/application events.

---

# 93. CONFIGURATION VERSIONING

Configuration that changes business behavior must be versionable where appropriate.

Examples:

* workflows;
* forms;
* pricing rules;
* approval rules;
* tax configurations;
* numbering rules;
* business rules;
* report definitions.

Changing configuration must not unexpectedly corrupt historical records.

---

# 94. HISTORICAL CORRECTNESS

Historical transactions must preserve the meaning of the data at the time of the transaction.

Do not allow a current configuration change to rewrite historical meaning unintentionally.

Examples:

* old tax rate;
* old price;
* old workflow;
* old account mapping;
* old approval chain;
* old currency conversion.

---

# 95. DATE, TIME AND CURRENCY RULES

Use explicit handling for:

* timezone;
* UTC storage where appropriate;
* organization timezone;
* user timezone;
* fiscal periods;
* currency;
* exchange rates;
* decimal precision.

Never rely blindly on the browser's local timezone.

Money must use precise numeric representations rather than floating-point arithmetic where financial correctness is required.

---

# 96. USER INPUT AND LOCALIZATION

Do not assume:

* one language;
* one date format;
* one number format;
* one currency;
* one timezone.

User-facing formatting should be localization-aware.

Business calculations must remain deterministic and locale-independent.

---

# 97. ERROR RECOVERY

Every critical feature should define what happens when an operation fails.

Examples:

```text
Payment fails
→ sale remains in controlled state

Inventory reservation fails
→ transaction does not falsely report completion

Workflow notification fails
→ approval state remains authoritative

Integration fails
→ retry/reconciliation mechanism handles it
```

Never hide partial failure.

---

# 98. OBSERVABILITY

Important services and operations must provide sufficient observability.

Use:

* structured logs;
* metrics;
* request IDs;
* job IDs;
* event IDs;
* integration IDs;
* error tracking.

Observability must respect privacy and security.

---

# 99. DEVELOPMENT ENVIRONMENT PARITY

Development should approximate staging/production behavior where practical.

Do not create a development environment that hides:

* authorization errors;
* database constraints;
* concurrency problems;
* production-like migrations;
* queue failures;
* integration failures.

---

# 100. LOCAL DEVELOPMENT DATA

Development data must be clearly separated from real production data.

Never copy sensitive production data into local development environments without approved controls and sanitization.

---

# 101. TEST DATA

Test data should be:

* deterministic where needed;
* realistic enough to expose business problems;
* isolated;
* disposable;
* documented.

Tests must not depend on manually created records in a developer's personal database.

---

# 102. COMMIT AND CHANGE DISCIPLINE

Changes should be logically grouped.

Avoid mixing:

```text
Feature
+
unrelated refactor
+
unrelated UI redesign
+
dependency upgrade
+
database migration
```

unless there is a clear reason.

Small, understandable changes are easier to review and recover.

---

# 103. REFACTORING RULE

Refactoring is encouraged when it improves maintainability, but it must not silently change business behavior.

Before refactoring sensitive modules, verify:

* accounting;
* inventory;
* authorization;
* workflows;
* audit;
* integrations;
* reports;
* offline behavior.

---

# 104. NO CODE GENERATION WITHOUT VERIFICATION

AI-assisted or automated code generation may be used, but generated code is not automatically trusted.

Generated code must be reviewed for:

* correctness;
* security;
* tenant isolation;
* authorization;
* business rules;
* performance;
* maintainability;
* licensing/dependencies;
* tests.

---

# 105. AI CODING ASSISTANT RULE

If an AI coding assistant is used, it must not be instructed to:

```text
"just make it work"
```

without requirement context.

Prompts should include:

* relevant specification;
* module;
* architecture boundary;
* security requirements;
* expected behavior;
* acceptance criteria;
* testing requirements.

---

# 106. NO ASSUMPTION-DRIVEN DEVELOPMENT

Developers must not invent business behavior when requirements are unclear.

If a requirement is ambiguous:

```text
Identify ambiguity
    ↓
Check existing specifications
    ↓
Check related module behavior
    ↓
Resolve requirement
    ↓
Implement
```

Do not silently choose a behavior that can affect financial, inventory, security, or workflow integrity.

---

# 107. CHANGE IMPACT ANALYSIS

Before modifying a shared entity or service, determine its impact on:

* modules;
* APIs;
* database;
* workflows;
* permissions;
* reports;
* integrations;
* notifications;
* offline synchronization;
* audit;
* existing data.

---

# 108. NO FEATURE IS COMPLETE WITHOUT DEPENDENCIES

A feature must account for its dependencies.

For example, implementing:

```text
Purchase Order
```

may require consideration of:

```text
Supplier
Product
Pricing
Tax
Approval
Inventory
Accounts Payable
Notifications
Audit
Reporting
```

Not all dependencies must be fully implemented simultaneously, but they must be identified and handled correctly.

---

# 109. BUSINESS PROCESS OVER CRUD

The platform must be developed around real business processes rather than database CRUD screens.

Bad:

```text
Add
Edit
Delete
List
```

as the entire definition of a business module.

Professional implementation considers:

```text
Create
Validate
Submit
Review
Approve
Execute
Post
Reconcile
Close
Reverse
Report
Audit
```

where applicable.

---

# 110. RECORD LIFECYCLE

Every important transactional entity should have an intentional lifecycle.

Example:

```text
Draft
 ↓
Submitted
 ↓
Approved
 ↓
Posted
 ↓
Completed
 ↓
Closed
```

Actual states depend on the entity.

Do not allow arbitrary status changes.

---

# 111. STATUS TRANSITIONS

Statuses must have controlled transitions.

Bad:

```text
PUT /invoice
{
    "status": "paid"
}
```

without verifying whether the invoice can legally transition to `paid`.

Preferred:

```text
markInvoicePaid()
```

where the application validates the transition.

---

# 112. BUSINESS ACTIONS OVER STATUS EDITING

When a status represents a business event, use a business action.

Examples:

```text
approvePurchase()
postInvoice()
receiveGoods()
completeSale()
cancelOrder()
reverseJournal()
transferStock()
```

rather than allowing generic status mutation.

---

# 113. AUDITABLE USER ACTIONS

Important user actions should produce traceable records.

Examples:

* approval;
* rejection;
* posting;
* reversal;
* deletion;
* export;
* permission change;
* configuration change;
* integration change;
* role change.

---

# 114. SECURITY REVIEW FOR NEW FEATURES

Every feature involving:

* money;
* personal data;
* permissions;
* files;
* external integrations;
* AI;
* offline storage;
* administrative controls

must receive explicit security consideration.

---

# 115. PERFORMANCE REVIEW FOR LARGE DATA

Features expected to operate on large datasets must be designed accordingly.

Consider:

* indexes;
* pagination;
* filtering;
* aggregation;
* background processing;
* caching;
* streaming;
* query plans.

Do not design based only on small development datasets.

---

# 116. DATA RETENTION

Data retention must be intentional.

Consider:

* legal requirements;
* business requirements;
* audit requirements;
* storage costs;
* privacy;
* archival;
* restoration.

Do not delete historical business data simply to reduce database size.

---

# 117. BACKUP AWARENESS

Development must never introduce a feature that makes recovery impossible.

Database changes, storage changes, and migrations must consider:

* backup;
* restore;
* point-in-time recovery where supported;
* migration rollback;
* data integrity verification.

---

# 118. RELEASE READINESS

Before release, verify:

```text
Requirements
Architecture
Database
API
Authorization
Security
UI/UX
Testing
Migration
Performance
Offline
Audit
Documentation
Deployment
Monitoring
Rollback
```

A feature that passes only functional testing is not automatically production-ready.

---

# 119. DEFINITION OF DONE

A feature is considered complete only when all applicable requirements have been satisfied.

Minimum conceptual checklist:

```text
[ ] Requirement understood
[ ] Scope confirmed
[ ] Module identified
[ ] Dependencies identified
[ ] Data model completed
[ ] Database migration completed
[ ] API contract completed
[ ] Authorization implemented
[ ] Business rules implemented
[ ] Workflow implemented if required
[ ] UI implemented
[ ] Validation implemented
[ ] Error states implemented
[ ] Audit implemented
[ ] Notifications implemented if required
[ ] Offline behavior defined
[ ] Integration behavior defined
[ ] Reports updated if required
[ ] Tests completed
[ ] Security reviewed
[ ] Performance reviewed
[ ] Accessibility reviewed
[ ] Documentation updated
[ ] Migration verified
[ ] Release readiness verified
```

---

# 120. DEVELOPMENT CHECKLIST

Before merging any meaningful feature, ask:

## Requirement

* Does the implementation exactly satisfy the approved requirement?
* Was unnecessary functionality added?

## Architecture

* Does the feature belong to the correct module?
* Are module boundaries respected?
* Is business logic in the correct layer?

## Security

* Is authentication enforced?
* Is authorization enforced?
* Is tenant isolation enforced?
* Is input validated?
* Are sensitive values protected?

## Data

* Are constraints correct?
* Are indexes appropriate?
* Are transactions used where necessary?
* Is concurrency handled?

## Business Integrity

* Can invalid state be created?
* Can users bypass workflow?
* Can financial records be corrupted?
* Can inventory become inconsistent?

## API

* Is the API versioned correctly?
* Are errors standardized?
* Is pagination used?
* Is idempotency required?
* Is the endpoint permission-aware?

## UI

* Are loading, empty, error, and success states handled?
* Is the interface consistent with the design system?
* Is it accessible and responsive?

## Offline

* Is offline behavior explicitly classified?
* Are queued operations safe?
* Are conflicts handled?
* Is server authority preserved?

## Audit

* Is the operation auditable?
* Can administrators determine who changed what?

## Testing

* Does the happy path work?
* Do invalid cases fail correctly?
* Are permission cases tested?
* Are edge cases tested?
* Are related modules tested?

---

# 121. DEVELOPMENT PRIORITY ORDER

When trade-offs occur, prioritize:

```text
1. Data integrity
2. Security
3. Tenant isolation
4. Business correctness
5. Authorization
6. Reliability
7. Auditability
8. Maintainability
9. Performance
10. UX polish
```

Performance and UX are important, but they must not compromise correctness or security.

---

# 122. ENGINEERING PRINCIPLE

The platform must be developed as a professional business system, not as a collection of screens.

The development mindset must be:

```text
Business Requirement
        ↓
Business Process
        ↓
Domain Model
        ↓
Data Integrity
        ↓
Authorization
        ↓
Application Logic
        ↓
API
        ↓
UI
        ↓
Audit
        ↓
Testing
        ↓
Operational Reliability
```

---

# 123. FINAL DEVELOPMENT RULE

Every developer must assume that the platform will eventually operate with:

* many organizations;
* many companies;
* many branches;
* many users;
* many roles;
* many warehouses;
* many transactions;
* many integrations;
* large datasets;
* concurrent users;
* intermittent connectivity;
* evolving business rules;
* configurable industries;
* strict audit requirements.

Code must therefore be written for correctness, maintainability, extensibility, security, and long-term evolution.

The objective is not merely to make today's feature work.

The objective is to build a platform that can safely support tomorrow's features without requiring the system to be rewritten.

---

# 124. FINAL RULE SUMMARY

The following rules are mandatory:

```text
Requirements before implementation.

Architecture before shortcuts.

Modules before uncontrolled coupling.

Application services before scattered business logic.

Server-side authorization before UI assumptions.

Database constraints before application-only assumptions.

Transactions before partial financial state.

Audit before untraceable operations.

Configuration before unnecessary hardcoding.

Reusable components before duplication.

API contracts before frontend assumptions.

Server authority before offline assumptions.

Testing before completion.

Security before convenience.

Business correctness before visual polish.

Documentation before undocumented behavior.

```

**This document is the mandatory development baseline for all future implementation work.**
