# DATABASE RULES

## Professional ERP & Business Management Platform

**Document:** `development/05-database-rules.md`
**Status:** Development Standard
**Primary Database:** PostgreSQL
**Purpose:** Define mandatory database engineering rules for schema design, data integrity, transactions, performance, security, migrations, multi-tenancy, financial records, inventory records, and long-term maintainability.

---

# 1. Purpose

This document defines how PostgreSQL must be designed and used throughout the platform.

The database is a critical integrity layer.

Database design must protect:

* organizational isolation
* data consistency
* financial integrity
* inventory integrity
* workflow integrity
* auditability
* concurrency correctness
* referential integrity
* performance
* recoverability
* security
* long-term maintainability

---

# 2. Database Technology

The primary relational database is:

```text
PostgreSQL
```

PostgreSQL is the authoritative transactional database for the online platform.

Additional technologies may be introduced for specialized workloads, but they must not replace PostgreSQL as the authoritative transactional source without an explicit architectural decision.

---

# 3. Database Philosophy

The database must be designed around:

```text
Integrity
+
Consistency
+
Traceability
+
Tenant isolation
+
Transaction safety
+
Performance
+
Recoverability
```

Convenience must not override data integrity.

---

# 4. Database Authority

The database is authoritative for persisted transactional state.

The frontend must never be treated as authoritative.

The backend application must enforce business behavior.

The database must additionally enforce structural and integrity constraints wherever practical.

---

# 5. Database Access Architecture

Application code should access the database through defined repository/data-access layers.

Preferred architecture:

```text
Controller
    ↓
Application Service
    ↓
Domain Service
    ↓
Repository
    ↓
PostgreSQL
```

Avoid:

```text
Controller
    ↓
Raw SQL
```

and:

```text
React Component
    ↓
Database
```

---

# 6. Database Ownership

Each domain/module should have clear ownership of its tables.

Examples:

```text
Inventory → inventory tables
Accounting → accounting tables
Sales → sales tables
HR → HR tables
Workflow → workflow tables
```

Another module should not directly mutate another module's internal tables.

Cross-module behavior should normally occur through application services/domain operations.

---

# 7. Modular Database Organization

The database should conceptually be organized by domain.

Possible PostgreSQL schemas may be used when they provide meaningful separation.

Example:

```text
core
identity
organization
catalog
inventory
sales
purchasing
accounting
crm
hr
manufacturing
workflow
reporting
audit
integration
offline
```

The final schema strategy should remain consistent rather than introducing schemas arbitrarily.

---

# 8. Table Naming

Table names should use predictable conventions.

Recommended:

```text
snake_case
plural nouns
```

Examples:

```text
organizations
users
products
inventory_movements
sales_orders
purchase_orders
journal_entries
journal_entry_lines
```

Avoid inconsistent naming such as:

```text
Product
tblProducts
productData
inventoryMovementTable
```

---

# 9. Column Naming

Use:

```text
snake_case
```

Examples:

```text
created_at
updated_at
organization_id
company_id
branch_id
warehouse_id
created_by
updated_by
```

---

# 10. Primary Keys

Every major persistent entity must have a primary key.

UUIDs are the default identifier strategy for externally addressable entities.

Example:

```text
id UUID PRIMARY KEY
```

---

# 11. UUID Generation

UUIDs should be generated using a trusted server/database mechanism.

Client-generated UUIDs may also be used for offline operation identities where necessary.

Client-provided identifiers must still be validated for uniqueness and authorization.

---

# 12. Internal vs External Identifiers

A system identifier and a human-readable business number are separate concepts.

Example:

```text
id:
UUID

invoice_number:
INV-2026-000123
```

Do not use human-readable document numbers as primary keys.

---

# 13. Business Numbering

Business documents may require:

* invoice numbers
* purchase order numbers
* sales order numbers
* receipt numbers
* journal numbers
* stock transfer numbers

Numbering must be centrally controlled and concurrency-safe.

---

# 14. Numbering Sequences

Concurrent users must never receive the same authoritative document number.

Use database-safe sequence/locking/number allocation mechanisms.

Never implement:

```text
SELECT MAX(invoice_number) + 1
```

as the authoritative numbering strategy.

---

# 15. Required Columns

Important entities should normally contain:

```text
id
created_at
updated_at
```

Additional metadata may include:

```text
created_by
updated_by
organization_id
```

where applicable.

---

# 16. Timestamp Standard

Persist timestamps using timezone-aware PostgreSQL types.

Prefer:

```text
TIMESTAMPTZ
```

for actual points in time.

---

# 17. Timezone Rule

Do not assume server timezone equals organization timezone.

Persist authoritative timestamps consistently.

Convert timestamps for display according to:

* user timezone
* organization timezone
* transaction requirements

---

# 18. Date-Only Values

Use date-only database types for values that genuinely represent dates rather than timestamps.

Examples:

```text
birth_date
tax_period_start
tax_period_end
holiday_date
```

Do not store all dates as timestamps simply for convenience.

---

# 19. Money Data Type

Financial amounts must not use floating-point types.

Use:

```text
NUMERIC
```

with appropriate precision and scale.

Example conceptually:

```text
NUMERIC(20, 4)
```

The exact precision must be determined according to the financial requirements.

---

# 20. Quantity Data Type

Inventory quantities should use appropriate `NUMERIC` precision.

Do not use floating-point storage for quantities where precision matters.

Examples:

```text
weight
length
volume
stock_quantity
unit_price
```

---

# 21. Percentage Values

Percentages should use an appropriate numeric type.

Do not store financial percentages as floating-point values when exactness matters.

---

# 22. Currency

Amounts must have an associated currency context where multi-currency is supported.

Do not assume every amount belongs to one global currency forever.

---

# 23. Currency Conversion

Foreign currency transactions should preserve:

* transaction currency
* base/reporting currency where applicable
* exchange rate
* rate date/source where required

Do not overwrite the original transaction amount merely because reporting currency changes.

---

# 24. Decimal Precision

Precision must be defined according to business meaning.

Examples:

```text
currency
quantity
exchange rate
tax rate
percentage
measurement
```

Do not use arbitrary decimal precision independently in every table.

---

# 25. NOT NULL

Use `NOT NULL` when a field is mandatory for valid data.

Do not allow nullable fields simply because application code currently handles null.

---

# 26. NULL Semantics

NULL must have a deliberate meaning.

Do not use NULL interchangeably with:

```text
0
false
empty string
unknown
not applicable
not provided
```

---

# 27. Default Values

Database defaults should be used for values that have a safe, universal default.

Examples may include:

```text
created_at
boolean flags
version
```

Do not use database defaults to hide required business logic.

---

# 28. Boolean Values

Use PostgreSQL boolean types for actual binary state.

Avoid:

```text
"yes"
"no"
"1"
"0"
```

when a boolean is sufficient.

---

# 29. Enumerated Business States

Business statuses require careful consideration.

For stable system-level states, PostgreSQL enums may be appropriate.

For highly configurable ERP statuses, lookup/configuration tables are usually preferable.

---

# 30. Configurable Statuses

User-configurable workflows and statuses should not be permanently hardcoded into database enums when administrators need to create or change them.

Use configuration entities where appropriate.

---

# 31. Foreign Keys

Foreign keys should be used to protect referential integrity.

Example:

```text
sales_orders.customer_id
    →
customers.id
```

Do not rely exclusively on application code for basic relational integrity.

---

# 32. Foreign Key Actions

Choose `ON DELETE` behavior deliberately.

Possible strategies:

```text
RESTRICT
NO ACTION
SET NULL
CASCADE
```

Do not use `CASCADE` simply because it is convenient.

---

# 33. Financial Foreign Keys

Financial records should generally not be deleted through cascading relationships.

Financial history must remain traceable.

---

# 34. Inventory Foreign Keys

Inventory movement history should not disappear because a related master record was deleted.

Use archival/deactivation strategies instead.

---

# 35. Referential Integrity

The database must prevent impossible relationships.

Examples:

* transaction line referencing nonexistent product
* journal line referencing nonexistent account
* stock movement referencing nonexistent warehouse
* employee record referencing nonexistent organization

---

# 36. Unique Constraints

Use database unique constraints for values that must be unique.

Examples:

```text
organization code
product SKU within required scope
username
external integration identifier within provider scope
document number within required scope
```

---

# 37. Scoped Uniqueness

ERP uniqueness is often contextual.

Example:

```text
SKU unique within organization
```

rather than:

```text
SKU unique globally
```

Use composite unique constraints when appropriate.

---

# 38. Composite Unique Constraints

Example conceptual structure:

```text
UNIQUE (
    organization_id,
    sku
)
```

The exact scope must match the business requirement.

---

# 39. Check Constraints

Use database `CHECK` constraints for basic structural validity.

Examples:

```text
quantity >= 0
percentage >= 0
percentage <= 100
amount >= 0
```

Only apply constraints that reflect the actual domain rules.

---

# 40. Complex Business Rules

Do not attempt to encode every business rule into database constraints.

Complex rules belong in domain/application services.

Use the database for structural integrity and the application layer for contextual business behavior.

---

# 41. Tenant Isolation

Every tenant/organization-owned table must have an appropriate ownership relationship.

Depending on the platform model, this may include:

```text
organization_id
company_id
branch_id
```

Not every table needs every level.

---

# 42. Tenant Context

Every database operation involving tenant-owned data must execute within the correct tenant context.

Never trust a tenant ID supplied only by the client.

---

# 43. Tenant Resolution

Tenant context should be derived from authenticated identity/session and authorized organization membership.

Client-provided tenant identifiers must be validated against the user's permitted scope.

---

# 44. Tenant Isolation Defense in Depth

Tenant isolation should exist across:

```text
Authentication
Authorization
Application services
Repository queries
Database constraints where appropriate
```

---

# 45. Cross-Tenant Access

Cross-tenant queries must be prohibited unless explicitly authorized for platform-level administrative functionality.

Such access must be auditable.

---

# 46. Organization Hierarchy

The database must support the platform's organizational hierarchy where applicable.

Example:

```text
Organization
    ↓
Company
    ↓
Branch
    ↓
Department
    ↓
Location/Warehouse
```

Not every entity must exist at every level.

---

# 47. Ownership vs Scope

Do not confuse:

```text
record owner
```

with:

```text
organization scope
```

A salesperson may own a customer record while the organization remains the authoritative tenant.

---

# 48. Data Visibility

Records may require additional visibility dimensions:

```text
owner
department
branch
company
warehouse
team
role
```

Database design should support efficient querying of these scopes.

---

# 49. Soft Delete

Soft deletion should be used where historical references or recovery are important.

Possible fields:

```text
deleted_at
deleted_by
```

or an explicit lifecycle state.

---

# 50. Soft Delete Limitations

Soft delete must not become a way to hide data indefinitely.

The platform should define:

* archive behavior
* retention
* recovery
* purge policy
* legal requirements

---

# 51. Financial Records Are Not Ordinary CRUD

Financial transactions must not be treated as ordinary mutable records.

Once posted, important financial information should be protected from destructive modification.

---

# 52. Financial Corrections

Corrections should generally use:

```text
reversal
adjustment
corrective transaction
reclassification
```

rather than silently rewriting historical posted records.

---

# 53. Double-Entry Accounting

Accounting data must preserve double-entry integrity.

A journal entry must satisfy:

```text
Total Debits = Total Credits
```

before posting.

---

# 54. Journal Entry Lines

Journal entry headers and lines should be modeled separately where appropriate.

Example:

```text
journal_entries
    ↓
journal_entry_lines
```

---

# 55. Accounting Transaction

Posting an accounting transaction should occur inside a controlled database transaction.

---

# 56. Accounting Posting

Posting should ensure atomically:

```text
transaction created
+
journal created
+
journal lines created
+
posting state updated
+
audit/event generated
```

as appropriate.

---

# 57. Accounting Periods

Financial periods should have controlled lifecycle states.

Example:

```text
Open
Closing
Closed
Locked
```

Posting into closed periods must be prevented according to accounting rules.

---

# 58. Accounting Locking

Period closing must be concurrency-safe.

Two users must not be able to simultaneously produce conflicting closing operations.

---

# 59. Inventory Integrity

Inventory quantity must not be treated as a freely editable number.

Inventory should be represented through controlled operations such as:

```text
Receipt
Issue
Transfer
Adjustment
Reservation
Count
Return
```

---

# 60. Inventory Ledger

The system should preserve stock movement history.

A conceptual model:

```text
Inventory Transaction
    ↓
Inventory Movement
    ↓
Product
    ↓
Warehouse/Location
```

---

# 61. Stock Quantity

Current stock may be derived from movement records, maintained as a controlled balance, or both.

If a cached balance is maintained, reconciliation mechanisms must exist.

---

# 62. Inventory Transactions

Inventory-changing operations must occur within appropriate database transactions.

Example:

```text
Sale
+
Stock deduction
+
Related accounting
```

must not partially succeed without a defined recovery mechanism.

---

# 63. Stock Transfer

A stock transfer should maintain both source and destination effects.

Example:

```text
Warehouse A
    ↓
Transfer
    ↓
Warehouse B
```

Both sides must remain consistent.

---

# 64. Stock Reservation

Reservations should not silently modify available physical stock.

The database model should distinguish concepts such as:

```text
On Hand
Reserved
Available
```

where required.

---

# 65. Serial Numbers

Serial-controlled inventory must enforce appropriate uniqueness.

A serial number must not simultaneously represent two active physical units within an invalid scope.

---

# 66. Batch Numbers

Batch-controlled inventory must preserve:

* batch identity
* product
* quantity
* expiration where applicable
* warehouse/location
* relevant supplier/manufacturer information

---

# 67. Expiry

Expiry-controlled inventory must not be handled merely as a display field.

Business rules may need to prevent:

* expired sale
* expired consumption
* invalid transfer
* invalid allocation

depending on configuration.

---

# 68. Inventory Counting

Stock counts should produce controlled adjustments rather than directly rewriting historical movement records.

---

# 69. Concurrency

Concurrent database operations must be expected.

Examples:

```text
Two users edit the same customer
Two cashiers sell the same product
Two users approve the same request
Two warehouses process the same transfer
Two users post financial transactions
```

---

# 70. Optimistic Concurrency

Important mutable records should support versioning where appropriate.

Conceptually:

```text
version
```

or equivalent update timestamp/version token.

---

# 71. Optimistic Concurrency Rule

An update should fail or require resolution if the record has changed since it was read.

Do not silently overwrite another user's changes.

---

# 72. Pessimistic Locking

Use database locks when atomic concurrency control requires them.

Examples may include:

* financial posting
* sequence allocation
* stock balance updates
* period closing
* scarce resource allocation

Locks must be short-lived and carefully scoped.

---

# 73. Lock Duration

Never hold a database lock longer than necessary.

Avoid long-running external API calls inside database transactions.

---

# 74. Transaction Boundaries

Database transactions should correspond to meaningful business operations.

Example:

```text
Create Purchase Receipt
    ↓
validate
    ↓
create receipt
    ↓
create inventory movements
    ↓
update controlled balances
    ↓
create accounting effect
    ↓
audit
    ↓
commit
```

---

# 75. Atomicity

Operations that must succeed or fail together should be committed atomically.

---

# 76. Partial Failure

If an operation cannot complete atomically, the architecture must explicitly define:

* retry
* compensation
* rollback
* pending state
* reconciliation

Never leave ambiguous transactional state without recovery.

---

# 77. Isolation Level

Use the lowest isolation level that safely supports the operation.

Higher isolation must be justified by correctness requirements.

---

# 78. Deadlock Prevention

Database operations should access resources in consistent order where possible.

Deadlocks must be detected, logged, tested, and safely retried where appropriate.

---

# 79. Retry Rules

Retries must be used carefully.

Never blindly retry a non-idempotent financial or inventory operation.

Use operation identifiers/idempotency where required.

---

# 80. Idempotency

Important operations should support idempotency.

Examples:

```text
payment posting
order submission
inventory transfer
POS sale
integration import
webhook processing
offline synchronization
```

---

# 81. Idempotency Keys

Where applicable, store an idempotency key associated with:

* operation
* organization
* actor/device
* request
* result

The exact scope must prevent accidental cross-operation collisions.

---

# 82. Offline Data

Offline-capable operations may create local records before server synchronization.

The server must treat offline identifiers as untrusted input and validate them.

---

# 83. Offline Operation IDs

Offline operations should have stable identifiers.

Example:

```text
operation_id UUID
```

This allows retries without creating duplicate transactions.

---

# 84. Sync Metadata

Where synchronization requires it, records may contain metadata such as:

```text
version
updated_at
server_sequence
last_synced_at
```

Only fields that serve a real synchronization requirement should be introduced.

---

# 85. Conflict Detection

Synchronization must detect when:

```text
client version
≠
server version
```

for operations requiring optimistic concurrency.

---

# 86. Financial Offline Operations

Financial posting should normally remain server-authoritative unless a dedicated local accounting engine is explicitly designed.

Database rules must not weaken accounting integrity merely to support offline functionality.

---

# 87. Inventory Offline Operations

Offline inventory capture may be supported, but authoritative stock posting must follow controlled synchronization rules.

---

# 88. POS Offline Operations

Offline POS records must include sufficient identity and sequencing information to support reconciliation.

Examples:

```text
device_id
operation_id
local_transaction_id
local_sequence
```

where required.

---

# 89. Indexing Principle

Indexes must support actual query patterns.

Do not add indexes to every column by default.

---

# 90. Primary Key Indexes

Primary keys automatically provide indexing behavior appropriate to the chosen PostgreSQL key strategy.

---

# 91. Foreign Key Indexes

Frequently queried foreign-key columns should generally be indexed.

Example:

```text
organization_id
customer_id
warehouse_id
product_id
```

---

# 92. Composite Indexes

Use composite indexes when queries commonly filter by multiple columns.

Example:

```text
organization_id
+
status
+
created_at
```

---

# 93. Index Column Order

Index column order should reflect real query patterns.

Do not select column order arbitrarily.

---

# 94. Tenant-Aware Indexing

For tenant-scoped tables, organization/tenant context often belongs in indexes where it significantly improves filtering.

Example:

```text
(organization_id, created_at)
```

---

# 95. Unique Indexes

Unique indexes may enforce scoped uniqueness.

Example:

```text
(organization_id, sku)
```

---

# 96. Partial Indexes

Partial indexes may be used for frequently queried subsets.

Example concept:

```text
active records only
```

Use only when query patterns justify them.

---

# 97. Index Maintenance

Unused or redundant indexes should be periodically reviewed.

Indexes have:

* storage cost
* write cost
* maintenance cost

---

# 98. Query Performance

Database queries must be reviewed for:

* sequential scans on large tables
* unnecessary joins
* excessive rows
* N+1 queries
* missing indexes
* inefficient sorting
* unbounded result sets

---

# 99. N+1 Queries

Avoid:

```text
load 100 customers
then query orders separately for each customer
```

Use appropriate:

* joins
* batch queries
* aggregation
* prefetching

---

# 100. Pagination

Large datasets must be paginated.

Do not return unlimited records through normal APIs.

---

# 101. Cursor Pagination

Cursor/keyset pagination should be considered for very large or frequently changing datasets.

---

# 102. Offset Pagination

Offset pagination may be used for smaller datasets and interfaces where its behavior is acceptable.

---

# 103. Search

Large searchable datasets should use appropriate database indexes/search mechanisms.

Do not use unrestricted wildcard searches across every column.

---

# 104. Full-Text Search

PostgreSQL full-text search may be used where appropriate.

Specialized search infrastructure may be added later if scale requires it.

---

# 105. JSONB

JSONB is permitted for genuinely dynamic data.

Appropriate examples:

```text
custom configuration
metadata
integration payloads
flexible custom field values
workflow configuration
AI metadata
```

---

# 106. JSONB Restrictions

Do not use JSONB as a replacement for relational modeling.

Do not store core entities such as:

```text
customers
products
invoices
journal entries
inventory movements
```

as giant JSON documents.

---

# 107. JSONB Indexing

JSONB indexes should be added only when actual query requirements justify them.

---

# 108. Custom Fields

Custom fields may use a metadata-driven model.

Possible architecture:

```text
custom_field_definitions
custom_field_values
```

or another carefully designed approach.

Core business fields should remain relational.

---

# 109. Configuration Data

Configuration should be structured and versionable.

Avoid storing an entire module configuration as one uncontrolled JSON document when individual settings require independent querying, validation, permissions, or auditing.

---

# 110. Audit Data

Audit records must be append-oriented.

Typical metadata:

```text
actor_id
organization_id
action
entity_type
entity_id
occurred_at
request_id
source
previous_state
new_state
```

Only appropriate data should be retained.

---

# 111. Audit Immutability

Normal users and ordinary application operations must not modify historical audit records.

Administrative correction mechanisms, if ever required, must be tightly controlled and audited.

---

# 112. Audit Volume

Audit tables may grow very large.

Design for:

* partitioning where appropriate
* indexing
* archival
* retention
* efficient querying

---

# 113. Event Data

Domain/integration events may require durable storage.

Events should contain enough information to identify:

* event type
* entity
* organization
* occurrence time
* event ID
* correlation ID

---

# 114. Outbox Pattern

For reliable database-to-message/integration workflows, an outbox pattern may be used.

Conceptually:

```text
Business Transaction
    ↓
Database Transaction
    ├── Business Data
    └── Outbox Event
            ↓
        Event Processor
```

This prevents the database commit and event publication from becoming inconsistently separated.

---

# 115. Background Jobs

Long-running jobs should not keep database transactions open unnecessarily.

Store job state separately where appropriate.

Example:

```text
queued
running
completed
failed
cancelled
```

---

# 116. External Integrations

Do not hold database transactions open while waiting for external services.

Preferred pattern:

```text
Commit local state
    ↓
Queue integration work
    ↓
External API
    ↓
Store result
```

Use compensation/reconciliation where business requirements demand atomic-looking behavior.

---

# 117. Webhook Storage

Incoming webhook events should be stored or tracked sufficiently to support:

* idempotency
* replay protection
* debugging
* auditing
* retry

---

# 118. External IDs

Integration entities should preserve external identifiers.

Example:

```text
provider
external_id
```

with appropriate uniqueness scope.

---

# 119. Data Import

Large imports should not execute as one uncontrolled database operation.

Use:

```text
upload
→ validate
→ stage
→ review
→ process
→ report
```

where appropriate.

---

# 120. Import Staging

Staging tables may be used for large or complex imports.

Import processing must preserve:

* source
* actor
* organization
* batch
* errors
* status

---

# 121. Bulk Operations

Bulk writes must:

* validate scope
* respect permissions
* preserve auditability
* handle partial failure explicitly
* avoid uncontrolled transaction size

---

# 122. Database Transactions and Bulk Operations

Do not place enormous bulk operations into one transaction if that creates unacceptable:

* locks
* memory usage
* transaction duration
* replication pressure
* rollback cost

Batch processing may be required.

---

# 123. Large Tables

Tables expected to become very large should be designed with future growth in mind.

Examples:

```text
audit_logs
inventory_movements
journal_entry_lines
notifications
activity_events
integration_events
```

---

# 124. Partitioning

PostgreSQL partitioning may be introduced for large tables when supported by actual workload requirements.

Possible partition dimensions:

* date
* organization
* event type

Partitioning must not be introduced merely because a table is large in theory.

---

# 125. Archive Strategy

Historical data should have defined lifecycle policies.

Possible lifecycle:

```text
Active
→ Historical
→ Archived
→ Purged
```

Subject to legal, accounting, operational, and organizational requirements.

---

# 126. Data Retention

Retention must consider:

* legal requirements
* accounting requirements
* business requirements
* privacy
* storage cost
* audit requirements

---

# 127. Personal Data

Personal data should be stored only when necessary.

Database design should support appropriate:

* access control
* retention
* masking
* deletion/anonymization where legally permitted

---

# 128. Sensitive Data

Do not store secrets in plaintext.

Examples:

```text
passwords
API credentials
private keys
access tokens
```

---

# 129. Password Storage

Passwords must never be stored as plaintext or reversible encryption.

Use a modern password hashing mechanism through the authentication layer.

---

# 130. Encryption

Sensitive data may require encryption at:

```text
transport
storage
application field
backup
```

depending on risk and requirements.

---

# 131. Database Credentials

Database credentials must not be committed to source control.

Use environment/secret management mechanisms.

---

# 132. Least Privilege

The application database user should have only the permissions required.

Avoid using superuser credentials from application code.

---

# 133. Database Roles

Separate roles may be used for:

```text
application
migration
read-only reporting
administration
backup
```

where operational complexity justifies them.

---

# 134. Reporting Access

Reporting queries must not accidentally bypass tenant isolation or permissions.

A read-only database role does not automatically mean unrestricted business visibility.

---

# 135. Database Views

Views may be used for:

* reporting
* standardized read models
* complex query reuse

Views must still respect security requirements.

---

# 136. Materialized Views

Materialized views may be used for expensive analytical workloads.

They must have a defined refresh strategy and freshness indicator.

---

# 137. Reporting vs Transactional Queries

Heavy analytical queries should not unnecessarily degrade transactional workloads.

Consider:

* optimized indexes
* read replicas
* materialized views
* reporting database
* asynchronous report generation

when scale requires them.

---

# 138. Database Connection Pooling

Application servers should use controlled connection pooling.

Pool size must reflect:

* database capacity
* application concurrency
* number of application instances

---

# 139. Connection Limits

Do not configure application instances to collectively exceed safe PostgreSQL connection limits.

Scaling application servers may require adjusting pool sizes rather than simply adding connections.

---

# 140. Long Queries

Long-running queries must be monitored.

Potential causes:

* missing indexes
* poor joins
* huge exports
* analytical queries
* lock contention

---

# 141. Query Timeouts

Appropriate database/query timeouts should protect the system from runaway operations.

Critical transactions should be designed so that timeout behavior is understood and safely recoverable.

---

# 142. Migration Standard

Every database schema change must be represented by a versioned migration.

Never rely on manually editing production databases as the normal deployment process.

---

# 143. Migration Naming

Migration names must clearly identify their purpose and sequence.

Example:

```text
20261008_create_inventory_movements
20261009_add_invoice_posting_state
```

The exact naming format may vary, but consistency is mandatory.

---

# 144. Migration Immutability

Applied migrations must not be silently edited.

Create a new migration to correct an existing migration's behavior.

---

# 145. Forward-Compatible Migrations

Where practical, schema changes should support rolling deployments.

Avoid requiring old application code and new schema to become incompatible immediately.

---

# 146. Expand-and-Contract Strategy

For risky changes:

```text
Expand
→ Deploy compatible code
→ Migrate/backfill
→ Switch usage
→ Remove old structure
```

This is preferred over destructive one-step migrations.

---

# 147. Column Removal

Do not immediately remove a column used by running application versions.

Deprecate first, migrate usage, verify, then remove.

---

# 148. Column Type Changes

Large or risky type changes require migration planning.

Consider:

* table size
* locks
* conversion time
* rollback
* application compatibility

---

# 149. Data Backfills

Backfills must be:

* resumable where possible
* observable
* batched when necessary
* safe to retry
* scoped
* tested

---

# 150. Migration Transactions

Use migration transactions when safe and appropriate.

Very large operations may require specialized strategies to avoid long locks.

---

# 151. Seed Data

Seed/reference data must be clearly distinguished from user data.

Examples:

```text
system permissions
default statuses
system roles
supported currencies
country codes
```

---

# 152. Seed Idempotency

Seed scripts should be safe to run repeatedly where practical.

Do not create duplicate reference records every time.

---

# 153. Environment Data

Development/test data must never be confused with production data.

Never copy production secrets into development environments.

---

# 154. Test Database

Automated tests should use isolated databases or transaction-safe test infrastructure.

Tests must not modify real production data.

---

# 155. Database Test Isolation

Tests should clean up after themselves or use disposable database environments.

---

# 156. Constraint Testing

Tests should verify critical constraints.

Examples:

```text
duplicate SKU
invalid foreign key
invalid amount
invalid tenant scope
unbalanced journal
duplicate idempotency key
```

---

# 157. Transaction Testing

Critical operations must be tested for rollback behavior.

Example:

```text
Create sale
→ inventory update fails
→ entire transaction rolls back
```

where the operation is designed to be atomic.

---

# 158. Concurrency Testing

Important operations should have concurrency tests.

Examples:

```text
two stock deductions
two invoice postings
two approvals
two sequence allocations
```

---

# 159. Deadlock Testing

High-contention workflows should be tested for deadlocks and safe retries.

---

# 160. Database Backup

Production databases must have automated backups.

Backup strategy should include:

* frequency
* retention
* storage security
* encryption
* monitoring
* restore testing

---

# 161. Backup Is Not Enough

A backup that has never been restored successfully is not sufficient evidence of recoverability.

Restore testing is mandatory for production readiness.

---

# 162. Point-in-Time Recovery

Where operational requirements justify it, PostgreSQL point-in-time recovery should be configured.

---

# 163. Recovery Objectives

Database operations should align with defined:

```text
RPO
RTO
```

requirements.

---

# 164. Disaster Recovery

Database recovery plans must cover:

* database corruption
* accidental deletion
* infrastructure loss
* credential compromise
* regional failure where applicable

---

# 165. Backup Security

Backups must be protected with:

* access control
* encryption
* retention rules
* monitoring
* separation from primary infrastructure where appropriate

---

# 166. Backup Tenant Isolation

Restoration procedures must consider multi-tenant data isolation.

Tenant-level recovery may require specialized tooling if supported.

---

# 167. Data Recovery

Recovery operations must be auditable.

Restoring data should not silently overwrite newer authoritative transactions.

---

# 168. Database Monitoring

Production monitoring should cover:

* connections
* CPU
* memory
* disk
* I/O
* locks
* slow queries
* replication
* transaction age
* deadlocks
* table growth
* index health
* backup status

---

# 169. Query Observability

Important database operations should be traceable to application requests through correlation/request identifiers where practical.

---

# 170. Slow Query Review

Slow queries should be investigated rather than solved only by increasing hardware.

Use query plans and actual workload analysis.

---

# 171. Explain Plans

Database performance investigations should use PostgreSQL query planning tools such as:

```text
EXPLAIN
EXPLAIN ANALYZE
```

with care in production.

---

# 172. Database Logging

Database logging should support operational diagnostics without exposing sensitive information.

---

# 173. Sensitive Query Data

Do not log:

* passwords
* authentication tokens
* encryption keys
* full payment credentials
* unnecessary personal information

---

# 174. Schema Documentation

Important tables should document:

* purpose
* ownership
* scope
* important relationships
* special integrity rules
* retention
* audit requirements

---

# 175. Data Dictionary

The platform should maintain a data dictionary describing important business entities and fields.

---

# 176. Naming Consistency

Database naming should remain consistent across all modules.

Do not allow every module to invent different naming patterns for equivalent concepts.

---

# 177. Common Metadata

Where appropriate, entities may use standardized metadata such as:

```text
id
created_at
updated_at
created_by
updated_by
version
```

Do not add fields that have no actual purpose.

---

# 178. Record Version

Records participating in optimistic concurrency should have an explicit versioning strategy.

---

# 179. Status History

Important status changes may require history records.

Example:

```text
invoice_status_history
workflow_status_history
purchase_order_status_history
```

---

# 180. History vs Audit

Do not confuse:

```text
business history
```

with:

```text
technical audit
```

Business history explains domain lifecycle.

Audit explains who changed/accessed what and when.

Both may be necessary.

---

# 181. Comments and Notes

User comments/notes should be modeled as separate entities where they require:

* author
* timestamp
* permissions
* attachments
* editing rules
* auditability

---

# 182. Attachments

Files should generally not be stored directly inside PostgreSQL as large binary values unless there is a specific reason.

Store file metadata in PostgreSQL and actual files in appropriate object/file storage where applicable.

---

# 183. File Metadata

File records may contain:

```text
id
entity_type
entity_id
filename
mime_type
size
storage_reference
uploaded_by
created_at
```

with appropriate security controls.

---

# 184. Referential Cleanup

When a business entity is archived, associated files and references must follow defined lifecycle rules.

Do not accidentally orphan important records.

---

# 185. Database and API Consistency

API contracts must reflect actual database/domain behavior.

Do not expose database implementation details unnecessarily.

---

# 186. Repository Rules

Repositories should:

* encapsulate database access
* enforce tenant scope
* use parameterized queries
* provide predictable methods
* avoid business workflows
* avoid HTTP concerns

---

# 187. Parameterized Queries

Never construct SQL using unsafe string concatenation with user-controlled values.

Use parameterized queries or safe query-builder mechanisms.

---

# 188. SQL Injection

All database-access code must be reviewed for SQL injection risk.

Dynamic identifiers such as:

* table names
* column names
* sort fields

must come from trusted allowlists.

---

# 189. Database Errors

Raw database errors must not be exposed directly to users.

Translate them into safe application errors while retaining diagnostic details in secure logs.

---

# 190. Constraint Error Handling

Application services should recognize expected database constraint failures and return meaningful domain-level errors.

---

# 191. Transaction Context

Repository methods participating in a transaction must use the transaction's database connection/context.

Do not accidentally open independent connections inside a transaction.

---

# 192. Nested Transactions

The application must understand PostgreSQL transaction limitations.

Use savepoints or explicit application-level transaction design where nested behavior is required.

---

# 193. External Calls Inside Transactions

Avoid external network requests while a PostgreSQL transaction is open.

This increases:

* lock duration
* failure risk
* resource consumption

---

# 194. Database Triggers

Triggers may be used for narrowly defined integrity or technical purposes.

Do not hide major business workflows inside complex trigger systems.

Business logic must remain understandable in application/domain services.

---

# 195. Stored Procedures

Stored procedures/functions may be used when they provide a clear technical or performance advantage.

They must be documented, versioned, tested, and included in migrations.

---

# 196. Avoid Hidden Business Logic

The platform must not split critical business behavior unpredictably between:

```text
frontend
backend
database triggers
background jobs
```

without clear documentation.

---

# 197. Database-Level Integrity

The database should enforce what it can reliably enforce:

```text
Primary keys
Foreign keys
Unique constraints
Basic check constraints
Not-null requirements
Transactional atomicity
```

---

# 198. Application-Level Integrity

The application should enforce context-sensitive behavior such as:

```text
approval rules
permission decisions
business workflows
pricing rules
tax rules
complex inventory allocation
```

---

# 199. Financial Database Principle

Financial correctness has priority over convenience.

The system must never sacrifice accounting integrity simply to make CRUD operations easier.

---

# 200. Inventory Database Principle

Inventory correctness has priority over UI convenience.

The system must never permit arbitrary stock manipulation simply because a UI field exists.

---

# 201. Multi-Organization Database Principle

Organization isolation must be treated as a fundamental database design requirement, not an optional feature.

---

# 202. Database Change Review

Every significant schema change should be reviewed for:

* integrity
* tenant isolation
* migration safety
* performance
* concurrency
* rollback/recovery
* reporting impact
* audit impact
* offline/sync impact
* API compatibility

---

# 203. Production Migration Checklist

Before production migration:

```text
[ ] Migration tested
[ ] Rollout order defined
[ ] Data backfill tested
[ ] Lock impact reviewed
[ ] Query performance reviewed
[ ] Existing data compatibility verified
[ ] Backup verified
[ ] Rollback/recovery strategy defined
[ ] Application compatibility verified
[ ] Monitoring prepared
[ ] Migration owner identified
```

---

# 204. Database Feature Definition of Done

A database-backed feature is not complete until:

```text
[ ] Schema designed
[ ] Ownership defined
[ ] Tenant scope defined
[ ] Primary keys defined
[ ] Foreign keys defined
[ ] Required constraints added
[ ] Indexes reviewed
[ ] Transaction boundaries defined
[ ] Concurrency behavior defined
[ ] Audit requirements defined
[ ] Migration created
[ ] Seed/reference data handled
[ ] API compatibility checked
[ ] Tests added
[ ] Performance reviewed
[ ] Security reviewed
[ ] Backup/recovery implications considered
```

---

# 205. Final Database Rules

The database implementation must follow these fundamental principles:

1. **Use PostgreSQL as the primary transactional database.**
2. **Protect tenant isolation at every layer.**
3. **Use UUIDs for major externally addressable entities.**
4. **Use relational modeling for core business data.**
5. **Use JSONB only where flexibility genuinely requires it.**
6. **Use NUMERIC for financial and precision-sensitive values.**
7. **Use foreign keys and constraints to protect structural integrity.**
8. **Use transactions for atomic business operations.**
9. **Design explicitly for concurrency.**
10. **Never treat financial records as ordinary CRUD.**
11. **Never treat inventory quantities as arbitrary editable fields.**
12. **Use versioned migrations for every schema change.**
13. **Design indexes around real query patterns.**
14. **Do not allow unbounded queries on large datasets.**
15. **Keep external calls outside long-running database transactions.**
16. **Use idempotency for retry-sensitive operations.**
17. **Maintain auditability for important changes.**
18. **Protect backups and test restoration.**
19. **Monitor database health and query performance.**
20. **Prefer correctness and recoverability over convenience.**

---

# 206. Final Principle

The database must not merely store application data.

It must provide a reliable foundation for:

```text
Multi-Tenancy
+
Business Transactions
+
Financial Integrity
+
Inventory Integrity
+
Workflow Integrity
+
Auditability
+
Concurrency
+
Offline Synchronization
+
Reporting
+
Long-Term Scalability
```

The database is therefore treated as a **core integrity layer of the platform**, not simply a persistence mechanism.

---

# END OF DATABASE RULES
