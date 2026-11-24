# DATA MODEL

## Professional ERP & Business Management Platform

**Document:** `13-DATA-MODEL.md`
**Document Type:** Core Platform Data Architecture Specification
**Status:** Approved Architecture Specification
**Database:** PostgreSQL
**ORM / Data Access:** As defined by `04-TECH-STACK.md`
**Primary API Style:** Versioned REST API

---

# 1. PURPOSE

This document defines the conceptual and architectural data model for the ERP & Business Management Platform.

The data model must provide a stable foundation for:

* multi-tenancy
* multi-organization operation
* multi-company operation
* branches
* departments
* users
* roles
* permissions
* products
* services
* inventory
* warehouses
* sales
* POS
* customers
* suppliers
* procurement
* finance
* accounting
* HR
* payroll
* manufacturing
* projects
* CRM
* service management
* documents
* workflows
* approvals
* notifications
* reporting
* integrations
* customization
* automation
* audit
* future modules

The model must remain modular enough that additional modules can be introduced without restructuring the entire platform.

---

# 2. DATA MODEL OBJECTIVES

The architecture must prioritize:

1. Data integrity.
2. Tenant isolation.
3. Referential integrity.
4. Auditability.
5. Scalability.
6. Query performance.
7. Modular ownership.
8. Extensibility.
9. Configurability.
10. Financial integrity.
11. Inventory integrity.
12. Historical accuracy.
13. Security.
14. Versioning.
15. Concurrency safety.
16. Reporting capability.
17. Offline synchronization support.
18. Future mobile support.
19. Future AI/automation support.
20. Controlled customization.

---

# 3. DATABASE PRINCIPLES

The platform database must follow these principles:

* PostgreSQL is the primary relational database.
* Relational structure is preferred for authoritative business data.
* Foreign keys should be used where appropriate.
* Unique constraints must protect business invariants.
* Check constraints should protect valid ranges and states.
* Transactions must protect multi-record business operations.
* JSONB should be used only for genuinely dynamic structures.
* Financial history must be append-oriented.
* Inventory movements must be ledger-oriented.
* Audit records must be immutable or strongly protected.
* Tenant ownership must be explicit.
* Soft deletion must be used carefully.
* Historical records must not be destroyed merely for convenience.

---

# 4. DATA OWNERSHIP MODEL

Every entity must have a clearly defined owner.

Possible ownership scopes:

```text
Platform
Organization
Company
Branch
Business Unit
Department
Location
Warehouse
User
Module
Record
```

Ownership determines:

* access
* visibility
* configuration
* lifecycle
* retention
* reporting scope

---

# 5. MULTI-TENANT DATA MODEL

The platform must be multi-tenant from the beginning.

Conceptual hierarchy:

```text
Platform
    ↓
Organization
    ↓
Company
    ↓
Branch
    ↓
Department
    ↓
Location / Warehouse
```

Not every organization must use every level.

---

# 6. ORGANIZATION

The organization is the primary tenant/business boundary.

Conceptual fields:

```text
id
name
code
legal_name
status
default_currency
timezone
locale
country
industry
settings
created_at
updated_at
```

Additional organization configuration should remain modular.

---

# 7. COMPANY

A company represents a legal or operational company within an organization.

Possible fields:

```text
id
organization_id
name
code
legal_name
registration_number
tax_number
status
base_currency
timezone
address
contact_information
settings
created_at
updated_at
```

---

# 8. BRANCH

Branches belong to an organization/company.

Possible fields:

```text
id
organization_id
company_id
name
code
address
contact_information
manager_id
status
settings
created_at
updated_at
```

---

# 9. BUSINESS UNITS

Business units may represent:

* divisions
* regions
* operating groups
* business lines

They may be hierarchical.

```text
Organization
 ├── Business Unit A
 │    ├── Region 1
 │    └── Region 2
 └── Business Unit B
```

---

# 10. DEPARTMENTS

Departments may belong to companies, branches, or business units.

Example:

```text
Finance
HR
Sales
Procurement
Operations
Production
IT
```

Departments may also have parent-child structures.

---

# 11. LOCATIONS

Locations represent physical or logical operational locations.

Examples:

* office
* warehouse
* store
* production area
* stock room
* service location

---

# 12. WAREHOUSES

Warehouse data must be separate from generic locations where inventory functionality requires additional semantics.

Conceptual fields:

```text
id
organization_id
company_id
branch_id
location_id
name
code
status
warehouse_type
settings
```

---

# 13. STORAGE LOCATIONS

Warehouses may contain hierarchical storage locations.

Example:

```text
Warehouse A
 ├── Zone A
 │    ├── Rack 01
 │    │    ├── Shelf 01
 │    │    └── Shelf 02
 │    └── Rack 02
 └── Zone B
```

---

# 14. USERS

Users are platform identities.

Conceptual fields:

```text
id
email
username
password_hash
status
display_name
phone
locale
timezone
last_login_at
created_at
updated_at
```

Authentication-specific fields should remain separated where appropriate.

---

# 15. ORGANIZATION MEMBERSHIP

A user may belong to multiple organizations.

Conceptual model:

```text
User
   ↓
Organization Membership
   ↓
Organization
```

Membership may contain:

* organization
* user
* status
* default role
* default company
* default branch
* joined date

---

# 16. ROLES

Roles define collections of permissions.

Conceptual fields:

```text
id
organization_id
name
code
description
is_system_role
status
```

---

# 17. PERMISSIONS

Permissions should be represented independently of roles.

Example:

```text
inventory.view
inventory.create
inventory.edit
inventory.adjust
inventory.approve
inventory.export
```

---

# 18. ROLE-PERMISSION RELATIONSHIP

```text
Role
  ↓
RolePermission
  ↓
Permission
```

A role may contain many permissions.

A permission may belong to many roles.

---

# 19. USER-ROLE RELATIONSHIP

Users may receive roles through:

* organization membership
* company
* branch
* department
* direct assignment

The authorization layer must resolve effective permissions.

---

# 20. ACCESS SCOPE

Permission assignments may include scope.

Possible scopes:

```text
Organization
Company
Branch
Department
Warehouse
Location
Own Records
Assigned Records
```

This allows:

> User can manage inventory only in Branch A.

---

# 21. CORE ENTITY IDENTIFIERS

Every persistent entity should have a stable unique identifier.

The exact ID strategy must be defined consistently across the platform.

IDs must:

* be unique
* be immutable
* not depend on display names
* support distributed operations where necessary

---

# 22. BUSINESS DOCUMENT NUMBERS

Business documents require separate human-readable numbers.

Example:

```text
PO-2026-000001
INV-2026-000145
SO-2026-000098
```

The document number must not replace the primary database identifier.

---

# 23. NUMBERING CONFIGURATION

Numbering may be configurable by:

* organization
* company
* branch
* document type
* fiscal year
* sequence

The numbering system must prevent duplicate document numbers where uniqueness is required.

---

# 24. COMMON AUDIT FIELDS

Applicable entities should contain:

```text
created_at
created_by
updated_at
updated_by
```

Additional fields may include:

```text
deleted_at
deleted_by
version
```

Not every entity should use soft deletion.

---

# 25. SOFT DELETION

Soft deletion may be used for configurable/master data where historical references must remain valid.

Example:

```text
status = archived
```

is often preferable to physical deletion.

Financial and historical records should generally not be physically deleted.

---

# 26. STATUS MODEL

Entities should use explicit lifecycle statuses where required.

Examples:

```text
draft
active
inactive
archived
cancelled
completed
```

Statuses must represent meaningful business states rather than arbitrary UI labels.

---

# 27. PRODUCT MODEL

Products are core master data.

A product may represent:

* physical item
* consumable
* raw material
* finished good
* spare part
* asset-related item
* service-related item

---

# 28. PRODUCT ENTITY

Conceptual fields:

```text
id
organization_id
sku
name
description
product_type
status
category_id
brand_id
default_uom_id
tax_profile_id
tracking_type
pricing_configuration
inventory_configuration
custom_data
```

---

# 29. PRODUCT TYPES

Examples:

```text
Stock Item
Non-Stock Item
Service
Bundle
Kit
Raw Material
Finished Good
Asset
Digital Product
```

The exact type system should remain extensible.

---

# 30. PRODUCT CATEGORIES

Categories may form hierarchies.

```text
Electronics
 ├── Computers
 │    ├── Laptops
 │    └── Desktops
 └── Accessories
```

Categories may contain organization-specific configuration.

---

# 31. PRODUCT VARIANTS

Products may have variants based on attributes.

Example:

```text
T-Shirt
 ├── Small / Black
 ├── Medium / Black
 ├── Large / Black
 └── Medium / White
```

Variant data must be normalized enough to support efficient inventory operations.

---

# 32. PRODUCT ATTRIBUTES

Attributes may include:

* size
* color
* material
* model
* capacity
* weight
* dimensions
* custom attributes

Dynamic attributes may use controlled JSONB structures where appropriate.

---

# 33. UNITS OF MEASURE

UOM data should support:

* pieces
* kilograms
* grams
* liters
* meters
* boxes
* cartons
* pallets
* hours

Conversions must be explicitly defined.

Example:

```text
1 carton = 24 pieces
```

---

# 34. INVENTORY MODEL

Inventory must be movement-oriented.

The system must not treat stock quantity as a freely editable field.

Conceptual structure:

```text
Product
 ↓
Inventory Item / Stock Context
 ↓
Stock Movement
 ↓
Stock Ledger
 ↓
Current Balance
```

---

# 35. STOCK MOVEMENT

Stock movement may represent:

* receipt
* issue
* transfer
* adjustment
* reservation
* release
* return
* production consumption
* production output
* damage
* write-off

---

# 36. STOCK LEDGER

The stock ledger should preserve the history of inventory changes.

Conceptual fields:

```text
id
organization_id
warehouse_id
location_id
product_id
movement_type
quantity
uom_id
reference_type
reference_id
unit_cost
total_cost
movement_date
created_by
```

---

# 37. INVENTORY BALANCE

Current stock may be derived or maintained as a controlled projection of stock movements.

Possible dimensions:

```text
product
warehouse
location
batch
serial
uom
```

The balance must remain consistent with the stock ledger.

---

# 38. BATCH TRACKING

Products may support batch/lot tracking.

Batch data may include:

```text
batch_number
product_id
manufacture_date
expiry_date
supplier
status
```

---

# 39. SERIAL TRACKING

Serialized products require unique serial identities.

Examples:

* laptops
* phones
* machinery
* medical equipment

Serial numbers must not be duplicated within the relevant scope.

---

# 40. EXPIRY TRACKING

Expiry-controlled inventory should retain:

* expiry date
* batch
* product
* quantity
* location

The system may generate expiry alerts.

---

# 41. INVENTORY RESERVATIONS

Reservations represent stock committed to a business process without necessarily issuing it.

Example:

```text
Sales Order
 ↓
Reserve Stock
 ↓
Pick
 ↓
Issue
```

Reservation state must be separate from physical stock.

---

# 42. WAREHOUSE TRANSFERS

Transfers must preserve:

* source
* destination
* products
* quantities
* status
* requester
* approver
* execution records

---

# 43. STOCK COUNTS

Stock count entities should capture:

* counting session
* warehouse
* location
* product
* expected quantity
* counted quantity
* variance
* approval
* adjustment reference

---

# 44. CUSTOMER MODEL

Customers should support:

* individuals
* companies
* organizations
* groups

Conceptual fields:

```text
id
organization_id
customer_code
name
customer_type
contact_information
billing_address
shipping_address
tax_information
credit_limit
status
```

---

# 45. SUPPLIER MODEL

Suppliers should support:

* individuals
* companies
* organizations

Possible fields:

```text
id
organization_id
supplier_code
name
supplier_type
contact_information
billing_address
tax_information
payment_terms
status
```

---

# 46. CONTACT MODEL

Reusable contacts may be associated with:

* customers
* suppliers
* employees
* organizations
* partners

Contacts should not require duplicated person records unnecessarily.

---

# 47. ADDRESS MODEL

Addresses should support:

* billing
* shipping
* office
* home
* warehouse
* branch
* delivery

Addresses may be reusable but must preserve historical document snapshots where required.

---

# 48. SALES MODEL

Sales may include:

```text
Quotation
Sales Order
Delivery
Invoice
Payment
Return
Refund
```

Each document should have its own lifecycle.

---

# 49. SALES DOCUMENT RELATIONSHIPS

Example:

```text
Quotation
   ↓
Sales Order
   ↓
Delivery
   ↓
Invoice
   ↓
Payment
```

Not every business requires every step.

---

# 50. PURCHASE MODEL

Purchasing may include:

```text
Purchase Request
Request for Quotation
Supplier Quotation
Purchase Order
Receipt
Supplier Invoice
Payment
Return
```

---

# 51. PROCUREMENT RELATIONSHIPS

Example:

```text
Purchase Request
      ↓
RFQ
      ↓
Supplier Quotation
      ↓
Purchase Order
      ↓
Receipt
      ↓
Supplier Invoice
      ↓
Payment
```

---

# 52. DOCUMENT LINE MODEL

Transaction documents should generally separate header and line entities.

Example:

```text
SalesOrder
   ↓
SalesOrderLine
```

The same pattern may apply to:

* purchase orders
* invoices
* quotations
* stock documents
* production documents

---

# 53. SNAPSHOT DATA

Transactional records should preserve important historical values.

For example, an invoice line may preserve:

* product description
* unit price
* tax
* discount
* UOM

Changing the product master later must not rewrite historical invoices.

---

# 54. PRICING MODEL

Pricing may include:

* base price
* price lists
* customer-specific price
* supplier-specific price
* quantity pricing
* promotional price
* currency-specific price
* effective dates

---

# 55. TAX MODEL

Tax structures should support:

* tax profiles
* tax rates
* tax categories
* exemptions
* effective dates
* jurisdiction

Tax configuration must remain organization-aware.

---

# 56. FINANCIAL DATA MODEL

Financial data requires strict integrity.

Core conceptual entities include:

```text
ChartOfAccounts
Account
Journal
JournalEntry
JournalLine
FiscalPeriod
FinancialDocument
Payment
BankAccount
CashAccount
Tax
Budget
CostCenter
ProfitCenter
```

---

# 57. ACCOUNTING RELATIONSHIPS

Example:

```text
Financial Transaction
        ↓
Journal Entry
        ↓
Journal Lines
        ↓
Accounts
```

---

# 58. DOUBLE-ENTRY MODEL

Each posted journal entry must satisfy:

```text
Total Debits = Total Credits
```

The database and accounting service must prevent invalid posted entries.

---

# 59. JOURNAL ENTRY IMMUTABILITY

Posted journal entries must not be arbitrarily edited.

Corrections should use:

* reversal
* adjustment
* correcting entry
* compensating transaction

The original history must remain auditable.

---

# 60. ACCOUNTS RECEIVABLE

AR may contain:

* customer invoices
* receivable balances
* payments
* credits
* refunds
* aging records

---

# 61. ACCOUNTS PAYABLE

AP may contain:

* supplier invoices
* payable balances
* payments
* debit/credit adjustments
* aging records

---

# 62. BANKING MODEL

Banking data may include:

```text
Bank
BankAccount
BankTransaction
BankReconciliation
CashAccount
CashTransaction
```

Sensitive banking information must be protected.

---

# 63. PAYMENT MODEL

Payments may reference:

* customer
* supplier
* invoice
* order
* bank account
* cash account
* payment method

Payment records must preserve historical context.

---

# 64. EXPENSE MODEL

Expenses may include:

* employee
* department
* project
* cost center
* amount
* tax
* receipt
* approval status
* payment status

---

# 65. BUDGET MODEL

Budgets may be defined by:

* organization
* company
* department
* account
* cost center
* project
* period

Budget consumption should be traceable.

---

# 66. COST AND PROFIT CENTERS

The model should support analytical dimensions such as:

```text
Cost Center
Profit Center
Department
Project
Branch
Business Unit
```

These dimensions support reporting without changing core accounting structures.

---

# 67. HR DATA MODEL

HR may include:

```text
Employee
Employment
Department
Position
Contract
Attendance
Leave
Payroll
Compensation
```

Sensitive employee information requires strict access controls.

---

# 68. EMPLOYEE MODEL

Employee data should be separated from platform authentication identity.

Relationship:

```text
User
 ↓
Employee Profile
 ↓
Employment
```

A person may have an employee record without requiring unrestricted access to the system.

---

# 69. ATTENDANCE MODEL

Attendance may include:

* employee
* date
* check-in
* check-out
* attendance status
* location/device reference
* corrections
* approval

---

# 70. LEAVE MODEL

Leave may include:

```text
LeaveType
LeaveBalance
LeaveRequest
LeaveApproval
LeavePeriod
```

---

# 71. PAYROLL MODEL

Payroll should be represented using controlled structures for:

* payroll periods
* employee compensation
* earnings
* deductions
* taxes
* adjustments
* payroll runs

Payroll data must remain highly restricted.

---

# 72. MANUFACTURING MODEL

Manufacturing may include:

```text
BillOfMaterials
BOMLine
Routing
WorkCenter
ProductionOrder
MaterialConsumption
ProductionOutput
QualityCheck
```

---

# 73. BILL OF MATERIALS

A BOM defines required components.

Example:

```text
Finished Product
 ├── Component A
 ├── Component B
 └── Component C
```

BOMs should support versioning.

---

# 74. PRODUCTION ORDER

Production orders may track:

* product
* planned quantity
* actual quantity
* materials
* work centers
* status
* dates
* quality
* costs

---

# 75. CRM MODEL

CRM may include:

```text
Lead
Opportunity
Activity
Campaign
CustomerInteraction
Pipeline
PipelineStage
```

---

# 76. PROJECT MODEL

Projects may include:

```text
Project
ProjectTask
Milestone
Timesheet
ProjectExpense
ProjectBudget
ProjectMember
```

---

# 77. SERVICE MANAGEMENT MODEL

Service functionality may include:

```text
Ticket
TicketComment
TicketAssignment
TicketStatus
ServiceRequest
SLA
ServiceActivity
```

---

# 78. DOCUMENT MANAGEMENT MODEL

Documents may include:

```text
Document
DocumentVersion
DocumentFolder
DocumentPermission
DocumentShare
DocumentTemplate
DocumentAudit
```

---

# 79. FILE MODEL

Files should store metadata rather than relying on database blobs for every file.

Metadata may include:

```text
id
organization_id
storage_key
filename
mime_type
size
checksum
uploaded_by
created_at
```

Actual storage may use configured object/file storage.

---

# 80. DOCUMENT VERSIONING

Documents may have:

```text
Document
 ├── Version 1
 ├── Version 2
 └── Version 3
```

Each version should remain identifiable.

---

# 81. WORKFLOW DATA MODEL

Workflow entities include:

```text
WorkflowDefinition
WorkflowVersion
WorkflowInstance
WorkflowState
WorkflowTransition
WorkflowTask
WorkflowApproval
WorkflowAction
WorkflowExecution
WorkflowAuditEvent
```

Detailed workflow behavior is defined in:

`12-WORKFLOW-APPROVAL-ENGINE.md`

---

# 82. NOTIFICATION MODEL

Notifications may include:

```text
Notification
NotificationRecipient
NotificationTemplate
NotificationPreference
NotificationDelivery
```

Delivery attempts must be traceable.

---

# 83. AUDIT MODEL

Audit entities may include:

```text
AuditEvent
AuditChange
SecurityEvent
LoginEvent
DataAccessEvent
```

Audit records should capture meaningful changes.

---

# 84. CUSTOMIZATION DATA MODEL

The customization engine requires metadata entities for:

```text
CustomEntity
CustomField
CustomFieldOption
CustomForm
CustomFormField
CustomView
CustomStatus
CustomRule
CustomWorkflowConfiguration
CustomDashboard
CustomReport
```

Dynamic configuration may use JSONB where appropriate.

---

# 85. JSONB USAGE

JSONB is permitted for genuinely dynamic structures such as:

* custom field values
* configurable UI metadata
* workflow configuration
* organization settings
* integration configuration
* dynamic attributes

JSONB must not replace normalized relational data unnecessarily.

---

# 86. JSONB RESTRICTIONS

Do not store core authoritative business relationships entirely inside JSONB.

Bad:

```text
invoice.data = {
  customer: ...,
  total: ...,
  lines: ...
}
```

Preferred:

```text
Invoice
InvoiceLine
Customer
Tax
Payment
```

with relational references.

---

# 87. RELATIONSHIP TYPES

The platform should support:

### One-to-One

```text
User ↔ UserProfile
```

### One-to-Many

```text
Invoice → InvoiceLines
```

### Many-to-Many

```text
Role ↔ Permission
```

using junction tables.

---

# 88. FOREIGN KEYS

Foreign keys should be used where practical to enforce referential integrity.

However, special handling may be required for:

* polymorphic references
* audit logs
* external references
* configurable entities

---

# 89. POLYMORPHIC REFERENCES

Some platform services require references such as:

```text
reference_type
reference_id
```

Examples:

* audit
* attachments
* comments
* notifications
* workflow instances

These require application-level validation where normal foreign keys cannot be used.

---

# 90. DELETE STRATEGY

Deletion must be intentional.

Possible strategies:

```text
RESTRICT
CASCADE
SET NULL
ARCHIVE
SOFT DELETE
```

Financial and historical data should generally use `RESTRICT` or archival approaches.

---

# 91. HISTORICAL INTEGRITY

Historical records must preserve the values that were true at transaction time.

Examples:

* invoice price
* tax rate
* customer address
* product description
* exchange rate
* supplier terms

Master-data changes must not rewrite history.

---

# 92. TEMPORAL DATA

Certain entities require effective dating.

Examples:

* pricing
* tax
* employee compensation
* approval thresholds
* organization policies
* contracts
* exchange rates

Conceptually:

```text
effective_from
effective_to
```

---

# 93. VERSIONING

Entities requiring controlled versioning may use:

```text
version
revision
effective_from
effective_to
```

Versioning must not be confused with workflow versioning.

---

# 94. CONCURRENCY CONTROL

Important records should support optimistic concurrency.

Example:

```text
version = 12
```

Update:

```text
WHERE id = X
AND version = 12
```

then increment version.

---

# 95. TRANSACTIONAL INTEGRITY

Operations affecting multiple authoritative tables must use appropriate transactions.

Example:

```text
Sales Confirmation
    ↓
Stock Reservation
    ↓
Financial Posting
    ↓
Audit
```

Failure must not leave an inconsistent state.

---

# 96. EVENT-DRIVEN DATA CHANGES

Modules may emit domain events.

Examples:

```text
sales.order.confirmed
inventory.stock.received
purchase.order.approved
payment.posted
employee.created
workflow.completed
```

Events should contain stable identifiers and tenant context.

---

# 97. DOMAIN EVENTS VS DATABASE TRIGGERS

Business behavior should primarily be implemented through application/domain services rather than excessive database triggers.

Database constraints remain appropriate for data integrity.

---

# 98. REPORTING DATA

Operational tables should remain optimized for transactional integrity.

Complex reporting may use:

* optimized queries
* materialized views
* reporting projections
* analytical tables
* future data warehouse architecture

Reporting must not compromise transaction performance.

---

# 99. SEARCH DATA

Search functionality may use:

* PostgreSQL indexes
* full-text search
* dedicated search infrastructure in future

Search indexes must respect tenant and permission boundaries.

---

# 100. INDEXING STRATEGY

Indexes should prioritize:

* organization ID
* company ID
* branch ID
* foreign keys
* document numbers
* statuses
* timestamps
* frequently filtered fields

Composite indexes should be designed from actual query patterns.

---

# 101. TENANT-AWARE INDEXING

For tenant-owned tables, indexes commonly need organization context.

Example:

```text
(organization_id, status)
(organization_id, created_at)
(organization_id, document_number)
```

Exact indexes depend on workload.

---

# 102. UNIQUE CONSTRAINTS

Uniqueness must be scoped correctly.

Example:

```text
organization_id + sku
```

may be unique rather than:

```text
sku
```

globally.

---

# 103. CHECK CONSTRAINTS

Database constraints should enforce basic invariants.

Examples:

```text
quantity >= 0
amount >= 0
effective_to >= effective_from
```

Where negative values are legitimate business concepts, the model must explicitly permit them.

---

# 104. FINANCIAL DECIMAL PRECISION

Financial amounts must use exact decimal/numeric types rather than floating-point types.

Currency precision must be configurable where appropriate.

---

# 105. QUANTITY PRECISION

Inventory quantities may require configurable decimal precision.

Examples:

```text
Pieces → 0 decimals
Weight → 3 decimals
Liquid → configurable decimals
```

---

# 106. CURRENCY MODEL

The platform should support:

```text
Currency
CurrencyRate
CurrencyRateSource
```

Transactions should preserve:

* transaction currency
* base currency
* exchange rate
* conversion timestamp

where applicable.

---

# 107. TIMEZONE MODEL

Dates/times must be stored consistently.

The platform should support:

* organization timezone
* user timezone
* company timezone
* location timezone

UTC storage with contextual display should be preferred where appropriate.

---

# 108. DATE-ONLY DATA

Certain values are date-only rather than timestamps.

Examples:

* birth date
* contract start date
* leave date
* expiry date

These should not be unnecessarily converted into timezone-sensitive timestamps.

---

# 109. CONFIGURATION DATA

Configuration should be separated into appropriate layers:

```text
Platform Configuration
Organization Configuration
Company Configuration
Branch Configuration
User Preferences
Module Configuration
```

Resolution order must be deterministic.

---

# 110. CONFIGURATION OVERRIDES

Example:

```text
Platform Default
      ↓
Organization Override
      ↓
Company Override
      ↓
Branch Override
      ↓
User Preference
```

More specific configuration should override broader defaults where permitted.

---

# 111. FEATURE FLAGS

Feature availability may use:

```text
FeatureFlag
FeatureFlagScope
FeatureFlagOverride
```

Feature flags must not replace permission checks.

---

# 112. MODULE ENABLEMENT

Organizations may have modules enabled or disabled.

Example:

```text
Organization
 ├── Inventory = enabled
 ├── Manufacturing = enabled
 ├── Payroll = disabled
 └── CRM = enabled
```

Module state must be validated server-side.

---

# 113. OFFLINE DATA

Offline-capable clients may maintain local replicas of selected entities.

Synchronization metadata may include:

```text
entity_id
version
updated_at
sync_status
last_synced_at
local_change_id
server_revision
```

The full offline architecture is defined in:

`15-OFFLINE-SYNC.md`

---

# 114. SYNCHRONIZATION IDENTIFIERS

Offline-created records require identifiers that avoid collisions.

The final strategy may use:

* UUID-based identifiers
* client-generated IDs
* synchronization IDs

The server remains authoritative after synchronization.

---

# 115. CONFLICT DATA

Synchronization conflicts should preserve:

* local version
* server version
* timestamps
* actor
* source device
* conflict type

Conflicts must not silently overwrite authoritative data.

---

# 116. INTEGRATION REFERENCES

External integrations may require:

```text
ExternalSystem
ExternalConnection
ExternalReference
IntegrationEvent
IntegrationJob
```

External IDs should not replace internal primary keys.

---

# 117. WEBHOOK DATA

Webhook delivery records should track:

```text
event_id
endpoint_id
attempt
status
response
sent_at
next_retry_at
```

Sensitive payload data must be handled securely.

---

# 118. AI DATA

AI-related records may include:

```text
AIRequest
AIResponse
AIRecommendation
AIAction
AIUsage
```

AI data must reference source records where appropriate.

---

# 119. AI ACTION AUTHORIZATION

An AI action must never gain authority simply because it is stored in an AI table.

Data-changing AI actions must still pass through:

```text
Authentication
Authorization
Business Rules
Approval
Domain Service
Audit
```

where applicable.

---

# 120. DATA PRIVACY

Sensitive data should be classified.

Possible categories:

```text
Public
Internal
Confidential
Restricted
Highly Restricted
```

Examples of highly restricted data may include:

* passwords
* authentication secrets
* payroll information
* sensitive employee data
* banking credentials

---

# 121. DATA ENCRYPTION

Sensitive information should use appropriate encryption.

Examples:

* passwords → strong one-way hashing
* secrets → secure secret storage
* sensitive fields → encryption where required
* network transport → TLS

---

# 122. PASSWORD STORAGE

Passwords must never be stored in plaintext.

Only secure password hashes should be stored.

---

# 123. SECRETS

API keys, tokens, integration credentials, and encryption keys must not be stored casually in business tables.

Secrets should use secure secret management mechanisms.

---

# 124. BACKUP

Database backup must support:

* scheduled backups
* point-in-time recovery where infrastructure supports it
* encrypted backups
* retention policies
* restoration testing
* organization-aware recovery procedures

---

# 125. RESTORE

Restore operations must preserve:

* referential integrity
* tenant boundaries
* financial history
* audit records

Selective organization restoration requires specialized procedures and must not accidentally overwrite unrelated organizations.

---

# 126. DATA MIGRATIONS

Database changes must use version-controlled migrations.

Migration requirements:

* deterministic
* repeatable
* tested
* reversible where practical
* production-safe
* compatible with existing data

---

# 127. LARGE-SCALE MIGRATIONS

Large migrations should consider:

* locking
* downtime
* batching
* background migration
* indexes
* table size
* rollback strategy

---

# 128. SEED DATA

Seed data may include:

* permissions
* system roles
* currencies
* standard configuration
* module definitions
* workflow templates

Tenant-specific business data must not be accidentally inserted into global seed data.

---

# 129. SYSTEM VS TENANT DATA

System-level data may include:

```text
Permission definitions
System module definitions
Platform templates
Supported currencies
```

Tenant-level data includes:

```text
Customers
Products
Invoices
Employees
Warehouses
Workflows
```

Ownership must be explicit.

---

# 130. CROSS-MODULE RELATIONSHIPS

Modules should communicate through stable domain references.

Example:

```text
Sales
 ↓
Customer
 ↓
Inventory
 ↓
Accounting
 ↓
Payment
```

Modules must not become tightly coupled through uncontrolled direct database manipulation.

---

# 131. MODULAR DATA OWNERSHIP

Each module should own its authoritative tables.

Example:

```text
Inventory Module
→ inventory-specific data

Sales Module
→ sales-specific data

Accounting Module
→ accounting-specific data
```

Shared reference entities should have clearly defined ownership.

---

# 132. SHARED ENTITIES

Potential shared entities include:

* Organization
* User
* Employee
* Product
* Customer
* Supplier
* Currency
* Tax
* Address
* File

Shared entities require stable contracts.

---

# 133. DATABASE SCHEMA ORGANIZATION

The implementation may organize tables by logical module/schema.

Possible logical domains:

```text
core
identity
organization
inventory
sales
purchasing
finance
hr
manufacturing
crm
projects
service
documents
workflow
notifications
audit
customization
integration
reporting
```

The exact PostgreSQL schema strategy must remain consistent with `03-ARCHITECTURE.md`.

---

# 134. DATA ACCESS LAYER

Application access should flow through controlled layers:

```text
API
 ↓
Controller
 ↓
Application Service
 ↓
Domain Service
 ↓
Repository / Data Access
 ↓
PostgreSQL
```

Controllers should not contain complex database logic.

---

# 135. REPOSITORY RESPONSIBILITY

Repositories should handle:

* queries
* persistence
* transaction participation
* tenant filtering
* entity retrieval

Business decisions belong in services/domain logic.

---

# 136. DOMAIN SERVICE RESPONSIBILITY

Domain services should enforce:

* business invariants
* calculations
* state transitions
* financial integrity
* inventory integrity
* authorization-related business rules
* transactional operations

---

# 137. TRANSACTION BOUNDARIES

Transactions should be established around meaningful business operations.

Example:

```text
Confirm Sales Order
    ↓
Validate
    ↓
Reserve Inventory
    ↓
Create Financial Impact
    ↓
Audit
```

The implementation must define safe transaction boundaries.

---

# 138. DATA VALIDATION

Validation occurs at multiple levels:

```text
UI Validation
 ↓
API Validation
 ↓
Application Validation
 ↓
Domain Validation
 ↓
Database Constraints
```

Client-side validation is never sufficient.

---

# 139. NULLABILITY

Nullable fields must have a business reason.

Avoid excessive nullable columns that make domain state ambiguous.

---

# 140. ENUM STRATEGY

Stable system statuses may use controlled values.

Highly customizable statuses may require metadata tables instead of database enums.

This distinction supports future configuration.

---

# 141. CUSTOM FIELDS

Custom fields must support:

* text
* number
* decimal
* date
* datetime
* boolean
* select
* multi-select
* relation
* file
* currency
* formula where supported

Custom fields must retain metadata defining their type and validation.

---

# 142. CUSTOM ENTITY MODEL

The customization engine may define custom entities with:

```text
CustomEntityDefinition
CustomFieldDefinition
CustomRelationshipDefinition
CustomViewDefinition
CustomWorkflowDefinition
```

Runtime custom records must preserve tenant ownership.

---

# 143. RELATIONSHIP CUSTOMIZATION

Organizations may define relationships such as:

```text
Vehicle
  ↔
Maintenance Contract
```

or:

```text
Customer
  ↔
Service Agreement
```

Relationship metadata must remain controlled.

---

# 144. AUDIT IMMUTABILITY

Audit records should be append-only from the application perspective.

Normal users must never be able to:

* edit audit events
* delete audit events
* rewrite historical actors
* rewrite timestamps

---

# 145. FINANCIAL IMMUTABILITY

Posted financial transactions should be treated as immutable business history.

Corrections should create new transactions.

---

# 146. INVENTORY IMMUTABILITY

Stock movement history should be preserved.

Corrections should use:

* reversal
* adjustment
* compensating movement

rather than rewriting the original movement.

---

# 147. DATA QUALITY

The platform should provide mechanisms for:

* duplicate detection
* required-field validation
* reference validation
* inconsistent-state detection
* orphan detection
* integrity checks

---

# 148. DATA CONSISTENCY MONITORING

Background jobs may detect anomalies such as:

* negative stock where prohibited
* unbalanced journal
* orphan references
* missing workflow approvers
* invalid tax configuration
* broken document references

Detected issues should be logged and surfaced to authorized administrators.

---

# 149. PERFORMANCE MONITORING

Database monitoring should track:

* slow queries
* lock waits
* deadlocks
* high-cardinality indexes
* table growth
* connection usage
* cache performance

---

# 150. DATA ARCHIVING

High-volume historical data may eventually be archived.

Candidates include:

* old workflow execution logs
* notification delivery records
* operational audit data
* old report execution data

Archiving must preserve required legal and business history.

---

# 151. DATA PARTITIONING

Large tables may eventually use PostgreSQL partitioning.

Potential candidates:

* audit events
* workflow execution records
* stock ledger
* financial transaction history
* notification delivery

Partitioning should be introduced based on actual scale requirements.

---

# 152. REPORTING PROJECTIONS

For expensive analytics, the platform may create reporting projections.

Example:

```text
Transactional Database
        ↓
Domain Events
        ↓
Reporting Projection
        ↓
Dashboard / BI
```

Reporting projections must not become the authoritative source of business truth.

---

# 153. SEARCH PROJECTIONS

Unified search may use indexed projections containing:

* entity
* title
* identifiers
* organization
* permissions metadata

Search results must be filtered according to current authorization.

---

# 154. CACHE DATA

Caches are not authoritative data stores.

Cached records must have:

* expiration/invalidation policy
* tenant context
* version awareness

Sensitive cached data must be protected.

---

# 155. DATA ACCESS AUDIT

Sensitive data access may require logging.

Examples:

* payroll
* employee records
* financial reports
* banking details
* confidential documents

---

# 156. DATA EXPORT

Exports should be generated according to permissions.

Export records may track:

```text
requested_by
entity
filters
format
timestamp
status
```

Sensitive exports should be auditable.

---

# 157. IMPORTS

Imports should support:

* validation
* preview
* mapping
* duplicate detection
* error reporting
* transaction safety
* audit

Large imports should use background jobs.

---

# 158. IMPORT ROLLBACK

Where possible, imports should have controlled rollback or compensating mechanisms.

Financial and inventory imports require particularly strong safeguards.

---

# 159. API RESPONSE MODEL

APIs should not expose raw database structures blindly.

Responses should use controlled DTO/resource representations.

The API layer must:

* hide sensitive fields
* enforce permissions
* apply tenant filtering
* normalize relationships
* prevent accidental internal metadata leakage

---

# 160. DATA EXPOSURE PREVENTION

Never expose:

* password hashes
* encryption keys
* internal secrets
* unauthorized organization data
* restricted payroll data
* hidden security metadata

---

# 161. DATABASE TESTING

Database tests must verify:

* constraints
* foreign keys
* unique indexes
* tenant isolation
* transactions
* concurrency
* migration correctness
* financial invariants
* inventory invariants

---

# 162. DATA MODEL TESTING

Each major entity should have tests for:

* creation
* update
* lifecycle
* invalid input
* deletion/archive
* relationships
* permissions
* tenant isolation
* historical integrity

---

# 163. MIGRATION TESTING

Every migration should be tested against:

* empty database
* realistic dataset
* production-like dataset
* previous migration state
* rollback strategy where supported

---

# 164. DATA MODEL DOCUMENTATION

Each module should document:

* entities
* fields
* relationships
* constraints
* indexes
* lifecycle
* ownership
* permissions
* audit behavior

---

# 165. DATA MODEL CHANGE CONTROL

Schema changes must be reviewed for:

* backward compatibility
* migration impact
* reporting impact
* API impact
* offline impact
* integration impact
* performance impact
* security impact

---

# 166. ACCEPTANCE CRITERIA

The data model is acceptable when:

* PostgreSQL is the authoritative relational database
* all tenant-owned entities have explicit tenant context
* organizational hierarchy is supported
* users and access control are modeled independently
* module data is logically separated
* financial data preserves accounting integrity
* inventory data preserves movement history
* transactional records preserve historical snapshots
* workflows and approvals have persistent state
* customization is metadata-driven
* JSONB is used only where appropriate
* relationships are explicit
* foreign keys protect referential integrity where applicable
* unique constraints protect business invariants
* financial values use exact numeric types
* concurrency is considered
* audit data is protected
* migrations are version controlled
* reporting can scale independently
* offline synchronization can be supported
* integrations can maintain external references
* sensitive data can be protected
* data access can be audited
* the model can grow without redesigning the entire platform

---

# 167. DEFINITION OF DONE

A data model feature is complete only when:

```text
Entity Definition
      ↓
Relationships
      ↓
Constraints
      ↓
Indexes
      ↓
Migration
      ↓
Repository
      ↓
Domain Service
      ↓
API Contract
      ↓
Authorization
      ↓
Audit
      ↓
Testing
      ↓
Documentation
```

---

# 168. FINAL ARCHITECTURAL PRINCIPLE

The database is the foundation of the platform, but it must not become an uncontrolled collection of tables.

Every important entity must have:

* clear ownership
* clear lifecycle
* clear relationships
* clear authority
* clear validation
* clear security
* clear audit behavior
* clear historical semantics

The data model must preserve the difference between:

```text
Master Data
Transactional Data
Historical Data
Configuration Data
Workflow Data
Audit Data
Analytical Data
Integration Data
```

Financial and inventory records must be treated as authoritative business history rather than ordinary CRUD records.

The final architecture must therefore follow:

```text
Configurable
        +
Relational
        +
Tenant-Aware
        +
Auditable
        +
Historically Accurate
        +
Transactionally Safe
        +
Scalable
        +
Modular
        +
Extensible
```

The objective is not merely to store data.

The objective is to create a **reliable enterprise data foundation capable of supporting the entire ERP platform without compromising integrity, security, scalability, or future extensibility.**

---

# END OF DOCUMENT
