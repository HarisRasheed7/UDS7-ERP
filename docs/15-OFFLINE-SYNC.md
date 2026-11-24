# OFFLINE & SYNCHRONIZATION SPECIFICATION

## 1. DOCUMENT PURPOSE

This document defines the complete offline-first and synchronization architecture for the ERP & Business Management Platform.

The platform is primarily a web-based enterprise system, but selected capabilities must remain usable when network connectivity is unavailable or unreliable.

Offline support must be designed as a controlled platform capability rather than as a blanket requirement that every feature operate independently of the server.

The offline architecture must preserve:

* security
* tenant isolation
* authorization
* data integrity
* accounting integrity
* inventory integrity
* workflow integrity
* auditability
* idempotency
* consistency
* recoverability
* user transparency

Offline operation must never become a mechanism for bypassing server-side controls.

---

# 2. OFFLINE ARCHITECTURAL OBJECTIVE

The objective is to allow users to continue productive work during temporary connectivity loss while preserving the server as the authoritative system for operations that require centralized validation.

The architecture must support:

1. Offline application access where appropriate.
2. Local data caching.
3. Local draft creation and editing.
4. Local operation queuing.
5. Reliable synchronization.
6. Incremental change delivery.
7. Conflict detection.
8. Conflict resolution.
9. Retry and recovery.
10. Idempotent operation processing.
11. Secure local storage.
12. Tenant-aware synchronization.
13. Permission-aware synchronization.
14. Offline-aware workflows.
15. Offline-aware inventory operations.
16. Controlled offline POS capabilities where explicitly enabled.
17. Local file/document handling where appropriate.
18. Synchronization monitoring.
19. Recovery from corrupted or obsolete local state.
20. Migration of local storage schemas.

---

# 3. CORE OFFLINE PRINCIPLE

The platform follows this principle:

> **Offline does not mean independent of the platform. Offline means temporarily operating with a controlled local state that can later reconcile with the authoritative server.**

The server remains authoritative for:

* identity
* authentication
* authorization
* tenant membership
* security policy
* financial posting
* accounting periods
* finalized financial transactions
* inventory ledger integrity
* approval authority
* workflow state where server validation is required
* organization configuration
* system administration
* integrations
* external data
* security revocation
* audit authority

The client may temporarily store and prepare data, but must not be allowed to redefine authoritative business state.

---

# 4. OFFLINE CAPABILITY MODEL

Every module, entity, action, and workflow must explicitly declare its offline capability.

Offline capabilities include:

```text
NONE
READ_ONLY
CACHE
DRAFT
CREATE
EDIT
QUEUE
CONTROLLED_TRANSACTION
FULL_OFFLINE
```

These capabilities must not be inferred automatically.

Each feature must define:

* whether it can be accessed offline
* what data can be cached
* which fields can be changed
* which actions can be queued
* whether server validation is required
* whether conflicts are possible
* whether the action requires online connectivity
* how synchronization occurs
* how failures are handled

---

# 5. OFFLINE DATA CLASSIFICATION

Data should be classified into offline capability categories.

## 5.1 Public or Low-Risk Reference Data

Examples:

* product categories
* units of measure
* tax labels
* basic system terminology
* cached configuration
* non-sensitive reference lists

These may generally be cached.

---

## 5.2 Operational Master Data

Examples:

* products
* customers
* suppliers
* warehouses
* locations
* contacts
* service definitions

Selected fields may be available offline.

Changes may be queued when business rules permit.

---

## 5.3 Sensitive Operational Data

Examples:

* customer balances
* supplier balances
* employee information
* financial documents
* pricing
* cost information
* contracts

Offline access must be restricted according to permissions and data sensitivity.

---

## 5.4 High-Integrity Transactional Data

Examples:

* accounting entries
* finalized invoices
* inventory ledger movements
* payment postings
* bank reconciliations
* fiscal period closing
* payroll finalization

These generally require authoritative server processing.

---

## 5.5 Security and Administration Data

Examples:

* roles
* permissions
* authentication policies
* MFA configuration
* organization security settings
* user suspension
* tenant configuration

These should generally require online access.

---

# 6. OFFLINE ARCHITECTURE

The client-side architecture should contain a dedicated local persistence and synchronization layer.

```text
                 WEB APPLICATION
                       │
                       ▼
              APPLICATION SERVICES
                       │
          ┌────────────┴────────────┐
          │                         │
      Online Path              Offline Path
          │                         │
          ▼                         ▼
       API Client              Local Store
          │                         │
          ▼                         ├── Cached Data
       Server API               ├── Local Metadata
                                ├── Outbox
                                ├── Inbox
                                ├── Conflicts
                                ├── Failed Operations
                                └── Sync State
```

The UI must not communicate directly with IndexedDB.

Instead:

```text
UI
 ↓
Application Service
 ↓
Repository / Data Access Layer
 ↓
Local Store OR API
```

This keeps online and offline behavior behind a common application boundary.

---

# 7. LOCAL STORAGE

The browser client should use **IndexedDB** for structured offline persistence.

Local storage must be divided conceptually into separate areas.

```text
IndexedDB
│
├── cached_entities
├── cached_relationships
├── local_metadata
├── outbox
├── sync_changes
├── conflicts
├── failed_operations
├── sync_state
├── local_files
└── schema_metadata
```

Local storage must not be treated as a permanent replacement for PostgreSQL.

---

# 8. SERVICE WORKER

A service worker may be used for:

* application shell caching
* static asset caching
* selected offline resources
* controlled network fallback
* background synchronization where browser support exists

The service worker must not contain business authorization logic.

The service worker must not independently authorize:

* financial transactions
* inventory postings
* approvals
* administrative actions
* security changes

Application-level services remain responsible for business logic.

---

# 9. LOCAL CACHE DESIGN

Cached records must contain synchronization metadata.

Example:

```json
{
  "id": "customer_123",
  "tenantId": "tenant_001",
  "serverVersion": 18,
  "lastSyncedAt": "2026-10-06T12:00:00Z",
  "syncState": "synced",
  "data": {}
}
```

Recommended metadata:

* tenant ID
* entity type
* entity ID
* server version
* local version
* last server synchronization timestamp
* local modification timestamp
* synchronization state
* deletion state
* cache expiration policy
* source
* permission context where required

---

# 10. LOCAL DATA IS TENANT-SCOPED

Every offline record must remain associated with its organization/tenant context.

A local record must never become accessible merely because another organization is selected in the UI.

Local storage must enforce logical partitioning such as:

```text
tenantId
organizationId
companyId
branchId
userId/deviceId
```

depending on the data domain.

---

# 11. TENANT SWITCHING

When a user changes organization or tenant context:

1. Current operations must be evaluated.
2. Pending operations must remain associated with their original tenant.
3. Local cache access must switch to the selected tenant scope.
4. Cross-tenant records must never appear.
5. Tenant-specific search indexes must remain isolated.
6. Tenant-specific files must remain isolated.
7. Tenant-specific sync cursors must remain isolated.
8. Tenant-specific permissions must be refreshed when connectivity exists.

A queued operation must never be reassigned to another tenant.

---

# 12. DEVICE / INSTALLATION IDENTITY

Each client installation should have a unique device or installation identifier.

Example:

```text
deviceId
installationId
```

The identifier is used for:

* synchronization tracking
* operation tracing
* conflict diagnostics
* audit metadata
* device-level security
* troubleshooting

Device identity must not replace user authentication.

---

# 13. LOCAL OPERATION OUTBOX

All offline mutations must enter an outbox.

Example:

```text
OUTBOX
│
├── operationId
├── tenantId
├── deviceId
├── entity
├── entityId
├── action
├── payload
├── baseVersion
├── clientTimestamp
├── idempotencyKey
├── dependencyIds
├── status
└── retryMetadata
```

Possible statuses:

```text
PENDING
READY
SYNCING
SUCCEEDED
FAILED
CONFLICT
BLOCKED
CANCELLED
```

---

# 14. OPERATION IDENTITY

Every offline operation must have a globally unique operation ID.

Example:

```text
operationId = UUID
```

The same operation ID must remain unchanged across retries.

This allows the server to recognize:

```text
first request
retry
duplicate request
replayed request
```

without executing the operation multiple times.

---

# 15. IDEMPOTENCY

Offline synchronization must be idempotent.

If the client sends the same operation five times because of network failures, the server must not create five transactions.

Example:

```text
Operation:
SALE_CREATE
operationId:
op_82f91...
```

If the server has already processed the operation:

```text
HTTP response:
already processed
```

The server returns the original result rather than creating a duplicate.

---

# 16. OFFLINE TIMESTAMPS

Offline operations may contain:

* client-created timestamp
* client-updated timestamp
* local event timestamp

However, client timestamps must never be treated as authoritative server time.

The server must record:

```text
clientTimestamp
serverReceivedAt
serverProcessedAt
```

This supports:

* clock skew analysis
* audit
* ordering diagnostics
* synchronization troubleshooting

---

# 17. CLOCK SKEW

Client clocks cannot be trusted.

The system should detect significant differences between:

```text
client time
server time
```

If the difference exceeds a configured threshold, the UI should warn the user.

Server timestamps remain authoritative.

---

# 18. SYNC ARCHITECTURE

The synchronization service contains two major flows.

```text
             SYNC SERVICE
                  │
       ┌──────────┴──────────┐
       │                     │
       ▼                     ▼
    PUSH OUTBOX          PULL CHANGES
       │                     │
       ▼                     ▼
 Server Processor       Change Feed
       │                     │
       └──────────┬──────────┘
                  ▼
             Reconciliation
```

---

# 19. CHANGE FEED

The server must maintain a synchronization-friendly change feed.

Changes should contain:

* tenant ID
* entity type
* entity ID
* operation
* version
* server sequence
* timestamp
* relevant metadata
* deletion/tombstone state

Example:

```json
{
  "sequence": 190821,
  "tenantId": "tenant_001",
  "entity": "products",
  "entityId": "product_100",
  "operation": "updated",
  "version": 8,
  "occurredAt": "2026-10-06T14:20:00Z"
}
```

---

# 20. SYNC CURSOR

Each client must maintain a synchronization cursor.

Example:

```text
lastServerSequence = 190820
```

The next synchronization requests changes after that sequence.

```text
cursor = 190820
```

Server returns:

```text
190821
190822
190823
```

The client advances the cursor only after successfully applying the corresponding changes.

---

# 21. CURSOR SAFETY

A cursor must not be advanced prematurely.

Incorrect:

```text
download changes
advance cursor
application crashes
changes never applied
```

Correct:

```text
download
validate
apply
persist
commit
advance cursor
```

The cursor update must occur only after successful local application.

---

# 22. TOMBSTONES

Deleted or archived records must leave synchronization markers.

Example:

```json
{
  "entity": "customer",
  "entityId": "customer_123",
  "operation": "deleted",
  "sequence": 9821
}
```

Without tombstones, an offline client could incorrectly recreate or retain deleted records.

Tombstones may be retained for a configured period based on synchronization requirements.

---

# 23. INITIAL BOOTSTRAP

When a new device first enters offline-capable mode:

```text
Authenticate
↓
Load tenant context
↓
Load permissions
↓
Load offline policy
↓
Bootstrap required reference data
↓
Bootstrap permitted operational data
↓
Create sync cursor
↓
Mark local state ready
```

Initial synchronization must be permission-aware and tenant-aware.

---

# 24. SELECTIVE SYNC

The platform must not automatically download the entire ERP database.

Sync policies should define:

* entities
* fields
* relationships
* date ranges
* organizational scope
* branch
* warehouse
* department
* user ownership
* record limits
* file limits
* retention
* sensitivity

Example:

A warehouse employee may receive:

```text
Products
Stock
Warehouse Locations
Open Orders
Customers relevant to branch
```

but not:

```text
Payroll
Company-wide financial statements
HR records
Other organizations
```

---

# 25. INCREMENTAL SYNC

After bootstrap, synchronization should be incremental.

```text
Initial Bootstrap
        ↓
Incremental Changes
        ↓
Incremental Changes
        ↓
Incremental Changes
```

Full synchronization should only be required when:

* cursor becomes invalid
* local database is corrupted
* schema migration requires rebuild
* server requests re-bootstrap
* retention window is exceeded
* security policy requires local purge
* synchronization state becomes unrecoverable

---

# 26. SYNC CYCLE

The standard synchronization cycle is:

```text
Detect connectivity
        ↓
Authenticate
        ↓
Validate tenant context
        ↓
Pull server changes
        ↓
Apply safe changes
        ↓
Push local outbox
        ↓
Process conflicts
        ↓
Pull resulting server changes
        ↓
Advance cursor
        ↓
Update sync status
```

A second pull may be required after push because server-side operations can generate additional changes.

---

# 27. CONNECTIVITY DETECTION

Browser connectivity indicators are advisory only.

For example:

```text
navigator.onLine
```

does not prove that the API is reachable.

The system should distinguish:

```text
ONLINE
OFFLINE
CONNECTIVITY_UNCERTAIN
SERVER_UNAVAILABLE
AUTHENTICATION_REQUIRED
SYNCING
```

The actual API response is authoritative.

---

# 28. RETRY STRATEGY

Transient failures must be retried.

Recommended strategy:

```text
Attempt 1 → short delay
Attempt 2 → longer delay
Attempt 3 → longer delay
...
```

Use:

* exponential backoff
* jitter
* maximum retry interval
* maximum automatic retry count
* retry classification

Do not retry permanent business validation errors indefinitely.

---

# 29. FAILURE CLASSIFICATION

Errors must be classified.

## 29.1 Network Failure

Examples:

* connection lost
* timeout
* DNS failure
* server temporarily unreachable

Action:

```text
retry
```

---

## 29.2 Authentication Failure

Examples:

* session expired
* token invalid
* account revoked

Action:

```text
pause synchronization
require authentication
```

---

## 29.3 Authorization Failure

Examples:

* permission removed
* branch access removed

Action:

```text
reject operation
refresh authorization
notify user
```

---

## 29.4 Business Validation Failure

Examples:

* invalid product
* closed fiscal period
* insufficient stock
* invalid status transition

Action:

```text
do not automatically retry
mark failed
show explanation
```

---

## 29.5 Conflict

Action:

```text
mark conflict
provide resolution workflow
```

---

## 29.6 Server Error

Temporary server errors may be retried.

Persistent errors must be surfaced to the user and operations team.

---

# 30. OUTBOX DEPENDENCIES

Offline operations may depend on previous operations.

Example:

```text
Create Customer
        ↓
Create Sales Order for Customer
        ↓
Add Order Item
```

The order cannot synchronize before the customer operation has produced a valid server identity.

The outbox must support dependency relationships.

---

# 31. TEMPORARY CLIENT IDENTIFIERS

Offline-created entities should use UUID-based client identifiers.

Example:

```text
clientId:
local_customer_8f92...
```

After synchronization, the server may establish the canonical identifier.

The client must maintain an identity mapping:

```text
client ID
     ↓
server ID
```

All dependent queued operations must resolve this mapping.

---

# 32. CONFLICT DETECTION

Conflicts occur when local state was based on an older server version.

Example:

```text
Server:
Customer version = 10

Device A:
reads version 10

Device B:
updates version 10 → 11

Device A offline:
updates based on version 10
```

When Device A synchronizes:

```text
baseVersion = 10
serverVersion = 11
```

The server detects a concurrency conflict.

---

# 33. OPTIMISTIC CONCURRENCY

Entities that support offline editing should use version metadata.

Example:

```text
version = 15
```

An update may include:

```json
{
  "entityId": "123",
  "baseVersion": 15,
  "changes": {}
}
```

If the server currently has version 16, the server evaluates the conflict policy.

---

# 34. CONFLICT RESOLUTION STRATEGIES

Different domains require different strategies.

Supported strategies include:

1. Server authoritative.
2. Last-write-wins.
3. Field-level merge.
4. Domain-specific merge.
5. Manual resolution.
6. Rejection and re-entry.

---

# 35. LAST-WRITE-WINS

Last-write-wins may be used only for low-risk metadata where business integrity is not affected.

Suitable examples:

* display preferences
* non-critical descriptions
* selected UI settings

It must not be the default strategy for:

* accounting
* inventory
* payments
* financial balances
* approvals
* stock quantities

---

# 36. FIELD-LEVEL MERGING

Field-level merging may be used when different users update independent fields.

Example:

```text
Device A:
phone = X

Device B:
email = Y
```

If both changes are safe, the platform may merge them.

The merge policy must be explicitly defined per entity.

---

# 37. DOMAIN-SPECIFIC CONFLICTS

Some conflicts require business logic.

Example:

```text
Product stock:
100

Device A offline:
records sale of 10

Server:
stock already reduced to 95
```

The system must not simply choose:

```text
95
or
90
```

It must evaluate the underlying stock movements and business rules.

---

# 38. FINANCIAL CONFLICT POLICY

Financial records require strict server-authoritative processing.

Offline clients must not resolve accounting conflicts by choosing arbitrary values.

Examples requiring server validation:

* journal posting
* payment posting
* invoice finalization
* fiscal period checks
* ledger balances
* bank reconciliation
* tax posting

If conflict occurs:

```text
Reject or hold operation
        ↓
Explain reason
        ↓
Allow authorized correction/re-entry
```

---

# 39. INVENTORY CONFLICT POLICY

Inventory must be movement-based.

Offline clients must not simply overwrite:

```text
stockQuantity = 500
```

Instead, operations should represent business events:

```text
receipt
issue
transfer
count
adjustment
reservation
sale
return
```

The server validates the resulting inventory state.

---

# 40. OFFLINE INVENTORY COUNT

Stock counting is a suitable offline workflow.

Example:

```text
Download assigned count
↓
Go offline
↓
Scan/count products
↓
Record counted quantities
↓
Store locally
↓
Reconnect
↓
Upload count
↓
Server validates
↓
Generate adjustment
```

Final inventory adjustment remains subject to server-side rules.

---

# 41. OFFLINE SALES ORDERS

Sales order drafting may be supported offline.

Users may:

* create customer orders
* add products
* enter quantities
* apply permitted pricing
* save draft
* queue submission

Final processing may require server validation.

---

# 42. OFFLINE POS

POS may provide a stronger offline capability than ordinary ERP modules, but only when explicitly enabled.

Possible offline POS workflow:

```text
Product catalog cached
↓
Barcode scanned
↓
Local cart
↓
Local pricing rules
↓
Customer selection
↓
Permitted payment
↓
Offline transaction record
↓
Receipt
↓
Outbox
↓
Server synchronization
```

Offline POS must have dedicated safeguards.

---

# 43. OFFLINE POS IDENTIFIERS

Every offline POS transaction must receive a unique transaction identifier.

Example:

```text
deviceId
+
terminalId
+
localSequence
```

This prevents duplicate sale creation during retries.

---

# 44. OFFLINE POS PAYMENT RESTRICTIONS

Not every payment method should be available offline.

Potentially restricted:

* online payment gateway
* card authorization requiring network
* bank API verification
* external payment confirmation
* real-time wallet confirmation

Allowed offline payment methods depend on the configured business policy.

Cash transactions may be supported where permitted.

Offline payments must be clearly marked as offline-originated until server reconciliation is complete.

---

# 45. OFFLINE POS STOCK POLICY

Offline POS introduces inventory risk.

The system must define one of the following policies:

```text
No offline sales
```

or:

```text
Offline sales allowed against cached stock
```

or:

```text
Offline sales allowed with configured local inventory allowance
```

The selected policy must be configurable by organization/business context.

---

# 46. ACCOUNTING OFFLINE POLICY

Accounting should normally support:

```text
view cached data
prepare drafts
prepare journal entries
prepare documents
queue permitted operations
```

but final authoritative posting should normally require server connectivity.

Offline financial posting may only be supported if a specifically designed offline accounting engine exists with:

* local journal integrity
* sequence management
* period validation
* duplicate protection
* reconciliation
* audit
* controlled synchronization

This is not the default architecture.

---

# 47. WORKFLOW OFFLINE POLICY

Workflow support may include:

* viewing cached assigned tasks
* preparing draft responses
* attaching documents
* entering comments
* preparing approval decisions

Authoritative approval should generally require online validation.

This prevents:

* stale permissions
* revoked approvers
* expired workflows
* duplicate approvals
* invalid state transitions

---

# 48. OFFLINE APPROVALS

If a future module explicitly permits offline approval:

1. Approval authority must be cached with expiration.
2. Approval context must be captured.
3. The operation must be signed/identified by the authenticated session.
4. Server must revalidate permission.
5. Server must revalidate workflow state.
6. Duplicate approval must be rejected.
7. Server remains authoritative.

Offline approval must never bypass maker-checker or segregation-of-duties rules.

---

# 49. DOCUMENT OFFLINE SUPPORT

Documents may support:

* offline viewing
* cached previews
* draft creation
* queued uploads
* queued attachments

Files must have:

* tenant association
* entity association
* metadata
* access policy
* checksum where appropriate
* upload state

Sensitive files should not automatically be cached indefinitely.

---

# 50. FILE UPLOAD QUEUE

Queued uploads may contain:

```text
fileId
operationId
entityId
tenantId
file metadata
checksum
upload status
chunk state
retry count
```

Large files should support resumable uploads where appropriate.

---

# 51. SEARCH OFFLINE

Offline search should operate only against the locally synchronized dataset.

The UI must distinguish:

```text
Offline search
```

from:

```text
Global server search
```

A user must never assume that an offline search result represents the entire organization.

---

# 52. REPORTING OFFLINE

Reports may use cached data.

Offline reports must clearly identify:

```text
Data last synchronized:
06 Oct 2026 14:32
```

Sensitive or high-integrity reports may be disabled offline.

Financial dashboards must never silently present stale information as current.

---

# 53. NOTIFICATIONS OFFLINE

Offline behavior may include:

* cached notifications
* locally generated synchronization notifications
* pending action indicators

Server-generated notifications received while offline will be delivered when synchronization resumes.

Notifications must not be duplicated during reconnect.

---

# 54. PERMISSION CHANGES WHILE OFFLINE

A major security consideration is stale permissions.

Example:

```text
User has inventory permission
↓
Administrator removes permission
↓
User goes offline
```

The client may still possess stale cached capability metadata.

Therefore:

* client permissions are advisory
* server authorization is authoritative
* queued operations must be reauthorized
* revoked operations must be rejected
* security changes must invalidate local capability caches when detected

---

# 55. SESSION EXPIRATION

If the session expires:

```text
Pause sync
↓
Protect queued operations
↓
Request authentication
↓
Revalidate tenant and permissions
↓
Resume synchronization
```

Queued data must not be silently discarded unless security policy explicitly requires local purge.

---

# 56. LOGOUT

Logout must address local data.

Depending on organization security policy, logout may:

* clear authentication credentials
* revoke tokens
* clear sensitive cache
* clear tenant cache
* retain non-sensitive offline drafts
* retain or purge outbox
* remove local encryption keys

High-security environments may require complete local data purge.

---

# 57. LOCAL ENCRYPTION

Sensitive local data should be encrypted where feasible.

The design must consider:

* browser storage security
* device security
* encryption key management
* session-bound access
* key invalidation
* logout behavior

Encryption does not replace:

* XSS protection
* CSP
* secure authentication
* authorization
* tenant isolation

---

# 58. XSS AND OFFLINE SECURITY

Offline applications can still be attacked through malicious content.

The platform must prevent:

* unsafe HTML rendering
* injected scripts
* malicious document previews
* unsafe imported data
* malicious cached content

All server-originated and user-generated content must remain subject to normal validation and output encoding.

---

# 59. SYNC API

The synchronization API aligns with the API architecture in `14-API-SPECIFICATION.md`.

Conceptual endpoints:

```text
GET  /api/v1/sync/status
GET  /api/v1/sync/bootstrap
GET  /api/v1/sync/changes
POST /api/v1/sync/push
POST /api/v1/sync/acknowledge
POST /api/v1/sync/rebuild
```

Exact endpoint behavior must remain versioned and documented through the API specification.

---

# 60. SYNC STATUS

Example:

```http
GET /api/v1/sync/status
```

Response may contain:

```json
{
  "status": "ready",
  "tenantId": "tenant_001",
  "serverSequence": 190821,
  "clientSequence": 190818,
  "pendingOperations": 4,
  "conflicts": 1
}
```

---

# 61. CHANGE REQUEST

Example:

```http
GET /api/v1/sync/changes?cursor=190818
```

The server should return:

* changes
* next cursor
* more-data indicator
* server sequence
* synchronization metadata

Large change sets must be paginated.

---

# 62. PUSH REQUEST

Example:

```json
{
  "deviceId": "device_001",
  "tenantId": "tenant_001",
  "operations": [
    {
      "operationId": "op_001",
      "entity": "customers",
      "entityId": "customer_001",
      "action": "update",
      "baseVersion": 12,
      "payload": {},
      "clientTimestamp": "2026-10-06T14:30:00Z",
      "idempotencyKey": "idem_001"
    }
  ]
}
```

---

# 63. PUSH RESPONSE

Each operation should receive an explicit result.

Possible states:

```text
APPLIED
ALREADY_APPLIED
CONFLICT
REJECTED
RETRY
BLOCKED
```

Example:

```json
{
  "operationId": "op_001",
  "status": "CONFLICT",
  "serverVersion": 14,
  "serverRecord": {},
  "reason": "Record was modified after the offline copy was created."
}
```

---

# 64. ACKNOWLEDGEMENT

Acknowledgement allows the client and server to confirm synchronization state.

The server must not assume that delivery of a response guarantees that the client persisted the result.

The client should acknowledge durable local application where the protocol requires it.

---

# 65. SYNC TRANSACTION BOUNDARIES

Each operation must have clearly defined server-side transaction boundaries.

For example:

```text
Receive operation
↓
Authenticate
↓
Authorize
↓
Validate
↓
Check idempotency
↓
Check concurrency
↓
Execute domain operation
↓
Write audit
↓
Generate change event
↓
Commit
↓
Return result
```

A failed transaction must not partially modify business state.

---

# 66. DOMAIN EVENTS

Successful synchronization operations should generate normal domain events.

Example:

```text
offline order synchronized
        ↓
OrderCreated
        ↓
Inventory workflow
        ↓
Notification
        ↓
Audit
        ↓
Reporting update
```

Offline-originated operations must not bypass normal application events.

---

# 67. CONFLICT RECORDS

Conflicts should be persisted when necessary.

Conflict record should include:

* conflict ID
* tenant
* device
* operation ID
* entity
* entity ID
* base version
* server version
* local payload
* server state
* conflict type
* created timestamp
* resolution status
* resolved by
* resolution timestamp
* resolution method

---

# 68. MANUAL CONFLICT RESOLUTION

A conflict UI should provide:

```text
LOCAL VERSION
SERVER VERSION
DIFFERENCES
BUSINESS IMPACT
RESOLUTION OPTIONS
```

Example:

```text
Customer Name

Local:
ABC Trading Ltd.

Server:
ABC Trading Limited
```

For safe metadata, the user may choose:

```text
Keep Local
Keep Server
Merge
```

For financial or inventory conflicts, arbitrary merge options must not be presented.

---

# 69. CONFLICT RESOLUTION AUDIT

Every manual resolution must be auditable.

Record:

* user
* tenant
* device
* conflict
* original local value
* server value
* selected resolution
* timestamp
* reason if required

---

# 70. DELETED RECORD CONFLICTS

Scenario:

```text
Device A offline:
edits customer

Device B online:
deletes customer

Device A reconnects
```

The server must detect the deletion conflict.

The result may be:

```text
rejected
```

or:

```text
restore workflow
```

depending on domain policy.

Deletion must never be silently undone.

---

# 71. OFFLINE CACHE RETENTION

Local data should have configurable retention policies.

Example:

```text
Reference data:
longer retention

Operational data:
limited retention

Sensitive data:
short retention

Financial data:
controlled retention

Temporary drafts:
until completion or expiration
```

The platform must avoid unlimited local data growth.

---

# 72. STORAGE QUOTAS

The client must monitor storage usage.

Possible states:

```text
NORMAL
WARNING
CRITICAL
FULL
```

When storage approaches capacity:

1. Remove expired cache.
2. Remove unnecessary temporary files.
3. Compact local indexes where possible.
4. Notify the user.
5. Prevent unsafe new caching.
6. Preserve critical queued operations.

The platform must not silently delete unsynchronized business operations.

---

# 73. LOCAL SCHEMA MIGRATIONS

IndexedDB schema versions must be tracked.

Example:

```text
Local Schema v1
↓
Local Schema v2
↓
Local Schema v3
```

Migration must preserve:

* queued operations
* sync cursor
* cached records where possible
* conflict records
* file metadata

If migration cannot safely preserve state, the application must enter a controlled recovery flow.

---

# 74. LOCAL DATABASE RECOVERY

Possible recovery options:

```text
repair
rebuild indexes
re-download cache
re-bootstrap
export pending drafts
```

Unsynchronized operations must receive special protection.

The platform must not offer a simple:

```text
Clear all data
```

action without warning when pending operations exist.

---

# 75. FULL RESYNCHRONIZATION

A full rebuild may follow:

```text
Pause operations
↓
Preserve unsynchronized outbox
↓
Validate authentication
↓
Clear invalid cache
↓
Bootstrap server data
↓
Replay valid local operations
↓
Resolve conflicts
↓
Resume normal operation
```

---

# 76. MULTI-TAB SYNCHRONIZATION

Multiple browser tabs may access the same tenant.

The platform should prevent:

* duplicate operation processing
* competing sync workers
* cursor corruption
* outbox race conditions

Possible coordination mechanisms include:

* BroadcastChannel
* Web Locks API where supported
* local coordination records
* server-side idempotency

The design must remain functional even when browser coordination features are unavailable.

---

# 77. MULTI-DEVICE SYNCHRONIZATION

The same user may use:

```text
Desktop
Laptop
Tablet
Mobile browser
```

Changes from one device must eventually propagate to other devices according to synchronization policy.

Device identity must be preserved in audit and diagnostics.

---

# 78. SERVER-SIDE AUTHORITY

The server must revalidate every synchronized mutation.

The client cannot claim:

```text
permission = true
```

and expect the server to accept it.

The server must independently verify:

* identity
* session
* tenant
* role
* permission
* scope
* workflow
* business rules
* concurrency
* data integrity

---

# 79. OFFLINE CUSTOMIZATION

Customization data may be cached for rendering.

However, changes to:

* roles
* permissions
* workflows
* business rules
* custom fields
* custom modules
* security policies

should generally require online server validation.

Local customization drafts may be prepared where supported.

---

# 80. OFFLINE BUSINESS RULES

Some client-side rules may be executed offline for user experience.

Examples:

```text
required field
basic format validation
local form validation
basic quantity validation
```

These are convenience checks.

They do not replace server validation.

---

# 81. OFFLINE BUSINESS RULE VERSIONING

If a business rule is cached locally, its version should be tracked.

Example:

```text
pricingRuleVersion = 8
```

If the server has version 9:

```text
local rule is stale
```

The system must avoid treating stale client rules as authoritative.

---

# 82. OFFLINE PRICING

Pricing may be cached when necessary.

However, pricing must be associated with:

* effective date
* price list
* currency
* tax policy
* customer segment
* version
* validity

Offline pricing should be marked as cached when appropriate.

Final transaction validation remains server-controlled unless offline transaction policy explicitly permits it.

---

# 83. OFFLINE TAX DATA

Tax configuration may be cached for permitted workflows.

The client must retain:

* tax rule version
* effective date
* jurisdiction
* rate
* calculation method

Final tax posting may require server validation.

---

# 84. OFFLINE USER EXPERIENCE

The interface must clearly communicate synchronization state.

Recommended global status:

```text
● Online
```

```text
● Offline
```

```text
↻ Synchronizing...
```

```text
! 3 changes need attention
```

---

# 85. OFFLINE BANNER

Offline messages must be informative rather than disruptive.

Example:

```text
You are offline.
Changes that support offline mode will be saved locally and synchronized when connection returns.
```

The UI should not repeatedly display the same blocking warning.

---

# 86. RECORD-LEVEL OFFLINE STATE

Records may display:

```text
Synced
Pending
Syncing
Conflict
Failed
Offline Draft
```

Users must be able to understand whether their action has reached the server.

---

# 87. SYNC CENTER

The platform should provide a dedicated Sync Center.

Recommended sections:

```text
Overview
Pending Changes
Completed
Failed
Conflicts
Storage
Device
Sync History
```

---

# 88. SYNC CENTER OVERVIEW

The overview should display:

* connection status
* last successful sync
* current synchronization state
* pending operations
* failed operations
* conflicts
* storage usage
* current tenant
* current device
* server reachability

---

# 89. PENDING CHANGES

Users should be able to inspect pending operations where appropriate.

Example:

```text
Customer Update
Offline Draft
Pending synchronization
```

Sensitive internal payloads should not be exposed unnecessarily.

---

# 90. FAILED OPERATIONS

Failed operations should display:

* operation
* entity
* failure reason
* time
* retry option
* resolution option
* affected record

Permanent business failures should not have an endless automatic retry loop.

---

# 91. CONFLICT SCREEN

Conflict screen should provide:

```text
Conflict Summary
Local Data
Server Data
Difference View
Business Rule Explanation
Resolution Action
Audit Information
```

---

# 92. MANUAL SYNC

The user should be able to trigger:

```text
Sync Now
```

Manual sync must use the same safe synchronization pipeline as automatic sync.

It must not bypass:

* authorization
* validation
* idempotency
* audit
* conflict detection

---

# 93. BACKGROUND SYNC

When browser capabilities permit, synchronization may continue in the background.

However, the system must not depend exclusively on background synchronization.

The application must recover when:

* browser suspends execution
* device sleeps
* browser closes
* background sync is unavailable

---

# 94. SYNC SCHEDULING

Synchronization may be triggered by:

* reconnect
* application startup
* application resume
* manual request
* timer
* successful mutation
* background sync event

The scheduler must prevent multiple concurrent synchronization processes for the same local context.

---

# 95. SYNC QUEUE PRIORITY

Operations may have priority.

Example:

```text
Security-related synchronization
High-integrity business operations
User-requested operations
Normal operational data
Background cache updates
```

Priority must never allow low-level operations to bypass business dependencies.

---

# 96. DEAD-LETTER OPERATIONS

Operations that repeatedly fail should eventually move to a controlled dead-letter state.

Example:

```text
PENDING
↓
RETRYING
↓
FAILED
↓
DEAD_LETTER
```

Dead-letter operations should remain recoverable by authorized users or support processes.

They must not disappear silently.

---

# 97. OFFLINE AUDIT

Offline actions must remain auditable.

Audit information should distinguish:

```text
client timestamp
server receipt timestamp
server processing timestamp
device ID
operation ID
user ID
tenant ID
source = offline
```

The audit record must clearly show that the action originated offline.

---

# 98. AUDIT INTEGRITY

Client-provided audit information must not replace server-generated audit information.

The server must independently record:

* actor
* tenant
* operation
* server timestamp
* authorization result
* final action
* resulting entity state

---

# 99. OFFLINE SECURITY EVENTS

Security-sensitive server events received after reconnect should be processed immediately.

Examples:

* account suspended
* password reset
* MFA requirement changed
* tenant access revoked
* permission removed
* device revoked
* security policy changed

The platform may require local cache invalidation after such events.

---

# 100. OFFLINE DATA PURGE

The platform should support remote or server-triggered local purge policies where security requirements demand it.

Examples:

```text
user revoked
device revoked
tenant access removed
organization deleted
security incident
```

Local purge must be designed carefully so that unauthorized parties cannot recover cached sensitive information.

---

# 101. MODULE OFFLINE CAPABILITY MATRIX

| Domain                | Offline Access | Offline Mutation | Typical Policy          |
| --------------------- | -------------- | ---------------- | ----------------------- |
| Organization          | Limited        | No               | Online                  |
| Users & Access        | Limited        | No               | Online                  |
| Products              | Yes            | Yes              | Controlled              |
| Customers             | Yes            | Yes              | Controlled              |
| Suppliers             | Yes            | Yes              | Controlled              |
| Inventory             | Yes            | Limited          | Controlled              |
| Warehouses            | Yes            | Limited          | Controlled              |
| Sales                 | Yes            | Draft/Queue      | Controlled              |
| POS                   | Yes            | Optional         | Dedicated offline mode  |
| Purchasing            | Yes            | Draft/Queue      | Controlled              |
| Accounting            | Cached         | Draft            | Usually online posting  |
| Finance               | Cached         | Limited          | Server authoritative    |
| HR                    | Limited        | Limited          | Policy-dependent        |
| Manufacturing         | Cached         | Selected         | Controlled              |
| CRM                   | Yes            | Selected         | Controlled              |
| Projects              | Yes            | Selected         | Controlled              |
| Documents             | Yes            | Queue uploads    | Controlled              |
| Workflows             | Yes            | Draft            | Usually online approval |
| Notifications         | Cached         | Local state      | Sync on reconnect       |
| Reports               | Cached         | No               | Clearly marked stale    |
| BI                    | Cached         | No               | Read-only               |
| Customization         | Cached         | Draft            | Online publish          |
| Security              | Limited        | No               | Online                  |
| System Administration | Limited        | No               | Online                  |
| Integrations          | Cached         | Queue where safe | Server-controlled       |

---

# 102. OFFLINE CAPABILITY CONFIGURATION

Organizations may configure offline capabilities within platform limits.

Example:

```text
POS Offline:
Enabled

Inventory Count Offline:
Enabled

Accounting Posting Offline:
Disabled

Workflow Approval Offline:
Disabled
```

Organizations must not be allowed to enable capabilities that violate platform integrity constraints.

---

# 103. OFFLINE POLICY HIERARCHY

Effective offline behavior may depend on:

```text
Platform Policy
↓
Industry Policy
↓
Organization Policy
↓
Company Policy
↓
Branch Policy
↓
Role Policy
↓
User/Device Policy
↓
Module Policy
↓
Entity/Action Policy
```

More restrictive policies must override less restrictive settings.

---

# 104. OFFLINE DATA MINIMIZATION

The client should only cache data necessary for supported workflows.

Do not cache:

```text
entire database
```

when the user only needs:

```text
warehouse inventory
open sales orders
assigned customers
```

This improves:

* performance
* security
* storage
* synchronization speed

---

# 105. STALE DATA INDICATORS

Cached information should have freshness metadata.

Example:

```text
Last synchronized:
Today, 14:32
```

If data exceeds its allowed freshness period:

```text
Stale
```

must be displayed.

Certain operations should be disabled when required data becomes too stale.

---

# 106. OFFLINE DATA FRESHNESS POLICIES

Each offline-capable dataset may define:

```text
maximumAge
refreshOnUse
refreshOnReconnect
requireFreshForMutation
```

Example:

```text
Product catalog:
24 hours

Pricing:
4 hours

Tax rules:
short controlled period

Security policy:
must be current
```

Actual values should be configurable according to business risk.

---

# 107. OFFLINE API CACHE

HTTP caching and application-level synchronization must not be treated as the same system.

HTTP cache may improve performance.

The synchronization layer manages:

* authoritative versions
* mutations
* conflicts
* cursors
* outbox
* acknowledgements

---

# 108. CONSISTENCY MODEL

The platform uses a controlled consistency model.

## Strong Consistency

Required for:

* accounting posting
* permissions
* security
* fiscal controls
* finalized financial records

## Eventual Consistency

Acceptable for:

* selected operational master data
* notifications
* dashboards
* non-critical cached data

## Local Temporary Consistency

Allowed for:

* drafts
* offline forms
* queued operations
* temporary POS state

---

# 109. OFFLINE TRANSACTION BOUNDARIES

Every offline-capable action must explicitly define:

```text
What happens locally?
What is authoritative?
What can fail later?
What can conflict?
What can be reversed?
What must be rejected?
```

No feature should be marked “offline capable” without these definitions.

---

# 110. REVERSAL AND CORRECTION

If an offline transaction is later found invalid, the system should use normal correction mechanisms.

For financial and inventory records:

```text
Original transaction
↓
Correction / reversal / adjustment
```

rather than destructive rewriting.

---

# 111. OFFLINE IMPORTS

Offline import may be supported for selected datasets.

Imports should be stored as:

```text
draft import
```

and validated server-side when synchronized.

Large imports should not automatically be pushed as thousands of independent uncontrolled operations.

Batch import processing should use a dedicated import workflow.

---

# 112. OFFLINE BULK ACTIONS

Bulk offline actions require additional safeguards.

Example:

```text
Update 500 products
```

The system must track each affected record or create a deterministic batch operation.

A partially synchronized bulk operation must be recoverable.

---

# 113. BATCH OPERATION IDENTIFIERS

Bulk operations should have:

```text
batchId
operationId
itemOperationId
```

This allows:

* partial success reporting
* retry
* failure isolation
* audit
* reconciliation

---

# 114. SYNCHRONIZATION OBSERVABILITY

The system must expose operational metrics.

Important metrics include:

* synchronization success rate
* synchronization failure rate
* queue depth
* conflict rate
* average sync duration
* maximum sync duration
* failed operation count
* retry count
* dead-letter count
* cursor lag
* stale clients
* storage utilization
* bootstrap duration
* change feed volume
* per-tenant synchronization load

---

# 115. SYNC LOGGING

Logs should include:

```text
requestId
operationId
deviceId
tenantId
userId
entity
entityId
sync batch
result
duration
error classification
```

Sensitive payload data should not be logged unnecessarily.

---

# 116. SYNC TRACING

Synchronization requests should support distributed tracing.

Example:

```text
Client Operation
      ↓
Sync API
      ↓
Application Service
      ↓
Domain Service
      ↓
Database
      ↓
Event
      ↓
Audit
```

Correlation IDs must allow support teams to trace the operation.

---

# 117. PERFORMANCE REQUIREMENTS

The synchronization system must support:

* incremental synchronization
* pagination
* batching
* compression where appropriate
* efficient indexes
* selective fields
* selective entities
* background processing
* lazy file synchronization
* resumable uploads
* bounded queue processing

Large tenants must not cause synchronization requests to become unbounded.

---

# 118. CHANGE FEED INDEXING

The server-side change feed must be indexed appropriately.

Important dimensions include:

```text
tenantId
sequence
entity
entityId
timestamp
```

Indexes must support:

```text
tenant + sequence
```

as a primary synchronization access pattern.

---

# 119. DATA RETENTION AND CHANGE FEED

Change feed retention must be long enough to support normal offline clients.

If a client remains offline beyond the available change history:

```text
incremental sync unavailable
```

The system should require:

```text
re-bootstrap
```

rather than attempting to reconstruct missing history incorrectly.

---

# 120. STALE CLIENT MANAGEMENT

The platform should identify clients that have not synchronized for an excessive period.

Possible states:

```text
CURRENT
STALE
VERY_STALE
REQUIRES_REBUILD
```

Users should be warned before stale local data is used for risky operations.

---

# 121. OFFLINE DEVICE REGISTRATION

Organizations may require devices to be registered.

Device registration may contain:

* device ID
* user
* organization
* browser/client metadata
* created date
* last sync
* status
* revoked status

Device registration must remain subject to security policies.

---

# 122. DEVICE REVOCATION

If a device is revoked:

```text
server marks device revoked
↓
next synchronization rejects device
↓
local session invalidated
↓
sensitive cache purged
```

Where immediate online communication is impossible, the device cannot be remotely disabled until it reconnects; therefore local security controls remain important.

---

# 123. OFFLINE ACCEPTANCE RULES

Every offline operation must pass through:

```text
Offline Capability Check
↓
Local Validation
↓
Permission Context Check
↓
Operation Creation
↓
Outbox Persistence
```

When synchronized:

```text
Authentication
↓
Tenant Validation
↓
Authorization
↓
Business Validation
↓
Concurrency Validation
↓
Domain Transaction
↓
Audit
↓
Event
↓
Acknowledgement
```

---

# 124. TESTING STRATEGY

Offline functionality requires dedicated testing.

## Connectivity Tests

Test:

* start online
* go offline
* reconnect
* intermittent network
* slow network
* timeout
* server unavailable
* DNS failure

---

# 125. QUEUE TESTS

Test:

* single queued operation
* multiple operations
* dependent operations
* duplicate operations
* retry
* failed operation
* dead-letter operation
* application restart with queue pending

---

# 126. CONFLICT TESTS

Test:

* same record edited on two devices
* same field edited
* different fields edited
* delete versus update
* inventory conflict
* pricing conflict
* financial conflict
* workflow state conflict

---

# 127. SECURITY TESTS

Test:

* expired session
* revoked permission
* revoked tenant access
* revoked device
* tenant switching
* cross-tenant cache access
* malicious cached data
* XSS
* storage inspection
* local data purge
* logout
* reauthentication

---

# 128. STORAGE TESTS

Test:

* storage near quota
* quota exceeded
* large queue
* large file
* corrupted local data
* schema migration
* failed migration
* rebuild
* re-bootstrap

---

# 129. MULTI-TAB TESTS

Test:

* two tabs editing same record
* simultaneous synchronization
* cursor updates
* duplicate processing
* logout in one tab
* tenant switch in one tab

---

# 130. MULTI-DEVICE TESTS

Test:

```text
Device A offline
Device B online
Device A reconnects
```

and:

```text
Device A + Device B + Device C
```

with simultaneous edits.

---

# 131. POS OFFLINE TESTS

If offline POS is enabled, test:

* barcode scanning
* cached products
* cached pricing
* offline sale
* multiple payments
* duplicate transaction prevention
* receipt generation
* local stock policy
* reconnect
* server conflict
* failed synchronization
* refund/return policy
* terminal sequence
* end-of-day reconciliation

---

# 132. FINANCIAL OFFLINE TESTS

Test:

* offline draft
* stale fiscal period
* server posting
* duplicate submission
* concurrent modification
* permission removal
* accounting period closure
* reconciliation conflict

---

# 133. RECOVERY TESTS

The application must recover correctly from:

* browser crash
* computer shutdown
* device sleep
* tab close
* application refresh
* network failure during upload
* network failure after server commit
* server response lost after successful transaction

The final case is especially important because the client may retry an operation that the server already completed.

Idempotency must prevent duplication.

---

# 134. ACCEPTANCE CRITERIA

The offline synchronization architecture is accepted only when:

* offline capabilities are explicitly defined
* tenant isolation exists locally
* IndexedDB is used appropriately
* application state is separated from persistence
* outbox exists
* operation IDs exist
* idempotency exists
* server versions exist
* sync cursors exist
* incremental changes exist
* tombstones exist
* conflicts are detected
* conflicts are resolved according to domain rules
* financial conflicts are server authoritative
* inventory conflicts are movement-based
* permissions are revalidated server-side
* authentication expiration is handled
* logout is secure
* tenant switching is safe
* local data retention exists
* local storage limits are handled
* schema migration exists
* full rebuild exists
* retry policies exist
* dead-letter handling exists
* synchronization is observable
* offline UI clearly communicates state
* stale data is identifiable
* offline reports are labeled
* files can be queued safely
* multi-tab behavior is controlled
* multi-device behavior is supported
* security tests exist
* offline POS is separately controlled if enabled
* normal audit rules remain intact

---

# 135. DEFINITION OF DONE

An offline-capable feature is not complete merely because its screen works without an internet connection.

It is complete only when:

### Product

* offline capability is explicitly documented
* user experience communicates offline state
* stale data is identifiable
* unsupported actions are explained

### Frontend

* local persistence exists
* local validation exists
* outbox integration exists
* synchronization state is displayed
* failures are recoverable

### Backend

* server authorization exists
* idempotency exists
* concurrency control exists
* conflict detection exists
* domain validation exists
* audit exists

### Database

* versioning exists
* change tracking exists
* synchronization metadata exists
* appropriate indexes exist
* transactional integrity exists

### Security

* tenant isolation exists
* local data is protected
* authentication expiration is handled
* permission changes are respected
* device revocation is supported where required

### Testing

* offline transition tested
* reconnect tested
* retries tested
* conflicts tested
* duplicate requests tested
* recovery tested
* multi-device tested
* security tested

---

# 136. IMPLEMENTATION LAYERS

The implementation should remain separated into:

```text
UI
 ↓
Application Services
 ↓
Offline Repository
 ↓
Sync Manager
 ↓
Local Persistence
 ↓
API Client
 ↓
Server Sync API
 ↓
Application Services
 ↓
Domain Services
 ↓
PostgreSQL
```

No UI component should implement synchronization algorithms directly.

---

# 137. RECOMMENDED CLIENT COMPONENTS

The frontend should provide reusable infrastructure such as:

```text
OfflineProvider
ConnectivityMonitor
SyncManager
SyncQueue
OutboxRepository
ConflictRepository
LocalCacheRepository
SyncStatusStore
OfflineCapabilityGuard
StaleDataIndicator
PendingChangeIndicator
ConflictResolver
SyncCenter
StorageMonitor
DeviceContext
```

These components must remain reusable across modules.

---

# 138. RECOMMENDED SERVER SERVICES

The backend should provide dedicated services such as:

```text
SyncService
ChangeFeedService
OutboxProcessor
ConflictService
IdempotencyService
DeviceService
SyncPolicyService
CursorService
ReconciliationService
```

These services must integrate with normal application/domain services rather than creating a second business-rule system.

---

# 139. RELATIONSHIP TO OTHER ARCHITECTURE DOCUMENTS

Offline synchronization must integrate with:

```text
09-AUTH-SECURITY.md
10-MULTI-TENANCY.md
11-CUSTOMIZATION-ENGINE.md
12-WORKFLOW-APPROVAL-ENGINE.md
13-DATA-MODEL.md
14-API-SPECIFICATION.md
```

The synchronization layer must not redefine rules established by those documents.

It implements controlled transport and reconciliation around those rules.

---

# 140. FINAL ARCHITECTURAL PRINCIPLE

The platform must follow this final rule:

> **Offline capability is a controlled extension of the platform's normal application architecture, not a separate application with weaker rules.**

The platform must remain:

```text
Secure
Tenant-Isolated
Permission-Aware
Auditable
Idempotent
Recoverable
Conflict-Aware
Business-Rule Compliant
Financially Safe
Inventory-Safe
Scalable
Observable
```

Whether the user is online or offline, the same fundamental platform principles remain valid.

Offline mode may temporarily defer server authority, but it must never eliminate server authority where authoritative validation is required.

The final synchronization model is therefore:

```text
                SERVER
                  │
        Authoritative State
                  │
        ┌─────────┴─────────┐
        │                   │
     Change Feed         API Commands
        │                   │
        ▼                   ▼
             SYNC ENGINE
                  │
        ┌─────────┴─────────┐
        │                   │
      INBOX              OUTBOX
        │                   │
        ▼                   ▼
            LOCAL STORE
                  │
                  ▼
             APPLICATION
                  │
                  ▼
                USER
```

This architecture provides controlled offline capability while preserving the integrity, security, scalability, and enterprise-grade behavior expected from the platform.
