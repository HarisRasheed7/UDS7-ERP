# IMPLEMENTATION MASTER INSTRUCTIONS

## 1. DOCUMENT PURPOSE

This document defines the mandatory implementation rules for transforming the approved ERP & Business Management Platform specifications into a production-grade software system.

It is the primary implementation instruction document for developers, AI coding agents, automation systems, and technical contributors working on the project.

It does **not** replace the product specifications, architecture documentation, module specifications, industry specifications, security specifications, database rules, API rules, coding standards, testing rules, or other approved documentation.

Instead, it defines **how those specifications must be interpreted and implemented together**.

The implementation must produce a real, maintainable, secure, scalable, professional software platform.

The objective is not to create a demonstration, prototype, collection of CRUD pages, or visually impressive mock application.

The objective is to build the actual platform described by the approved specifications.

---

# 2. FUNDAMENTAL IMPLEMENTATION PRINCIPLE

> **Implement the documented system, not an imagined simplified version of it.**

Every implementation decision must be evaluated against the existing project documentation.

Developers and AI agents must not independently redefine the product based on assumptions, convenience, personal preferences, framework defaults, or perceived simplicity.

The implementation must preserve:

* functional requirements
* business rules
* architecture
* security
* tenant isolation
* authorization
* data integrity
* workflows
* approvals
* auditability
* customization
* industry adaptability
* module relationships
* reporting requirements
* integration boundaries
* performance requirements
* accessibility requirements
* internationalization requirements
* testing requirements

---

# 3. DOCUMENTATION-FIRST DEVELOPMENT

Before implementing a significant feature, module, service, workflow, database entity, API, or architectural change, the developer or AI agent must inspect the relevant documentation.

At minimum, implementation work must consider the applicable documents from:

```text
docs/
```

including:

* `00-MASTER-INSTRUCTIONS.md`
* `PROJECT-IDENTITY.md`
* `01-PROJECT-VISION.md`
* `02-PRODUCT-REQUIREMENTS.md`
* `03-ARCHITECTURE.md`
* `04-TECH-STACK.md`
* `05-DESIGN-SYSTEM.md`
* `06-UI-UX-SPECIFICATION.md`
* `07-THEME-SYSTEM.md`
* `08-ANIMATION-MOTION.md`
* `09-AUTH-SECURITY.md`
* `10-MULTI-TENANCY.md`
* `11-CUSTOMIZATION-ENGINE.md`
* `12-WORKFLOW-APPROVAL-ENGINE.md`
* `13-DATA-MODEL.md`
* `14-API-SPECIFICATION.md`
* `15-OFFLINE-SYNC.md`
* `16-NOTIFICATIONS.md`
* `17-INTEGRATIONS.md`
* `18-AI-AUTOMATION.md`
* `19-REPORTING-BI.md`
* `20-TESTING-QA.md`
* `21-DEPLOYMENT-DEVOPS.md`
* `22-MOBILE-FUTURE.md`
* `26-USER-ROLES-PERMISSIONS-SPECIFICATION.md`
* modules specifications in modules/
* industries specifications in industries/
* features specifications in features/
* development specifications in development/

Only the documents relevant to the current implementation need to be deeply reviewed, but developers must identify those dependencies before coding.

---

# 4. SOURCE-OF-TRUTH HIERARCHY

When multiple specifications appear relevant, use the following conceptual hierarchy:

```text
Project Owner Decisions
        ↓
00-MASTER-INSTRUCTIONS.md
        ↓
Architecture / Product Requirements
        ↓
Domain & Platform Specifications
        ↓
Module / Industry Specifications
        ↓
Development Rules
        ↓
Implementation Details
```

An explicit project-owner decision always has priority.

If documentation conflicts or is materially ambiguous, do not silently choose the interpretation that is easiest to implement.

Identify the conflict and resolve it according to the project's approved decision process.

---

# 5. PROJECT NAME NEUTRALITY

The project name is currently **TBD**.

Until officially selected:

* do not invent a project name
* do not use an old project name
* do not create unofficial branding
* do not hard-code a temporary brand name into architecture
* do not create production package identifiers based on an invented name

Use the neutral platform terminology defined in:

```text
PROJECT-IDENTITY.md
```

---

# 6. TECHNOLOGY COMPLIANCE

The implementation must follow the approved technology stack.

The current mandatory frontend direction is:

* JavaScript
* React
* Next.js
* Custom CSS

The following are prohibited unless the project owner explicitly changes the technology decision:

* TypeScript
* Tailwind CSS
* arbitrary CSS frameworks replacing the approved styling architecture
* unnecessary framework migrations

Backend technology must follow the approved architecture and technology documentation.

The selected backend framework must be implemented consistently rather than mixing unrelated architectural patterns.

Primary database:

* PostgreSQL

Supporting technologies such as:

* Redis
* queues
* object storage
* search engines
* message brokers

must only be introduced where justified by the architecture.

---

# 7. NO UNAUTHORIZED TECHNOLOGY CHANGES

A developer or AI agent must never replace an approved technology simply because another technology appears easier, newer, faster, or more familiar.

Do not independently introduce:

* new frontend frameworks
* new backend frameworks
* new ORM systems
* new databases
* CSS frameworks
* state-management frameworks
* authentication providers
* cloud platforms
* microservice infrastructure
* message brokers
* search engines
* AI providers

unless required by the approved specifications or explicitly authorized.

---

# 8. REPOSITORY INSPECTION BEFORE MODIFICATION

Before modifying an existing codebase:

1. inspect the repository structure
2. identify the application entry points
3. identify frontend architecture
4. identify backend architecture
5. identify database configuration
6. identify environment configuration
7. identify authentication
8. identify authorization
9. identify API conventions
10. identify existing components
11. identify existing design tokens
12. identify testing infrastructure
13. identify migrations
14. identify background jobs
15. identify integrations
16. identify current feature flags
17. identify existing documentation
18. identify existing technical debt relevant to the task

Never assume the current implementation matches the documentation.

Determine the actual state before making changes.

---

# 9. NO BLIND REWRITES

Do not rewrite an entire application merely because a feature requires modification.

Prefer:

* incremental changes
* isolated improvements
* backward-compatible migrations
* targeted refactoring
* reusable abstractions
* controlled architectural evolution

Large rewrites require explicit justification.

---

# 10. NO SILENT FUNCTIONAL REMOVAL

Existing functionality must not be removed merely because it is inconvenient.

If implementation requires replacing or removing functionality:

1. identify the affected functionality
2. determine its dependencies
3. evaluate compatibility
4. document the reason
5. preserve behavior where possible
6. migrate safely where replacement is required
7. test affected functionality

Never silently delete working functionality.

---

# 11. NO FAKE FUNCTIONALITY

The following do not count as completed implementation:

* static buttons
* fake API calls
* placeholder database operations
* hard-coded dashboard numbers
* simulated success responses
* mock business rules presented as real functionality
* incomplete forms presented as complete
* navigation links leading nowhere
* fake reports
* fake permissions
* fake workflow states
* fake synchronization
* fake AI actions

A UI may initially use controlled mocks during an explicitly defined prototyping stage, but mock behavior must never be presented as production functionality.

---

# 12. FEATURE IMPLEMENTATION MODEL

An enterprise feature must not be implemented as:

```text
Button
→ API
→ Database
```

Instead evaluate the complete feature lifecycle:

```text
Requirement
→ UI
→ Permission
→ Validation
→ Application Logic
→ Domain Rules
→ Transaction
→ Database
→ Audit
→ Notifications
→ Workflow
→ Reporting
→ Integration
→ Offline/Synchronization
→ Testing
```

Not every feature requires every layer, but every applicable layer must be considered.

---

# 13. FEATURE ANALYSIS BEFORE CODING

Before implementing a substantial feature, determine:

* purpose
* actors
* permissions
* entities
* relationships
* input
* validation
* business rules
* statuses
* transitions
* workflow
* approvals
* transactions
* audit requirements
* notifications
* reporting requirements
* integration requirements
* offline behavior
* synchronization behavior
* failure scenarios
* security risks
* performance risks
* test requirements

Do not begin implementation until the feature's boundaries are understood.

---

# 14. MODULE IMPLEMENTATION

Every module must be implemented as part of the platform rather than as an isolated application.

A module must have clearly defined:

* purpose
* domain boundaries
* entities
* services
* permissions
* screens
* workflows
* APIs
* events
* audit behavior
* reports
* dependencies
* customization points
* industry applicability

Modules must integrate through approved platform services and domain boundaries.

---

# 15. MODULE ISOLATION

Module isolation means **controlled boundaries**, not disconnected software.

A module may depend on another module through approved interfaces.

For example:

```text
Sales
    ↓
Inventory
    ↓
Accounts Receivable
    ↓
Cash / Banking
    ↓
Accounting
    ↓
Reporting
```

Do not create direct uncontrolled database dependencies between unrelated modules.

---

# 16. CROSS-MODULE CONSISTENCY

Cross-module workflows must preserve a single coherent business transaction.

For example:

```text
Purchase
→ Goods Receipt
→ Inventory Update
→ Accounts Payable
→ Supplier Balance
→ Cash / Bank
→ Accounting
→ Reporting
```

A completed operation must not leave downstream modules in an inconsistent state.

Use transactional boundaries, events, outbox patterns, or other approved mechanisms where appropriate.

---

# 17. INDUSTRY IMPLEMENTATION

Industry specifications must configure and extend the shared platform.

Do not create completely separate application architectures for every industry.

Industry behavior should primarily be represented through:

* module selection
* configuration
* templates
* custom fields
* attributes
* workflows
* business rules
* terminology
* document templates
* dashboards
* reports
* optional capabilities
* integrations
* industry extensions

The core platform must remain industry-neutral.

---

# 18. INDUSTRY CUSTOMIZATION

An industry template must not become an inflexible hard-coded product.

A business must be able to adapt the selected industry configuration according to its actual requirements.

The system must support controlled customization without forcing source-code changes for ordinary configuration needs.

---

# 19. CUSTOMIZATION ENGINE

Customization is a core platform capability.

Where specified, users with appropriate permissions should be able to configure:

* fields
* labels
* attributes
* forms
* views
* workflows
* statuses
* business rules
* numbering
* document templates
* dashboards
* notifications
* reports
* module visibility
* terminology
* industry configuration

Customization must be:

* permission-controlled
* validated
* auditable
* versionable where appropriate
* tenant-aware
* safe
* reversible where practical

---

# 20. CONFIGURATION OVER HARD-CODING

If behavior is intended to be configurable, do not hard-code it.

Prefer:

```text
Configuration
→ Validation
→ Runtime Behavior
```

over:

```text
Source Code Modification
→ Deployment
→ Runtime Behavior
```

Normal business customization should not require developers.

---

# 21. MULTI-TENANCY

Multi-organization support is a fundamental architectural requirement.

Every tenant-sensitive operation must correctly establish:

* organization context
* user context
* role context
* permission context
* data scope

Never rely solely on frontend filtering for tenant isolation.

Tenant isolation must be enforced server-side and at appropriate data-access boundaries.

---

# 22. AUTHORIZATION

Authorization is mandatory at the server boundary.

The frontend may hide unauthorized functionality, but frontend hiding is not authorization.

Every protected operation must validate:

* authentication
* tenant context
* permission
* scope
* resource access
* workflow authority where applicable

Default behavior must be deny-by-default.

---

# 23. SEGREGATION OF DUTIES

Sensitive operations must respect maker-checker and separation-of-duty rules where configured.

Do not automatically permit:

```text
Create
→ Approve
→ Execute
```

by the same actor when policy prohibits it.

Self-approval rules must be explicitly defined.

---

# 24. DATA INTEGRITY

Data integrity has priority over convenience.

Never implement behavior that can silently produce:

* duplicate financial records
* incorrect inventory quantities
* orphaned transactions
* cross-tenant data leakage
* invalid balances
* inconsistent workflow states
* partial business transactions
* missing audit records

---

# 25. FINANCIAL DATA

Financial records require controlled mutation.

Do not casually overwrite historical financial transactions.

Where required, use:

* reversals
* adjustments
* correction transactions
* controlled amendments
* approval processes

Maintain appropriate audit history.

Money must be represented using precise numeric strategies suitable for financial operations.

Never rely on unsafe floating-point calculations for authoritative financial values.

---

# 26. INVENTORY INTEGRITY

Inventory must be transaction-driven.

Stock changes should originate from valid business events such as:

* purchases
* goods receipts
* sales
* POS transactions
* transfers
* adjustments
* returns
* production
* consumption
* stock counts

Do not allow arbitrary quantity editing to bypass inventory rules.

Concurrency must be considered for simultaneous stock operations.

---

# 27. POS IMPLEMENTATION

POS must be treated as a professional transactional system.

A POS operation may involve:

```text
Product Identification
→ Pricing
→ Cart
→ Discount
→ Tax
→ Payment
→ Receipt
→ Inventory Deduction
→ Customer
→ Accounting / Receivable
→ Audit
```

The exact flow depends on configuration and business requirements.

POS operations must handle:

* duplicate scans
* unavailable stock
* price changes
* discounts
* taxes
* returns
* cancellations
* payment failures
* partial payments where supported
* concurrency
* receipt generation
* offline behavior where supported

---

# 28. WORKFLOWS AND APPROVALS

Workflow logic must be centralized where possible.

Do not implement independent, conflicting approval systems inside every module.

Workflow transitions must verify:

* current state
* permitted transition
* actor permission
* approval authority
* business conditions
* separation of duties
* required data
* audit requirements

Invalid state transitions must be rejected.

---

# 29. AUDITABILITY

Important business and administrative operations must produce appropriate audit records.

Audit information should identify, where applicable:

* actor
* organization
* action
* entity
* record
* timestamp
* previous state
* resulting state
* source
* request context
* relevant metadata

Audit records must not be casually editable by normal users.

---

# 30. API IMPLEMENTATION

All APIs must follow the approved API architecture.

The standard REST API namespace is:

```text
/api/v1
```

APIs must follow:

* consistent naming
* HTTP semantics
* validation
* authorization
* tenant isolation
* structured responses
* structured errors
* pagination
* filtering
* sorting
* idempotency where required
* concurrency controls where required
* audit behavior
* observability
* documentation

Controllers must not become the location for all business logic.

---

# 31. API LAYERING

Use appropriate separation between:

```text
HTTP / Controller
        ↓
Application Service
        ↓
Domain Logic
        ↓
Repository / Data Access
        ↓
Database
```

The exact implementation may vary according to the approved architecture, but responsibilities must remain clear.

---

# 32. DATABASE IMPLEMENTATION

PostgreSQL is the primary authoritative database.

Database implementation must consider:

* normalized relational design
* foreign keys
* indexes
* constraints
* uniqueness
* tenant boundaries
* transactions
* concurrency
* migrations
* auditability
* soft deletion where appropriate
* retention
* archival
* performance

Do not use the database as an unstructured storage dump.

---

# 33. DATABASE MIGRATIONS

Every schema change must be represented through controlled migrations.

Do not manually alter production schema without a documented migration strategy.

Migrations must be:

* repeatable
* reviewable
* versioned
* tested
* backward-aware where necessary
* compatible with deployment strategy

Destructive migrations require special care and explicit migration planning.

---

# 34. TRANSACTION BOUNDARIES

Use database transactions for operations that must remain atomic.

For example:

```text
Create Sale
+ Update Stock
+ Create Financial Effect
+ Audit
```

must not accidentally result in only some of those operations succeeding when the business operation requires atomicity.

Distributed operations must use appropriate consistency patterns when a single database transaction cannot cover the entire process.

---

# 35. IDEMPOTENCY

Operations that may be retried must be designed to prevent duplicate business effects.

This is particularly important for:

* payments
* POS
* inventory
* imports
* webhooks
* integrations
* offline synchronization
* background jobs

A repeated request must not unintentionally create repeated financial or inventory effects.

---

# 36. OFFLINE CAPABILITY

Offline functionality must follow the approved offline specification.

Do not assume the entire platform must operate offline.

Offline support is a capability that must be explicitly defined for each relevant feature.

For offline-enabled operations, define:

* local storage
* local authentication/session behavior
* queued operations
* synchronization
* conflict handling
* retry behavior
* failure behavior
* user feedback
* audit implications

---

# 37. SYNCHRONIZATION

Synchronization must be deterministic and safe.

Never resolve conflicts through silent data loss.

Where conflicts occur, the system must apply the documented conflict strategy.

Synchronization must account for:

* duplicate operations
* stale records
* ordering
* retries
* partial synchronization
* network interruption
* authentication expiration
* tenant context
* permission changes
* concurrent edits

---

# 38. FILES AND DOCUMENTS

Document and file functionality must respect:

* authorization
* tenant isolation
* storage security
* metadata validation
* file type restrictions
* size limits
* malware/security controls where applicable
* retention
* versioning
* auditability
* access permissions

Never expose files merely because a user knows or guesses a URL.

---

# 39. NOTIFICATIONS

Notifications must use centralized notification infrastructure where appropriate.

Support the configured channels and preferences defined by the platform.

Notifications must respect:

* tenant
* user
* role
* permissions
* preferences
* event relevance

Avoid sending duplicate notifications for retried events.

---

# 40. REPORTING AND ANALYTICS

Reports must use authoritative business data.

Do not calculate important KPIs using unrelated frontend state.

Reports must respect:

* tenant boundaries
* permissions
* date ranges
* filters
* currency
* timezone
* business configuration

Expensive reporting workloads should use appropriate query optimization or reporting infrastructure.

---

# 41. SEARCH

Search must be permission-aware.

A user must never receive search results for records they cannot access.

Search indexing must respect:

* tenant boundaries
* permissions
* record visibility
* deletion
* archival
* updates

---

# 42. COMMAND CENTER

The command center is an operational interface, not a security bypass.

Every command must pass through the same authorization and business-rule boundaries as normal UI operations.

Commands may:

* navigate
* search
* create records
* perform permitted actions
* trigger workflows
* access reports

only when the current user has the required authority.

---

# 43. AI IMPLEMENTATION

AI is an assistive capability.

AI must never become an uncontrolled authority over business data or business rules.

AI must not receive unrestricted:

* database access
* SQL execution
* JavaScript execution
* shell execution
* arbitrary filesystem access

AI actions must operate through approved, allowlisted tools and services.

AI-generated recommendations must not silently modify authoritative business records.

Sensitive actions should require explicit confirmation or approved workflow mechanisms.

---

# 44. INTEGRATIONS

External integrations must use controlled interfaces.

An integration must not bypass:

* authorization
* tenant isolation
* validation
* business rules
* workflow
* accounting rules
* inventory rules
* audit requirements

External events must be validated and safely processed.

Webhook processing must support idempotency.

---

# 45. BACKGROUND JOBS

Long-running operations must not unnecessarily block synchronous API requests.

Use background jobs for suitable workloads such as:

* imports
* exports
* report generation
* notifications
* synchronization
* integration processing
* scheduled automation

Jobs must be:

* observable
* retry-safe
* idempotent where required
* failure-aware
* auditable where applicable

---

# 46. ERROR HANDLING

Errors must be handled deliberately.

Never expose:

* database internals
* stack traces
* secrets
* credentials
* sensitive tenant data
* internal infrastructure details

to normal users.

Errors must provide enough information for the user to understand what happened without exposing sensitive implementation details.

---

# 47. LOGGING AND OBSERVABILITY

Important application behavior must be observable.

The system should provide appropriate:

* structured logs
* metrics
* tracing
* request identifiers
* job identifiers
* error tracking
* performance monitoring
* security monitoring

Logs must not expose:

* passwords
* authentication secrets
* tokens
* sensitive personal information
* confidential business data unnecessarily

---

# 48. FRONTEND IMPLEMENTATION

Frontend implementation must follow the approved design system.

Avoid creating every page as a unique visual implementation.

Reuse:

* layout primitives
* navigation
* tables
* forms
* dialogs
* drawers
* filters
* pagination
* status indicators
* cards
* dashboards
* command interfaces
* notification components

Reusable components must remain configurable without becoming unnecessarily complex.

---

# 49. UI CONSISTENCY

All modules must look and behave as parts of the same platform.

Consistency must exist across:

* navigation
* spacing
* typography
* buttons
* forms
* tables
* status colors
* dialogs
* notifications
* loading states
* error states
* empty states
* responsive behavior

Module-specific differences should come from business requirements, not arbitrary developer styling.

---

# 50. CSS AND DESIGN SYSTEM

Custom CSS must follow the approved design system.

Use design tokens for:

* colors
* typography
* spacing
* borders
* radius
* shadows
* elevation
* motion
* component states

Do not scatter arbitrary values throughout the application unnecessarily.

---

# 51. THEMES

Theme support must use the centralized theme architecture.

Components must consume theme tokens rather than hard-coding colors.

Theme changes must not require rewriting every component.

---

# 52. RESPONSIVE DESIGN

The platform must support the approved responsive targets.

Do not treat mobile/tablet layouts as an afterthought.

Interfaces must remain usable across:

* desktop
* laptop
* tablet
* mobile

where the feature is applicable.

---

# 53. ACCESSIBILITY

Accessibility is a functional requirement.

Implementation must consider:

* keyboard navigation
* focus management
* semantic structure
* accessible labels
* form errors
* contrast
* screen readers
* reduced motion
* non-color indicators
* responsive text
* accessible dialogs
* accessible tables

Do not rely on color alone to communicate important states.

---

# 54. INTERNATIONALIZATION

Do not hard-code user-facing text in a way that prevents localization where internationalization is required.

Consider:

* languages
* date formats
* timezones
* currencies
* number formats
* pluralization
* text direction
* localized terminology

Business configuration must not be confused with translation infrastructure.

---

# 55. PERFORMANCE

Performance must be considered during implementation rather than only after completion.

Avoid:

* unnecessary database queries
* N+1 queries
* excessive frontend rendering
* oversized payloads
* unnecessary network requests
* blocking operations
* uncontrolled polling
* inefficient search
* unbounded lists

Use pagination, caching, indexing, batching, lazy loading, and background processing where appropriate.

---

# 56. SECURITY BY DESIGN

Security must be implemented at every layer:

```text
Browser
→ API
→ Application
→ Domain
→ Database
→ Storage
→ Integrations
→ Infrastructure
```

Do not rely on a single security mechanism.

Input validation, authorization, tenant isolation, secrets management, secure sessions, rate limiting, auditability, and safe error handling must be implemented according to the security documentation.

---

# 57. SECRETS

Secrets must never be hard-coded into source code.

Do not commit:

* passwords
* API keys
* private keys
* tokens
* database credentials
* production secrets

Use approved environment/configuration mechanisms.

---

# 58. VALIDATION

Validate data at the correct boundary.

Client-side validation improves usability.

Server-side validation protects the system.

Critical business rules must not depend solely on frontend validation.

---

# 59. FORM IMPLEMENTATION

Forms must handle:

* validation
* loading
* submission
* duplicate submission prevention
* server errors
* field errors
* success states
* cancellation
* unsaved changes where applicable
* permission state
* accessibility

Do not build forms that only work under ideal conditions.

---

# 60. TABLE IMPLEMENTATION

Enterprise tables should support the capabilities required by their domain, such as:

* sorting
* filtering
* searching
* pagination
* column visibility
* responsive behavior
* selection
* bulk actions
* export
* permissions
* loading
* empty state
* error state

Do not render massive datasets without an appropriate data strategy.

---

# 61. STATE MANAGEMENT

State should have clear ownership.

Distinguish between:

* local UI state
* server state
* cached state
* session state
* tenant configuration
* global platform state

Do not introduce global state merely to avoid passing a small amount of data between components.

---

# 62. COMPONENT DESIGN

Components must have clear responsibilities.

Avoid:

* giant components
* components containing unrelated business domains
* duplicated business logic
* duplicated API logic
* excessive prop chains
* hidden side effects

Business logic should live in appropriate application/domain layers rather than being buried inside visual components.

---

# 63. BUSINESS LOGIC LOCATION

Important business rules must not exist only inside frontend components.

Authoritative business rules belong in the appropriate backend/domain/application layer.

Frontend logic may provide:

* presentation
* client-side validation
* optimistic interaction where safe
* usability behavior

but must never become the sole authority for protected business operations.

---

# 64. MODULE REGISTRATION

Modules should be registered through a controlled module architecture.

A module should have defined metadata such as:

* identifier
* name
* version
* dependencies
* permissions
* navigation
* capabilities
* configuration
* status

Module activation must not accidentally expose functionality without the required permissions.

---

# 65. MODULE DEPENDENCIES

Dependencies must be explicit.

For example:

```text
POS
→ Product
→ Inventory
→ Sales
→ Customer
→ Payment
```

Do not hide critical dependencies inside arbitrary imports or database calls.

Circular module dependencies must be avoided.

---

# 66. INDUSTRY PACKAGES

Industry configurations should declare their dependencies on modules and capabilities.

An industry configuration may specify:

```text
Industry
→ Required Modules
→ Optional Modules
→ Default Configuration
→ Workflows
→ Fields
→ Business Rules
→ Reports
→ Terminology
```

The platform must still permit controlled customization after activation.

---

# 67. FEATURE FLAGS

Feature flags may be used where appropriate for:

* gradual rollout
* experimental features
* tenant-specific activation
* migration
* controlled deployment

Feature flags must not become a permanent substitute for proper architecture.

Unused flags must eventually be removed.

---

# 68. VERSIONING AND COMPATIBILITY

Changes must consider:

* API compatibility
* database compatibility
* frontend compatibility
* existing tenant data
* existing configurations
* integrations
* offline clients
* mobile clients
* reports

Breaking changes must be deliberate and managed.

---

# 69. IMPORTS AND EXPORTS

Imports must validate data before applying business effects.

A failed import must not leave uncontrolled partial data.

Where large imports are required:

```text
Upload
→ Validate
→ Preview
→ Approve
→ Process
→ Report
```

Exports must respect permissions and tenant boundaries.

---

# 70. CONCURRENCY

Concurrency must be considered wherever two or more users/processes can modify the same business resource.

Important examples include:

* inventory
* payments
* POS
* approvals
* document numbering
* stock transfers
* reservations
* scheduling
* workflow transitions

Use appropriate locking, version checks, transactions, or optimistic concurrency controls.

---

# 71. DATA RETENTION

Do not delete important historical records merely to simplify implementation.

Retention and archival behavior must follow the relevant product and compliance requirements.

Where records must remain historically meaningful, use appropriate archival or status strategies.

---

# 72. TESTING REQUIREMENT

Every meaningful implementation must include appropriate tests.

Testing must follow:

```text
Unit
→ Component
→ Integration
→ API
→ Database
→ Workflow
→ Security
→ E2E
→ Regression
→ Performance
→ Release Verification
```

Not every feature requires every layer, but all applicable risks must be tested.

---

# 73. SECURITY TESTING

Security tests must include, where applicable:

* unauthorized access
* privilege escalation
* tenant isolation
* IDOR
* injection
* malformed input
* authentication failures
* session behavior
* permission bypass
* file access
* API abuse
* rate limits
* sensitive data exposure

---

# 74. CROSS-TENANT TESTING

Testing must explicitly verify that:

```text
Tenant A
≠
Tenant B
```

A user from one organization must never access another organization's protected data unless an explicitly authorized cross-organization model exists.

---

# 75. FINANCIAL TESTING

Financial functionality must be tested for:

* calculation accuracy
* rounding
* currency
* negative values where permitted
* reversals
* adjustments
* duplicate operations
* concurrency
* transaction atomicity
* audit history
* reporting consistency

---

# 76. INVENTORY TESTING

Inventory functionality must be tested for:

* stock-in
* stock-out
* transfers
* returns
* adjustments
* negative stock rules
* concurrent operations
* duplicate requests
* unit conversions
* reservations where applicable
* inventory valuation where applicable
* auditability

---

# 77. OFFLINE TESTING

Offline-enabled functionality must be tested under:

* normal offline operation
* intermittent connectivity
* reconnect
* duplicate synchronization
* conflicting edits
* failed synchronization
* expired authentication
* partial synchronization
* local queue failure

---

# 78. CUSTOMIZATION TESTING

Test configurations such as:

* custom fields
* custom workflows
* custom permissions
* industry templates
* module activation
* custom statuses
* custom reports
* terminology
* business rules

Configuration changes must not unexpectedly break unrelated tenants.

---

# 79. REGRESSION TESTING

Every significant change must consider its impact on existing functionality.

Cross-module regressions are particularly important.

For example, modifying:

```text
Inventory
```

requires consideration of:

```text
Purchasing
Sales
POS
Warehouses
Manufacturing
Reporting
Accounting
```

where applicable.

---

# 80. DEFINITION OF DONE

A feature is not complete merely because it compiles or appears on the screen.

A feature is complete only when all applicable requirements have been implemented and verified.

The Definition of Done may include:

* requirements implemented
* UI complete
* permissions complete
* validation complete
* business rules complete
* API complete
* database complete
* audit complete
* workflow complete
* notifications complete
* reporting complete
* offline behavior complete
* synchronization complete
* security tested
* automated tests passing
* responsive behavior verified
* accessibility verified
* error states implemented
* documentation updated
* migration completed
* performance acceptable

---

# 81. NO PREMATURE SIMPLIFICATION

Do not remove required complexity merely because it is difficult.

If the specification requires:

* configurable workflows
* granular permissions
* multi-tenancy
* industry configuration
* transaction integrity
* synchronization
* auditing
* customization

do not replace them with simplistic substitutes.

Complexity should be **managed**, not arbitrarily deleted.

---

# 82. COMPLEXITY MANAGEMENT

The goal is not maximum complexity.

The goal is:

> **The minimum architecture capable of correctly satisfying the documented requirements.**

Avoid unnecessary abstractions while preserving necessary enterprise capabilities.

Do not introduce microservices, distributed infrastructure, or advanced tooling simply to appear enterprise-grade.

---

# 83. MODULAR MONOLITH PREFERENCE

The initial implementation should prefer a well-structured modular architecture unless the approved architecture explicitly requires otherwise.

Modules should have strong boundaries while remaining operationally manageable.

Microservices should not be introduced merely because the product is large.

Distributed architecture must have a real justification.

---

# 84. DEVELOPMENT ORDER

Implementation should proceed according to dependency order.

A typical foundation sequence is:

```text
1. Project / Repository Foundation
2. Environment Configuration
3. Database Foundation
4. Core Backend Architecture
5. Authentication
6. Multi-Tenancy
7. Authorization
8. Organization Management
9. Core Platform Services
10. Customization Foundation
11. Workflow Foundation
12. Audit Foundation
13. Notification Foundation
14. Module Infrastructure
15. Core Business Modules
16. Industry Configuration
17. Reporting / BI
18. Integrations
19. AI / Automation
20. Offline / Synchronization
21. Advanced Capabilities
22. Testing / Hardening
23. Deployment
```

The exact sequence may change based on dependencies discovered during implementation.

---

# 85. FOUNDATION BEFORE FEATURES

Do not build dozens of business screens before establishing the required foundation.

For example, before implementing sensitive business modules, establish appropriate:

* authentication
* organization context
* authorization
* database conventions
* API conventions
* audit
* error handling
* validation
* testing infrastructure

This prevents expensive rewrites later.

---

# 86. IMPLEMENTATION PHASES

Every major implementation phase should have:

```text
Phase Objective
→ Dependencies
→ Implementation
→ Testing
→ Verification
→ Documentation Update
→ Completion Decision
```

Do not automatically proceed to the next major phase when the current phase has unresolved critical failures.

---

# 87. CHANGE IMPACT ANALYSIS

Before significant architectural changes, identify affected:

* modules
* database entities
* APIs
* permissions
* workflows
* reports
* integrations
* offline behavior
* synchronization
* mobile compatibility
* tests
* documentation

Do not evaluate changes only within the file being edited.

---

# 88. BACKWARD COMPATIBILITY

When practical, preserve existing behavior.

If a change is breaking:

1. identify the breaking behavior
2. identify affected consumers
3. define migration
4. update documentation
5. update tests
6. communicate the change
7. remove old behavior only when safe

---

# 89. DOCUMENTATION MAINTENANCE

Documentation is part of the implementation.

When implementation changes a documented behavior, the appropriate specification must be updated.

When requirements change, code and tests must eventually reflect the new requirement.

Never allow:

```text
Documentation ≠ Implementation
```

to persist unnoticed.

---

# 90. CODE REVIEW STANDARD

Every significant change should be reviewed for:

* correctness
* security
* tenant isolation
* permissions
* maintainability
* performance
* data integrity
* testing
* API consistency
* architecture
* documentation

Reviewers should ask:

> Does this implementation solve the documented problem without creating hidden problems elsewhere?

---

# 91. AI CODING AGENT RULES

AI coding agents must:

1. inspect before modifying
2. read relevant specifications
3. understand existing conventions
4. make targeted changes
5. avoid invented requirements
6. avoid unauthorized technologies
7. avoid fake implementations
8. explain blockers when necessary
9. run appropriate tests
10. inspect errors
11. fix root causes
12. verify the final state
13. update documentation where required

AI agents must not assume that generated code is correct simply because it compiles.

---

# 92. AI AGENT BEHAVIOR WHEN REQUIREMENTS ARE UNCLEAR

When requirements are incomplete but implementation can safely proceed:

* use the documented architecture
* use existing conventions
* choose the least surprising compatible behavior
* document the assumption
* avoid creating irreversible decisions

When the ambiguity materially affects architecture, security, data integrity, or product behavior:

* stop the affected implementation
* identify the ambiguity
* request clarification or an explicit decision

Do not silently make high-impact decisions.

---

# 93. DO NOT INVENT REQUIREMENTS

Do not add features merely because:

* another ERP has them
* a framework supports them
* an AI model thinks they are useful
* they would look impressive
* they are easy to implement
* they may be useful someday

Future extensibility is acceptable.

Unapproved scope expansion is not.

---

# 94. FUTURE FEATURES

Future functionality must remain architecturally possible without automatically becoming current scope.

Examples may include:

* advanced mobile applications
* additional AI capabilities
* additional industry packs
* advanced automation
* expanded integrations
* additional enterprise capabilities

Design appropriate extension points where justified, but do not implement future features prematurely.

---

# 95. ERP SCOPE CONTROL

The platform is an ERP & Business Management Platform, but individual modules must still be implemented according to approved requirements.

Do not expand one module into unrelated systems merely because they could theoretically be connected.

For example, adding a sales feature does not automatically authorize creation of unrelated CRM, marketing, HR, or project functionality unless those capabilities are part of the approved module scope.

---

# 96. NO ISOLATED FEATURES

A feature must be considered in relation to the platform.

Ask:

```text
Who uses it?
What module owns it?
What data does it affect?
What permissions apply?
What workflows apply?
What other modules depend on it?
What reports use it?
What audit records are required?
What happens when it fails?
```

A feature that works in isolation but breaks the surrounding platform is not successful implementation.

---

# 97. DATA OWNERSHIP

Every major entity should have a clear domain owner.

Other modules should interact with that entity through approved services, APIs, events, or domain contracts rather than uncontrolled duplication.

Avoid creating multiple conflicting sources of truth for the same business concept.

---

# 98. SINGLE SOURCE OF TRUTH

For authoritative business concepts, maintain a clear source of truth.

Examples include:

* organization identity
* user identity
* product definitions
* inventory quantities
* financial transactions
* permissions
* workflow state
* configuration

Caches and derived data must not silently become authoritative.

---

# 99. EVENTS

Events should represent meaningful domain or integration changes.

Events must have:

* clear names
* defined payloads
* ownership
* versioning strategy where needed
* retry behavior
* idempotency considerations

Do not use events simply to hide unclear architecture.

---

# 100. CACHE RULES

Caching must never compromise authoritative business correctness.

Cached data must have:

* ownership
* invalidation strategy
* expiration strategy where applicable
* tenant awareness
* permission awareness

Never treat stale cached financial or inventory data as authoritative.

---

# 101. API AND DATABASE CONSISTENCY

API behavior must correspond to actual domain and database rules.

Do not create APIs that permit states the database or domain layer considers invalid.

Do not create database constraints that silently contradict documented business behavior.

---

# 102. DEPLOYMENT AWARENESS

Implementation must consider deployment from the beginning.

Code should support:

* environment separation
* migrations
* health checks
* configuration
* logging
* monitoring
* backup
* rollback
* deployment verification

Do not design features that can only work on a developer's machine.

---

# 103. ENVIRONMENT SEPARATION

At minimum, distinguish appropriately between:

```text
Development
Testing
Staging
Production
```

Production credentials and resources must never be casually used for development or testing.

---

# 104. RELEASE READINESS

Before release, verify:

* builds
* migrations
* environment configuration
* tests
* security
* permissions
* tenant isolation
* backups
* observability
* performance
* error handling
* deployment process
* rollback process

A feature that works locally but cannot be reliably deployed is not production-ready.

---

# 105. PRODUCTION SAFETY

Production changes must be controlled.

Particularly sensitive operations include:

* database migrations
* financial changes
* inventory changes
* authentication changes
* permission changes
* tenant architecture changes
* storage changes
* integration changes

These require additional verification.

---

# 106. BACKUP AND RECOVERY

Data protection must be considered during implementation.

Important systems must have appropriate:

* backups
* restoration procedures
* recovery testing
* retention
* disaster recovery strategy

A backup that has never been successfully restored must not automatically be considered reliable.

---

# 107. PERFORMANCE VERIFICATION

Performance-critical features must be tested with realistic data volumes.

Do not validate enterprise performance using only:

```text
5 users
10 products
20 transactions
```

Where relevant, test:

* large datasets
* concurrent users
* concurrent transactions
* large reports
* imports
* exports
* search
* synchronization
* background jobs

---

# 108. UI VERIFICATION

Do not consider a screen complete because it renders.

Verify:

* loading
* empty
* success
* error
* permission denied
* validation failure
* long content
* large datasets
* responsive layouts
* keyboard operation
* accessibility
* theme behavior

---

# 109. BUSINESS SCENARIO VERIFICATION

Testing should include realistic end-to-end business scenarios.

For example:

```text
Create Supplier
→ Create Purchase
→ Receive Goods
→ Increase Inventory
→ Create Payable
→ Record Payment
→ Verify Supplier Balance
→ Verify Inventory
→ Verify Accounting
→ Verify Audit
→ Verify Reports
```

Likewise:

```text
Create Customer
→ Create Sale
→ Deduct Inventory
→ Record Payment / Receivable
→ Verify Customer Balance
→ Verify Accounting
→ Verify Audit
→ Verify Reports
```

---

# 110. ERROR RECOVERY

For every important operation, consider:

```text
What happens if the database fails?
What happens if the network fails?
What happens if the user retries?
What happens if the request is duplicated?
What happens if the process crashes?
What happens if authorization changes?
What happens if downstream processing fails?
```

Recovery behavior must be deliberate.

---

# 111. USER EXPERIENCE DURING FAILURE

Failures must be understandable.

The UI should distinguish between:

* validation errors
* authorization errors
* network errors
* temporary server errors
* business-rule rejection
* synchronization conflicts
* system failures

Do not show generic “Something went wrong” messages when useful safe information can be provided.

---

# 112. NO DATA LOSS

The platform must prioritize:

> **Security and data integrity over convenience.**

Never choose a convenient implementation that risks silent data loss.

When uncertain:

```text
Preserve Data
→ Preserve Auditability
→ Preserve Security
→ Preserve Consistency
→ Then Optimize Convenience
```

---

# 113. EXTENSIBILITY

Architecture should permit future extension through controlled mechanisms.

Examples:

* module interfaces
* configuration
* events
* APIs
* plugin-like capability boundaries
* industry packs
* workflow definitions
* custom fields
* automation tools

Extensibility must not mean uncontrolled dynamic code execution.

---

# 114. MAINTAINABILITY

Prefer code that another competent developer can understand.

Avoid unnecessary:

* clever abstractions
* deeply nested logic
* hidden side effects
* magical behavior
* duplicated rules
* framework-specific hacks

Readable code is an architectural asset.

---

# 115. REFACTORING

Refactor when duplication or structural problems materially affect maintainability.

Do not refactor unrelated areas merely because they are imperfect.

Refactoring must preserve behavior unless behavior change is explicitly intended.

---

# 116. TECHNICAL DEBT

Technical debt must be identified rather than hidden.

When temporary compromises are necessary:

* document them
* identify risk
* define scope
* avoid spreading the compromise
* plan remediation when appropriate

Do not disguise incomplete functionality as finished architecture.

---

# 117. IMPLEMENTATION CHECKPOINTS

At the end of each major phase, verify:

```text
Architecture
✓

Functionality
✓

Security
✓

Data Integrity
✓

Permissions
✓

Testing
✓

Performance
✓

Documentation
✓

Deployment Readiness
✓
```

Critical failures block completion.

---

# 118. COMPLETION REPORTING

When an implementation phase is reported as complete, the developer or AI agent must be able to state:

* what was implemented
* what files/components changed
* what database changes occurred
* what APIs were added/changed
* what permissions were added/changed
* what tests were added/run
* what issues remain
* what assumptions were made
* what documentation was updated

Do not claim completion when known critical work remains unfinished.

---

# 119. BLOCKER HANDLING

When blocked, identify the exact blocker.

Examples:

```text
Missing Requirement
Architecture Conflict
Database Dependency
External Integration Dependency
Security Decision
Environment Problem
Third-Party Limitation
```

Do not hide blockers by implementing unrelated substitutes.

---

# 120. IMPLEMENTATION DISCIPLINE

Every implementation task should follow:

```text
READ
↓
UNDERSTAND
↓
PLAN
↓
IMPLEMENT
↓
TEST
↓
VERIFY
↓
DOCUMENT
```

Skipping these stages increases the probability of architectural drift.

---

# 121. FINAL IMPLEMENTATION RULES

The following are absolute implementation principles:

1. Follow the approved specifications.
2. Do not invent requirements.
3. Do not silently remove requirements.
4. Do not change approved technologies without authorization.
5. Do not create fake functionality.
6. Do not bypass security.
7. Do not bypass tenant isolation.
8. Do not bypass permissions.
9. Do not bypass workflows.
10. Do not bypass financial or inventory integrity rules.
11. Do not create uncontrolled cross-module dependencies.
12. Do not allow AI to become an unrestricted authority.
13. Do not sacrifice data integrity for convenience.
14. Do not treat frontend restrictions as security.
15. Do not treat cached data as authoritative.
16. Do not claim incomplete work is complete.
17. Do not allow documentation and implementation to drift silently.
18. Do not expand scope without authorization.
19. Do not optimize prematurely at the expense of correctness.
20. Do not over-engineer without justification.
21. Prefer maintainable architecture.
22. Prefer explicit behavior.
23. Preserve backward compatibility where practical.
24. Test realistic business scenarios.
25. Treat security, correctness, and data integrity as first-class requirements.

---

# 122. FINAL DEVELOPMENT PRINCIPLE

> **Build the platform as a real enterprise system from the foundation upward.**

The implementation must be:

* professional
* modular
* secure
* maintainable
* scalable
* configurable
* multi-organization
* multi-industry
* auditable
* testable
* accessible
* responsive
* integration-ready
* future-ready

while remaining faithful to the approved project scope.

The purpose of these instructions is not to force unnecessary complexity.

The purpose is to ensure that implementation does not accidentally reduce a comprehensive enterprise platform into a collection of simplified CRUD applications.

The final standard is:

```text
DOCUMENTED REQUIREMENTS
        +
CORRECT ARCHITECTURE
        +
SECURE IMPLEMENTATION
        +
DATA INTEGRITY
        +
COMPLETE BUSINESS BEHAVIOR
        +
TESTING
        +
OBSERVABILITY
        +
MAINTAINABILITY
        +
DEPLOYABILITY
        =
PRODUCTION-READY PLATFORM
```

**This document governs implementation discipline.**

**The approved project specifications govern product behavior.**

**The project owner governs final decisions.**

All three must remain aligned throughout development.
