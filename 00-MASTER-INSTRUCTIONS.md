# MASTER INSTRUCTIONS

# Professional Multi-Organization, Multi-Industry ERP & Business Management Platform

## 1. DOCUMENT PURPOSE

This document is the highest-level development instruction for the entire ERP platform.

All developers, AI coding agents, automation agents, designers, and implementation tools must treat this document and the other specification files in this repository as the primary source of truth.

The goal is to build a professional, scalable, secure, modular, configurable, multi-organization, multi-industry ERP and business management web platform.

This is NOT a student CRUD project.
This is NOT a basic inventory application.
This is NOT a simple POS system.

The platform must be architected as a serious enterprise-grade business management product capable of supporting organizations across many industries.

---

# 2. CORE PRODUCT VISION

The platform shall provide one unified business management system containing interconnected modules for:

* Organization management
* Users and access control
* Products and services
* Inventory
* Warehouses
* Sales
* POS
* CRM
* Purchasing
* Procurement
* Suppliers
* Accounting
* Finance
* Accounts receivable
* Accounts payable
* Cash and banking
* Expenses
* Budgeting
* Tax
* HR
* Attendance
* Leave
* Payroll
* Manufacturing
* MRP
* Quality management
* Supply chain
* Logistics
* Fleet
* Assets
* Maintenance
* Projects
* Contracts
* Help desk
* Service management
* Appointments
* Documents
* Workflows
* Approvals
* Marketing
* E-commerce
* Integrations
* Business intelligence
* Reporting
* AI
* Automation
* Administration
* Configuration

The architecture must also allow future modules to be added without rewriting the core platform.

---

# 3. PRODUCT PRINCIPLES

The following principles are mandatory.

## 3.1 Professional First

Every feature must be designed as if it will be used by real organizations.

Avoid toy implementations.

Avoid unnecessary simplification.

Avoid hard-coded assumptions that prevent future growth.

---

## 3.2 Modular Architecture

Each major ERP capability must be represented as a module.

Modules should be:

* independently configurable
* loosely coupled
* reusable
* permission-aware
* auditable
* extensible
* integration-ready

Organizations must be able to activate only the modules they require.

---

## 3.3 Configuration Over Hard-Coding

Whenever a business behavior can reasonably be configurable, prefer configuration over hard-coded behavior.

Examples:

* statuses
* numbering formats
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
* notification rules
* business rules
* dashboards
* reports
* menus

---

## 3.4 Multi-Organization From Day One

The system must be designed for multiple organizations.

Do not build a single-company application and attempt to convert it to multi-tenancy later.

The architecture must support:

* organizations
* companies
* branches
* locations
* departments
* business units
* warehouses
* stores
* multiple fiscal years
* multiple currencies
* multiple languages
* organization-specific configuration

Tenant isolation and authorization must be enforced on the server.

---

# 4. TECHNOLOGY RULES

## 4.1 Programming Language

Use:

# JavaScript

Do NOT convert the project to TypeScript.

The project should remain JavaScript-based unless the project owner explicitly changes this requirement.

---

## 4.2 Frontend

Preferred architecture:

* React
* Next.js
* JavaScript
* Custom CSS
* Modern browser APIs
* Accessible UI primitives where appropriate

Next.js should be used for the primary website application.

---

## 4.3 CSS

# DO NOT USE TAILWIND CSS.

The design system must be implemented using:

* CSS
* CSS Modules where useful
* global design tokens
* CSS variables
* component-level styling
* reusable style utilities where appropriate

The UI must not depend on Tailwind.

---

## 4.4 Backend

The backend must use JavaScript.

Preferred technologies may include:

* Node.js
* Fastify
* Express
* NestJS if justified

The final choice must be consistent across the architecture.

Backend business rules must never depend exclusively on frontend validation.

---

## 4.5 Database

Preferred primary database:

# PostgreSQL

The database architecture must support:

* relational integrity
* transactions
* foreign keys
* indexes
* constraints
* auditability
* multi-organization data isolation
* financial consistency
* scalable querying

---

## 4.6 Caching and Background Processing

Redis may be used where appropriate for:

* caching
* queues
* rate limiting
* temporary state
* background jobs
* event processing
* session-related infrastructure where justified

Do not introduce Redis merely because it is popular.

Every infrastructure component must have a clear purpose.

---

## 4.7 API

The system must expose a professional API architecture.

Preferred approach:

* REST APIs
* versioned APIs
* authentication
* authorization
* validation
* pagination
* filtering
* sorting
* error standards
* idempotency where required
* audit events
* webhooks
* event-driven integration readiness

GraphQL may be considered later if a concrete requirement justifies it.

---

# 5. UI/UX PRINCIPLES

The application must have a distinctive professional enterprise interface.

It must NOT look like:

* a generic AI-generated dashboard
* a basic Bootstrap admin panel
* a student project
* a template with random cards
* a collection of unrelated screens

The design system must feel like one coherent product.

---

# 6. VISUAL DESIGN

The primary visual direction should use sophisticated blue-based gradients combined with neutral and semantic colors.

The design system should support:

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

Do not hard-code colors repeatedly inside components.

---

# 7. THEME SYSTEM

The application must support at least 10 themes.

Potential themes include:

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

The architecture must allow additional themes to be added.

Users and organizations should be able to configure supported appearance settings.

Theme changes must not require rewriting components.

---

# 8. ANIMATION AND MOTION

The application should contain high-quality animations and micro-interactions.

Animations should be:

* smooth
* intentional
* professional
* performant
* accessible
* consistent

Use animation for:

* page transitions
* modal transitions
* drawers
* dropdowns
* hover states
* buttons
* cards
* table interactions
* notifications
* loading states
* dashboard transitions
* charts
* navigation
* command interfaces

Do NOT animate everything.

Enterprise software must prioritize usability and performance over visual effects.

Respect:

`prefers-reduced-motion`

---

# 9. RESPONSIVE DESIGN

The website must work across:

* desktop
* laptop
* tablet
* mobile browsers

The desktop experience should be optimized for enterprise productivity.

Mobile responsive behavior must not simply shrink desktop screens.

Layouts should intelligently transform.

Examples:

Desktop table:

Columns | Columns | Columns | Columns

Mobile:

Primary information
→ Details
→ Actions
→ Additional information

---

# 10. FUTURE MOBILE APPLICATION

The backend and business logic must be designed so that future mobile applications can consume the same APIs.

Future applications may support:

* Android
* iOS

Potential future technology:

* React Native

Do not build business logic directly into browser-only components when it should exist in shared backend/domain logic.

---

# 11. ERP MODULE ARCHITECTURE

The initial major module structure is:

1. Organization Management
2. User & Access Management
3. Product & Service Management
4. Inventory Management
5. Warehouse Management
6. Sales Management
7. POS Management
8. Customer & CRM
9. Purchase Management
10. Supplier Management
11. Procurement Management
12. Accounting & Finance
13. Accounts Receivable
14. Accounts Payable
15. Cash & Bank Management
16. Expense Management
17. Budget & Financial Planning
18. Tax & Compliance
19. HR Management
20. Attendance & Leave
21. Payroll Management
22. Manufacturing / Production
23. MRP
24. Quality Management
25. Supply Chain Management
26. Logistics & Delivery
27. Fleet Management
28. Asset Management
29. Maintenance Management
30. Project Management
31. Contract Management
32. Service Management / Help Desk
33. Appointment & Scheduling
34. Document Management
35. Workflow & Approval Management
36. Marketing Management
37. E-Commerce & Integrations
38. Business Intelligence & Reporting
39. AI & Automation
40. System Administration & Configuration

Additional modules may be introduced when professionally justified.

---

# 12. MODULE DEVELOPMENT RULE

Every module specification should contain, where applicable:

* Purpose
* Objectives
* Scope
* Actors
* Roles
* Submodules
* Features
* Screens
* Navigation
* Data entities
* Relationships
* Workflows
* Statuses
* Business rules
* Validation
* Permissions
* Approval requirements
* Notifications
* Reports
* Dashboards
* KPIs
* APIs
* Events
* Integrations
* Audit events
* Customization
* Automation
* AI capabilities
* Offline behavior
* Dependencies
* Industry applicability
* Future extensions
* Acceptance criteria

Do not implement a module based on a vague title alone.

---

# 13. CUSTOMIZATION ENGINE

The platform must support deep organization-level customization.

Organizations should be able to configure:

* custom fields
* custom forms
* custom modules
* custom statuses
* custom workflows
* custom approvals
* custom business rules
* custom numbering
* custom labels
* custom menus
* custom dashboards
* custom reports
* custom notifications
* custom document templates
* custom roles
* custom permissions

The customization architecture must not require source-code modification for normal organization-level customization.

---

# 14. INDUSTRY SUPPORT

The core ERP must remain industry-neutral.

Industry-specific behavior should be introduced through:

* templates
* configurations
* optional modules
* workflows
* custom fields
* business rules
* industry packs
* extensions

Potential supported industries include:

* Retail
* Wholesale
* Distribution
* Manufacturing
* Restaurants
* Food businesses
* Hospitality
* Education
* Healthcare administration
* Construction
* Real estate
* Logistics
* Transportation
* Automotive
* Agriculture
* Professional services
* Repair businesses
* Service businesses
* Subscription businesses
* Non-profit organizations
* Franchises

The system should be extensible to additional industries.

---

# 15. SECURITY

Security is a core architectural requirement.

The platform must implement:

* secure authentication
* secure password hashing
* session security
* authorization
* role-based access control
* granular permissions
* tenant isolation
* input validation
* output validation
* secure HTTP headers
* CSRF protection where applicable
* rate limiting
* audit logging
* security event logging
* secret management
* encryption in transit
* appropriate encryption at rest
* secure file access
* dependency security
* backup security

Never trust the client.

Every sensitive operation must be authorized on the server.

---

# 16. AUDITABILITY

Important business operations must be auditable.

Audit records should capture, where appropriate:

* actor
* organization
* timestamp
* action
* entity
* entity ID
* previous state
* new state
* source
* IP/device metadata where appropriate
* correlation/request ID

Financial records must never be silently modified in ways that destroy accounting history.

Prefer:

* reversals
* adjustments
* corrections
* compensating transactions

over destructive mutations.

---

# 17. PERMISSION ARCHITECTURE

Do not create a system where permissions are only:

* admin
* user

The platform must support granular permissions.

Possible permission levels:

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

Permissions may also be scoped by:

* organization
* company
* branch
* department
* warehouse
* location
* record
* ownership
* role

---

# 18. FINANCIAL INTEGRITY

Accounting and financial modules must follow professional accounting principles.

The system should support:

* chart of accounts
* double-entry accounting
* journal entries
* general ledger
* accounts receivable
* accounts payable
* bank accounts
* cash accounts
* reconciliations
* fiscal periods
* period closing
* financial statements
* budgets
* cost centers
* profit centers
* taxes
* multi-currency accounting
* audit trails

Never implement financial posting as simple CRUD.

---

# 19. INVENTORY INTEGRITY

Inventory must be transaction-driven.

Important inventory concepts include:

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
* reorder rules
* minimum levels
* maximum levels

Stock quantity should not be treated as an arbitrary editable number.

---

# 20. POS REQUIREMENTS

POS must support professional counter-sale workflows.

Example:

1. Cashier starts POS session.
2. Customer arrives.
3. Product barcode is scanned.
4. System identifies the product.
5. Product details are displayed.
6. Current price is determined.
7. Applicable taxes are calculated.
8. Discounts are applied according to permissions/rules.
9. Product availability is verified.
10. Product is added to cart.
11. Customer may be attached.
12. Payment is selected.
13. Payment is processed.
14. Sale is finalized.
15. Inventory is updated.
16. Accounting entries are generated where applicable.
17. Receipt is generated.
18. Audit event is recorded.

POS must also support:

* returns
* refunds
* exchanges
* suspended sales
* cash drawer
* opening cash
* closing cash
* end-of-day reconciliation
* multiple payment methods
* barcode scanners
* receipt printers
* offline operation where supported
* synchronization

---

# 21. OFFLINE-FIRST REQUIREMENTS

The web platform should support offline functionality for appropriate workflows.

Offline candidates may include:

* POS
* product lookup
* inventory lookup
* draft documents
* field service
* selected warehouse workflows
* barcode scanning
* selected forms

Offline architecture may use:

* IndexedDB
* service workers
* local queues
* sync queues
* retry mechanisms
* conflict detection
* reconciliation

Not every feature needs to work offline.

Cloud-only capabilities may include:

* centralized AI processing
* external integrations
* real-time multi-user collaboration
* centralized backups
* external payment processing
* certain administrative operations

---

# 22. DATA SYNCHRONIZATION

Synchronization must be designed explicitly.

Requirements include:

* retry-safe operations
* idempotency
* conflict detection
* conflict resolution
* sync status
* failed sync queue
* retry controls
* timestamps
* versioning
* reconciliation

Never assume network connectivity is permanent.

---

# 23. DOCUMENT MANAGEMENT

The platform must support:

* file uploads
* attachments
* documents
* versions
* metadata
* access permissions
* document categories
* previews where supported
* document templates
* generated PDFs
* printing
* retention rules
* audit trails

Files must not be publicly accessible unless intentionally configured.

---

# 24. NOTIFICATIONS

The platform should support:

* in-app notifications
* email
* push notifications in future
* SMS integration readiness
* workflow notifications
* approval notifications
* alert notifications
* system notifications

Notification rules should be configurable.

---

# 25. REPORTING AND ANALYTICS

Reports should not be hard-coded wherever configuration can reasonably support them.

Support:

* filters
* grouping
* sorting
* date ranges
* saved reports
* exports
* scheduling
* dashboards
* KPIs
* charts
* drill-down
* permissions

Potential exports:

* CSV
* Excel
* PDF

---

# 26. AI AND AUTOMATION

AI must enhance the ERP rather than replace deterministic business rules.

Potential AI capabilities:

* natural-language business assistant
* sales forecasting
* inventory forecasting
* demand prediction
* anomaly detection
* expense categorization
* document extraction
* invoice extraction
* OCR
* intelligent search
* report summarization
* business insights
* predictive maintenance
* recommendation systems
* workflow suggestions

AI must not bypass:

* authorization
* accounting controls
* auditability
* approval processes
* security controls

AI actions that change important business data should require appropriate authorization.

---

# 27. PERFORMANCE

The platform must be designed for large datasets.

Consider:

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

Never load thousands of database records into the browser unnecessarily.

---

# 28. DATABASE RULES

Database design must prioritize:

* normalization where appropriate
* integrity
* constraints
* indexing
* transactions
* referential integrity
* auditability
* scalability

Avoid excessive duplication.

Avoid storing critical relational data only as unstructured JSON when relational modeling is appropriate.

JSON/JSONB may be used for genuinely dynamic configuration or extensibility.

---

# 29. API RULES

APIs should have:

* consistent naming
* versioning
* validation
* authentication
* authorization
* pagination
* filtering
* sorting
* standardized errors
* rate limiting
* auditability
* request IDs

Sensitive endpoints must be protected.

---

# 30. ERROR HANDLING

Errors must be designed intentionally.

The UI should provide:

* clear messages
* actionable guidance
* retry options
* validation feedback
* loading states
* empty states
* permission states
* offline states
* conflict states

Never expose:

* database stack traces
* secrets
* internal credentials
* sensitive server information

to end users.

---

# 31. ACCESSIBILITY

The application should target strong accessibility practices.

Support:

* keyboard navigation
* semantic HTML
* visible focus
* sufficient contrast
* accessible labels
* screen reader compatibility
* reduced motion
* accessible forms
* accessible dialogs
* accessible tables

---

# 32. INTERNATIONALIZATION

The platform must be designed for:

* multiple languages
* multiple currencies
* multiple time zones
* multiple date formats
* number formatting
* decimal precision
* RTL languages

Do not hard-code UI text directly into components when localization is expected.

---

# 33. SEARCH

The platform should eventually provide unified search.

Search may cover:

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

Search should respect user permissions.

---

# 34. COMMAND CENTER

The platform should support a powerful command/search interface.

Potential capabilities:

* navigate to modules
* search records
* create records
* execute actions
* open recent items
* access settings
* show shortcuts

Every command must respect authorization.

---

# 35. DESIGN REFERENCES

The project owner may provide:

* screenshots
* images
* website references
* UI examples
* animations
* design inspiration

These references should be treated as design input.

Do not blindly copy copyrighted designs.

Instead identify:

* layout principles
* visual hierarchy
* interaction patterns
* spacing
* typography
* animation behavior
* information architecture
* component patterns

and translate them into the project's own design system.

---

# 36. CODE QUALITY

Code must be:

* readable
* modular
* maintainable
* reusable
* documented where necessary
* testable
* secure

Avoid:

* giant components
* duplicated business logic
* duplicated UI logic
* hard-coded configuration
* hidden side effects
* magic values
* unnecessary dependencies

---

# 37. COMPONENT ARCHITECTURE

Build reusable components for common ERP patterns.

Examples:

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

Components must support consistent behavior and accessibility.

---

# 38. TABLE DESIGN

ERP systems frequently require dense tables.

Tables must support where appropriate:

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
* responsive transformation

Do not sacrifice productivity for decorative UI.

---

# 39. FORMS

Forms should support:

* validation
* required fields
* conditional fields
* sections
* tabs
* autosave where appropriate
* draft mode
* server validation
* permission-aware fields
* custom fields
* attachments
* comments
* audit information

Complex forms should not become overwhelming.

Use progressive disclosure.

---

# 40. TESTING

Testing must exist at multiple levels.

Include:

* unit tests
* component tests
* integration tests
* API tests
* database tests
* end-to-end tests
* security testing
* permission testing
* workflow testing
* offline synchronization testing

Critical financial and inventory workflows require especially strong testing.

---

# 41. DEVELOPMENT PROCESS

When implementing a feature:

1. Read the relevant specification.
2. Identify dependencies.
3. Identify affected modules.
4. Design data requirements.
5. Design API requirements.
6. Design permission requirements.
7. Design UI.
8. Implement backend/domain behavior.
9. Implement frontend.
10. Implement validation.
11. Implement audit logging.
12. Implement notifications where required.
13. Add tests.
14. Test authorization.
15. Test edge cases.
16. Review performance.
17. Review accessibility.
18. Review responsive behavior.
19. Update documentation.
20. Only then consider the feature complete.

---

# 42. DO NOT CREATE ISOLATED FEATURES

ERP features must connect to the wider system.

For example:

A completed sale may affect:

Sales
→ Customer balance
→ Inventory
→ Warehouse
→ Tax
→ Accounts receivable
→ General ledger
→ Cash/bank
→ Reporting
→ Audit trail

Do not implement each module as an isolated CRUD application.

---

# 43. MODULE DEPENDENCIES

Modules should define their dependencies explicitly.

Example:

POS may depend on:

* Organization
* Users
* Products
* Inventory
* Pricing
* Customers
* Tax
* Payments
* Accounting

Manufacturing may depend on:

* Products
* Inventory
* Warehouses
* BOM
* MRP
* Quality
* Maintenance
* Accounting

Dependencies must be documented before implementation.

---

# 44. FEATURE PRIORITIZATION

Features should be classified as:

## P0 — Critical

Required for core operation.

## P1 — High Priority

Required for professional usability.

## P2 — Important

Adds significant business value.

## P3 — Advanced

Advanced enterprise capabilities.

## P4 — Future

Long-term capabilities.

Do not implement P4 functionality before the foundational architecture is stable.

---

# 45. NO PREMATURE SIMPLIFICATION

If a requirement is complex, do not automatically simplify it.

Instead:

1. Identify the complexity.
2. Determine whether it belongs in the current phase.
3. Design the architecture for it.
4. Implement the appropriate scope.
5. Document future extensions.

The goal is to avoid architectural dead ends.

---

# 46. NO UNAUTHORIZED TECHNOLOGY CHANGES

Do not replace the required architecture simply because another technology is easier.

In particular:

* Do not switch JavaScript to TypeScript.
* Do not introduce Tailwind CSS.
* Do not replace PostgreSQL without justification.
* Do not remove multi-tenancy.
* Do not remove auditability.
* Do not turn modules into unrelated mini-applications.

Any major architectural change must be explicitly justified.

---

# 47. SOURCE OF TRUTH

The project specification repository should contain:

* master instructions
* architecture
* product requirements
* module specifications
* design system
* API specification
* database specification
* security specification
* development rules
* testing rules
* deployment rules

When implementing a feature, the agent should search the specification repository before making architectural decisions.

---

# 48. DOCUMENTATION MAINTENANCE

When implementation changes behavior:

1. Update the relevant specification.
2. Update API documentation.
3. Update database documentation if necessary.
4. Update acceptance criteria.
5. Update tests.

Documentation must not become permanently outdated.

---

# 49. DEFINITION OF DONE

A feature is not considered complete merely because the UI exists.

A feature is complete when applicable:

* UI works
* API works
* database behavior works
* validation works
* permissions work
* business rules work
* audit logging works
* notifications work
* integrations work
* error handling works
* responsive behavior works
* accessibility works
* tests exist
* edge cases are handled
* documentation is updated

---

# 50. FINAL DEVELOPMENT PRINCIPLE

Build this platform as a long-term product.

Every architectural decision should answer:

> "Will this still make sense when the system has thousands of users, multiple organizations, millions of records, many modules, multiple industries, mobile applications, integrations, and years of historical data?"

Prefer designs that remain maintainable and extensible at that scale.

The platform should feel like a mature ERP product rather than a collection of generated pages.

END OF MASTER INSTRUCTIONS
