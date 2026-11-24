# API RULES

## Professional ERP & Business Management Platform

**Document:** `development/06-api-rules.md`
**Status:** Development Standard
**API Style:** REST
**Current Version:** `/api/v1`
**Purpose:** Define mandatory rules for API architecture, routing, controllers, application services, validation, authentication, authorization, tenant isolation, transactions, errors, pagination, concurrency, integrations, offline synchronization, testing, and long-term API compatibility.

---

# 1. Purpose

This document defines how APIs must be designed and implemented throughout the platform.

The API is the controlled boundary between:

```text
Frontend
Mobile Applications
Desktop Clients
Integrations
Automation
AI Tools
External Systems
```

and the platform's authoritative application/domain layer.

---

# 2. API Architecture Principle

The API must provide a stable contract without exposing internal implementation details.

Preferred flow:

```text id="z0k4fu"
Client
    ↓
HTTP Request
    ↓
Route
    ↓
Middleware
    ↓
Controller
    ↓
Application Service
    ↓
Domain Logic
    ↓
Repository
    ↓
PostgreSQL
```

The reverse path returns a controlled response.

---

# 3. API Technology

The backend API uses:

* JavaScript
* Node.js
* REST
* versioned endpoints
* PostgreSQL
* JSON request/response bodies where appropriate

The API architecture must remain compatible with:

* web frontend
* future mobile applications
* desktop clients
* third-party integrations
* offline synchronization
* AI tool execution

---

# 4. API Versioning

The current API version is:

```text id="dqup2v"
/api/v1
```

Example:

```text id="pxv1hz"
/api/v1/products
/api/v1/customers
/api/v1/sales/orders
```

---

# 5. Versioning Principle

API versions represent public contract boundaries.

Breaking changes must not silently alter the meaning of existing endpoints.

When a breaking change is required, introduce a new version or a formally managed compatibility strategy.

---

# 6. Resource-Oriented Design

Endpoints should represent business resources.

Preferred:

```text id="l1f6rj"
/api/v1/products
/api/v1/customers
/api/v1/sales-orders
/api/v1/purchase-orders
```

Avoid RPC-like endpoints unless the operation genuinely represents a command.

---

# 7. Commands vs CRUD

Not every business action is ordinary CRUD.

Examples of command-style operations:

```text id="xv76w4"
POST /invoices/{id}/post
POST /invoices/{id}/reverse
POST /sales/{id}/refund
POST /inventory/transfers/{id}/complete
POST /approvals/{id}/approve
POST /payroll/runs/{id}/finalize
```

These operations must invoke domain/application services rather than simply updating a status field.

---

# 8. HTTP Methods

Use methods according to semantic meaning.

### GET

Read data.

### POST

Create or execute a command where appropriate.

### PUT

Replace a resource when full replacement semantics are intended.

### PATCH

Partially update a resource.

### DELETE

Delete only where deletion is genuinely supported.

For financial or historical records, deletion may be prohibited.

---

# 9. HTTP Safety

GET requests must not perform destructive or transactional mutations.

A GET request must not:

* post accounting entries
* modify inventory
* approve transactions
* send payments
* delete records

---

# 10. HTTP Idempotency

Where HTTP semantics require idempotency, implementation must honor them.

Business operations that may be retried should use explicit idempotency mechanisms even when the HTTP verb itself is not naturally idempotent.

---

# 11. Route Naming

Use consistent plural resource names.

Examples:

```text id="s5v8r4"
/api/v1/users
/api/v1/roles
/api/v1/products
/api/v1/warehouses
/api/v1/invoices
```

---

# 12. Route Naming Conventions

Use predictable lowercase path segments.

Prefer:

```text id="q2pkn0"
/sales-orders
```

over:

```text id="0fspr6"
/SalesOrders
/salesOrders
/sales_orders
```

---

# 13. Nested Resources

Nested resources may be used when the relationship is meaningful and bounded.

Example:

```text id="qf5mli"
/api/v1/customers/{customerId}/contacts
```

Avoid deeply nested paths.

---

# 14. Excessive Nesting

Avoid routes such as:

```text id="x7h3zw"
/organizations/{id}/companies/{id}/branches/{id}/departments/{id}/employees/{id}
```

Use contextual query parameters or direct resource endpoints when appropriate.

---

# 15. Resource Identifiers

Use stable IDs.

Do not expose database implementation assumptions unnecessarily.

Example:

```text id="ov4kyr"
/api/v1/products/{productId}
```

---

# 16. Query Parameters

Query parameters should be used for:

* filtering
* sorting
* searching
* pagination
* field selection
* includes/expansion where supported

---

# 17. Filtering

Filtering must use predictable syntax.

Example:

```text id="x4qg7h"
?status=active
?warehouse_id=...
?created_from=...
?created_to=...
```

Complex filtering should use a documented query format.

---

# 18. Sorting

Sorting must use an allowlist of supported fields.

Never directly insert an arbitrary user-supplied column name into SQL.

Example:

```text id="j2w9j1"
?sort=created_at
?sort=-created_at
```

where `-` means descending if that convention is adopted.

---

# 19. Search

Search endpoints must define:

* searchable fields
* matching behavior
* pagination
* minimum search length where required
* authorization filtering

---

# 20. Pagination

Collection endpoints must be paginated when datasets can become large.

Example:

```text id="r9p5ob"
?page=1
&page_size=50
```

or cursor-based pagination.

---

# 21. Page Size Limits

The API must enforce maximum page sizes.

Do not allow:

```text id="cwhz5f"
?page_size=10000000
```

to trigger an uncontrolled query.

---

# 22. Cursor Pagination

Cursor pagination should be considered for:

* activity streams
* audit logs
* notifications
* large transaction tables
* high-volume feeds

---

# 23. Pagination Response

A paginated response should provide enough metadata for the client.

Example conceptual structure:

```json id="fyfbd5"
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 1000,
    "hasNext": true
  }
}
```

The exact response envelope must remain standardized across the platform.

---

# 24. Response Standard

API responses should follow a consistent structure.

Example:

```json id="i9j27j"
{
  "success": true,
  "data": {}
}
```

Errors should use a standardized error structure.

---

# 25. Error Response

Example conceptual structure:

```json id="f6w1t9"
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": []
  },
  "requestId": "..."
}
```

Do not expose internal stack traces.

---

# 26. Error Codes

Use stable machine-readable error codes.

Examples:

```text id="s4cz8g"
VALIDATION_ERROR
AUTHENTICATION_REQUIRED
FORBIDDEN
NOT_FOUND
CONFLICT
DUPLICATE_RESOURCE
BUSINESS_RULE_VIOLATION
WORKFLOW_REQUIRED
OFFLINE_NOT_SUPPORTED
SYNC_CONFLICT
RATE_LIMITED
INTERNAL_ERROR
```

---

# 27. HTTP Status Codes

Use HTTP status codes meaningfully.

Typical examples:

```text id="9v4m44"
200 OK
201 Created
202 Accepted
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

The exact mapping should remain standardized.

---

# 28. Authentication

Protected APIs must authenticate the caller.

Authentication may use:

* secure session mechanisms
* access tokens
* refresh tokens
* MFA-backed sessions
* integration credentials

according to the security architecture.

---

# 29. Authentication vs Authorization

Authentication answers:

> Who is this caller?

Authorization answers:

> What is this caller allowed to do?

Both are mandatory for protected operations.

---

# 30. Authorization

Every protected endpoint must enforce authorization.

Authorization must consider where applicable:

* user
* role
* permission
* organization
* company
* branch
* department
* warehouse
* ownership
* record scope
* workflow authority

---

# 31. Server-Side Authorization

Frontend permission checks are not security controls.

The backend must independently enforce permissions.

---

# 32. Default Deny

Protected operations must follow a default-deny security model.

If authorization is unclear, access must be denied.

---

# 33. Tenant Context

The API must establish tenant/organization context before accessing tenant-owned data.

The client must not be able to arbitrarily select another organization.

---

# 34. Tenant Membership

The authenticated user must have valid membership/authorization for the requested organization context.

---

# 35. Tenant-Aware Repository Queries

Repositories should enforce tenant scope rather than relying entirely on controllers.

Example conceptual requirement:

```text id="5e0e3w"
findProduct(productId, organizationContext)
```

rather than:

```text id="zgl8dz"
findProduct(productId)
```

for tenant-owned resources.

---

# 36. Cross-Tenant Administration

Platform-level administrative APIs that intentionally operate across tenants must:

* require special privileges
* use explicit administrative context
* be audited
* minimize accessible data

---

# 37. Request Validation

Every external API request must be validated.

Validate:

* path parameters
* query parameters
* headers where relevant
* body
* file metadata
* pagination
* filters
* identifiers

---

# 38. Validation Before Business Logic

Invalid requests should be rejected before entering expensive domain operations.

---

# 39. Validation vs Business Rules

Validation checks structural correctness.

Business rules determine whether an otherwise valid operation is allowed.

Example:

```text id="9m31x0"
quantity = -5
```

is a validation failure.

```text id="2a1w7c"
quantity = 5
but warehouse has insufficient available stock
```

is a business rule failure.

---

# 40. Schema Validation

API request schemas should be explicit and reusable.

The project may use an established JavaScript validation library if selected by the implementation team.

---

# 41. Sanitization

Input must be safely handled according to its context.

Do not assume validation automatically makes arbitrary input safe for:

* SQL
* HTML
* shell commands
* URLs
* filesystem paths

---

# 42. Output Security

Responses must include only information the caller is authorized to receive.

Do not return full database objects by default.

---

# 43. Response DTOs

Application services/controllers should return controlled response structures.

Do not automatically serialize internal ORM/database models as public API responses.

---

# 44. Sensitive Fields

Never return sensitive fields unless explicitly required and authorized.

Examples:

```text id="7w5kkt"
password hashes
tokens
private keys
internal secrets
```

---

# 45. Mass Assignment

Do not allow clients to submit arbitrary fields and have them automatically written to database models.

Explicitly define writable fields.

---

# 46. Protected Fields

Fields such as:

```text id="9ljj2v"
organization_id
created_by
posted_at
approved_by
balance
stock_quantity
```

must not be freely client-controlled when they are authoritative system values.

---

# 47. Controller Responsibility

Controllers should handle:

* request extraction
* validation integration
* authentication context
* application service invocation
* response formatting
* HTTP-specific behavior

Controllers should remain thin.

---

# 48. Controllers Must Not Contain Domain Logic

Avoid implementing:

* accounting calculations
* inventory rules
* approval decisions
* complex pricing logic

inside controllers.

---

# 49. Application Services

Application services orchestrate business use cases.

Examples:

```text id="kq7s6d"
CreateInvoice
PostInvoice
ReceivePurchase
TransferStock
ApproveExpense
CreateEmployee
RunPayroll
```

---

# 50. Domain Services

Domain services should contain business rules that are not naturally owned by one entity.

---

# 51. Repository Responsibility

Repositories handle persistence concerns.

They should not decide:

* whether a user may approve
* whether a transaction is financially valid
* whether a workflow should advance

Those decisions belong to application/domain layers.

---

# 52. No Direct Database in Controllers

Controllers must not contain raw SQL or direct database manipulation.

---

# 53. No Direct Database in AI

AI tools must never directly execute database queries.

They must use approved application services/tools.

---

# 54. API Transaction Boundaries

Application services should define transaction boundaries for operations requiring atomicity.

---

# 55. Financial API Operations

Financial operations must use transaction-safe application services.

Examples:

```text id="u6c9pk"
POST /invoices/{id}/post
POST /payments/{id}/post
POST /journal-entries/{id}/post
POST /invoices/{id}/reverse
```

The API must not implement these as ordinary field updates.

---

# 56. Inventory API Operations

Inventory operations should use controlled commands.

Examples:

```text id="2r5oqn"
POST /receipts/{id}/post
POST /stock-transfers/{id}/complete
POST /stock-adjustments/{id}/post
```

---

# 57. POS API Operations

POS transaction APIs must protect:

* cashier authorization
* price rules
* discount rules
* tax
* payment validation
* inventory effect
* transaction identity
* receipt generation
* audit

---

# 58. Workflow APIs

Workflow endpoints should represent controlled transitions.

Example:

```text id="b85k8n"
POST /workflow-instances/{id}/approve
POST /workflow-instances/{id}/reject
POST /workflow-instances/{id}/return
POST /workflow-instances/{id}/cancel
```

---

# 59. Workflow Authorization

An endpoint must verify that the caller is the correct authorized approver/actor.

Never accept:

```json id="e8o8t3"
{
  "approvedBy": "some-user-id"
}
```

as proof of authority.

The authenticated identity is authoritative.

---

# 60. Maker-Checker

Where required, APIs must prevent a user from approving their own prohibited transaction.

---

# 61. Approval Thresholds

Approval authority must be evaluated server-side.

Example:

```text id="l7f3mg"
expense > threshold
→ additional approval required
```

The client cannot override this by submitting an alternative status.

---

# 62. State Transitions

State-changing endpoints should validate that the current state permits the requested transition.

Example:

```text id="4r5hqs"
Draft → Submitted
Submitted → Approved
Approved → Posted
```

An invalid transition must return a controlled error.

---

# 63. State Transition Race Conditions

State transitions must be concurrency-safe.

Two users must not both successfully perform mutually exclusive transitions.

---

# 64. Idempotency for Commands

High-impact POST operations should support idempotency.

Example:

```text id="r7xg4m"
Idempotency-Key: <unique-operation-id>
```

The server must define the scope and retention of idempotency keys.

---

# 65. Idempotency Result Reuse

When a duplicate request arrives with the same valid idempotency key, the API should return the original operation result rather than executing the transaction twice.

---

# 66. Idempotency Conflict

If the same idempotency key is reused with a materially different request, the API must reject the request.

---

# 67. Optimistic Concurrency

Important updates may require a version value.

Example:

```text id="d7j0we"
If-Match
```

or:

```text id="l72r6j"
version
```

The exact mechanism should be standardized.

---

# 68. Concurrency Errors

When a record changed before an update, return a conflict response rather than silently overwriting the newer data.

---

# 69. Bulk APIs

Bulk APIs may be used for:

* imports
* batch updates
* bulk archival
* bulk assignment
* bulk tagging

They must still respect:

* permissions
* validation
* audit
* tenant isolation
* transaction rules

---

# 70. Bulk Failure Handling

Bulk operations must define whether they are:

```text id="c7e1xk"
all-or-nothing
```

or:

```text id="w5w5gd"
partial-success
```

The API response must communicate failures clearly.

---

# 71. Large Bulk Operations

Very large operations should be asynchronous.

Example:

```text id="t4i4v5"
POST /imports
→ 202 Accepted
→ job created
```

---

# 72. Async Jobs

Long-running operations should return a job/reference identifier.

Example:

```json id="7fbw7c"
{
  "success": true,
  "data": {
    "jobId": "..."
  }
}
```

---

# 73. Job Status

Provide controlled status endpoints where appropriate.

Example:

```text id="cl0e5h"
/api/v1/jobs/{jobId}
```

---

# 74. Job Authorization

A user must only be able to inspect jobs they are authorized to access.

---

# 75. File Upload APIs

File upload endpoints must validate:

* authentication
* authorization
* file size
* file type
* file content where required
* entity relationship
* storage permissions

---

# 76. File Upload Processing

Large or complex file processing should be asynchronous where appropriate.

---

# 77. File Download APIs

Downloads must verify access at request time.

Do not assume possession of a file URL grants permission.

---

# 78. Signed URLs

Signed/temporary URLs may be used for controlled file access.

They must:

* expire
* be scoped
* not expose permanent credentials

---

# 79. Import APIs

Import APIs should support:

```text id="q5y2k7"
Upload
→ Validate
→ Preview
→ Confirm
→ Process
→ Report
```

where appropriate.

---

# 80. Export APIs

Exports must respect:

* filters
* permissions
* tenant scope
* field visibility
* file size
* rate limits

Large exports should be asynchronous.

---

# 81. Report APIs

Report endpoints should distinguish:

```text id="kdbq9j"
data retrieval
```

from:

```text id="p48k4v"
report generation
```

Large report generation may use background jobs.

---

# 82. Cached Reports

Cached reports must expose freshness information where stale data could affect decisions.

---

# 83. Offline Synchronization API

The API must provide explicit synchronization capabilities where offline functionality is supported.

Conceptual endpoints:

```text id="wfr6d1"
GET  /api/v1/sync/bootstrap
GET  /api/v1/sync/changes
POST /api/v1/sync/push
POST /api/v1/sync/acknowledge
GET  /api/v1/sync/status
POST /api/v1/sync/rebuild
```

---

# 84. Sync Bootstrap

Bootstrap should provide the minimum authorized dataset/configuration required for an offline client.

---

# 85. Sync Changes

Change feeds should provide changes after a known cursor/version.

Example:

```text id="s6h5ax"
GET /api/v1/sync/changes?cursor=...
```

---

# 86. Sync Push

Offline clients may submit queued operations.

The server must:

* authenticate the device/session
* validate tenant context
* validate permissions
* validate operation identity
* enforce business rules
* detect duplicates
* detect conflicts
* return authoritative results

---

# 87. Sync Conflict

A sync conflict must not silently overwrite authoritative server data.

---

# 88. Sync Idempotency

Offline operations must use stable operation IDs so retries do not create duplicate transactions.

---

# 89. Device Identity

Offline-capable clients may require registered device/install identities.

The API must be able to revoke compromised or lost devices where supported.

---

# 90. Sync Authorization

Permissions must be revalidated during synchronization.

A client must not retain permanent authority after server-side permissions change.

---

# 91. API Events

Important domain events may be published after successful transactions.

Examples:

```text id="0uvnny"
invoice.posted
sale.completed
inventory.received
purchase.approved
employee.created
```

---

# 92. Event Timing

Events representing committed business facts must not be published as successful before the authoritative transaction commits.

---

# 93. Transactional Outbox

Use an outbox mechanism where reliable event publication is required.

---

# 94. Webhooks

Outbound webhooks must support:

* event type
* event ID
* signature
* timestamp
* retry
* delivery status

---

# 95. Webhook Security

Webhook signatures must be verified.

Replay protection should be used where appropriate.

---

# 96. Incoming Webhooks

Incoming webhook endpoints must:

* authenticate/verify the sender
* validate payloads
* enforce idempotency
* prevent replay
* process safely
* record delivery state

---

# 97. Webhook Retries

Retries must use controlled backoff.

Repeated failures should eventually enter a dead-letter/review state.

---

# 98. API Rate Limiting

Rate limits should protect:

* authentication endpoints
* search endpoints
* expensive reports
* imports
* AI endpoints
* public integration endpoints

Limits may differ by endpoint and caller type.

---

# 99. Rate Limit Responses

Rate-limited responses should communicate that the caller must retry later without exposing unnecessary infrastructure details.

---

# 100. Abuse Prevention

High-risk endpoints should include protections against:

* brute force
* enumeration
* scraping
* excessive search
* large payload abuse
* repeated failed operations

---

# 101. Request Size Limits

APIs must define maximum request sizes.

Do not accept unlimited JSON/file payloads.

---

# 102. File Size Limits

File APIs must enforce configured maximum file sizes.

---

# 103. Header Validation

Security-sensitive headers must be validated where necessary.

---

# 104. CORS

CORS must use an explicit allowlist.

Do not use unrestricted origins for production APIs unless there is a documented reason and appropriate security controls.

---

# 105. CSRF

Browser-authenticated APIs must use appropriate CSRF protection where the authentication mechanism is vulnerable to CSRF.

---

# 106. Security Headers

The API gateway/server should provide appropriate security headers.

---

# 107. HTTPS

Production API communication must use HTTPS.

Sensitive authentication and business data must not be transmitted over insecure HTTP.

---

# 108. Request IDs

Every API request should have a correlation/request ID.

If supplied by the client, it must be validated and safely propagated.

---

# 109. Logging

API logs should include useful operational context such as:

```text id="c1f7ce"
request_id
route
method
status
duration
actor
organization
```

where appropriate and safe.

---

# 110. Sensitive Logging

Never log:

* passwords
* tokens
* secrets
* full payment credentials
* unnecessary sensitive personal information

---

# 111. Error Logging

Internal errors should be logged with enough context to investigate them.

The user-facing response must remain safe.

---

# 112. Exception Handling

Unhandled exceptions must be caught by centralized API error handling.

Do not implement inconsistent error formatting in every controller.

---

# 113. Error Classification

Errors should be classified into categories such as:

```text id="9t2nkl"
Validation
Authentication
Authorization
Not Found
Conflict
Business Rule
Infrastructure
Integration
Timeout
Rate Limit
```

---

# 114. Not Found vs Forbidden

The API may intentionally avoid revealing the existence of unauthorized resources.

Security policy should determine whether to return:

```text id="5r2a0f"
404
```

or:

```text id="c4fbr3"
403
```

in sensitive cases.

---

# 115. API Timeouts

External dependencies must have controlled timeouts.

The API should not hang indefinitely waiting for:

* payment provider
* bank API
* AI service
* email provider
* shipping provider

---

# 116. Circuit Breakers

Integration-heavy APIs may use circuit-breaker behavior to prevent cascading failures.

---

# 117. Retry Policy

Retry only operations known to be safe.

Retries should use:

```text id="1i1ihk"
bounded attempts
exponential backoff
jitter
```

---

# 118. Integration API Boundaries

Third-party APIs must not be allowed to bypass:

* authorization
* tenant isolation
* business rules
* accounting
* inventory
* workflows
* audit

---

# 119. External API Credentials

Credentials must be stored securely.

Never expose provider secrets to frontend clients unless the provider's protocol explicitly requires a safe client-side mechanism.

---

# 120. OAuth

OAuth credentials/tokens must be protected and scoped to the required permissions.

---

# 121. API Keys

API keys must:

* be scoped
* be revocable
* have appropriate expiration where possible
* be stored securely
* be audited

---

# 122. Service Accounts

Machine-to-machine API access should use dedicated service identities rather than human credentials where appropriate.

---

# 123. Service Account Permissions

Service accounts must follow least privilege.

Do not grant administrator access simply because an integration is easier to implement that way.

---

# 124. API Deprecation

Deprecated endpoints must have:

* documented replacement
* deprecation date
* migration guidance
* monitoring of remaining usage

---

# 125. Backward Compatibility

Non-breaking API changes may include:

* adding optional response fields
* adding optional request fields
* adding new endpoints

Breaking changes require versioning or explicit compatibility management.

---

# 126. Field Removal

Do not remove response/request fields abruptly from a supported API version.

---

# 127. OpenAPI

The API should maintain an OpenAPI specification.

It should document:

* endpoints
* parameters
* request bodies
* responses
* authentication
* errors
* examples

---

# 128. API Documentation

Documentation must remain synchronized with implementation.

An undocumented endpoint is not considered production-ready.

---

# 129. API Examples

Important endpoints should include example:

* request
* successful response
* validation failure
* authorization failure
* conflict
* relevant edge cases

---

# 130. API Testing

Every important endpoint should have tests for:

```text id="gnhu2d"
Success
Validation failure
Authentication failure
Authorization failure
Not found
Conflict
Tenant isolation
Business rule failure
Concurrency
Idempotency
```

where applicable.

---

# 131. Tenant Isolation Tests

Tests must explicitly verify that one organization's authenticated user cannot access another organization's records.

This is a mandatory security test category.

---

# 132. Permission Tests

Every protected operation should test:

```text id="84yp1u"
allowed
denied
scope restricted
```

where applicable.

---

# 133. Workflow Tests

Workflow endpoints should test:

* valid transition
* invalid transition
* unauthorized approver
* self-approval
* rejected state
* concurrent approval
* delegation
* expired approval

where applicable.

---

# 134. Financial API Tests

Financial operations should test:

* balanced entries
* invalid amounts
* posting
* reversal
* closed period
* duplicate submission
* concurrency
* rollback

---

# 135. Inventory API Tests

Inventory operations should test:

* insufficient stock
* concurrent deductions
* transfer
* reservation
* serial/batch rules
* rollback
* duplicate operation

---

# 136. POS API Tests

POS APIs should test:

* product lookup
* pricing
* discounts
* taxes
* payment
* inventory deduction
* receipt
* return/refund
* offline operation
* synchronization

---

# 137. API Performance Testing

Performance testing should cover:

* normal load
* peak load
* large datasets
* concurrent requests
* expensive reports
* bulk operations
* synchronization
* integrations

---

# 138. API Contract Testing

Frontend/client integrations should be protected against accidental contract changes.

Contract tests should verify important request/response structures.

---

# 139. API Security Testing

Security testing should cover:

* injection
* authorization bypass
* tenant escape
* rate-limit bypass
* malformed requests
* file upload attacks
* SSRF where applicable
* authentication attacks
* privilege escalation

---

# 140. API Load Safety

Endpoints must not allow a single request to consume unreasonable:

* CPU
* memory
* database connections
* disk
* network
* background job capacity

---

# 141. Database Query Limits

API endpoints must avoid unbounded database queries.

---

# 142. Large Responses

Large responses should use:

* pagination
* field selection
* async jobs
* streaming where appropriate

rather than returning enormous JSON payloads.

---

# 143. API Caching

Caching may be used for appropriate read-only data.

Do not cache sensitive or rapidly changing transactional data without carefully defined invalidation.

---

# 144. Cache Scope

Cached data must include the correct:

* organization
* user/permission context where necessary
* resource identity
* version/freshness information

---

# 145. Cache Invalidation

Important mutable data must have an explicit cache invalidation strategy.

---

# 146. Reference Data

Frequently used stable reference data may be cached.

Examples:

```text id="g7z8nz"
countries
currencies
units of measure
system permissions
```

---

# 147. API and Offline Cache

Offline clients may cache API responses.

The API must still assume the client cache is:

```text id="i7h4x5"
stale
modifiable
untrusted
```

---

# 148. Client-Provided Calculations

The API must not trust client-provided:

* totals
* tax amounts
* stock balances
* account balances
* approval authority
* final financial values

when the server can calculate/verify them.

---

# 149. Pricing

The client may display calculated pricing previews.

Final authoritative pricing must be validated by the server.

---

# 150. Tax

Tax calculations must be validated according to configured tax/business rules.

---

# 151. Inventory Availability

The client may display available quantity.

Final transaction validation must occur server-side.

---

# 152. Financial Balances

Client-provided balances must never be treated as authoritative accounting state.

---

# 153. API Business Rule Principle

A valid API request does not necessarily mean a valid business operation.

The API must evaluate:

```text id="g7h1yr"
Authentication
→ Authorization
→ Validation
→ Business Rules
→ Workflow
→ Transaction
→ Audit
→ Events
```

where applicable.

---

# 154. API Audit

Important API actions must create appropriate audit records.

Examples:

```text id="0xix4j"
login
create
update
delete
approve
reject
post
reverse
export
permission change
configuration change
integration change
```

The exact audit policy depends on the action.

---

# 155. Audit Actor

The audit system should identify the authenticated actor or service identity.

Do not trust an arbitrary `user_id` submitted by the client.

---

# 156. API Source

Where useful, audit records may identify:

```text id="j8wqkt"
web
mobile
desktop
integration
API
AI
offline-sync
```

---

# 157. AI API Boundary

AI-generated actions must use the same API/application security rules as ordinary actions.

AI must not receive special bypass privileges merely because the request originated from an AI feature.

---

# 158. AI Tool Invocation

Preferred flow:

```text id="s3j3p4"
AI
 ↓
Allowlisted Tool
 ↓
API/Application Service
 ↓
Authorization
 ↓
Business Rules
 ↓
Transaction
 ↓
Audit
```

---

# 159. AI Read Access

AI queries must return only information the user is authorized to access.

---

# 160. AI Write Access

Data-changing AI actions require explicit authorization and, where appropriate, user confirmation or workflow approval.

---

# 161. API and Customization

Configurable modules may generate dynamic forms and fields.

The API must still validate metadata-driven input safely.

---

# 162. Dynamic Fields

Custom field values must be validated according to their field definitions.

Examples:

```text id="u7g5st"
text
number
date
boolean
select
multi-select
reference
```

---

# 163. Dynamic API Endpoints

Customization should not result in uncontrolled arbitrary database access.

Dynamic entities must use controlled metadata/application services.

---

# 164. API Feature Flags

Feature flags may control endpoint availability.

Disabled functionality must not remain accidentally accessible through undocumented routes.

---

# 165. API Module Availability

Endpoint behavior should distinguish:

```text id="c3c1so"
module disabled
module unauthorized
feature unavailable
unsupported operation
```

---

# 166. Health Endpoints

The platform should provide appropriate health endpoints.

Examples conceptually:

```text id="80eih4"
/health
/health/live
/health/ready
```

These endpoints must not expose sensitive infrastructure details publicly.

---

# 167. Readiness

Readiness should reflect whether the service can safely handle requests.

Possible dependencies:

* database
* required configuration
* critical infrastructure

---

# 168. Liveness

Liveness should determine whether the application process is functioning, not whether every dependency is perfect.

---

# 169. Metrics

API monitoring should capture:

* request count
* latency
* error rate
* status codes
* route performance
* dependency failures
* queue/job behavior

---

# 170. Tracing

Important API operations should support distributed/request tracing where the infrastructure provides it.

---

# 171. Correlation

Requests across:

```text id="j7i2m6"
API
→ application service
→ database
→ background job
→ integration
```

should remain traceable where practical.

---

# 172. API Documentation as Contract

The API specification is a development contract.

Frontend, mobile, integrations, and backend implementations must align with it.

---

# 173. API Change Process

Before changing an API:

1. identify consumers
2. determine whether change is breaking
3. update documentation
4. update tests
5. update clients
6. define migration path
7. deploy safely
8. monitor usage

---

# 174. API Review Checklist

Every significant endpoint should be reviewed for:

```text id="1qk0j4"
[ ] Authentication
[ ] Authorization
[ ] Tenant context
[ ] Input validation
[ ] Output filtering
[ ] Business rules
[ ] Transaction boundaries
[ ] Concurrency
[ ] Idempotency
[ ] Error handling
[ ] Audit
[ ] Rate limits
[ ] Performance
[ ] Logging
[ ] Documentation
[ ] Tests
```

---

# 175. API Definition of Done

An API feature is complete only when:

```text id="f3a0ut"
[ ] Route defined
[ ] Version defined
[ ] Request schema defined
[ ] Response schema defined
[ ] Validation implemented
[ ] Authentication handled
[ ] Authorization enforced
[ ] Tenant isolation enforced
[ ] Application service implemented
[ ] Business rules enforced
[ ] Transaction behavior defined
[ ] Error handling implemented
[ ] Audit requirements implemented
[ ] Idempotency implemented where required
[ ] Concurrency handled where required
[ ] Documentation updated
[ ] Tests implemented
[ ] Security reviewed
[ ] Performance reviewed
```

---

# 176. Final API Architecture

The standard API architecture is:

```text id="jv8x1d"
Client
    ↓
API Gateway / HTTP Server
    ↓
Middleware
    ├── Authentication
    ├── Request ID
    ├── Rate Limiting
    ├── Security
    └── Tenant Context
    ↓
Route
    ↓
Controller
    ↓
Validation
    ↓
Application Service
    ↓
Authorization / Business Rules
    ↓
Domain Services
    ↓
Repository
    ↓
PostgreSQL
    ↓
Audit / Outbox / Events
    ↓
Response
```

---

# 177. Final API Principle

The API must not become a thin CRUD tunnel directly into the database.

It is the controlled execution boundary for the platform's business operations.

Therefore:

> **Every meaningful API operation must preserve security, tenant isolation, business integrity, authorization, auditability, and transactional correctness.**

---

# END OF API RULES
