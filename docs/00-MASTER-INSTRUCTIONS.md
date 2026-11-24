# MASTER INSTRUCTIONS

# Professional Multi-Organization, Multi-Industry ERP & Business Management Platform

---

# 1. DOCUMENT PURPOSE

This document is the highest-level development instruction for the entire platform.

It defines the mandatory principles, architectural constraints, development behavior, technology requirements, quality standards, security expectations, and implementation rules that apply to the complete system.

All:

* developers
* software engineers
* architects
* UI/UX designers
* QA engineers
* DevOps engineers
* AI coding agents
* automation agents
* code-generation tools
* implementation tools
* documentation tools

must treat this document as a mandatory governing instruction.

The other specification documents provide detailed requirements for specific areas.

This document establishes the overall direction and non-negotiable rules.

---

# 2. PLATFORM OBJECTIVE

The objective is to build a professional, scalable, secure, modular, configurable, multi-organization, multi-industry ERP and business management platform.

The platform must be capable of supporting organizations ranging from smaller businesses to complex enterprise environments.

The architecture must be designed for:

* multiple organizations
* multiple companies
* multiple branches
* multiple departments
* multiple warehouses
* multiple locations
* multiple users
* multiple roles
* multiple industries
* multiple currencies
* multiple languages
* multiple time zones
* large datasets
* long-term historical records
* integrations
* future mobile applications
* future automation
* future AI capabilities

The platform must be developed as a long-term product rather than a short-term demonstration application.

---

# 3. PROJECT CLASSIFICATION

This platform is:

* a professional ERP platform
* a business management platform
* a modular enterprise application
* a multi-organization system
* a multi-industry system
* a configurable business platform
* an extensible software platform

This platform is NOT:

* a student CRUD project
* a basic admin dashboard
* a simple inventory application
* a simple POS application
* a collection of unrelated CRUD pages
* a single-company application
* an AI-generated UI prototype
* a hard-coded industry application
* an application where the frontend is treated as the security boundary

The implementation must reflect the seriousness of the product.

---

# 4. MASTER DEVELOPMENT PRINCIPLE

Every implementation decision must prioritize:

1. correctness
2. security
3. data integrity
4. business integrity
5. maintainability
6. modularity
7. scalability
8. configurability
9. usability
10. performance
11. extensibility

Developer convenience must not override these principles.

Fast implementation is useful only when it does not create architectural or business problems.

---

# 5. SOURCE-OF-TRUTH HIERARCHY

The specification repository is the primary source of truth.

The conceptual hierarchy is:

```text
00-MASTER-INSTRUCTIONS.md
        ↓
01-PROJECT-VISION.md
        ↓
02-PRODUCT-REQUIREMENTS.md
        ↓
03-ARCHITECTURE.md
        ↓
04-TECH-STACK.md
        ↓
05-DESIGN-SYSTEM.md
        ↓
06-UI-UX-SPECIFICATION.md
        ↓
07-THEME-SYSTEM.md
        ↓
08-ANIMATION-MOTION.md
        ↓
09-AUTH-SECURITY.md
        ↓
10-MULTI-TENANCY.md
        ↓
11-CUSTOMIZATION-ENGINE.md
        ↓
12-WORKFLOW-APPROVAL-ENGINE.md
        ↓
13-DATA-MODEL.md
        ↓
14-API-SPECIFICATION.md
        ↓
15-OFFLINE-SYNC.md
        ↓
16-NOTIFICATIONS.md
        ↓
17-INTEGRATIONS.md
        ↓
18-AI-AUTOMATION.md
        ↓
19-REPORTING-BI.md
        ↓
20-TESTING-QA.md
        ↓
21-DEPLOYMENT-DEVOPS.md
        ↓
22-MOBILE-FUTURE.md
        ↓
23-MODULES-SPECIFICATION.md
        ↓
24-INDUSTRY-SPECIFICATION.md
        ↓
25-FEATURE-SPECIFICATION.md
        ↓
26-USER-ROLES-PERMISSIONS-SPECIFICATION.md
        ↓
development/*
        ↓
Implementation
```

A lower-level implementation must not silently contradict a higher-level requirement.

If two documents conflict:

1. identify the conflict
2. do not guess
3. determine which requirement is authoritative
4. update the appropriate specification if required
5. only then implement the change

Code must never become the accidental source of truth.

---

# 6. AI CODING AGENT RULE

AI coding agents must behave as implementation agents, not autonomous product decision-makers.

An AI agent must:

* read relevant specifications before implementation
* inspect the existing codebase before modifying it
* understand existing architecture
* reuse existing patterns
* avoid unnecessary rewrites
* avoid inventing requirements
* avoid inventing business rules
* avoid changing technology choices without authorization
* avoid deleting existing functionality without justification
* avoid introducing unrelated features
* avoid creating duplicate systems
* preserve existing security controls
* preserve tenant isolation
* preserve auditability
* preserve data integrity
* explain significant architectural changes
* verify implementation through tests

The agent must not interpret ambiguity as permission to redesign the platform.

---

# 7. AGENT IMPLEMENTATION BEHAVIOR

Before implementing a significant feature, the agent must:

1. inspect the relevant specification
2. inspect the current implementation
3. identify affected modules
4. identify dependencies
5. identify database impact
6. identify API impact
7. identify authorization requirements
8. identify workflow requirements
9. identify offline requirements
10. identify audit requirements
11. identify reporting requirements
12. identify integration requirements
13. identify testing requirements

Only then should implementation begin.

---

# 8. NO UNAUTHORIZED SCOPE EXPANSION

An implementation must remain within the approved scope.

Do not turn one feature into an unrelated system.

For example:

```text
Inventory adjustment
```

does not automatically authorize implementation of:

```text
Payroll
CRM
Marketing
HR
Projects
Complete accounting redesign
```

Cross-module integration is allowed when required.

Unrelated scope expansion is not.

---

# 9. ARCHITECTURAL NON-NEGOTIABLES

The following principles must not be removed for convenience:

* multi-organization architecture
* tenant isolation
* modular architecture
* server-side authorization
* auditability
* data integrity
* transactional correctness
* PostgreSQL as the primary database
* JavaScript as the required programming language
* React/Next.js frontend direction
* custom CSS instead of Tailwind
* API-based backend architecture
* configurable business behavior
* extensibility
* professional testing
* security-first development

Major changes require explicit architectural justification.

---

# 10. TECHNOLOGY RULES

## 10.1 Programming Language

Use:

**JavaScript**

Do NOT convert the project to TypeScript.

The project owner must explicitly authorize any future change from JavaScript to another primary programming language.

---

# 11. FRONTEND TECHNOLOGY

Preferred frontend architecture:

* React
* Next.js
* JavaScript
* Custom CSS
* CSS variables
* CSS Modules where useful
* modern browser APIs
* accessible UI primitives where appropriate

The frontend must remain modular and component-driven.

---

# 12. NO TAILWIND CSS

**TAILWIND CSS MUST NOT BE USED.**

The design system must use:

* CSS
* CSS Modules
* CSS variables
* design tokens
* reusable CSS utilities
* component-level styling

The interface must not become dependent on Tailwind.

---

# 13. BACKEND TECHNOLOGY

The backend must use JavaScript.

Potential technologies include:

* Node.js
* Fastify
* Express
* NestJS where justified

The final backend framework must remain consistent with the architecture.

Business rules must not exist only in frontend code.

---

# 14. DATABASE

The primary database must be:

**PostgreSQL**

The database architecture must support:

* relational integrity
* transactions
* foreign keys
* constraints
* indexes
* concurrency control
* auditability
* tenant isolation
* financial integrity
* inventory integrity
* scalable querying
* long-term historical data

JSON/JSONB should be used only when dynamic or semi-structured data is genuinely appropriate.

Do not replace relational modeling with unrestricted JSON storage.

---

# 15. INFRASTRUCTURE COMPONENTS

Additional infrastructure such as Redis, queues, search engines, object storage, or message brokers may be introduced when justified.

Every infrastructure component must have a clear purpose.

Do not introduce technologies merely because they are popular.

The architecture should avoid unnecessary operational complexity.

---

# 16. MODULAR ARCHITECTURE

The platform must be modular.

Modules should be:

* independently understandable
* configurable
* permission-aware
* auditable
* testable
* extensible
* integration-ready
* loosely coupled

Modules may depend on other modules where legitimate business dependencies exist.

Dependencies must be explicit.

---

# 17. MODULAR MONOLITH FIRST

The initial backend should generally prefer a modular monolith unless a concrete requirement justifies another architecture.

Do not split the system into microservices simply for appearance.

The architecture must preserve service boundaries so that future extraction remains possible if required.

---

# 18. MODULE BOUNDARIES

Each module should have clear ownership of:

* domain behavior
* application services
* repositories
* APIs
* validation
* permissions
* workflows
* events
* audit behavior

Modules should not directly manipulate another module's internal implementation.

Cross-module behavior should use defined application/domain interfaces.

---

# 19. PLATFORM CORE VS MODULES

The system should distinguish between:

```text
Platform Core
    ↓
Core Business Modules
    ↓
Optional Modules
    ↓
Industry Templates / Packs
    ↓
Organization Customization
    ↓
Extensions / Integrations
```

The platform core should contain capabilities shared across the entire system.

Industry-specific behavior should not unnecessarily contaminate the core model.

---

# 20. PRODUCT VISION

The platform shall provide interconnected business management capabilities including:

* Organization Management
* User & Access Management
* Product & Service Management
* Inventory Management
* Warehouse Management
* Sales Management
* POS Management
* CRM
* Customer Management
* Purchase Management
* Supplier Management
* Procurement
* Accounting & Finance
* Accounts Receivable
* Accounts Payable
* Cash & Banking
* Expenses
* Budgeting
* Tax Management
* HR
* Employee Management
* Attendance & Leave
* Payroll
* Manufacturing
* MRP
* Bill of Materials
* Production Planning
* Quality Management
* Supply Chain
* Logistics
* Delivery
* Fleet
* Assets
* Maintenance
* Projects
* Contracts
* Service Management
* Help Desk
* Appointments
* Document Management
* Workflow & Approvals
* Marketing
* E-Commerce
* Reporting
* Business Intelligence
* Notifications
* Integrations
* AI
* Automation
* System Administration
* Configuration
* Customization
* Audit
* Search
* Command Center

The architecture must allow additional modules to be introduced without rewriting the core platform.

---

# 21. MODULE ACTIVATION

Organizations should be able to activate only the modules they need.

Module activation must consider:

* dependencies
* permissions
* navigation
* configuration
* workflows
* reports
* notifications
* integrations
* data visibility

Disabled modules should not unnecessarily expose operational UI or functionality.

---

# 22. MODULE DEVELOPMENT STANDARD

Every major module must be specified using, where applicable:

* purpose
* objectives
* scope
* actors
* roles
* submodules
* features
* screens
* navigation
* entities
* relationships
* workflows
* statuses
* business rules
* validation
* permissions
* approval requirements
* notifications
* reports
* dashboards
* KPIs
* APIs
* events
* integrations
* audit events
* customization
* automation
* AI capabilities
* offline behavior
* dependencies
* industry applicability
* security
* edge cases
* acceptance criteria
* future extensions

A module must not be implemented based on a title alone.

---

# 23. CONFIGURATION OVER HARD-CODING

Whenever a business behavior can reasonably be configured, prefer configuration.

Examples:

* statuses
* numbering
* tax rules
* approval chains
* roles
* permissions
* currencies
* units
* warehouses
* branches
* departments
* workflows
* custom fields
* custom forms
* notifications
* business rules
* dashboards
* reports
* menus
* terminology
* document templates

Configuration must remain controlled, validated, permission-aware, and auditable.

---

# 24. CUSTOMIZATION ENGINE

Organizations should be able to customize the platform without source-code modification for normal configuration use cases.

Customization may include:

* custom fields
* custom forms
* custom statuses
* custom workflows
* custom approvals
* custom business rules
* custom numbering
* custom labels
* custom terminology
* custom menus
* custom dashboards
* custom reports
* custom notifications
* custom document templates
* custom roles
* custom permissions
* custom views
* custom validation
* custom automation

Customization must not allow users to bypass platform security or data integrity rules.

---

# 25. CUSTOMIZATION SAFETY

Customization must never allow ordinary configuration to bypass:

* tenant isolation
* authorization
* audit
* financial integrity
* inventory integrity
* security controls
* database integrity
* workflow restrictions

Custom rules must execute inside controlled platform boundaries.

Do not allow arbitrary user-supplied JavaScript or SQL to become unrestricted backend execution.

---

# 26. MULTI-ORGANIZATION ARCHITECTURE

The system must be multi-organization from day one.

Do not build a single-company application and retrofit multi-tenancy later.

The architecture must support:

* organizations
* companies
* branches
* departments
* business units
* warehouses
* locations
* stores
* teams
* users
* organization-specific configuration

---

# 27. TENANT ISOLATION

Tenant isolation is mandatory.

Every tenant-sensitive operation must establish and enforce the correct organization context.

Tenant isolation must be enforced server-side.

Never rely on:

* frontend filters
* hidden fields
* URL structure
* client-selected organization IDs
* UI visibility

as the sole isolation mechanism.

---

# 28. DATA ACCESS SCOPE

Where appropriate, data permissions may be scoped by:

* organization
* company
* branch
* department
* warehouse
* location
* ownership
* team
* role
* record

Repository and service layers must enforce these scopes.

---

# 29. SECURITY PRINCIPLE

Never trust the client.

The server must independently validate:

* identity
* authorization
* tenant
* input
* business rules
* workflow state
* transaction requirements

A hidden frontend button is not authorization.

---

# 30. AUTHENTICATION

The platform must support secure authentication architecture.

Consider:

* secure password hashing
* session management
* secure cookies/tokens
* MFA
* session expiration
* session revocation
* account security
* login protection
* password recovery
* device/session management

Authentication implementation must follow the security specification.

---

# 31. AUTHORIZATION

Authorization must be granular.

Permission levels may include:

* view
* create
* edit
* delete
* approve
* reject
* export
* print
* manage
* configure
* execute
* post
* reverse

Authorization must be enforced at the API/application level.

---

# 32. SEGREGATION OF DUTIES

Sensitive workflows should support separation of duties.

Examples:

```text
Creator
   ↓
Reviewer
   ↓
Approver
   ↓
Poster
```

Where maker-checker rules apply, users must not approve their own sensitive transactions unless an explicitly authorized policy allows it.

---

# 33. FINANCIAL INTEGRITY

Financial functionality must follow professional accounting principles.

Support, where applicable:

* chart of accounts
* double-entry accounting
* journal entries
* general ledger
* accounts receivable
* accounts payable
* bank accounts
* cash accounts
* reconciliation
* fiscal periods
* period closing
* financial statements
* budgets
* cost centers
* profit centers
* tax
* multi-currency
* audit trails

Financial posting is not ordinary CRUD.

---

# 34. FINANCIAL IMMUTABILITY

Posted financial records must not be silently overwritten.

Corrections should use controlled mechanisms such as:

* reversals
* adjustments
* correcting entries
* compensating transactions

Historical accounting evidence must remain traceable.

---

# 35. INVENTORY INTEGRITY

Inventory must be transaction-driven.

Support, where applicable:

* stock ledger
* stock movements
* receipts
* issues
* transfers
* adjustments
* reservations
* batches
* serial numbers
* expiry
* stock counts
* warehouses
* locations
* units of measure
* variants
* valuation
* reorder levels
* minimum levels
* maximum levels

Stock quantity must not be treated as an arbitrary editable number.

---

# 36. INVENTORY CONCURRENCY

Inventory operations must consider concurrent activity.

Examples:

```text
Device A sells item
Device B sells item
Warehouse receives item
Manager performs adjustment
```

The system must prevent inconsistent stock state.

Use appropriate:

* transactions
* locking
* optimistic concurrency
* versioning
* unique operation IDs

---

# 37. POS ARCHITECTURE

POS must support professional counter-sale workflows.

Typical flow:

```text
Cashier Session
      ↓
Product Identification
      ↓
Pricing
      ↓
Tax
      ↓
Discount
      ↓
Availability
      ↓
Cart
      ↓
Customer
      ↓
Payment
      ↓
Sale Finalization
      ↓
Inventory
      ↓
Accounting
      ↓
Receipt
      ↓
Audit
```

---

# 38. POS REQUIREMENTS

POS should support, where applicable:

* barcode scanning
* product search
* product identification
* pricing
* discounts
* tax
* customer selection
* multiple payment methods
* payment validation
* returns
* refunds
* exchanges
* suspended sales
* cashier sessions
* cash drawer
* opening cash
* closing cash
* end-of-day reconciliation
* receipt printing
* barcode scanners
* offline capability
* synchronization
* audit

---

# 39. CROSS-MODULE INTEGRITY

ERP modules must not behave as isolated CRUD applications.

Example:

```text
Purchase
    ↓
Goods Receipt
    ↓
Inventory
    ↓
Accounts Payable
    ↓
Supplier
    ↓
Cash / Bank
    ↓
Accounting
    ↓
Reporting
```

Another example:

```text
Sales
    ↓
POS / Sales Order
    ↓
Inventory
    ↓
Customer
    ↓
Accounts Receivable
    ↓
Cash / Bank
    ↓
Accounting
    ↓
Reporting
```

Cross-module effects must be explicitly designed.

---

# 40. TRANSACTION BOUNDARIES

Determine which operations must be atomic.

For example, a finalized sale may require:

* sale creation
* payment creation
* stock movement
* accounting effect
* audit event

to succeed consistently.

Do not allow accidental partial business transactions.

---

# 41. ASYNCHRONOUS OPERATIONS

Some operations may intentionally be asynchronous.

Examples:

* large reports
* large exports
* bulk imports
* AI processing
* external synchronization
* notification batches

Asynchronous operations must provide:

* job state
* failure state
* retry behavior
* observability
* audit where required

---

# 42. WORKFLOW AND APPROVALS

The platform must distinguish between:

```text
Workflow
```

and:

```text
Approval
```

Workflow may control the complete lifecycle of a business process.

Approval is a controlled authorization step inside that process.

Support where required:

* sequential approvals
* parallel approvals
* conditional approvals
* threshold approvals
* quorum
* delegation
* escalation
* deadlines
* SLA
* rejection
* return for rework
* cancellation
* resubmission
* maker-checker

---

# 43. WORKFLOW VERSIONING

Workflow definitions must be versioned.

Existing active workflow instances should remain associated with the appropriate workflow version.

Changing a workflow definition must not unexpectedly corrupt active processes.

---

# 44. OFFLINE ARCHITECTURE

Offline support must be designed explicitly.

Possible offline capabilities include:

* POS
* product lookup
* inventory lookup
* draft documents
* selected warehouse operations
* field service
* barcode scanning
* selected forms

Not every operation should be offline.

---

# 45. OFFLINE AUTHORITY

Offline operation must not bypass authoritative business controls.

Operations requiring authoritative centralized state may require online execution.

Examples:

* certain financial postings
* fiscal period closing
* sensitive administrative changes
* high-risk inventory operations
* permission administration

---

# 46. OFFLINE DATA

Offline architecture may use:

* IndexedDB
* service workers
* local persistence
* operation queues
* outbox patterns
* sync queues
* retry mechanisms
* conflict detection
* reconciliation

Local data must be minimized and protected.

---

# 47. SYNCHRONIZATION

Synchronization must support:

* operation IDs
* idempotency
* versioning
* conflict detection
* conflict resolution
* retry
* dependency ordering
* queue states
* reconciliation
* server-authoritative results

Never assume network connectivity is permanent.

---

# 48. SYNC CONFLICTS

Conflicts must be explicit.

Typical states:

```text
Pending
Syncing
Succeeded
Failed
Conflict
Blocked
Cancelled
```

Financial and inventory conflicts require deterministic, integrity-preserving resolution.

---

# 49. DOCUMENT MANAGEMENT

The platform should support:

* file uploads
* attachments
* documents
* versions
* metadata
* categories
* permissions
* previews
* document templates
* generated documents
* PDFs
* printing
* retention
* audit trails

Files must not be publicly accessible unless explicitly configured.

---

# 50. FILE SECURITY

File handling must protect against:

* unauthorized access
* path traversal
* malicious uploads
* dangerous file types
* oversized files
* accidental exposure
* insecure download URLs

File permissions must be enforced server-side.

---

# 51. NOTIFICATIONS

The platform should support:

* in-app notifications
* email
* push notifications
* SMS integration readiness
* approval notifications
* workflow notifications
* reminders
* alerts
* system notifications

Notification behavior should be configurable.

Avoid unnecessary notification spam.

---

# 52. REPORTING AND BUSINESS INTELLIGENCE

Reporting should support:

* operational reports
* financial reports
* inventory reports
* management reports
* compliance reports
* custom reports
* dashboards
* KPIs
* charts
* filters
* grouping
* sorting
* date ranges
* drill-down
* drill-through
* saved reports
* scheduling
* export

Potential export formats:

* CSV
* Excel
* PDF

Reports must respect permissions and tenant boundaries.

---

# 53. LARGE REPORTS AND EXPORTS

Large reports and exports should not unnecessarily block normal requests.

Use asynchronous processing where appropriate.

The system should provide:

* job status
* progress where practical
* completion notification
* secure download
* failure handling

---

# 54. AI ARCHITECTURE

AI is an assistive intelligence layer.

AI is NOT the authority for:

* authorization
* financial posting
* inventory integrity
* tenant isolation
* workflow approval
* security decisions

AI recommendations must remain subject to deterministic platform rules.

---

# 55. AI CAPABILITIES

Potential AI capabilities include:

* natural-language assistant
* business search
* report summarization
* forecasting
* demand prediction
* inventory prediction
* anomaly detection
* expense categorization
* document extraction
* invoice extraction
* OCR
* intelligent search
* business insights
* predictive maintenance
* recommendations
* workflow suggestions
* automation assistance

Capabilities must be introduced according to business value and security requirements.

---

# 56. AI TOOL ACCESS

AI must not receive unrestricted database access.

The required conceptual pattern is:

```text
AI
 ↓
Allowlisted Tool
 ↓
Application Service
 ↓
Authorization
 ↓
Domain Rules
 ↓
Repository
 ↓
Database
```

AI-generated requests must pass the same security and business controls as ordinary application requests.

---

# 57. AI DATA PROTECTION

AI features must respect:

* tenant boundaries
* permissions
* data visibility
* sensitive data rules
* audit requirements
* retention requirements

AI must not expose information simply because it can technically retrieve it.

---

# 58. AI ACTIONS

AI actions that change important business data must require appropriate authorization.

Examples:

* creating financial transactions
* changing inventory
* approving workflows
* modifying permissions
* changing configuration
* sending external communications

AI must not silently execute high-impact actions.

---

# 59. INTEGRATIONS

The integration architecture should support:

* REST APIs
* webhooks
* polling
* scheduled synchronization
* batch files
* external systems
* payment providers
* banking systems
* accounting systems
* e-commerce
* marketplaces
* shipping
* tax systems
* email
* SMS
* storage
* identity providers
* calendars
* OCR/document providers
* AI providers

Integrations must use adapter/provider abstractions.

---

# 60. INTEGRATION SAFETY

Integrations must support where appropriate:

* credentials security
* OAuth
* API keys
* mTLS
* webhook verification
* replay protection
* retries
* timeouts
* rate limits
* idempotency
* external IDs
* mapping
* reconciliation
* dead-letter handling
* monitoring

External integrations must never bypass core authorization or business rules.

---

# 61. API ARCHITECTURE

The platform should use professional versioned APIs.

Preferred architecture:

```text
/api/v1
```

APIs should support:

* authentication
* authorization
* validation
* tenant context
* standardized responses
* standardized errors
* pagination
* filtering
* sorting
* searching
* idempotency
* concurrency control
* auditability
* request IDs
* rate limiting
* observability

---

# 62. API BOUNDARIES

The preferred backend flow is:

```text
Request
 ↓
Route
 ↓
Middleware
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Controller
 ↓
Application Service
 ↓
Domain Logic
 ↓
Repository
 ↓
Database
```

Controllers should not contain large amounts of business logic.

---

# 63. NO DIRECT DATABASE ACCESS FROM FRONTEND

Frontend code must never directly access the production database.

The frontend communicates through approved APIs/application boundaries.

---

# 64. NO DIRECT DATABASE ACCESS FROM AI

AI tools must never directly execute unrestricted SQL against the production database.

All AI data access must pass through controlled application services.

---

# 65. ERROR HANDLING

Errors must be intentional and actionable.

The UI should support:

* validation errors
* permission errors
* loading states
* empty states
* retry states
* offline states
* conflict states
* integration failures
* server failures

Never expose:

* stack traces
* database credentials
* secrets
* internal infrastructure details
* sensitive server information

to ordinary users.

---

# 66. DATA INTEGRITY

Data integrity has priority over convenience.

The platform must use:

* database constraints
* foreign keys
* transactions
* validation
* unique constraints
* check constraints
* concurrency control
* audit records

where appropriate.

---

# 67. DATABASE DESIGN

Database design must prioritize:

* normalization where appropriate
* relational integrity
* constraints
* indexes
* transactions
* referential integrity
* tenant scope
* auditability
* scalability

Avoid:

* excessive duplication
* arbitrary JSON storage
* missing constraints
* unindexed critical queries
* destructive schema changes without migration planning

---

# 68. MONEY AND QUANTITIES

Financial amounts and important quantities must use appropriate precise database types.

Do not use floating-point arithmetic for financial values where precision matters.

Currency, precision, rounding, exchange rates, and units of measure must be explicitly handled.

---

# 69. DATE, TIME, AND TIMEZONE

The platform must explicitly support:

* UTC/server timestamps where appropriate
* organization timezone
* user timezone where applicable
* localized display
* date formats
* time formats
* fiscal periods

Do not assume every organization operates in the same timezone.

---

# 70. INTERNATIONALIZATION

The architecture must support:

* multiple languages
* multiple currencies
* multiple time zones
* date formats
* number formats
* decimal precision
* RTL languages
* localized terminology

UI strings should not be embedded into business logic.

---

# 71. SEARCH

The platform should provide unified search across authorized data such as:

* customers
* suppliers
* products
* invoices
* orders
* employees
* documents
* projects
* tickets
* transactions
* settings

Search must respect:

* permissions
* tenant isolation
* data visibility
* archived state

---

# 72. COMMAND CENTER

The platform should support a powerful command/search interface.

Potential capabilities:

* navigate
* search
* create
* execute actions
* open recent items
* access settings
* show shortcuts
* launch reports
* access workflows

Every command must be permission-aware.

---

# 73. UI/UX PRINCIPLE

The platform must feel like one coherent professional product.

It must not look like:

* generic AI dashboard
* Bootstrap admin template
* student project
* random collection of cards
* unrelated screens
* copied third-party interface

The design system must be consistent across all modules.

---

# 74. VISUAL DESIGN

The visual direction should use sophisticated blue-based gradients with professional neutral and semantic colors.

Supported colors may include:

* blue
* cyan
* navy
* indigo
* slate
* gray
* white
* black
* red
* green
* yellow
* orange
* purple

Colors must be controlled through design tokens.

---

# 75. THEME SYSTEM

The platform should support at least 10 professional themes.

Example themes:

1. Ocean Blue
2. Royal Blue
3. Indigo
4. Emerald
5. Forest
6. Purple
7. Sunset
8. Crimson
9. Light Neutral
10. Dark Professional

Additional themes must be possible without rewriting components.

Theme configuration must use shared design tokens.

---

# 76. ANIMATION AND MOTION

Motion should be:

* purposeful
* smooth
* professional
* performant
* consistent
* accessible

Potential uses:

* navigation
* dialogs
* drawers
* dropdowns
* hover states
* buttons
* notifications
* loading
* charts
* page transitions
* command interfaces

Do not animate every element.

Always respect:

```text
prefers-reduced-motion
```

---

# 77. RESPONSIVE DESIGN

The application must support:

* desktop
* laptop
* tablet
* mobile browsers

Desktop should prioritize enterprise productivity.

Mobile layouts must be intentionally designed rather than merely shrinking desktop layouts.

---

# 78. COMPONENT SYSTEM

Reusable components should include patterns such as:

* DataTable
* DataGrid
* FilterBar
* SearchBar
* FormField
* FormSection
* Modal
* Drawer
* ConfirmationDialog
* DatePicker
* DateRangePicker
* Select
* MultiSelect
* Combobox
* Tabs
* Stepper
* Timeline
* StatusBadge
* MetricCard
* KPIWidget
* Chart
* FileUploader
* FilePreview
* DocumentViewer
* NotificationCenter
* CommandPalette
* PermissionGate
* EmptyState
* ErrorState
* LoadingState
* Skeleton
* Breadcrumbs

Components must support accessibility and consistent behavior.

---

# 79. TABLES

Enterprise tables should prioritize productivity.

Where appropriate support:

* sorting
* filtering
* pagination
* column visibility
* column resizing
* row selection
* bulk actions
* export
* saved views
* search
* grouping
* totals
* sticky headers
* responsive behavior
* virtualization for large datasets

Decorative design must not reduce usability.

---

# 80. FORMS

Forms should support where applicable:

* validation
* required fields
* optional fields
* conditional fields
* sections
* tabs
* draft mode
* autosave
* server validation
* custom fields
* attachments
* comments
* permissions
* audit information

Complex forms should use progressive disclosure.

---

# 81. ACCESSIBILITY

The platform should target strong accessibility practices.

Support:

* keyboard navigation
* semantic HTML
* visible focus
* sufficient contrast
* accessible labels
* screen-reader compatibility
* reduced motion
* accessible forms
* accessible dialogs
* accessible tables

Important information must not rely only on color.

---

# 82. PERFORMANCE

The platform must be designed for large datasets.

Use where appropriate:

* pagination
* virtualization
* indexing
* caching
* lazy loading
* code splitting
* optimized queries
* background jobs
* asynchronous processing
* efficient API responses

Never load unnecessarily large datasets into the browser.

---

# 83. PERFORMANCE TARGET MINDSET

Every feature should consider:

* initial load
* API latency
* database latency
* rendering cost
* memory use
* large datasets
* concurrent users
* background processing
* network conditions

Performance must be measured rather than assumed.

---

# 84. TESTING

Testing must exist at multiple levels:

* unit tests
* component tests
* integration tests
* API tests
* database tests
* workflow tests
* permission tests
* security tests
* offline tests
* synchronization tests
* end-to-end tests
* regression tests
* performance tests
* accessibility tests

Critical financial, inventory, POS, authorization, and tenant-isolation functionality requires especially strong coverage.

---

# 85. TESTING PRINCIPLE

Tests must verify business behavior, not merely whether code executes.

Test:

* success
* failure
* invalid input
* unauthorized access
* concurrency
* duplicate requests
* workflow transitions
* edge cases
* recovery
* data integrity
* security

---

# 86. SECURITY REQUIREMENTS

Security must include, where applicable:

* authentication
* authorization
* MFA
* tenant isolation
* input validation
* output encoding
* CSRF protection
* CORS control
* rate limiting
* secure headers
* password security
* session security
* token security
* secret management
* encryption
* file security
* dependency security
* audit logging
* security event logging
* backup security

---

# 87. SECURITY ATTACK SURFACE

The implementation must consider protection against:

* SQL injection
* XSS
* CSRF
* SSRF
* IDOR
* privilege escalation
* path traversal
* command injection
* malicious file uploads
* brute-force attacks
* credential theft
* insecure webhooks
* replay attacks
* data leakage
* prompt injection
* AI data exfiltration

---

# 88. AUDITABILITY

Important business operations must be auditable.

Where appropriate capture:

* actor
* organization
* timestamp
* action
* entity
* entity ID
* previous state
* new state
* source
* request/correlation ID
* device/session metadata where appropriate

Audit records themselves must be protected by authorization.

---

# 89. DATA LIFECYCLE

The platform must account for:

* creation
* modification
* approval
* posting
* cancellation
* archival
* retention
* recovery
* deletion where permitted

Financial and other regulated records may require retention and controlled archival.

---

# 90. DESTRUCTIVE OPERATIONS

Destructive operations must be carefully controlled.

For sensitive business records, prefer:

* archive
* cancel
* reverse
* adjust
* compensate

over destructive deletion.

Deletion permissions must be explicit.

---

# 91. BACKUP AND RECOVERY

The platform must support appropriate:

* backups
* restore procedures
* retention
* recovery testing
* disaster recovery
* rollback procedures

A backup is not considered reliable until restoration has been tested.

---

# 92. OBSERVABILITY

Production systems must provide appropriate:

* structured logs
* metrics
* tracing
* request IDs
* job IDs
* synchronization status
* integration status
* error monitoring
* health checks

Logs must not expose secrets or unnecessary sensitive data.

---

# 93. CONFIGURATION MANAGEMENT

Configuration must be explicit.

Do not hard-code:

* passwords
* API keys
* secrets
* production credentials
* environment-specific URLs
* sensitive tenant configuration

Use appropriate environment/configuration management.

---

# 94. DEPENDENCY MANAGEMENT

Dependencies must be introduced intentionally.

Before adding a dependency consider:

* purpose
* security
* maintenance
* license
* compatibility
* bundle/runtime impact
* transitive dependencies
* existing alternatives

Do not add libraries simply because they are popular.

---

# 95. DOCUMENTATION RULE

When implementation changes behavior, update the relevant documentation.

Possible affected documents include:

* product requirements
* architecture
* module specification
* feature specification
* API specification
* database specification
* security specification
* workflow specification
* offline specification
* reporting specification
* development rules
* testing rules
* deployment documentation

Documentation must remain synchronized with implementation.

---

# 96. CHANGE MANAGEMENT

A major change must be evaluated before implementation.

Evaluate:

* requirements
* architecture
* database
* APIs
* modules
* permissions
* workflows
* integrations
* offline behavior
* testing
* deployment
* migration
* backward compatibility

Do not make major architectural changes silently.

---

# 97. BACKWARD COMPATIBILITY

When changing existing functionality, consider:

* existing users
* existing records
* existing APIs
* integrations
* mobile clients
* offline clients
* reports
* workflows
* customizations
* permissions

Avoid breaking existing functionality unnecessarily.

---

# 98. MIGRATION SAFETY

Database migrations must consider:

* existing data
* constraints
* indexes
* foreign keys
* table size
* locks
* migration duration
* deployment order
* rollback
* compatibility

Never assume production data resembles development data.

---

# 99. FEATURE FLAGS

Feature flags may be used for:

* staged rollout
* tenant-specific rollout
* testing
* experimental functionality
* emergency disablement

Feature flags must be documented.

Do not create permanent undocumented flags.

---

# 100. INDUSTRY SUPPORT

The platform must remain industry-neutral at the core.

Industry-specific behavior should generally be provided through:

* templates
* configurations
* optional modules
* workflows
* custom fields
* business rules
* industry packs
* extensions

Potential industries include:

* retail
* wholesale
* distribution
* manufacturing
* restaurants
* food businesses
* hospitality
* education
* healthcare administration
* construction
* real estate
* logistics
* transportation
* automotive
* agriculture
* professional services
* repair
* service businesses
* subscription businesses
* nonprofit organizations
* franchises

The architecture must support future industries.

---

# 101. INDUSTRY TEMPLATE PRINCIPLE

An industry template should configure the platform rather than duplicate the entire platform.

Conceptually:

```text
Core Platform
      ↓
Industry Template
      ↓
Enabled Modules
      ↓
Industry Workflows
      ↓
Industry Fields
      ↓
Industry Rules
      ↓
Organization Customization
```

Avoid creating separate codebases for every industry.

---

# 102. FUTURE MOBILE APPLICATION

The backend must be designed so future mobile applications can use the same APIs and business rules.

Potential platforms:

* Android
* iOS

Potential technology:

* React Native

Business rules should remain outside browser-only UI components where they belong in shared backend/application/domain layers.

---

# 103. API-FIRST MOBILE READINESS

Mobile clients must not require special business rules hidden inside the web application.

The backend API must remain the authoritative business interface.

Mobile applications should consume the same:

* authorization
* business rules
* workflows
* data contracts
* audit rules
* synchronization mechanisms

where applicable.

---

# 104. FEATURE DEVELOPMENT PROCESS

Every significant feature should follow:

```text
Requirement
 ↓
Scope Classification
 ↓
Source-of-Truth Check
 ↓
User Stories
 ↓
Acceptance Criteria
 ↓
Dependencies
 ↓
Data Model
 ↓
API Contract
 ↓
Authorization
 ↓
Business Rules
 ↓
Workflow
 ↓
UI/UX
 ↓
Offline Analysis
 ↓
Audit / Events / Notifications
 ↓
Implementation
 ↓
Testing
 ↓
Security Review
 ↓
Performance Review
 ↓
Accessibility Review
 ↓
Documentation
 ↓
Code Review
 ↓
Migration Review
 ↓
Staging
 ↓
Release
 ↓
Monitoring
```

---

# 105. FEATURE IMPLEMENTATION RULE

Do not consider a feature complete because:

* the page renders
* the button works
* the API responds
* the database record exists

A professional feature must satisfy its complete business requirements.

---

# 106. FEATURE COMPLETION MODEL

The preferred model is:

```text
Requirement
+
Business Rules
+
Authorization
+
Data Integrity
+
Workflow
+
Transactions
+
API
+
UI/UX
+
Audit
+
Notifications
+
Reporting
+
Offline/Sync
+
Testing
+
Security
+
Observability
+
Documentation
=
Enterprise Feature
```

Only applicable capabilities need implementation.

However, every capability must be consciously evaluated.

---

# 107. NO ISOLATED CRUD

Do not implement modules as unrelated CRUD applications.

A record's lifecycle must reflect its real business meaning.

For example:

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
Archived
```

where applicable.

---

# 108. BUSINESS STATE

Statuses must represent actual business states.

Do not create decorative UI statuses that have no meaningful business behavior.

Status transitions should be validated.

---

# 109. CLIENT CALCULATIONS

Client-side calculations may improve user experience.

They must not be treated as authoritative for critical business data.

The server must recalculate or validate important:

* totals
* taxes
* discounts
* balances
* inventory quantities
* financial effects

where appropriate.

---

# 110. NO SILENT DATA LOSS

The system must never silently lose user or business data.

This includes:

* unsaved forms
* offline operations
* synchronization queues
* imports
* uploads
* background jobs
* failed transactions

Failure states must be visible and recoverable where possible.

---

# 111. IDEMPOTENCY

Operations vulnerable to duplicate execution must support idempotency where appropriate.

Especially consider:

* payments
* sales
* inventory operations
* integrations
* webhooks
* offline synchronization
* background jobs

---

# 112. CONCURRENCY

Shared records must support appropriate concurrency protection.

Consider:

* simultaneous edits
* simultaneous approvals
* simultaneous payments
* simultaneous inventory changes
* multiple devices
* background jobs

Use:

* transactions
* locks
* unique constraints
* version numbers
* optimistic concurrency

where appropriate.

---

# 113. ERROR RECOVERY

Every significant feature should have defined recovery behavior.

Examples:

* retry
* save draft
* refresh
* reconnect
* resolve conflict
* retry synchronization
* cancel
* reverse
* reprocess
* escalate

Users must not be left in ambiguous states.

---

# 114. UI STATE COMPLETENESS

Every asynchronous feature should consider:

* loading
* success
* empty
* validation error
* permission denied
* server error
* offline
* conflict
* retry
* disabled
* processing

A UI is incomplete if it only implements the successful state.

---

# 115. DESIGN REFERENCE POLICY

The project owner may provide:

* screenshots
* websites
* animations
* UI examples
* design inspiration
* interaction references

These are design inputs.

Do not blindly copy copyrighted interfaces.

Extract useful:

* layout principles
* information hierarchy
* spacing
* typography
* interaction patterns
* animation behavior
* component ideas

and translate them into the platform's own design system.

---

# 116. CODE QUALITY

Code must be:

* readable
* modular
* maintainable
* testable
* secure
* reusable where appropriate
* documented where necessary

Avoid:

* giant components
* duplicated business logic
* duplicated UI logic
* hidden side effects
* magic values
* unnecessary dependencies
* unexplained abstractions
* hard-coded business behavior

---

# 117. CODE REVIEW STANDARD

Code review must verify:

* requirements
* architecture
* security
* authorization
* tenant isolation
* business rules
* database integrity
* API correctness
* UI quality
* testing
* performance
* accessibility
* documentation

---

# 118. CODE REVIEW BLOCKERS

Code should not be accepted if it contains:

* hardcoded secrets
* client-only authorization
* tenant isolation bypass
* unrestricted database access
* arbitrary SQL from users
* unrestricted SQL from AI
* financial integrity violations
* uncontrolled inventory changes
* missing critical tests
* silent data loss
* undocumented security bypass
* unsafe destructive mutation
* unexplained breaking API changes

---

# 119. PRIORITY SYSTEM

Features may be classified as:

### P0 — Critical

Required for core platform operation or security.

### P1 — High

Required for professional usability and important business workflows.

### P2 — Important

Significant business value.

### P3 — Advanced

Advanced enterprise capabilities.

### P4 — Future

Long-term capabilities.

P4 functionality should not be implemented prematurely at the expense of foundational architecture.

---

# 120. NO PREMATURE SIMPLIFICATION

When a requirement is complex:

1. understand the complexity
2. determine current scope
3. design appropriate architecture
4. implement the approved scope
5. preserve extension points
6. document future requirements

Do not simplify important requirements merely because they are difficult.

---

# 121. NO PREMATURE OVER-ENGINEERING

The opposite is also prohibited.

Do not introduce:

* unnecessary microservices
* unnecessary infrastructure
* unnecessary abstractions
* unnecessary databases
* unnecessary frameworks
* unnecessary distributed systems

The architecture must be sophisticated where necessary and simple where appropriate.

---

# 122. BALANCED ENGINEERING

The correct principle is:

```text
Simple Where Possible
+
Robust Where Necessary
+
Extensible Where Valuable
```

Do not confuse complexity with professionalism.

---

# 123. DEVELOPMENT ENVIRONMENT

Development must maintain clear separation between:

* development
* testing
* staging
* production

Environment configuration must not accidentally point development tools at production data.

---

# 124. PRODUCTION SAFETY

Development tools must not provide accidental access to destructive production operations.

Production actions must require appropriate authorization and safeguards.

---

# 125. DATA SEEDING

Seed data must distinguish between:

* system reference data
* development data
* test data
* demo data
* production initialization data

Demo/test data must not accidentally become production business data.

---

# 126. RELEASE MANAGEMENT

Before release verify:

* application build
* database migrations
* API compatibility
* permissions
* configuration
* background jobs
* integrations
* feature flags
* monitoring
* rollback strategy

---

# 127. STAGING

Significant features must be tested in a staging-like environment before production.

Verify:

* migrations
* APIs
* permissions
* workflows
* integrations
* jobs
* reports
* offline behavior
* synchronization
* audit
* performance

---

# 128. ROLLBACK

High-risk changes require a rollback strategy.

Possible mechanisms:

* feature flag disablement
* application rollback
* configuration rollback
* job cancellation
* approved data recovery
* migration rollback where safe

Do not casually reverse production financial or inventory data through destructive database operations.

---

# 129. POST-RELEASE MONITORING

After release monitor:

* errors
* API failures
* slow queries
* background jobs
* synchronization
* integrations
* security events
* data integrity
* resource usage
* user-facing failures

Deployment completion does not equal feature success.

---

# 130. BUG FIX PRINCIPLE

A bug fix should identify:

1. symptom
2. root cause
3. impact
4. affected modules
5. correction
6. regression test
7. deployment requirement

Do not only patch the visible symptom when the underlying rule remains incorrect.

---

# 131. REGRESSION PROTECTION

Important bugs must receive regression tests.

The desired lifecycle is:

```text
Bug
 ↓
Root Cause
 ↓
Fix
 ↓
Regression Test
 ↓
Verification
```

---

# 132. TECHNICAL DEBT

Technical debt must be documented rather than hidden.

Each important debt item should identify:

* problem
* impact
* risk
* affected area
* proposed solution
* priority

---

# 133. TEMPORARY IMPLEMENTATIONS

Temporary implementations must be explicitly identified.

They must document:

* reason
* limitations
* replacement condition
* expected future behavior

Temporary code must not silently become permanent architecture.

---

# 134. DEPRECATION

Deprecated functionality must follow a controlled lifecycle:

```text
Identify
 ↓
Mark Deprecated
 ↓
Provide Replacement
 ↓
Migrate Consumers
 ↓
Monitor Usage
 ↓
Remove Safely
```

---

# 135. FUTURE EXTENSIBILITY

The architecture must remain capable of supporting future:

* modules
* industries
* mobile applications
* integrations
* AI capabilities
* automation
* reporting
* customization
* workflow engines
* advanced analytics

Future capability does not mean everything must be implemented now.

The current implementation must provide sound extension points without unnecessary premature implementation.

---

# 136. NO TECHNOLOGY DRIFT

Do not silently introduce technologies that contradict the approved stack.

In particular:

* JavaScript remains the required language
* TypeScript must not be introduced
* Tailwind must not be introduced
* PostgreSQL remains the primary database
* multi-tenancy must not be removed
* auditability must not be removed
* modular architecture must not be removed

Any major exception requires explicit justification.

---

# 137. NO ARCHITECTURAL REWRITE WITHOUT REASON

Do not rewrite the project merely because a different architecture appears cleaner.

Before a major rewrite evaluate:

* current functionality
* migration cost
* data safety
* regression risk
* user impact
* compatibility
* long-term benefit

Prefer incremental improvement when practical.

---

# 138. DEVELOPMENT DOCUMENTATION

The documentation repository should maintain authoritative documents for:

* project vision
* requirements
* architecture
* technology
* design
* UI/UX
* themes
* motion
* security
* multi-tenancy
* customization
* workflow
* data
* API
* offline/sync
* notifications
* integrations
* AI
* reporting
* testing
* deployment
* mobile
* modules
* industries
* features
* permissions
* development rules
* folder structure
* coding standards
* component rules
* database rules
* API rules
* security rules
* testing rules
* feature development process

---

# 139. DOCUMENTATION SYNCHRONIZATION

When a behavior changes, determine which specifications are affected.

Do not update only the code.

A change may require updates to:

```text
Requirement
+
Architecture
+
Database
+
API
+
UI/UX
+
Permissions
+
Workflow
+
Testing
+
Deployment
```

---

# 140. FINAL QUALITY GATE

Before considering a major feature complete, verify:

```text
[ ] Requirement understood
[ ] Scope confirmed
[ ] Source of truth checked
[ ] Dependencies identified
[ ] Data model reviewed
[ ] Database migration reviewed
[ ] API contract defined
[ ] Authentication verified
[ ] Authorization verified
[ ] Tenant isolation verified
[ ] Business rules implemented
[ ] Workflow implemented where required
[ ] Financial integrity verified where applicable
[ ] Inventory integrity verified where applicable
[ ] POS integrity verified where applicable
[ ] Offline behavior evaluated
[ ] Synchronization evaluated
[ ] Audit implemented
[ ] Notifications implemented where required
[ ] Reporting impact reviewed
[ ] Integration impact reviewed
[ ] AI impact reviewed where applicable
[ ] UI/UX completed
[ ] Loading state handled
[ ] Empty state handled
[ ] Error state handled
[ ] Conflict state handled
[ ] Responsive behavior verified
[ ] Accessibility reviewed
[ ] Performance reviewed
[ ] Unit tests passed
[ ] Integration/API tests passed
[ ] Security tests passed
[ ] Regression tests passed
[ ] Documentation updated
[ ] Code review passed
[ ] Staging verification passed
[ ] Release strategy verified
[ ] Monitoring available
```

---

# 141. DEFINITION OF DONE

A feature is not DONE because:

* the screen exists
* the API responds
* the database record exists
* the happy path works

A feature is DONE only when its applicable:

* requirements
* business rules
* authorization
* data integrity
* workflows
* transactions
* UI/UX
* API
* audit
* notifications
* reporting
* offline behavior
* synchronization
* security
* testing
* performance
* accessibility
* documentation
* deployment

requirements have been verified.

---

# 142. ENTERPRISE DATA PRINCIPLE

Business data is one of the most valuable assets of the platform.

Therefore:

> Never sacrifice data integrity for implementation convenience.

Business data must be:

* accurate
* traceable
* recoverable
* appropriately protected
* correctly scoped
* auditable
* consistent

---

# 143. ENTERPRISE SECURITY PRINCIPLE

Security must be built into the architecture rather than added at the end.

Therefore:

> Security is a feature of every module, API, workflow, database operation, integration, and user interface.

---

# 144. ENTERPRISE MODULARITY PRINCIPLE

Modules must cooperate without becoming inseparably coupled.

Therefore:

> Build shared capabilities once, define clear boundaries, and integrate through controlled contracts.

---

# 145. ENTERPRISE CUSTOMIZATION PRINCIPLE

Organizations differ.

Therefore:

> Prefer configurable behavior over unnecessary hard-coded assumptions.

However:

> Customization must never become a mechanism for bypassing security or business integrity.

---

# 146. ENTERPRISE SCALABILITY PRINCIPLE

The system must be designed for growth.

Always consider:

```text
Thousands of users
+
Multiple organizations
+
Millions of records
+
Many branches
+
Many warehouses
+
Many modules
+
Many industries
+
Multiple integrations
+
Long historical periods
+
Mobile clients
```

Architecture should remain maintainable under this growth.

---

# 147. ENTERPRISE USER EXPERIENCE PRINCIPLE

Professional enterprise software must be powerful without becoming chaotic.

The interface should provide:

* clear information hierarchy
* predictable navigation
* efficient workflows
* dense but readable data presentation
* powerful search
* meaningful filters
* contextual actions
* keyboard support
* responsive layouts
* consistent visual language

Do not sacrifice productivity for decoration.

---

# 148. BUSINESS-FIRST ENGINEERING PRINCIPLE

The platform must model real business processes.

Do not design a feature merely around:

```text
Table
+
Form
+
CRUD API
```

Instead model:

```text
Business Object
+
Lifecycle
+
Rules
+
Permissions
+
Workflow
+
Transactions
+
Audit
+
Related Business Effects
```

---

# 149. FAILURE-FIRST ENGINEERING PRINCIPLE

Every important feature must consider failure.

Ask:

```text
What happens if the network fails?
What happens if the database fails?
What happens if the request is duplicated?
What happens if two users act simultaneously?
What happens if permission is revoked?
What happens if an integration fails?
What happens if synchronization conflicts?
What happens if a job crashes?
What happens if the user refreshes?
What happens if the operation partially completes?
```

The system must have intentional answers.

---

# 150. NO HIDDEN BUSINESS LOGIC

Critical business rules must not be hidden inside:

* random UI components
* event handlers
* duplicated frontend utilities
* database triggers without documentation
* integration scripts
* AI prompts
* temporary patches

Business behavior must have a clear architectural home.

---

# 151. NO DUPLICATED BUSINESS RULES

The same business rule must not be independently implemented in multiple places unless the duplication is intentionally defensive.

Where duplication exists, behavior must remain consistent.

Prefer centralized domain/application rules with appropriate client-side validation for user experience.

---

# 152. NO CLIENT-AUTHORITATIVE SECURITY

The following are never sufficient security controls:

```text
Hidden Button
Disabled Button
Frontend Route Guard
Client-Side Permission Check
Hidden Menu
```

The server must independently enforce authorization.

---

# 153. NO CLIENT-AUTHORITATIVE FINANCIAL OR INVENTORY STATE

The client may display calculated values.

The client must not be the final authority for:

* financial posting
* inventory quantity
* account balances
* tax results
* payment finalization
* transaction status

The server/domain layer must validate authoritative business state.

---

# 154. NO UNCONTROLLED AUTOMATION

Automation must respect:

* permissions
* business rules
* workflow
* audit
* tenant boundaries
* rate limits
* data integrity

Automation must not become a hidden bypass mechanism.

---

# 155. NO UNCONTROLLED AI

AI must respect:

* permissions
* tenant boundaries
* business rules
* workflows
* audit
* security
* data access policies

AI is an assistant, not an unrestricted administrator.

---

# 156. FINAL ARCHITECTURAL MODEL

The platform should conceptually operate as:

```text
                    ┌──────────────────────┐
                    │      Users / Apps    │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ UI / Mobile / Client │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ API / Application    │
                    │ Services             │
                    └──────────┬───────────┘
                               ↓
              ┌──────────────────────────────────┐
              │ Authorization / Tenant Context   │
              └────────────────┬─────────────────┘
                               ↓
              ┌──────────────────────────────────┐
              │ Domain Rules / Workflows         │
              │ Transactions / Business Logic    │
              └────────────────┬─────────────────┘
                               ↓
        ┌────────────────────────────────────────────────┐
        │ Modules / Shared Platform Services             │
        │ Inventory / Sales / Finance / HR / CRM / etc. │
        └───────────────────────┬────────────────────────┘
                                ↓
        ┌────────────────────────────────────────────────┐
        │ Repository / Data Access / Integrations       │
        └───────────────────────┬────────────────────────┘
                                ↓
        ┌────────────────────────────────────────────────┐
        │ PostgreSQL / Cache / Files / Queues / Events  │
        └────────────────────────────────────────────────┘
```

Cross-cutting capabilities operate throughout the architecture:

```text
Security
Authorization
Tenant Isolation
Audit
Notifications
Observability
Configuration
Customization
Workflow
Offline/Sync
Integrations
AI
Reporting
```

---

# 157. FINAL DEVELOPMENT COMMAND

Every implementation agent and developer must follow this rule:

> **Read the specification. Understand the existing architecture. Identify dependencies. Implement the smallest correct change that satisfies the requirement. Preserve security, tenant isolation, business integrity, and extensibility. Test the complete behavior. Update documentation. Never invent requirements or silently change architecture.**

---

# 158. FINAL PRODUCT PRINCIPLE

The platform must feel like a mature enterprise product.

It must not feel like:

* generated pages
* disconnected modules
* generic CRUD
* a student project
* a collection of templates
* an AI prototype

It should feel like one unified business operating platform where:

```text
Organizations
      ↓
People
      ↓
Products / Services
      ↓
Operations
      ↓
Transactions
      ↓
Workflows
      ↓
Finance
      ↓
Reporting
      ↓
Automation
      ↓
Intelligence
```

are connected through consistent architecture and reliable business rules.

---

# 159. FINAL SOURCE-OF-TRUTH RULE

If an implementation decision conflicts with this document or another authoritative specification:

**STOP.**

Do not silently choose the easier implementation.

Determine the conflict, resolve the requirement, update the appropriate documentation, and then continue.

---

# 160. FINAL MASTER PRINCIPLE

> **Build the platform as a long-term enterprise product, not as a collection of screens.**

Every architectural decision should answer:

> **"Will this still make sense when the platform has thousands of users, multiple organizations, millions of records, many modules, many industries, multiple integrations, mobile applications, extensive customization, AI capabilities, and years of historical business data?"**

Prefer solutions that remain:

* secure
* correct
* maintainable
* scalable
* configurable
* testable
* observable
* extensible

for years to come.

---

# END OF MASTER INSTRUCTIONS
