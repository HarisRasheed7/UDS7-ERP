# MULTI-TENANCY ARCHITECTURE

## 1. PURPOSE

This document defines the multi-tenancy architecture for the professional ERP & Business Management Platform.

Multi-tenancy is a foundational architectural requirement. The platform must support many independent organizations while maintaining strict data isolation, organization-level configuration, controlled cross-company access, scalable infrastructure, and secure tenant-aware processing.

The architecture must allow:

* Multiple organizations on the same platform
* Multiple companies within one organization
* Multiple branches and business units
* Departments and operational locations
* Multiple warehouses and inventory locations
* Organization-specific users, roles, permissions, settings, workflows, modules, branding, and configurations
* Strong tenant isolation
* Secure organization switching
* Tenant-aware APIs, databases, caches, files, jobs, notifications, reporting, search, AI, integrations, and offline synchronization
* Future SaaS deployment at significant scale

Multi-tenancy must be designed from the beginning rather than added later.

---

# 2. ARCHITECTURAL OBJECTIVES

The multi-tenancy architecture must provide:

1. Strong organization data isolation
2. Predictable tenant context handling
3. Secure cross-organization boundaries
4. Support for multi-company organizations
5. Support for branches and operational scopes
6. Organization-specific configuration
7. Organization-specific modules and features
8. Tenant-aware authorization
9. Tenant-aware auditability
10. Tenant-aware reporting and analytics
11. Tenant-aware background processing
12. Tenant-aware caching
13. Tenant-aware files and documents
14. Tenant-aware search
15. Tenant-aware integrations
16. Tenant-aware offline synchronization
17. Scalable database architecture
18. Future migration or sharding capability
19. Safe organization lifecycle management
20. Strong protection against accidental cross-tenant access

---

# 3. MULTI-TENANCY PRINCIPLE

The fundamental rule is:

> Every organization-owned operation must execute inside a validated organization context.

No application service, repository, API endpoint, background worker, report, search operation, file operation, cache operation, or synchronization process may access organization-owned data without an explicit and validated tenant context.

The system must never rely on the frontend to determine whether a user is allowed to access an organization.

The server must determine:

```text
Authenticated User
        ↓
Organization Membership
        ↓
Active Organization Context
        ↓
Company / Branch / Department / Location Scope
        ↓
Role
        ↓
Permission
        ↓
Record Access
        ↓
Business Rules
        ↓
Action
```

---

# 4. TENANT DEFINITION

For this platform, the primary tenant boundary is the **Organization**.

An organization represents an independent business or organizational environment operating within the platform.

Examples:

* Retail company
* Manufacturing group
* Restaurant group
* Educational organization
* Logistics company
* Professional services company
* Holding company
* Franchise organization
* Multi-company business group

Each organization owns or controls its operational data.

---

# 5. ORGANIZATIONAL HIERARCHY

The platform should support the following hierarchy:

```text
Platform
│
├── Organization
│   │
│   ├── Company
│   │   │
│   │   ├── Branch
│   │   │   ├── Department
│   │   │   ├── Business Unit
│   │   │   └── Locations
│   │   │
│   │   └── Warehouses
│   │       └── Warehouse Locations
│   │
│   ├── Users
│   ├── Roles
│   ├── Permissions
│   ├── Customers
│   ├── Suppliers
│   ├── Products
│   ├── Inventory
│   ├── Sales
│   ├── Purchasing
│   ├── Finance
│   ├── Employees
│   ├── Documents
│   ├── Workflows
│   ├── Reports
│   └── Configuration
│
└── Other Organizations
```

Not every organization must use every hierarchy level.

The architecture must support organizations ranging from:

```text
Organization
    ↓
Simple Business
```

to:

```text
Organization
    ↓
Multiple Companies
    ↓
Multiple Branches
    ↓
Departments
    ↓
Locations
    ↓
Warehouses
    ↓
Operational Units
```

---

# 6. PLATFORM LEVEL

The platform is the global application environment.

Platform-level data may include:

* Platform configuration
* Global feature definitions
* Supported modules
* System metadata
* Global permission definitions
* Global industry templates
* Global tax definitions where legally appropriate
* Supported currencies
* Supported languages
* Time zones
* System-wide configuration
* Platform administration
* Subscription infrastructure
* Platform-level integrations
* Platform telemetry

Platform-level data must not accidentally become organization-owned data.

Platform administrators must have explicitly controlled access to organization data.

Platform administration is not equivalent to unrestricted business-user access.

---

# 7. ORGANIZATION LEVEL

The organization is the primary tenant boundary.

Organization-owned data includes, where applicable:

* Organization profile
* Organization settings
* Companies
* Branches
* Departments
* Business units
* Locations
* Warehouses
* Users and memberships
* Roles
* Permissions
* Customers
* Suppliers
* Products
* Services
* Inventory
* Sales
* Purchasing
* Finance
* Employees
* Projects
* Documents
* Workflows
* Reports
* Dashboards
* Notifications
* Automation
* Integrations
* Custom fields
* Custom statuses
* Organization configuration
* Audit history

Every organization-owned record must be traceable to its organization.

---

# 8. COMPANY LEVEL

An organization may contain multiple companies.

Example:

```text
Organization: ABC Group

Company A: ABC Retail Ltd
Company B: ABC Manufacturing Ltd
Company C: ABC Distribution Ltd
```

Companies may share selected organization-level resources while maintaining company-level operational and financial boundaries.

Examples:

* Shared product catalog
* Shared customer directory
* Separate accounting books
* Separate warehouses
* Separate inventory
* Separate branches
* Separate tax configuration
* Separate numbering sequences

The architecture must explicitly distinguish:

```text
Organization Ownership
```

from:

```text
Company Ownership
```

---

# 9. BRANCH LEVEL

Branches represent operational divisions within a company.

Examples:

```text
Company
├── Lahore Branch
├── Islamabad Branch
└── Karachi Branch
```

Branch-level data may include:

* Sales
* POS operations
* Employees
* Customers
* Inventory
* Warehouses
* Cash registers
* Expenses
* Appointments
* Service operations
* Local configuration

Users may have access to:

* All branches
* Selected branches
* One branch
* Branches assigned through roles

---

# 10. BUSINESS UNIT LEVEL

Business units provide another organizational scope where required.

Examples:

```text
Retail Division
Wholesale Division
Online Sales Division
Manufacturing Division
Service Division
```

Business units must not be mandatory for organizations that do not need them.

---

# 11. DEPARTMENT LEVEL

Departments provide organizational and operational scope.

Examples:

* Sales
* Finance
* HR
* Procurement
* Warehouse
* Manufacturing
* Support
* Administration

Department scope may affect:

* User access
* Approval workflows
* Employees
* Documents
* Expenses
* Projects
* Tasks
* Reports

Department-level access must remain subordinate to organization membership.

---

# 12. LOCATION LEVEL

Locations represent physical or logical operational locations.

Examples:

* Office
* Store
* Factory
* Service center
* Yard
* Storage area
* Distribution center

Locations may belong to:

* Company
* Branch
* Business unit
* Warehouse

The hierarchy must prevent invalid ownership relationships.

---

# 13. WAREHOUSE LEVEL

Warehouses are operational inventory boundaries.

A warehouse may belong to a company, branch, or organization depending on configuration.

Warehouse scope may control access to:

* Stock
* Stock movements
* Transfers
* Counts
* Receipts
* Issues
* Reservations
* Picking
* Packing
* Warehouse documents

Inventory authorization must respect warehouse scope.

---

# 14. TENANT CONTEXT

Every organization-aware request must establish a tenant context.

Conceptually:

```text
Request
   ↓
Authenticate User
   ↓
Resolve Organization
   ↓
Validate Membership
   ↓
Resolve Company
   ↓
Resolve Branch
   ↓
Resolve Additional Scope
   ↓
Authorize Operation
   ↓
Execute
```

The tenant context may contain:

```text
organizationId
companyId
branchId
businessUnitId
departmentId
locationId
warehouseId
userId
roleIds
permissionSet
```

Only applicable scope values should be populated.

---

# 15. ACTIVE ORGANIZATION

A user may belong to multiple organizations.

Example:

```text
User
├── Organization A
├── Organization B
└── Organization C
```

The application must maintain an active organization context.

The user interface should clearly show the currently selected organization.

Example:

```text
Organization: ABC Group
Company: ABC Retail
Branch: Lahore
```

Changing the organization must trigger complete context validation.

---

# 16. ORGANIZATION SWITCHING

Organization switching must be treated as a security-sensitive context change.

When a user switches organization:

1. Verify membership
2. Verify organization status
3. Load organization configuration
4. Resolve available companies
5. Resolve available branches
6. Resolve accessible scopes
7. Refresh permissions
8. Refresh navigation
9. Refresh dashboards
10. Invalidate incompatible cached data
11. Reinitialize tenant-aware services

No data from the previous organization should remain visible through:

* Tables
* Search
* Dashboard widgets
* Notifications
* Recent items
* Cached API responses
* Files
* Reports
* Command center
* AI context

---

# 17. ORGANIZATION MEMBERSHIP

Users do not automatically gain access to an organization merely because they have an account.

Access requires an organization membership.

Conceptually:

```text
User
    ↓
Organization Membership
    ↓
Role
    ↓
Permissions
    ↓
Scope
```

Membership may contain:

* User ID
* Organization ID
* Membership status
* Role assignments
* Company assignments
* Branch assignments
* Department assignments
* Warehouse assignments
* Permission overrides where supported
* Invitation information
* Created timestamp
* Updated timestamp
* Last access information

---

# 18. MEMBERSHIP STATES

Recommended states:

```text
INVITED
ACTIVE
SUSPENDED
DISABLED
REMOVED
EXPIRED
```

Rules:

* `INVITED` cannot access organization data
* `ACTIVE` may access according to permissions
* `SUSPENDED` cannot perform normal organization operations
* `DISABLED` cannot authenticate into organization context
* `REMOVED` has no membership access
* `EXPIRED` cannot access until membership is renewed where applicable

Historical records must retain audit information even after membership changes.

---

# 19. ORGANIZATION INVITATIONS

Organizations should support inviting users.

Invitation flow:

```text
Organization Admin
       ↓
Enter User Email
       ↓
Select Role
       ↓
Select Scope
       ↓
Create Invitation
       ↓
User Accepts
       ↓
Membership Created
       ↓
Access Enabled
```

Invitation acceptance must not bypass:

* Organization status
* Permission rules
* Security controls
* Required verification
* Membership restrictions

---

# 20. ROLE AND SCOPE

Roles may be organization-specific.

Examples:

```text
Organization Administrator
Finance Manager
Sales Manager
Warehouse Manager
Branch Manager
Cashier
Purchasing Officer
HR Manager
Employee
Auditor
```

Permissions may be scoped by:

```text
Organization
Company
Branch
Department
Warehouse
Location
Record
Ownership
```

Example:

```text
Warehouse Manager
    ↓
View Inventory
    ↓
Warehouse = Lahore Warehouse
```

The user must not automatically gain access to inventory in other warehouses.

---

# 21. TENANT DATA OWNERSHIP

Every domain must define its ownership boundary.

Example:

| Domain       | Ownership            |
| ------------ | -------------------- |
| Organization | Organization         |
| Company      | Organization         |
| Branch       | Company              |
| Warehouse    | Company/Branch       |
| Product      | Organization/Company |
| Inventory    | Company/Warehouse    |
| Customer     | Organization         |
| Supplier     | Organization         |
| Sale         | Company/Branch       |
| POS Session  | Branch               |
| Employee     | Company              |
| Payroll      | Company              |
| Journal      | Company              |
| Document     | Organization/Company |
| Workflow     | Organization         |
| Custom Field | Organization         |
| Audit Record | Organization         |

Exact ownership may vary by module configuration, but the ownership rule must be explicit.

---

# 22. SHARED VS TENANT-OWNED DATA

The platform must distinguish between:

### Global Platform Data

Examples:

* System metadata
* Global module definitions
* Supported currencies
* Supported languages
* Platform feature definitions
* Industry templates

### Organization Data

Examples:

* Customers
* Products
* Sales
* Inventory
* Employees
* Financial records
* Documents

### Organization Configuration

Examples:

* Numbering rules
* Custom fields
* Workflows
* Permissions
* Branding
* Dashboard layouts
* Notification preferences

Global data must never be used as a mechanism to bypass tenant isolation.

---

# 23. DATABASE TENANCY STRATEGY

The initial architecture should support a shared PostgreSQL deployment with organization-aware records.

The preferred general model is:

```text
Shared Database
        ↓
Shared Schema
        ↓
Organization-Scoped Records
        ↓
organization_id
```

This provides:

* Operational simplicity
* Efficient infrastructure
* Easier cross-module reporting within an organization
* Easier schema migrations
* Lower infrastructure overhead
* Efficient support for many organizations

However, the architecture must remain capable of supporting stronger isolation strategies for future requirements.

---

# 24. TENANCY MODELS

The architecture should remain compatible with three major approaches.

## 24.1 Shared Database / Shared Schema

```text
Database
└── Shared Tables
    ├── Organization A rows
    ├── Organization B rows
    └── Organization C rows
```

Advantages:

* Simple operations
* Lower infrastructure cost
* Easy migrations
* Efficient platform-wide management

Risks:

* Requires extremely strong tenant filtering
* Accidental query omissions can become dangerous

This is the recommended initial model.

---

## 24.2 Shared Database / Schema Per Tenant

```text
Database
├── tenant_a
├── tenant_b
└── tenant_c
```

Advantages:

* Stronger logical isolation
* Easier tenant-specific database operations

Disadvantages:

* More complex migrations
* More schemas to manage
* Operational complexity at large tenant counts

This may be introduced later for selected high-isolation deployments.

---

## 24.3 Database Per Tenant

```text
Database A → Organization A
Database B → Organization B
Database C → Organization C
```

Advantages:

* Strong isolation
* Independent backup/restore
* Tenant-specific scaling

Disadvantages:

* Infrastructure complexity
* Migration complexity
* Higher operating cost

This should be considered for:

* Enterprise customers
* Regulatory requirements
* Very large tenants
* Dedicated deployments

---

# 25. FUTURE TENANT ISOLATION EVOLUTION

The architecture must avoid assumptions that prevent future migration.

Possible evolution:

```text
Phase 1
Shared DB / Shared Schema

        ↓

Phase 2
Partitioning / Read Replicas / Large Tenant Optimization

        ↓

Phase 3
Selective Schema or Database Isolation

        ↓

Phase 4
Dedicated Infrastructure for Enterprise Tenants
```

Business logic must remain independent of the physical tenancy strategy.

---

# 26. ORGANIZATION ID

Organization-owned tables should contain an explicit organization ownership reference where appropriate.

Example:

```text
organization_id
```

This should be indexed on high-volume organization-owned tables.

Where required, records may additionally contain:

```text
company_id
branch_id
department_id
warehouse_id
location_id
```

These relationships must be validated.

Example:

```text
warehouse.company_id
    MUST belong to
warehouse.organization_id
```

Invalid cross-tenant relationships must be rejected.

---

# 27. TENANT-AWARE DATABASE CONSTRAINTS

Database constraints should reinforce tenant boundaries.

Examples:

```text
UNIQUE (
    organization_id,
    code
)
```

instead of:

```text
UNIQUE (code)
```

where codes are expected to be unique only within an organization.

Other examples:

```text
UNIQUE (
    organization_id,
    customer_number
)
```

```text
UNIQUE (
    organization_id,
    product_sku
)
```

```text
UNIQUE (
    organization_id,
    document_number
)
```

Global uniqueness should only be used when genuinely required.

---

# 28. TENANT-AWARE INDEXING

Indexes must support common organization-scoped queries.

Examples:

```text
(organization_id, created_at)
(organization_id, status)
(organization_id, branch_id)
(organization_id, company_id)
(organization_id, warehouse_id)
```

Composite indexes should reflect actual query patterns.

High-volume modules such as:

* Inventory
* Sales
* POS
* Accounting
* Audit
* Notifications
* Documents

require particular attention to tenant-aware indexing.

---

# 29. TENANT-AWARE REPOSITORIES

Repositories/data-access services must enforce organization scope.

Bad pattern:

```text
findCustomer(customerId)
```

when organization context is not enforced.

Preferred conceptual pattern:

```text
findCustomer({
    organizationId,
    customerId
})
```

The repository must verify ownership.

A valid record ID alone must never be sufficient to retrieve an organization-owned record.

---

# 30. TENANT-AWARE SERVICE LAYER

Business services must receive validated organization context.

Example:

```text
createSale({
    organizationContext,
    saleData
})
```

The service must verify:

* Customer belongs to organization
* Products belong to organization
* Warehouse belongs to organization
* Branch belongs to organization
* User has permission
* Pricing rules belong to organization
* Tax configuration is valid
* Inventory belongs to appropriate scope

---

# 31. CROSS-TENANT ACCESS PREVENTION

The platform must prevent:

```text
Organization A
      ↓
Organization B Data
```

through:

* Direct API calls
* Modified IDs
* Query parameters
* Search
* Reports
* Exports
* Files
* Attachments
* Notifications
* Background jobs
* Webhooks
* Imports
* Integrations
* AI requests
* Offline synchronization

Changing a record ID must never allow access to another organization's record.

---

# 32. DEFENSE IN DEPTH

Tenant isolation must not depend on one control.

Recommended layers:

```text
Authentication
      ↓
Membership Validation
      ↓
Tenant Context
      ↓
Authorization
      ↓
Service Validation
      ↓
Repository Filtering
      ↓
Database Constraints
      ↓
Optional PostgreSQL RLS
      ↓
Audit
```

PostgreSQL Row-Level Security may be used as an additional defense-in-depth mechanism where appropriate.

It must not replace proper application authorization architecture.

---

# 33. API TENANCY

Organization-aware API routes should clearly establish tenant context.

Conceptual examples:

```text
/api/v1/organizations/{organizationId}/customers
/api/v1/organizations/{organizationId}/inventory
/api/v1/organizations/{organizationId}/sales
```

Alternatively, organization context may be derived from authenticated session/context.

The architecture must not allow arbitrary organization IDs to override authenticated membership.

Example:

```text
Requested Organization
        ↓
Authenticated Membership Check
        ↓
Allowed?
   ↙         ↘
 YES          NO
 ↓             ↓
Continue      Reject
```

---

# 34. ORGANIZATION CONTEXT VALIDATION

Every organization ID received from a client must be treated as untrusted input.

The server must verify:

1. Organization exists
2. Organization is active
3. User belongs to organization
4. User membership is active
5. Requested company belongs to organization
6. Requested branch belongs to company
7. Requested warehouse belongs to correct company/branch
8. Requested resource belongs to the same tenant
9. User has permission for the requested scope

---

# 35. TENANT-AWARE SEARCH

Global search must respect tenant boundaries.

A search query such as:

```text
"John"
```

must return only records accessible to the active organization and scope.

Search indexing must include tenant context.

Conceptually:

```text
Search Index
├── organization_id
├── entity_type
├── entity_id
├── searchable_content
└── access metadata
```

Search results must never leak another organization's information.

---

# 36. TENANT-AWARE CACHING

Caches must include tenant context in their keys.

Unsafe:

```text
customer:123
```

Safer:

```text
organization:{organizationId}:customer:{customerId}
```

For scoped records:

```text
organization:{organizationId}:warehouse:{warehouseId}:inventory
```

Changing organization must invalidate or isolate incompatible cache state.

---

# 37. TENANT-AWARE FILES

Uploaded files must belong to an organization or an explicitly global platform resource.

File metadata should contain:

```text
organization_id
entity_type
entity_id
file_id
access_scope
```

File retrieval must verify:

* Organization ownership
* Entity ownership
* User permission
* Record scope
* File access rules

File URLs should not provide unrestricted cross-tenant access.

---

# 38. TENANT-AWARE DOCUMENTS

Documents may be associated with:

* Organization
* Company
* Branch
* Employee
* Customer
* Supplier
* Transaction
* Project
* Asset
* Workflow

The document access hierarchy must remain within the organization boundary.

---

# 39. TENANT-AWARE BACKGROUND JOBS

Background jobs must preserve tenant context.

Example:

```text
Job
├── organization_id
├── company_id
├── requested_by
├── job_type
└── payload
```

Workers must not process organization data without knowing the tenant context.

Examples:

* Report generation
* Invoice processing
* Notifications
* Imports
* Exports
* Synchronization
* Document processing
* AI jobs
* Scheduled workflows
* Data aggregation

---

# 40. TENANT-AWARE NOTIFICATIONS

Notifications must be organization-scoped.

Example:

```text
Notification
├── organization_id
├── recipient_user_id
├── event_type
├── entity_type
├── entity_id
└── payload
```

A notification generated in Organization A must never appear in Organization B.

---

# 41. TENANT-AWARE REPORTING

Reports must automatically inherit organization context.

A report request must validate:

```text
Organization
    ↓
Company
    ↓
Branch
    ↓
Department
    ↓
Warehouse
```

where applicable.

Users must not be able to remove tenant restrictions through report filters.

For example:

```text
Company = All
```

must mean:

```text
All companies accessible within the current organization
```

not all companies on the platform.

---

# 42. TENANT-AWARE BI

BI and analytics must enforce the same isolation rules as transactional systems.

Dashboards must only aggregate accessible organization data.

Cross-company reporting is permitted only when:

* Companies belong to the same organization
* The user has required permissions
* The organization permits consolidated reporting

---

# 43. TENANT-AWARE AI

AI services must receive organization context.

AI must not mix information from:

```text
Organization A
```

with:

```text
Organization B
```

AI retrieval systems must enforce tenant filtering.

Knowledge bases should include tenant metadata.

Conceptually:

```text
AI Request
    ↓
User
    ↓
Organization
    ↓
Permission
    ↓
Allowed Data
    ↓
AI Context
    ↓
Response
```

AI must not use another organization's data merely because it exists in a shared infrastructure.

---

# 44. TENANT-AWARE INTEGRATIONS

External integrations must belong to an organization unless explicitly defined as platform-level.

Examples:

* Payment providers
* Email services
* SMS providers
* Accounting integrations
* E-commerce platforms
* Shipping providers
* Banking integrations
* Cloud storage
* Marketplace integrations

Credentials must never be shared between organizations unless intentionally configured as platform-managed infrastructure.

---

# 45. TENANT-AWARE WEBHOOKS

Webhook processing must identify the target organization.

Webhook records should contain sufficient information to determine:

```text
Integration
    ↓
Organization
    ↓
Entity
    ↓
Action
```

The system must reject ambiguous webhook ownership.

---

# 46. TENANT-AWARE AUDIT

Every organization-owned audit event must contain organization context.

Minimum conceptual fields:

```text
organization_id
actor_user_id
action
entity_type
entity_id
timestamp
source
request_id
```

Additional context may include:

```text
company_id
branch_id
department_id
warehouse_id
IP
device
previous_state
new_state
```

Audit records must remain isolated from other organizations.

---

# 47. TENANT-AWARE OFFLINE SYNCHRONIZATION

Offline clients must store organization context with local data.

Conceptually:

```text
Local Database
├── organization_id
├── company_id
├── branch_id
├── entity_id
├── sync_status
└── version
```

Synchronization must never upload data into an organization different from the local tenant context.

A synchronization request must validate:

```text
Device
    ↓
User
    ↓
Organization
    ↓
Membership
    ↓
Permission
    ↓
Entity Ownership
    ↓
Sync
```

Conflict resolution must also remain tenant-aware.

---

# 48. ORGANIZATION PROVISIONING

Organization creation should follow a controlled lifecycle.

Example:

```text
Create Organization
        ↓
Validate Owner
        ↓
Create Organization Record
        ↓
Create Owner Membership
        ↓
Initialize Configuration
        ↓
Initialize Default Roles
        ↓
Initialize Enabled Modules
        ↓
Initialize Numbering
        ↓
Initialize Default Settings
        ↓
Ready
```

Provisioning should be idempotent where possible.

---

# 49. ORGANIZATION ONBOARDING

Onboarding may collect:

* Organization name
* Industry
* Country
* Currency
* Time zone
* Fiscal configuration
* Business type
* Company information
* Branch information
* Enabled modules
* Initial users
* Default roles
* Branding

Industry selection should configure defaults rather than lock the organization into an inflexible architecture.

---

# 50. ORGANIZATION LIFECYCLE

Organizations should have lifecycle states.

Recommended:

```text
PROVISIONING
ACTIVE
SUSPENDED
ARCHIVED
DELETING
DELETED
```

### Provisioning

Organization is being initialized.

### Active

Normal operation.

### Suspended

Normal business operations are restricted.

### Archived

Organization is retained but not actively operating.

### Deleting

Controlled deletion process is underway.

### Deleted

Organization is no longer available according to retention policy.

---

# 51. ORGANIZATION SUSPENSION

Suspension must be controlled.

Possible reasons:

* Administrative action
* Subscription state
* Security incident
* Compliance requirement
* Organization request

Suspension should prevent appropriate transactional operations while preserving authorized administrative access for resolution.

---

# 52. ORGANIZATION ARCHIVAL

Archiving should preserve historical records according to retention requirements.

Archived organizations should not appear in normal organization selectors.

Authorized administrators may still access archived data when permitted.

---

# 53. ORGANIZATION DELETION

Deletion must not be treated as a simple database cascade.

The system must consider:

* Financial records
* Audit records
* Documents
* Legal retention
* Tax records
* Employee records
* Customer records
* Supplier records
* Integrations
* Backups
* Search indexes
* Object storage
* External systems

Deletion must follow documented retention and privacy rules.

---

# 54. BACKUP AND RESTORE

Backups must preserve tenant boundaries.

The platform should support:

* Platform backups
* Organization-level logical backups where practical
* Disaster recovery
* Point-in-time recovery
* Controlled tenant restoration

Tenant restoration must not overwrite another organization's data.

Restoration workflows should validate:

```text
Source Organization
Target Organization
Data Scope
Compatibility
Schema Version
Dependencies
```

---

# 55. TENANT DATA EXPORT

Organizations may require data export.

Exports must include only authorized organization data.

Export jobs must preserve:

* Organization identity
* Export scope
* Requested by
* Timestamp
* Included modules
* Data format
* Security controls
* Audit trail

Sensitive exports should require appropriate permissions and potentially step-up authentication.

---

# 56. TENANT QUOTAS AND LIMITS

The platform may support organization-level limits.

Examples:

* Maximum users
* Maximum storage
* Maximum branches
* Maximum warehouses
* Maximum API requests
* Maximum background jobs
* Maximum document storage
* Maximum integrations
* Maximum automation executions

Limits must be enforced server-side.

---

# 57. NOISY-NEIGHBOR PROTECTION

One organization must not significantly degrade the service for others.

Controls may include:

* API rate limiting
* Job concurrency limits
* Queue isolation
* Query timeouts
* Export limits
* Report execution limits
* Storage quotas
* Resource monitoring
* Background worker limits
* Tenant-specific throttling

Large operations should be asynchronous where appropriate.

---

# 58. LARGE TENANT STRATEGY

Some organizations may become significantly larger than others.

The architecture must support:

```text
Small Tenant
    ↓
Medium Tenant
    ↓
Large Tenant
    ↓
Enterprise Tenant
```

Large tenant optimizations may include:

* Table partitioning
* Specialized indexes
* Read replicas
* Dedicated workers
* Dedicated storage
* Dedicated search indexes
* Database isolation
* Dedicated infrastructure

The domain model must not require application rewrites when introducing these strategies.

---

# 59. TENANT FEATURE ENABLEMENT

Organizations may have different enabled modules.

Example:

```text
Organization A
├── Sales
├── Inventory
├── POS
└── Purchasing

Organization B
├── Manufacturing
├── Inventory
├── Accounting
├── HR
└── Projects
```

Module enablement must be organization-aware.

Disabled modules must not expose:

* Navigation
* APIs
* Actions
* Background jobs
* Reports
* Permissions

unless explicitly required for administration or migration.

---

# 60. TENANT FEATURE FLAGS

Feature flags may exist at multiple levels:

```text
Platform
    ↓
Organization
    ↓
Company
    ↓
User
```

The system must define precedence rules.

Feature flags must not be used as an authorization replacement.

Authorization remains mandatory.

---

# 61. ORGANIZATION CONFIGURATION

Organization-level configuration may include:

* Currency
* Time zone
* Date format
* Number format
* Fiscal settings
* Tax configuration
* Numbering sequences
* Business terminology
* Enabled modules
* Default workflows
* Notification preferences
* Branding
* Reporting preferences

Deep customization is handled by the customization architecture defined in:

```text
11-CUSTOMIZATION-ENGINE.md
```

This document defines the tenancy boundary in which that customization operates.

---

# 62. TENANT BRANDING

Organizations may have custom:

* Logo
* Name
* Brand colors
* Theme selection
* Login branding where supported
* Document branding
* Invoice branding
* Receipt branding
* Email templates

Branding must remain organization-specific.

Theme architecture is defined separately in:

```text
07-THEME-SYSTEM.md
```

---

# 63. MULTI-COMPANY OPERATIONS

A user may have access to multiple companies within one organization.

Example:

```text
ABC Group
├── Retail Company
├── Manufacturing Company
└── Distribution Company
```

The system must support:

* Company switching
* Consolidated reporting
* Company-specific transactions
* Company-specific financial books
* Company-specific inventory
* Company-specific warehouses
* Shared master data where configured

Cross-company transactions must be explicit and authorized.

---

# 64. INTERCOMPANY TRANSACTIONS

Where supported, intercompany operations must be treated as controlled business transactions.

Example:

```text
Company A
    ↓
Transfer / Sale / Service
    ↓
Company B
```

The system must validate:

* Both companies belong to same organization
* User has intercompany permissions
* Both companies are active
* Appropriate accounts/configuration exist
* Required approvals exist
* Both sides are auditable

---

# 65. CROSS-ORGANIZATION OPERATIONS

Cross-organization business operations must not be implicitly supported.

If a platform-level integration or service requires communication between organizations, it must use explicit controlled mechanisms.

Examples:

* Platform marketplace
* External supplier
* Shared service provider
* Platform-level analytics
* Controlled data exchange

Cross-organization access must never occur merely because two organizations use the same database.

---

# 66. TENANT-AWARE IMPORTS

Imports must validate organization context before processing.

Examples:

* Products
* Customers
* Suppliers
* Employees
* Inventory
* Transactions

Import records must not silently resolve references from another organization.

For example:

```text
Customer Code = CUST-100
```

must resolve only within the permitted organization unless an explicit global reference is supported.

---

# 67. TENANT-AWARE EXPORTS

Exports must apply the same authorization as normal views.

A user who cannot view another branch must not obtain its records through CSV or Excel export.

Export filtering must occur server-side.

---

# 68. TENANT-AWARE COMMAND CENTER

The command center must respect:

* Active organization
* Company
* Branch
* Role
* Permissions
* Module availability

A command such as:

```text
Create Sale
```

must execute inside the active organization context.

---

# 69. TENANT-AWARE RECENT ITEMS

Recent items must be organization-aware.

If a user switches organizations:

```text
Previous Organization Recent Items
```

must not appear as active records in:

```text
New Organization
```

unless the system intentionally maintains isolated per-organization history.

---

# 70. TENANT-AWARE DASHBOARDS

Dashboard data must always be scoped to the active organization.

For example:

```text
Sales Today
```

means:

```text
Sales Today
within current organization and authorized scope
```

not:

```text
all sales on the platform
```

Dashboard widgets must inherit tenant and permission context.

---

# 71. TENANT-AWARE SCHEDULED TASKS

Scheduled tasks must store organization context.

Examples:

* Daily sales reports
* Reorder checks
* Payment reminders
* Approval reminders
* Payroll processing
* Inventory alerts
* Automated exports
* Workflow execution

A scheduled task must not execute against an organization selected only from untrusted job input.

---

# 72. TENANT-AWARE EVENT SYSTEM

Domain events should include organization context.

Example:

```text
SaleCompleted
{
    organizationId,
    companyId,
    branchId,
    saleId,
    actorId
}
```

Consumers must validate tenant context before processing the event.

Events must not accidentally trigger actions against another organization.

---

# 73. TENANT-AWARE EVENT QUEUES

Queue messages should include enough context to identify:

```text
organizationId
entityId
eventType
requestedBy
correlationId
```

Workers must establish tenant context before accessing business data.

---

# 74. TENANT-AWARE TELEMETRY

Technical telemetry may be platform-level, but tenant attribution should be controlled.

Where organization IDs are included:

* Avoid sensitive business data
* Apply privacy rules
* Restrict access
* Prevent cross-tenant exposure
* Avoid logging secrets

Telemetry must not become an alternate data extraction channel.

---

# 75. TENANT-AWARE SECURITY MONITORING

Security events may include:

* Organization ID
* User ID
* IP
* Device
* Request ID
* Action
* Result

Security monitoring should allow detection of:

* Cross-tenant access attempts
* Unauthorized organization switching
* Suspicious exports
* Excessive API requests
* Privilege escalation
* Abnormal access patterns

---

# 76. PLATFORM ADMINISTRATORS

Platform administrators operate the platform itself.

Their permissions must be explicitly separated from organization roles.

Example:

```text
Platform Administrator
        ≠
Organization Administrator
```

Platform administration must not automatically mean unrestricted business-data access.

Privileged access should be:

* Explicit
* Auditable
* Restricted
* Logged
* Justified where required

---

# 77. ORGANIZATION ADMINISTRATORS

Organization administrators manage their own organization.

They may configure:

* Users
* Memberships
* Roles
* Permissions
* Companies
* Branches
* Modules
* Organization settings
* Workflows
* Customization
* Branding

They must not automatically access other organizations.

---

# 78. TENANT SECURITY MODEL

The tenant security model should follow:

```text
User Identity
      ↓
Authentication
      ↓
Organization Membership
      ↓
Organization Status
      ↓
Active Organization
      ↓
Company / Branch Scope
      ↓
Role
      ↓
Permission
      ↓
Record Ownership
      ↓
Business Rules
      ↓
Action
      ↓
Audit
```

This complements the security architecture in:

```text
09-AUTH-SECURITY.md
```

---

# 79. TENANT-AWARE ERROR HANDLING

The system must avoid leaking whether another organization's record exists.

Unsafe:

```text
Customer 123 exists but belongs to another organization.
```

Safer behavior:

```text
Resource not found.
```

or an equivalent permission-safe response.

Errors must not expose:

* Other organization names
* Record IDs
* Customer information
* User information
* Internal database identifiers
* Sensitive metadata

---

# 80. TENANT ID ENUMERATION PROTECTION

Sequential IDs must not be treated as authorization.

Example:

```text
GET /customers/100
GET /customers/101
GET /customers/102
```

Changing the ID must not reveal another organization's records.

Authorization must be evaluated independently of identifier knowledge.

---

# 81. TENANT-AWARE API IDEMPOTENCY

Idempotency keys should be scoped appropriately.

Conceptually:

```text
organization_id
+
idempotency_key
```

This prevents collisions between organizations using identical keys.

---

# 82. TENANT-AWARE TRANSACTIONS

Database transactions must preserve organization boundaries.

A transaction that creates:

```text
Sale
Inventory Movement
Customer Balance
Payment
Audit Record
```

must ensure all records belong to the correct organization and valid company/branch scope.

Partial cross-tenant transactions must never be allowed.

---

# 83. TENANT-AWARE FINANCIAL DATA

Financial records require particularly strong organization and company boundaries.

Examples:

* Accounts
* Journals
* Journal lines
* Receivables
* Payables
* Cash accounts
* Bank accounts
* Taxes
* Budgets
* Financial periods

A financial transaction must not reference an account belonging to another organization.

---

# 84. TENANT-AWARE INVENTORY DATA

Inventory records must validate:

```text
Organization
    ↓
Company
    ↓
Warehouse
    ↓
Location
    ↓
Product
```

Stock movements must not cross tenant boundaries.

Inter-company transfers must be explicit business transactions rather than arbitrary stock updates.

---

# 85. TENANT-AWARE POS

POS sessions must belong to:

```text
Organization
Company
Branch
Register
Cashier
```

POS operations must never use products, prices, taxes, customers, inventory, or payment configuration from another organization.

Offline POS data must preserve the same tenant context.

---

# 86. TENANT-AWARE CUSTOMER AND SUPPLIER DATA

Customers and suppliers may be:

* Organization-wide
* Company-specific
* Branch-specific

depending on configuration.

The ownership model must be explicit.

A shared organization customer may be accessible to multiple companies, while company-specific customers remain isolated.

---

# 87. TENANT-AWARE EMPLOYEE DATA

Employees belong to an organization and typically a company.

Sensitive HR information must additionally enforce:

* Department scope
* Manager scope
* HR permissions
* Record-level restrictions

Tenant isolation is necessary but not sufficient for HR security.

---

# 88. TENANT-AWARE DOCUMENT TEMPLATES

Templates may exist at:

```text
Platform
Organization
Company
Branch
```

Precedence should be deterministic.

Example:

```text
Branch Template
      ↓
Company Template
      ↓
Organization Template
      ↓
Platform Default
```

Only templates available to the current organization may be selected.

---

# 89. TENANT-AWARE NUMBERING

Business documents should generally use organization/company scoped numbering.

Examples:

```text
INV-000001
INV-000002
```

may restart independently for separate companies where configured.

Numbering sequences must never collide where uniqueness is required.

---

# 90. TENANT-AWARE CUSTOM FIELDS

Custom fields belong to an organization or explicitly defined scope.

For example:

```text
Organization A
Customer Custom Field:
"Tax Region"
```

must not automatically appear in:

```text
Organization B
```

Custom field definitions must carry scope metadata.

Detailed customization architecture belongs in:

```text
11-CUSTOMIZATION-ENGINE.md
```

---

# 91. TENANT-AWARE WORKFLOWS

Workflow definitions may be organization-specific.

Example:

```text
Purchase Order Approval
Organization A:
Manager → Finance → Director
```

Organization B may use:

```text
Manager → Procurement Head
```

Workflow execution must always resolve the correct tenant definition.

---

# 92. TENANT-AWARE AUTOMATION

Automations must include organization context.

Example:

```text
IF stock < reorder level
THEN create purchase suggestion
```

must execute only against the organization that owns the automation.

Automation definitions must never be globally executable unless intentionally designed as platform-level functionality.

---

# 93. TENANT-AWARE NOTIFICATION TEMPLATES

Notification templates may be customized by organizations.

Examples:

* Approval notifications
* Invoice reminders
* Low-stock alerts
* Payment reminders
* Workflow messages

Organization-specific templates must remain isolated.

---

# 94. TENANT-AWARE INTEGRATION CREDENTIALS

Credentials must be scoped.

Example:

```text
Organization A
└── Payment Provider Credential A

Organization B
└── Payment Provider Credential B
```

Credentials must never be selected solely by integration type.

The system must resolve:

```text
Organization
    ↓
Integration
    ↓
Credential
```

---

# 95. TENANT-AWARE STORAGE

Object/file storage should use tenant-aware paths or equivalent logical partitioning.

Conceptual structure:

```text
organizations/
    {organizationId}/
        documents/
        attachments/
        exports/
        imports/
        generated/
```

Storage authorization must still be enforced independently.

Path separation alone is not security.

---

# 96. TENANT-AWARE SEARCH INDEXES

Search indexes should include organization metadata.

Depending on implementation, the platform may use:

* Tenant-specific indexes
* Shared indexes with mandatory tenant filters
* Partitioned indexes
* Dedicated indexes for large tenants

The search layer must preserve the same authorization model as the primary database.

---

# 97. TENANT-AWARE CACHE INVALIDATION

When organization configuration changes, related caches must be invalidated appropriately.

Examples:

* Permissions
* Roles
* Organization settings
* Branding
* Module configuration
* Workflows
* Pricing
* Tax configuration

Cache invalidation must never cause one organization's configuration to appear in another.

---

# 98. TENANT-AWARE RATE LIMITING

Rate limits may be applied at:

```text
Platform
Organization
User
IP
API Key
Integration
```

This provides protection against both abuse and noisy-neighbor behavior.

---

# 99. TENANT OBSERVABILITY

Operational monitoring should support tenant-aware metrics such as:

* Request volume
* Error rate
* Job volume
* Storage usage
* Database usage
* API consumption
* Sync activity
* Integration activity

Tenant analytics must be protected from unauthorized business-data access.

---

# 100. TENANT MIGRATION

Organizations may eventually need migration between tenancy models.

Examples:

```text
Shared Schema
      ↓
Dedicated Database
```

or:

```text
Organization
      ↓
New Region
```

Migration tooling should preserve:

* IDs where possible
* Relationships
* Audit history
* Files
* Configuration
* Permissions
* Workflows
* Integrations
* Historical records

Migration must be verifiable and auditable.

---

# 101. TENANT REGION SUPPORT

The architecture should remain compatible with future regional deployment.

An organization may eventually have:

```text
Region
Country
Data Residency
```

configuration.

This may influence:

* Database placement
* Storage
* Backups
* Integrations
* Compliance
* Processing

Regional deployment must preserve logical tenant isolation.

---

# 102. TENANT TIME ZONE

Organizations should have a default time zone.

Users may have personal time zones where supported.

The system must distinguish:

```text
Organization Time Zone
User Time Zone
Server Time Zone
```

Business operations should use explicitly defined temporal rules.

---

# 103. TENANT CURRENCY

Organizations may have one or more currencies.

The organization configuration should define:

* Base currency
* Supported currencies
* Decimal precision
* Exchange rate configuration

Multi-company organizations may have different company currencies where supported.

Currency configuration must never leak between organizations.

---

# 104. TENANT LOCALIZATION

Organization-level localization may include:

* Language
* Date format
* Number format
* Currency display
* Time zone
* Fiscal calendar
* RTL preferences

These settings must be resolved from the active organization and user context.

---

# 105. TENANT DATA RETENTION

Retention policies may vary by organization where legally and technically appropriate.

Potential policies include:

* Audit retention
* Document retention
* Transaction retention
* Deleted record retention
* Backup retention

Retention must not violate platform-level legal requirements.

---

# 106. TENANT DATA PRIVACY

Organization data must be treated as private business data.

The platform must prevent:

* Unauthorized internal access
* Cross-tenant access
* Accidental exposure
* Unauthorized exports
* Improper AI access
* Improper logging
* Uncontrolled file access

Privacy controls should work together with the security architecture.

---

# 107. TENANT TESTING REQUIREMENTS

Multi-tenancy must have dedicated automated tests.

Minimum test categories:

### Tenant Isolation

* Organization A cannot access Organization B
* Organization B cannot access Organization A

### Membership

* Removed users cannot access organization
* Suspended users cannot perform normal operations
* Invitations cannot bypass authorization

### Scope

* Branch restrictions work
* Warehouse restrictions work
* Company restrictions work
* Department restrictions work

### API

* Modified organization IDs fail
* Modified record IDs fail
* Cross-tenant relationships fail

### Search

* Cross-tenant search leakage is impossible

### Files

* Cross-tenant file access fails

### Reports

* Cross-tenant report data is impossible

### Background Jobs

* Jobs execute only within their tenant

### AI

* AI retrieval remains tenant-scoped

### Offline

* Offline synchronization cannot cross tenants

---

# 108. CROSS-TENANT SECURITY TEST MATRIX

The test suite should explicitly attempt:

```text
Organization A User
    ↓
Organization B Customer
Organization B Sale
Organization B Product
Organization B Inventory
Organization B Document
Organization B Employee
Organization B Report
Organization B Search Result
Organization B Notification
Organization B API Endpoint
Organization B File
Organization B AI Context
```

Every unauthorized operation must fail safely.

---

# 109. TENANT LOAD TESTING

Load tests should simulate:

```text
Many Organizations
        +
Many Users
        +
High Transaction Volume
        +
Large Tenants
        +
Background Jobs
        +
Reports
        +
Search
```

The platform must prevent one tenant's workload from causing unacceptable degradation for others.

---

# 110. TENANT FAILURE ISOLATION

A failure affecting one organization should not unnecessarily affect others.

Examples:

```text
Organization A
Large Export
        ↓
Should not block
        ↓
Organization B
Normal Sales
```

Tenant-heavy workloads should use controlled asynchronous processing where appropriate.

---

# 111. TENANT-AWARE PERFORMANCE

Common queries should always be optimized around tenant access patterns.

The architecture must consider:

* Organization-aware indexes
* Query planning
* Pagination
* Partitioning
* Caching
* Read replicas
* Background jobs
* Search infrastructure
* Large-tenant isolation

Tenant isolation must not become a reason for poor performance.

---

# 112. TENANT CONTEXT IN APPLICATION CODE

Tenant context should be represented as a first-class application concept.

Conceptually:

```text
TenantContext
├── organizationId
├── companyId
├── branchId
├── businessUnitId
├── departmentId
├── locationId
├── warehouseId
└── userId
```

Services should consume this context rather than independently reconstructing it from arbitrary request parameters.

---

# 113. TENANT CONTEXT LIFECYCLE

Tenant context should be:

```text
Created
    ↓
Validated
    ↓
Attached to Request
    ↓
Used by Services
    ↓
Used by Repository
    ↓
Used by Audit
    ↓
Cleared
```

Context must not leak between requests or asynchronous operations.

---

# 114. TENANT CONTEXT AND TRANSACTIONS

Transactions should preserve tenant context throughout their lifecycle.

Example:

```text
Create Sale
   ↓
Inventory Update
   ↓
Payment
   ↓
Customer Balance
   ↓
Accounting
   ↓
Audit
```

Every operation must remain inside the same validated organization context.

---

# 115. TENANT CONTEXT AND EVENTS

When an event is emitted:

```text
SaleCompleted
```

the event should carry organization information required by consumers.

Consumers must never infer tenant context from an entity ID alone.

---

# 116. TENANT CONTEXT AND WEB REQUESTS

Request handling should conceptually follow:

```text
HTTP Request
     ↓
Security Middleware
     ↓
Authentication
     ↓
Tenant Resolution
     ↓
Membership Validation
     ↓
Scope Resolution
     ↓
Authorization
     ↓
Controller
     ↓
Service
     ↓
Repository
```

Controllers must not bypass tenant-aware services.

---

# 117. TENANT CONTEXT AND BACKGROUND WORKERS

Workers must explicitly establish context.

Bad:

```text
processJob(job)
```

without tenant validation.

Preferred conceptual behavior:

```text
processJob(job)
    ↓
Resolve organization
    ↓
Validate organization status
    ↓
Establish tenant context
    ↓
Authorize operation
    ↓
Process
```

---

# 118. TENANT-AWARE ERROR AND LOG CORRELATION

Requests should include correlation identifiers.

Example:

```text
requestId
correlationId
organizationId
userId
```

Sensitive values must not be logged unnecessarily.

Logs must be access-controlled.

---

# 119. TENANT-AWARE DEVELOPMENT RULES

Developers must follow these rules:

1. Never query organization-owned data without tenant context.
2. Never trust organization IDs from the client.
3. Never assume record IDs imply authorization.
4. Never use global caches for tenant-specific data.
5. Never create tenant-specific background jobs without tenant context.
6. Never expose cross-tenant search results.
7. Never store tenant secrets in shared configuration without scope.
8. Never bypass authorization for convenience.
9. Never use frontend filtering as tenant isolation.
10. Never create a new organization-owned entity without defining ownership.

---

# 120. TENANT-AWARE CODE REVIEW CHECKLIST

Every feature touching organization data should be reviewed for:

* Organization ownership
* Company ownership
* Branch ownership
* Scope validation
* API authorization
* Repository filtering
* Database constraints
* Cache isolation
* Search isolation
* File isolation
* Job isolation
* Event isolation
* Audit context
* Export isolation
* Import validation
* Offline synchronization
* AI context
* Integration context

---

# 121. TENANT-AWARE FEATURE DEVELOPMENT

Before implementing a new feature, developers must answer:

### Ownership

Who owns the data?

### Scope

Is it:

* Organization-wide?
* Company-specific?
* Branch-specific?
* Department-specific?
* Warehouse-specific?
* User-specific?

### Authorization

Who can access it?

### Isolation

How is cross-tenant access prevented?

### Persistence

Which tables contain organization context?

### Search

How is tenant filtering enforced?

### Cache

How is tenant isolation represented?

### Jobs

Does the feature run asynchronously?

### Audit

What tenant information is recorded?

### Offline

Does the feature synchronize?

### Integrations

Does external communication require tenant credentials?

---

# 122. MULTI-TENANCY AND MODULE ARCHITECTURE

Every major module must declare its tenancy behavior.

Example:

```text
Inventory Module
    Organization
        ↓
    Company
        ↓
    Warehouse
```

```text
CRM Module
    Organization
        ↓
    Customer
        ↓
    Branch Scope
```

```text
Accounting Module
    Organization
        ↓
    Company
        ↓
    Financial Books
```

Module specifications must define these boundaries explicitly.

---

# 123. MULTI-TENANCY AND INDUSTRY TEMPLATES

Industry templates must not create shared mutable tenant data.

A template may be global:

```text
Retail Template
```

but when applied to an organization, its configuration becomes organization-owned.

Example:

```text
Global Retail Template
        ↓
Organization A
        ↓
Organization-specific configuration
```

Changes made by Organization A must not modify the global template or Organization B.

---

# 124. MULTI-TENANCY AND CUSTOMIZATION

Tenant customization must operate within the organization boundary.

Examples:

* Custom fields
* Custom forms
* Custom statuses
* Custom workflows
* Custom dashboards
* Custom reports
* Custom numbering
* Custom terminology
* Custom navigation
* Custom notifications

These features are governed by:

```text
11-CUSTOMIZATION-ENGINE.md
```

The customization engine must never allow an organization to mutate another organization's configuration.

---

# 125. MULTI-TENANCY AND THEMES

Theme selection is organization-aware where organization branding is supported.

Example:

```text
Organization A
    → Ocean Blue

Organization B
    → Royal Blue

Organization C
    → Dark Professional
```

Theme configuration must be isolated.

The theme system remains defined by:

```text
07-THEME-SYSTEM.md
```

---

# 126. MULTI-TENANCY AND AUTHENTICATION

Authentication establishes the user's identity.

Multi-tenancy establishes which organizations that identity may access.

Therefore:

```text
Authentication
    ≠
Organization Authorization
```

A successfully authenticated user must still be denied access to organizations for which they have no active membership.

Detailed authentication and security rules remain defined in:

```text
09-AUTH-SECURITY.md
```

---

# 127. MULTI-TENANCY AND AUTHORIZATION

Authorization must always consider both:

```text
Who is the user?
```

and:

```text
Which organization/context is being accessed?
```

A user may have:

```text
Permission = inventory.view
```

but only:

```text
Warehouse = Lahore
```

Therefore:

```text
Permission
+
Tenant Scope
=
Effective Access
```

---

# 128. MULTI-TENANCY AND AUDITABILITY

Every significant tenant-level operation should be traceable.

Example:

```text
User
Organization
Company
Branch
Action
Entity
Entity ID
Timestamp
Request ID
Source
Result
```

For sensitive operations:

```text
Previous State
New State
Reason
Approval
```

may also be recorded.

---

# 129. MULTI-TENANCY AND DATA INTEGRITY

Tenant isolation must be enforced at the data relationship level.

Example:

```text
Sale.organization_id
Customer.organization_id
```

must match.

Likewise:

```text
Sale.company_id
```

must reference a company belonging to:

```text
Sale.organization_id
```

This prevents invalid cross-tenant relationships.

---

# 130. MULTI-TENANCY AND SOFT DELETION

Soft-deleted records must remain tenant-scoped.

Queries must not accidentally return deleted records from another tenant.

Example:

```text
organization_id
deleted_at
```

must both be considered in appropriate queries.

---

# 131. MULTI-TENANCY AND DATA RESTORATION

Restoring a deleted record must validate:

* Organization ownership
* Current organization status
* User permissions
* Parent entity ownership
* Related entity ownership
* Business rules

Restoration must never resurrect a cross-tenant relationship.

---

# 132. MULTI-TENANCY AND VERSIONING

Versioned records must retain organization context.

Examples:

* Documents
* Workflows
* Configuration
* Custom fields
* Templates

Version history must remain within the organization.

---

# 133. MULTI-TENANCY AND APPROVALS

Approval workflows must resolve:

```text
Organization
Company
Branch
Department
Role
User
```

Approvers must belong to the correct organization.

An approval assigned to a user from another organization must be rejected.

---

# 134. MULTI-TENANCY AND SCHEDULED APPROVALS

Scheduled approval reminders must preserve organization context.

Example:

```text
Pending Purchase Order
    ↓
Organization A
    ↓
Notify Organization A Approver
```

The worker must never resolve approvers globally without tenant filtering.

---

# 135. MULTI-TENANCY AND REPORT EXPORT

Large exports should be processed asynchronously.

The export job must contain:

```text
organization_id
requested_by
scope
filters
columns
format
```

The generated file must remain accessible only to authorized users of that organization.

---

# 136. MULTI-TENANCY AND DATA IMPORT VALIDATION

Imported references must be resolved within the current organization.

For example:

```text
SKU
Customer Code
Supplier Code
Warehouse Code
Account Code
```

must not resolve against arbitrary global records.

---

# 137. MULTI-TENANCY AND EXTERNAL IDENTIFIERS

External system IDs should be scoped appropriately.

Example:

```text
organization_id
external_system
external_id
```

This prevents collisions between organizations integrating with the same external provider.

---

# 138. MULTI-TENANCY AND IDEMPOTENCY

Idempotency records must be tenant-aware.

Two organizations may legitimately use the same idempotency key.

Therefore the uniqueness model should include tenant context where appropriate.

---

# 139. MULTI-TENANCY AND API KEYS

Organization API keys must belong to an organization.

An API key should resolve:

```text
API Key
    ↓
Organization
    ↓
Permissions
    ↓
Scope
```

API keys must not provide platform-wide access unless explicitly designed for platform administration.

---

# 140. MULTI-TENANCY AND SERVICE ACCOUNTS

Service accounts must have explicit organization membership and permissions.

A background service account must not automatically inherit unrestricted tenant access.

---

# 141. MULTI-TENANCY AND MACHINE USERS

Integrations and automated systems may act as non-human identities.

They must still have:

* Organization context
* Permissions
* Scope
* Audit identity
* Credential lifecycle
* Revocation support

---

# 142. MULTI-TENANCY AND MOBILE CLIENTS

Future mobile applications must use the same tenant model.

A mobile application may cache:

```text
Organization A
```

but must not expose:

```text
Organization B
```

unless the user explicitly switches to B and has permission.

---

# 143. MULTI-TENANCY AND DESKTOP/OFFLINE CLIENTS

Offline-capable clients must enforce tenant separation locally as well as on the server.

Local storage should be logically separated by organization.

When switching organizations:

```text
Organization A Local Context
        ↓
Close / isolate
        ↓
Organization B Local Context
```

Synchronization must validate server-side ownership.

Client-side tenant separation is an additional control, not the primary security boundary.

---

# 144. MULTI-TENANCY AND DATA MIGRATION

Database migrations must preserve organization ownership.

Schema migrations must be tested against:

* Empty organizations
* Small organizations
* Large organizations
* Multi-company organizations
* High-volume transaction organizations

Migration scripts must not accidentally update all tenants when an organization-specific change was intended.

---

# 145. MULTI-TENANCY AND SEED DATA

Default seed data must distinguish:

```text
Global seed data
```

from:

```text
Organization initialization data
```

Organization initialization must create isolated copies where mutation is allowed.

Example:

```text
Global Default Role
        ↓
Organization A Role Copy

Global Default Role
        ↓
Organization B Role Copy
```

Modifying A must not modify B.

---

# 146. MULTI-TENANCY AND DEFAULT CONFIGURATION

Default configuration should be applied during organization provisioning.

Examples:

* Default roles
* Default statuses
* Default document types
* Default numbering
* Default workflows
* Default dashboard
* Default notification settings

These become organization-specific after initialization.

---

# 147. MULTI-TENANCY AND GLOBAL CONSTANTS

Global constants should only contain truly global values.

Do not hardcode organization-specific:

* Currency
* Tax rates
* Number formats
* Business terminology
* Approval thresholds
* Warehouse rules
* Pricing rules

These belong to appropriate configuration layers.

---

# 148. MULTI-TENANCY ANTI-PATTERNS

The following are prohibited:

### Frontend-only tenant filtering

```text
Fetch everything
↓
Filter in React
```

### Record-ID-only authorization

```text
GET /customers/123
```

without ownership validation.

### Global tenant cache

```text
customer:123
```

for tenant-owned data.

### Global background jobs

Processing tenant records without explicit tenant context.

### Global custom configuration

Allowing one organization to mutate another.

### Global search without tenant filtering

Returning records across organizations.

### Global file URLs

Allowing direct access without authorization.

### Client-controlled organization switching

Accepting arbitrary organization IDs without membership validation.

---

# 149. ACCEPTANCE CRITERIA

The multi-tenancy architecture is complete when:

* [ ] Multiple organizations can exist simultaneously.
* [ ] Organization is the primary tenant boundary.
* [ ] Users can belong to multiple organizations.
* [ ] Organization membership is explicit.
* [ ] Organization switching is secure.
* [ ] Company hierarchy is supported.
* [ ] Branch hierarchy is supported.
* [ ] Department/business-unit scope is supported.
* [ ] Warehouse/location scope is supported.
* [ ] Tenant context is first-class.
* [ ] Tenant context is validated server-side.
* [ ] Organization-owned data contains appropriate ownership references.
* [ ] Tenant-aware database constraints exist.
* [ ] Tenant-aware indexes exist.
* [ ] Repository access is tenant-aware.
* [ ] Service-layer access is tenant-aware.
* [ ] API authorization is tenant-aware.
* [ ] Search is tenant-aware.
* [ ] Cache is tenant-aware.
* [ ] Files are tenant-aware.
* [ ] Documents are tenant-aware.
* [ ] Background jobs are tenant-aware.
* [ ] Notifications are tenant-aware.
* [ ] Reports are tenant-aware.
* [ ] BI is tenant-aware.
* [ ] AI retrieval is tenant-aware.
* [ ] Integrations are tenant-aware.
* [ ] Webhooks are tenant-aware.
* [ ] Audit events are tenant-aware.
* [ ] Offline synchronization is tenant-aware.
* [ ] Organization lifecycle is defined.
* [ ] Organization suspension is supported.
* [ ] Organization archival is supported.
* [ ] Organization deletion follows retention rules.
* [ ] Tenant exports are isolated.
* [ ] Tenant imports are isolated.
* [ ] Large tenants can be optimized.
* [ ] Noisy-neighbor protection exists.
* [ ] Future database isolation is possible.
* [ ] Cross-tenant security tests exist.
* [ ] Multi-company access is controlled.
* [ ] Platform administrators are separated from organization administrators.
* [ ] Tenant-specific customization remains isolated.
* [ ] Tenant-specific branding remains isolated.
* [ ] Tenant-aware auditability is implemented.

---

# 150. FINAL MULTI-TENANCY PRINCIPLE

The platform must treat tenancy as a foundational architectural boundary rather than a filtering feature.

The core principle is:

```text
Platform
    ↓
Organization
    ↓
Company
    ↓
Branch / Business Unit
    ↓
Department / Location / Warehouse
    ↓
User + Role + Permission
    ↓
Record Ownership
    ↓
Business Rules
    ↓
Action
    ↓
Audit
```

Every organization must operate as an independent and secure business environment while still benefiting from the shared platform architecture.

The system must be designed so that:

> **No user, request, query, process, job, integration, file, search operation, report, AI operation, synchronization process, or background task can cross an organization boundary unless that cross-organization operation is explicitly authorized and architecturally supported.**

Multi-tenancy must therefore be built into the database, backend, APIs, authorization model, application services, storage, search, caching, jobs, integrations, reporting, AI, offline synchronization, and operational infrastructure from the beginning.
