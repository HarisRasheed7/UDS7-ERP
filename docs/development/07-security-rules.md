# DEVELOPMENT SECURITY RULES

## Enterprise ERP & Business Management Platform

**Document:** `development/07-security-rules.md`
**Status:** Mandatory Development Standard
**Applies To:** Frontend, Backend, API, Database, Integrations, Offline Systems, AI, Background Jobs, Files, Infrastructure
**Technology:** JavaScript, React/Next.js, Custom CSS, PostgreSQL
**Security Model:** Defense in Depth, Least Privilege, Zero Trust, Fail Closed

---

# 1. PURPOSE

This document defines the mandatory security implementation rules for the platform.

Security is not treated as a separate feature. Security must be built into:

* authentication
* authorization
* tenant isolation
* API design
* database access
* frontend behavior
* business services
* workflows
* financial operations
* inventory operations
* POS operations
* file handling
* integrations
* background jobs
* offline storage
* synchronization
* AI functionality
* logging
* auditing
* deployment
* backups
* recovery

No feature is considered complete if its security behavior is incomplete.

---

# 2. SECURITY OBJECTIVES

The platform must protect:

1. Confidentiality
2. Integrity
3. Availability
4. Tenant isolation
5. User identity
6. Business data
7. Financial data
8. Inventory data
9. Personal information
10. Authentication credentials
11. API credentials
12. Integration credentials
13. Uploaded files
14. Audit records
15. Offline data
16. Synchronization operations
17. AI context and business information

---

# 3. CORE SECURITY PRINCIPLES

Every implementation must follow these principles:

* Never trust the client.
* Never trust user-supplied authorization claims.
* Never trust tenant identifiers supplied by the client.
* Never trust hidden UI controls as security.
* Never expose sensitive information unnecessarily.
* Default to deny.
* Grant only required permissions.
* Validate on the server.
* Enforce authorization on the server.
* Enforce tenant isolation on the server.
* Protect business integrity on the server.
* Fail closed.
* Prefer secure failure over convenient failure.
* Log security-relevant events.
* Do not silently ignore security failures.
* Do not bypass security for internal convenience.
* Do not create undocumented security exceptions.

---

# 4. SECURITY IS CROSS-CUTTING

Security must not exist only in:

```text
auth/
security/
middleware/
```

Security must also exist at:

```text
API
Application Services
Domain Services
Repositories
Database
Background Jobs
Workflow Engine
Integrations
Offline Engine
AI Tool Layer
File Services
Reporting
Exports
Administration
```

A secure route with an insecure service is still insecure.

---

# 5. NEVER TRUST THE FRONTEND

Frontend controls are usability controls, not security controls.

The frontend may:

* hide unauthorized buttons
* disable unauthorized actions
* hide restricted navigation
* display permission messages

However, the backend must independently enforce the same restrictions.

Never assume:

```text
Button hidden = action protected
```

The real rule is:

```text
Frontend permission check
        ↓
Backend authentication
        ↓
Backend authorization
        ↓
Scope validation
        ↓
Business-rule validation
        ↓
Transaction
```

---

# 6. AUTHENTICATION REQUIREMENT

Every protected resource must require authentication.

Authentication must establish:

* user identity
* session identity
* organization context
* membership context
* device/session context where applicable
* authentication strength where applicable

Authentication must occur before authorization.

---

# 7. AUTHENTICATION FAILURE

Authentication failures must not reveal unnecessary information.

Avoid responses such as:

```text
User does not exist
```

when that would allow account enumeration.

Prefer generic authentication failure messages where appropriate.

---

# 8. SESSION SECURITY

Sessions must have:

* secure identifiers
* expiration
* inactivity controls where required
* revocation support
* logout support
* device/session tracking where required
* rotation after sensitive authentication events
* secure storage

Sessions must be invalidated when required after:

* password reset
* account disablement
* security incident
* administrative revocation
* suspicious activity
* organization access removal

---

# 9. TOKEN SECURITY

Tokens must:

* have appropriate expiration
* be securely generated
* avoid predictable values
* avoid unnecessary payload information
* be revocable where required
* never contain secrets
* never contain passwords
* never contain unnecessary sensitive information

Do not place sensitive tokens in URLs.

---

# 10. COOKIE SECURITY

If cookies are used for authentication, apply appropriate:

* `HttpOnly`
* `Secure`
* `SameSite`
* expiration
* path/domain restrictions

Cookies must not be accessible to client-side JavaScript when they contain sensitive authentication material unless there is a documented reason.

---

# 11. PASSWORD STORAGE

Passwords must never be stored in plaintext.

Passwords must use a modern adaptive password hashing algorithm.

The implementation must include:

* unique salts
* appropriate work factor
* secure password verification
* password reset controls
* brute-force protection

Passwords must never appear in:

* logs
* API responses
* audit records
* analytics
* error messages
* backups in plaintext

---

# 12. PASSWORD POLICY

Password policy must support configurable organizational requirements where appropriate.

Potential controls include:

* minimum length
* complexity
* breached-password protection
* password history where required
* reset requirements
* expiration only where justified
* account lockout or throttling

Security policy must avoid unnecessarily harmful usability requirements.

---

# 13. MULTI-FACTOR AUTHENTICATION

MFA must be supported by the security architecture.

Possible mechanisms include:

* authenticator applications
* email verification where appropriate
* hardware/security keys where supported
* recovery codes

MFA enforcement may be:

* optional
* organization-required
* role-required
* administrator-required
* risk-triggered

MFA must never be bypassed through ordinary API calls.

---

# 14. MFA RECOVERY

MFA recovery must be treated as a security-sensitive process.

Recovery must require appropriate identity verification.

Recovery actions must be audited.

---

# 15. AUTHORIZATION

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Every protected operation must perform authorization.

---

# 16. DEFAULT DENY

Authorization must follow:

```text
No explicit permission
        ↓
DENY
```

Do not implement:

```text
Allow by default
```

---

# 17. PERMISSION GRANULARITY

Permissions may include:

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

Permissions must be checked against the actual requested operation.

---

# 18. DATA SCOPE SECURITY

Authorization must also consider scope.

Examples:

```text
Organization
Company
Branch
Department
Warehouse
Location
Record
Ownership
Role
```

A user may have:

```text
edit.sales
```

but not necessarily:

```text
edit.all-sales
```

---

# 19. TENANT ISOLATION

Tenant isolation is mandatory.

A request belonging to Organization A must never access Organization B's data.

Tenant isolation must be enforced in:

* application services
* repositories
* database queries
* background jobs
* reports
* exports
* search
* notifications
* files
* integrations
* AI
* offline synchronization

---

# 20. NEVER TRUST TENANT IDS

A client-provided organization or tenant ID must never automatically determine authorization.

For example:

```text
GET /organizations/B/data
```

must not allow a user from Organization A to access B simply because the request contains B.

The server must derive or verify tenant context from authenticated membership and authorized context.

---

# 21. TENANT-AWARE REPOSITORIES

Repositories must require appropriate organizational context.

Unsafe:

```text
repository.findById(id)
```

when tenant context is required.

Preferred conceptual pattern:

```text
repository.findById({
    id,
    organizationId
})
```

The exact implementation may differ, but tenant scope must not be accidentally omitted.

---

# 22. CROSS-TENANT OPERATIONS

Cross-tenant operations must be extremely restricted.

They should normally be limited to:

* platform administrators
* explicitly authorized support mechanisms
* controlled maintenance jobs

All such operations must be:

* strongly authorized
* audited
* traceable
* minimized

---

# 23. ORGANIZATION MEMBERSHIP

A user must only access organization resources when the user has valid membership or another explicitly authorized relationship.

Removing membership must immediately affect authorization.

---

# 24. ROLE SECURITY

Roles must follow least privilege.

Avoid creating one universal:

```text
SuperAdmin
```

for ordinary business operations.

Highly privileged roles must be restricted.

---

# 25. PRIVILEGED ACCESS

Privileged actions must receive stronger scrutiny.

Examples:

* changing permissions
* disabling security controls
* deleting organization data
* changing financial configuration
* changing tax configuration
* modifying workflow authority
* accessing security logs
* managing integrations
* changing authentication policy
* exporting sensitive datasets

---

# 26. SEPARATION OF DUTIES

Where required, the system must prevent incompatible responsibilities from being combined.

Examples:

```text
Create payment
+
Approve same payment
```

or:

```text
Create financial journal
+
Approve/post same journal
```

where organizational policy requires maker-checker separation.

---

# 27. SELF-APPROVAL

Sensitive actions must not automatically allow the creator to approve their own action when maker-checker rules prohibit it.

---

# 28. TEMPORARY PRIVILEGES

Temporary access must:

* have an explicit start
* have an explicit end
* have a reason
* identify the grantor
* be audited
* automatically expire

---

# 29. BREAK-GLASS ACCESS

Emergency access may exist for exceptional operational circumstances.

Break-glass access must:

* require explicit authorization
* have a defined reason
* be time-limited
* be highly audited
* generate security alerts where appropriate

It must never become a normal workflow.

---

# 30. INPUT VALIDATION

Every externally supplied input must be validated.

Inputs include:

* JSON bodies
* query parameters
* route parameters
* headers
* form data
* uploaded files
* webhook payloads
* imported data
* offline operations
* integration data
* AI-generated arguments

---

# 31. VALIDATION LAYERS

Validation should exist at appropriate levels:

```text
Request Schema Validation
        ↓
Business Validation
        ↓
Authorization
        ↓
Domain Validation
        ↓
Database Constraints
```

These layers are complementary.

---

# 32. NEVER RELY ONLY ON DATABASE VALIDATION

Database constraints are essential but insufficient.

The application must still enforce:

* authorization
* workflow rules
* business rules
* state transitions
* ownership
* tenant scope

---

# 33. NEVER RELY ONLY ON FRONTEND VALIDATION

Frontend validation improves UX.

It does not replace server validation.

---

# 34. SQL INJECTION PROTECTION

Database queries must use parameterized mechanisms.

Never concatenate untrusted values into SQL.

Unsafe conceptual pattern:

```text
"SELECT * FROM users WHERE name = '" + userInput + "'"
```

Use parameterized queries or safe query builders.

---

# 35. DYNAMIC SQL

Dynamic SQL must be strictly controlled.

Dynamic identifiers such as:

* column names
* table names
* sort fields

must come from allowlists.

Never directly inject arbitrary client-provided SQL fragments.

---

# 36. ORM/QUERY BUILDER SECURITY

Using an ORM does not automatically guarantee security.

Developers must still review:

* raw SQL
* dynamic filters
* dynamic ordering
* raw query APIs
* unsafe interpolation

---

# 37. XSS PROTECTION

User-controlled content must not be rendered as executable HTML unless explicitly sanitized and required.

Avoid unsafe HTML rendering.

When HTML is required:

* sanitize
* allowlist tags
* allowlist attributes
* remove scripts
* remove dangerous URLs
* prevent event-handler injection

---

# 38. OUTPUT ENCODING

Data must be safely encoded for its output context.

Different contexts require different handling:

* HTML
* attributes
* JavaScript
* URLs
* CSS
* JSON

---

# 39. CSRF PROTECTION

State-changing browser requests must be protected against CSRF when cookie-based authentication is used.

Controls may include:

* SameSite cookies
* CSRF tokens
* origin checks
* secure request policies

---

# 40. CORS

CORS must use explicit allowed origins.

Do not use broad production configuration such as:

```text
*
```

for authenticated APIs unless there is a documented and secure reason.

---

# 41. SSRF PROTECTION

Server-side requests to user-supplied URLs must be protected against SSRF.

Controls should include:

* URL validation
* protocol allowlisting
* private IP blocking
* localhost blocking
* internal network blocking
* redirect validation
* DNS rebinding protection
* timeout limits

---

# 42. FILE UPLOAD SECURITY

File uploads must validate:

* size
* extension
* MIME type
* actual file signature where appropriate
* storage path
* filename
* permissions

Never trust the filename or MIME type supplied by the client.

---

# 43. FILE NAME SECURITY

Never directly use user-provided filenames as storage paths.

Generate safe internal names.

Prevent:

```text
../
..\ 
absolute paths
```

and equivalent traversal techniques.

---

# 44. MALICIOUS FILES

Uploaded files may contain:

* malware
* scripts
* executable content
* malicious documents
* embedded payloads

Where appropriate, use:

* antivirus scanning
* content inspection
* sandboxing
* safe conversion
* download restrictions

---

# 45. FILE ACCESS CONTROL

Files must inherit or explicitly define authorization.

A user must not access another organization's private attachment simply by guessing a file ID.

---

# 46. SIGNED DOWNLOAD URLS

Temporary signed URLs may be used for protected files.

Signed URLs must:

* expire
* be scoped
* be unguessable
* avoid unnecessary permissions

---

# 47. PATH TRAVERSAL

All filesystem paths derived from user input must be normalized and validated.

Never assume:

```text
path.join(base, userInput)
```

is sufficient without validating the resulting path.

---

# 48. COMMAND INJECTION

Never pass untrusted input directly to operating-system commands.

If system commands are unavoidable:

* use fixed commands
* use argument arrays
* validate arguments
* avoid shell interpretation
* run with minimal privileges

---

# 49. DESERIALIZATION

Do not deserialize untrusted data using unsafe mechanisms.

Imported or transmitted structured data must be:

* parsed safely
* validated
* schema-checked

---

# 50. REQUEST SIZE LIMITS

API endpoints must enforce reasonable limits for:

* request body
* query parameters
* headers
* file uploads
* batch operations

This protects against resource exhaustion.

---

# 51. RATE LIMITING

Rate limits must protect sensitive endpoints.

Especially:

* login
* password reset
* MFA verification
* token operations
* exports
* search
* expensive reports
* AI requests
* integration endpoints
* webhook endpoints
* file operations

---

# 52. BRUTE-FORCE PROTECTION

Authentication endpoints must include appropriate protection such as:

* throttling
* rate limits
* progressive delays
* temporary restrictions
* suspicious activity detection

Do not make permanent lockouts the only defense.

---

# 53. ACCOUNT ENUMERATION

Security-sensitive endpoints should avoid revealing whether:

* an account exists
* a customer exists
* a secret exists

unless disclosure is explicitly required.

---

# 54. SECRET MANAGEMENT

Secrets must never be hardcoded.

Examples:

* database passwords
* JWT secrets
* encryption keys
* API keys
* OAuth secrets
* webhook signing secrets
* cloud credentials

---

# 55. ENVIRONMENT VARIABLES

Environment variables may be used for secrets during deployment.

However:

* never commit secret values
* never print them
* never expose them to the frontend
* never include them in error responses

---

# 56. SECRET ROTATION

Sensitive credentials must support rotation.

The architecture should allow:

* key rotation
* API credential rotation
* integration credential replacement
* session invalidation
* emergency revocation

without requiring application rewrites.

---

# 57. ENCRYPTION IN TRANSIT

Production network traffic must use secure transport.

Sensitive communication must not rely on plaintext transport.

---

# 58. ENCRYPTION AT REST

Sensitive information should be encrypted at rest where appropriate.

Protection should consider:

* database
* backups
* file storage
* integration credentials
* offline data
* local caches

---

# 59. KEY MANAGEMENT

Encryption keys must be managed separately from encrypted data where practical.

Keys must not be stored directly inside application source code.

---

# 60. DATABASE SECURITY

Database access must use least privilege.

The application database account should not automatically have unrestricted administrative privileges.

---

# 61. DATABASE CREDENTIALS

Database credentials must:

* be secret
* use separate environment configuration
* be rotated
* be restricted
* not appear in source control

---

# 62. DATABASE NETWORK ACCESS

Production databases should not be unnecessarily exposed to the public internet.

Use controlled network access.

---

# 63. DATABASE CONSTRAINTS AS SECURITY SUPPORT

Database constraints should enforce integrity where possible:

* foreign keys
* unique constraints
* check constraints
* not-null constraints
* appropriate ownership relationships

---

# 64. FINANCIAL SECURITY

Financial data requires stronger integrity protection.

Financial operations must not be treated as ordinary CRUD.

Examples:

* journal posting
* payment
* receipt
* invoice posting
* bank transaction
* reconciliation
* fiscal closing

must follow controlled business services.

---

# 65. FINANCIAL IMMUTABILITY

Posted financial records must generally not be silently edited or deleted.

Corrections should use:

* reversals
* adjustments
* compensating entries
* controlled correction workflows

---

# 66. INVENTORY SECURITY

Inventory quantities must not be freely manipulated through arbitrary update requests.

Stock changes must originate from authorized inventory operations.

Examples:

* receipt
* issue
* transfer
* adjustment
* count
* reservation
* sale
* return
* production

---

# 67. POS SECURITY

POS operations must protect:

* cashier identity
* terminal identity
* session
* sale state
* payment information
* inventory impact
* refund authorization
* discount authorization
* cash drawer operations

---

# 68. REFUND SECURITY

Refunds must require appropriate authorization.

High-value refunds may require additional approval.

Refunds must be fully auditable.

---

# 69. DISCOUNT SECURITY

Discount rules must be server-enforced.

Do not trust a client-provided:

```text
discountPercent
```

without validating authorization and business limits.

---

# 70. WORKFLOW SECURITY

Workflow transitions must be authorized.

A client must not be able to change:

```text
pending → approved
```

simply by sending:

```text
status = "approved"
```

The server must verify:

* current state
* authorized transition
* actor authority
* approval requirements
* workflow version
* business conditions

---

# 71. APPROVAL SECURITY

Approvals must verify:

* approver identity
* permission
* organizational scope
* threshold authority
* maker-checker restrictions
* current record state

---

# 72. WORKFLOW BYPASS PROHIBITION

No normal API endpoint may bypass required workflow approval.

Alternative routes must not accidentally create a security bypass.

---

# 73. BACKGROUND JOB SECURITY

Background jobs must execute with appropriate permissions.

Do not run every job using unrestricted administrator privileges.

Jobs must have:

* defined identity
* required scope
* authorization assumptions
* auditability
* retry behavior

---

# 74. SERVICE ACCOUNT SECURITY

Service accounts must use:

* minimal permissions
* clear ownership
* rotation
* expiration where appropriate
* audit trails

---

# 75. WEBHOOK SECURITY

Inbound webhooks must verify authenticity.

Use appropriate:

* signatures
* shared secrets
* timestamp checks
* replay protection
* source validation where appropriate

Never trust webhook payloads solely because they arrive at the correct URL.

---

# 76. WEBHOOK REPLAY PROTECTION

Webhook requests should include mechanisms allowing the platform to reject duplicate or replayed messages.

Use:

* external event IDs
* timestamps
* idempotency keys
* processed-event tracking

---

# 77. API KEY SECURITY

API keys must:

* be hashed or securely stored where possible
* have scopes
* have expiration/rotation support
* be revocable
* be audited
* never appear in normal logs

---

# 78. OAUTH SECURITY

OAuth implementations must protect:

* client secrets
* redirect URIs
* state
* authorization codes
* access tokens
* refresh tokens

Redirect URIs must be strictly controlled.

---

# 79. INTEGRATION CREDENTIALS

Integration credentials belong to controlled credential storage.

Do not expose credentials to:

* frontend applications
* ordinary API responses
* logs
* analytics
* AI prompts

---

# 80. LOGGING SECURITY

Logs must not contain secrets or unnecessary sensitive data.

Never log:

* passwords
* authentication tokens
* session secrets
* API keys
* private encryption keys

---

# 81. SECURE ERROR LOGGING

Errors should contain enough technical information for diagnosis while avoiding sensitive disclosure.

Internal logs may contain more diagnostic information than user-facing errors.

---

# 82. ERROR RESPONSE SECURITY

Production APIs must not expose:

* stack traces
* SQL statements
* database credentials
* filesystem paths
* internal secrets
* internal network information

unless explicitly safe and required.

---

# 83. SECURITY AUDITING

Security-sensitive operations must be auditable.

Audit events should capture appropriate:

* actor
* organization
* action
* entity
* entity ID
* timestamp
* request/correlation ID
* source
* device/session information where appropriate
* result

---

# 84. AUDIT LOG INTEGRITY

Audit logs must not be casually editable by normal users.

Deletion and modification of audit records must be highly restricted.

---

# 85. SECURITY EVENTS

Security events may include:

* login success
* login failure
* logout
* MFA change
* password change
* password reset
* session revocation
* permission change
* role change
* organization membership change
* API key creation
* API key revocation
* integration credential change
* privileged action
* suspicious access
* export of sensitive data

---

# 86. SECURITY ALERTS

The system should support alerts for important events such as:

* repeated failed authentication
* unusual privileged access
* mass export
* suspicious API behavior
* repeated authorization failures
* abnormal integration activity

---

# 87. OFFLINE SECURITY

Offline capability must not weaken security.

Offline data must be treated as sensitive.

---

# 88. LOCAL STORAGE SECURITY

Sensitive offline data must not be stored casually in plaintext browser storage.

Where appropriate, use:

* encrypted storage
* protected IndexedDB strategies
* secure local application storage
* device-level protection

---

# 89. OFFLINE AUTHORIZATION

Offline authorization must not become an unrestricted permission cache.

The system must respect:

* permission expiration
* session expiration
* device authorization
* tenant context
* synchronization rules

---

# 90. OFFLINE QUEUE SECURITY

Queued operations must contain:

* operation ID
* device/install identity
* authenticated context where appropriate
* operation metadata
* integrity validation

---

# 91. OFFLINE TENANT ISOLATION

Local data must remain correctly partitioned by organization/tenant.

Switching tenants must not accidentally expose cached data from another tenant.

---

# 92. DEVICE REVOCATION

A lost or compromised device must be revocable.

Revocation must prevent future synchronization where applicable.

---

# 93. OFFLINE FINANCIAL SECURITY

Offline financial operations require strict controls.

Where server authority is required, the client must not fabricate final authoritative financial postings.

---

# 94. OFFLINE INVENTORY SECURITY

Offline inventory operations must have explicit reconciliation rules.

Conflicting stock changes must not silently overwrite authoritative stock state.

---

# 95. AI SECURITY PRINCIPLE

AI must never become a security bypass.

AI is:

```text
Assistive
```

not:

```text
Authoritative
```

---

# 96. AI DATA ACCESS

AI must never receive unrestricted database access.

The architecture must use:

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
Audit
```

---

# 97. AI PERMISSION ENFORCEMENT

AI requests must execute under the user's effective permissions and tenant context.

A user cannot ask AI:

> Show me another company's financial records.

and gain access merely because AI can query them.

---

# 98. AI PROMPT INJECTION

External documents, web pages, imported files, customer messages, and other untrusted content may contain prompt injection.

AI systems must treat such content as untrusted data.

---

# 99. AI OUTPUT VALIDATION

AI-generated:

* commands
* structured data
* classifications
* formulas
* workflow suggestions
* database filters

must be validated before use.

---

# 100. AI DATA EXFILTRATION

AI must not expose restricted data through:

* summaries
* reports
* suggestions
* generated files
* conversational answers

Permission filtering must happen before the AI receives or returns data.

---

# 101. REPORTING SECURITY

Reports must respect:

* tenant scope
* organization scope
* branch scope
* department scope
* role permissions
* field-level restrictions where applicable

---

# 102. EXPORT SECURITY

Exports can expose large amounts of data and must therefore be permission-controlled.

Export permissions must be separate from ordinary viewing where appropriate.

---

# 103. BULK EXPORT PROTECTION

Large exports should support:

* authorization
* audit logging
* rate limiting
* asynchronous processing
* expiration
* secure download

---

# 104. SEARCH SECURITY

Global search must never become a data-leak mechanism.

Search results must be filtered by effective permissions and organizational scope.

---

# 105. NOTIFICATION SECURITY

Notifications must not expose restricted information.

For example, a notification may indicate:

```text
You have a new approval request.
```

without unnecessarily exposing confidential transaction information to an unauthorized surface.

---

# 106. EMAIL SECURITY

Sensitive information should not be unnecessarily included in email notifications.

Where appropriate, email should direct the user to the authenticated platform.

---

# 107. BROWSER SECURITY

The frontend should use appropriate security controls such as:

* Content Security Policy where practical
* secure headers
* safe resource loading
* controlled third-party scripts
* secure cookie configuration

---

# 108. CONTENT SECURITY POLICY

CSP should be configured to reduce:

* XSS
* unauthorized script execution
* malicious resource loading

Avoid unnecessarily broad policies.

---

# 109. THIRD-PARTY DEPENDENCIES

Dependencies must be treated as part of the security boundary.

Use:

* trusted packages
* maintained packages
* dependency review
* vulnerability scanning
* lockfiles
* controlled updates

---

# 110. SUPPLY-CHAIN SECURITY

The project must monitor dependencies for:

* known vulnerabilities
* abandoned packages
* malicious releases
* compromised maintainers
* unexpected dependency changes

---

# 111. DEPENDENCY UPDATES

Security updates must be prioritized.

Do not blindly update every package without testing.

Use controlled upgrade procedures.

---

# 112. SOURCE CONTROL SECURITY

Never commit:

* passwords
* API keys
* private certificates
* production credentials
* database dumps containing sensitive data
* secret environment files

---

# 113. SECRET SCANNING

Development and CI should use secret scanning where practical.

A detected secret must be treated as compromised until proven otherwise.

---

# 114. ENVIRONMENT SEPARATION

Development, staging, and production must not casually share credentials.

Use separate:

```text
database
credentials
API keys
storage
integrations
secrets
```

where appropriate.

---

# 115. DEBUG MODE

Debug functionality must not expose sensitive internals in production.

Production configuration must disable unnecessary debugging.

---

# 116. DEVELOPMENT SHORTCUTS

The following are prohibited from reaching production:

```text
skipAuth()
allowAll()
isAdmin = true
temporaryPassword
testSecret
disableSecurity
```

Development bypasses must be isolated and controlled.

---

# 117. TEST ACCOUNT SECURITY

Test accounts must never contain production secrets.

Production data must not be copied into development environments without appropriate protection and authorization.

---

# 118. TEST DATA

Security-sensitive test data should be synthetic whenever possible.

---

# 119. SECURITY TESTING

Security testing must include:

* authentication tests
* authorization tests
* tenant isolation tests
* input validation tests
* injection tests
* file upload tests
* session tests
* CSRF tests
* rate-limit tests
* permission escalation tests
* workflow bypass tests
* export authorization tests
* offline security tests
* AI security tests

---

# 120. IDOR TESTING

Every resource identifier must be tested for unauthorized access.

Example:

```text
User A requests Resource B's ID
```

Expected:

```text
DENIED
```

---

# 121. PRIVILEGE ESCALATION TESTING

Test both:

### Horizontal escalation

User A accesses User B's resources.

### Vertical escalation

Normal user performs administrator action.

Both must fail.

---

# 122. TENANT ESCAPE TESTING

Automated tests must attempt to access another tenant's:

* records
* files
* reports
* search results
* notifications
* integrations
* AI context
* offline data

All unauthorized attempts must fail.

---

# 123. AUTHORIZATION REGRESSION TESTS

Whenever permissions change, regression tests must verify existing protected operations.

---

# 124. SECURITY TEST DATA

Security tests should include:

* malformed IDs
* missing IDs
* invalid types
* oversized inputs
* unexpected fields
* duplicate requests
* expired sessions
* revoked sessions
* unauthorized roles
* wrong tenant
* stale versions

---

# 125. CONCURRENCY SECURITY

Security-sensitive operations must consider race conditions.

Examples:

* two approvals
* duplicate payment
* simultaneous refund
* simultaneous stock adjustment
* repeated password reset
* concurrent permission changes

---

# 126. IDEMPOTENCY SECURITY

Retrying a sensitive request must not create duplicate business effects.

Use idempotency where appropriate for:

* payments
* financial posting
* inventory operations
* integrations
* webhooks
* synchronization

---

# 127. TRANSACTION SECURITY

Sensitive multi-step operations must use appropriate database transactions.

Authorization must be evaluated within a transactionally safe operation where race conditions could otherwise bypass controls.

---

# 128. CONCURRENCY CONTROL

Use:

* optimistic concurrency
* row-level locking
* unique constraints
* transaction isolation

where required by business integrity.

---

# 129. SECURITY AND CACHE

Caches must not leak data between tenants.

Cache keys must include appropriate scope.

Unsafe conceptual key:

```text
customer:123
```

Safer conceptual structure:

```text
tenant:456:customer:123
```

---

# 130. CACHE INVALIDATION

Sensitive cached data must be invalidated when:

* permissions change
* membership changes
* records change
* credentials are revoked
* tenant context changes

---

# 131. SECURITY AND BACKUPS

Backups contain potentially complete business datasets.

Therefore backups require:

* encryption
* access control
* retention policy
* auditability
* secure storage
* restoration testing

---

# 132. BACKUP ACCESS

Backup access must be restricted separately from ordinary application access.

---

# 133. BACKUP TESTING

A backup that cannot be restored is not a reliable backup.

Restoration must be tested periodically.

---

# 134. DATA RETENTION

Security and privacy requirements must influence retention.

Do not retain sensitive data indefinitely without reason.

---

# 135. DATA DELETION

Deletion must respect:

* legal requirements
* audit requirements
* financial retention
* organizational policy
* dependency relationships

Financial and audit records may require controlled archival rather than destructive deletion.

---

# 136. DATA MASKING

Sensitive information should be masked when full values are unnecessary.

Examples:

```text
**** **** **** 1234
```

instead of displaying complete payment information.

---

# 137. LOG MASKING

Sensitive identifiers and credentials should be masked or omitted from logs where appropriate.

---

# 138. PERSONAL DATA

Personal information must only be accessible to authorized users.

Examples:

* employee information
* customer contact data
* identity documents
* payroll information
* addresses
* bank information

---

# 139. FIELD-LEVEL SECURITY

Some entities may require field-level restrictions.

For example:

A user may access an employee record but not:

```text
salary
bank account
identity document
```

unless authorized.

---

# 140. SECURITY AND CUSTOM FIELDS

Custom fields must inherit the platform's security model.

A custom field must not create an unauthorized data exposure simply because it was dynamically created.

---

# 141. SECURITY AND CUSTOM FORMS

Custom forms must still enforce:

* authorization
* validation
* tenant scope
* field restrictions
* business rules
* audit

---

# 142. SECURITY AND CUSTOM WORKFLOWS

Custom workflows must not permit users to create authorization bypasses.

The workflow engine must enforce:

* allowed transitions
* approver permissions
* maker-checker rules
* scope
* audit

---

# 143. SECURITY AND CUSTOM AUTOMATION

Custom automation must run within controlled permissions.

Automation must not receive unrestricted access to the platform.

---

# 144. SCRIPT EXECUTION PROHIBITION

Do not allow ordinary administrators to upload and execute arbitrary server-side JavaScript as a customization feature.

Customization must use controlled declarative mechanisms.

---

# 145. SECURITY AND IMPORTS

Imported data must be treated as untrusted.

Imports must validate:

* schema
* types
* required fields
* tenant scope
* references
* business rules
* authorization

---

# 146. IMPORT PREVIEW

Where appropriate, imports should provide a validation preview before committing changes.

---

# 147. IMPORT TRANSACTIONS

Critical imports should use controlled transactions or staged processing.

Partial corruption must be prevented.

---

# 148. SECURITY AND DOCUMENTS

Documents may contain sensitive business information.

Document access must follow:

* organization scope
* record permissions
* role permissions
* document classification
* sharing rules

---

# 149. DOCUMENT SHARING

External sharing must be:

* explicit
* limited
* revocable
* time-bound where appropriate
* auditable

---

# 150. SECURITY AND INTEGRATIONS

Integrations must never bypass core security.

External systems cannot directly manipulate:

* accounting
* inventory
* workflows
* users
* permissions

without going through controlled application boundaries.

---

# 151. INTEGRATION PRINCIPLE

Use:

```text
External System
      ↓
Integration Adapter
      ↓
Validation
      ↓
Authentication
      ↓
Authorization
      ↓
Application Service
      ↓
Domain Rules
      ↓
Transaction
      ↓
Audit
```

---

# 152. SECURITY AND WEBHOOK PROCESSING

Webhook processing must validate:

* source authenticity
* payload schema
* tenant mapping
* event identity
* authorization context
* replay state

---

# 153. SECURITY AND BACKGROUND SYNCHRONIZATION

Sync processes must verify tenant/device identity before applying changes.

A sync payload must never be trusted merely because it came from a registered device.

---

# 154. DEVICE IDENTITY

Devices used for offline or mobile workflows may require:

* registration
* unique identity
* status
* organization association
* revocation
* last-seen information

---

# 155. COMPROMISED DEVICE RESPONSE

If a device is compromised:

1. revoke device
2. invalidate sessions where appropriate
3. stop synchronization
4. investigate queued operations
5. review audit activity
6. restore access only after verification

---

# 156. SECURITY AND NOTIFICATION CHANNELS

Security-sensitive notifications should use appropriate channels.

Potential channels:

* in-app
* email
* SMS
* push

The channel must not disclose more information than necessary.

---

# 157. SECURITY AND SEARCH INDEXES

Search indexes may duplicate sensitive information.

Therefore:

* indexes require access controls
* tenant identifiers must be stored
* permission metadata should be maintained
* queries must enforce authorization

---

# 158. SECURITY AND ANALYTICS

Analytics systems must not automatically receive unrestricted business data.

Data sent to analytics must be:

* authorized
* minimized
* scoped
* appropriately anonymized or protected

---

# 159. SECURITY AND TELEMETRY

Telemetry must avoid collecting unnecessary sensitive information.

Do not send:

* passwords
* tokens
* private documents
* financial secrets

to telemetry systems.

---

# 160. SECURITY AND ERROR TRACKING

Error monitoring must sanitize:

* request bodies
* headers
* cookies
* authorization information
* personal data

before transmission.

---

# 161. SECURITY AND PERFORMANCE MONITORING

Monitoring systems must not become unauthorized data-access channels.

Access to monitoring dashboards must itself be controlled.

---

# 162. SECURITY CONFIGURATION

Security configuration must be centralized where practical.

Examples:

```text
authentication policy
session duration
password policy
MFA requirement
rate limits
file limits
allowed origins
security headers
```

---

# 163. CONFIGURATION VALIDATION

Application startup should validate critical security configuration.

If required security configuration is missing, the application should fail safely rather than silently using insecure defaults.

---

# 164. FAIL-CLOSED RULE

When a security decision cannot be determined safely:

```text
DENY
```

Examples:

* unknown permission
* invalid tenant
* missing membership
* invalid workflow authority
* unknown role
* unavailable security policy

---

# 165. FAIL-SAFE RULE

Operational failures should avoid corrupting or exposing data.

Examples:

* failed authorization → deny
* failed transaction → rollback
* failed validation → reject
* failed signature verification → reject
* failed tenant resolution → reject

---

# 166. SECURITY EXCEPTIONS

Any security exception must have:

* documented reason
* defined scope
* owner
* expiration/review date
* compensating controls
* audit trail

Permanent undocumented exceptions are prohibited.

---

# 167. SECURITY CODE REVIEW

Security-sensitive code requires explicit review.

Review especially:

* authentication
* authorization
* permissions
* tenant context
* file handling
* SQL
* financial posting
* inventory mutation
* workflow transitions
* integrations
* AI tools
* offline synchronization

---

# 168. SECURITY REVIEW QUESTIONS

Every security-sensitive feature should answer:

1. Who can access it?
2. What tenant can they access?
3. What records can they access?
4. What actions can they perform?
5. What fields can they see?
6. What happens if the request is modified?
7. What happens if the request is repeated?
8. What happens if two users perform it simultaneously?
9. What happens offline?
10. What happens after permission revocation?
11. What is audited?
12. Can AI invoke it?
13. Can an integration invoke it?
14. Can a background job invoke it?
15. Can it expose data through search or reports?

---

# 169. SECURITY TESTING IN CI

CI should automatically run appropriate:

* dependency scans
* lint/security rules
* unit tests
* authorization tests
* tenant isolation tests
* API security tests
* integration tests

---

# 170. STATIC ANALYSIS

Where practical, use static analysis to detect:

* unsafe patterns
* vulnerable dependencies
* secret leakage
* dangerous APIs
* suspicious code

---

# 171. DYNAMIC SECURITY TESTING

Before major releases, perform appropriate dynamic testing against:

* authentication
* authorization
* API
* file upload
* search
* import/export
* workflows
* integrations

---

# 172. PENETRATION TESTING

Major production releases should be eligible for penetration testing based on risk and deployment scale.

Findings must be:

* documented
* prioritized
* assigned
* remediated
* retested

---

# 173. VULNERABILITY SEVERITY

Security issues should be classified according to severity and business impact.

Critical vulnerabilities affecting:

* authentication
* tenant isolation
* remote code execution
* financial integrity
* secret exposure

must receive immediate attention.

---

# 174. INCIDENT RESPONSE

Security incidents must have a defined response process:

```text
Detect
↓
Contain
↓
Investigate
↓
Eradicate
↓
Recover
↓
Validate
↓
Document
↓
Improve
```

---

# 175. INCIDENT AUDIT

Security incidents must preserve relevant evidence where appropriate.

Do not destroy logs or records needed for investigation.

---

# 176. SECURITY COMMUNICATION

Security incidents must be communicated through controlled channels according to organizational and legal requirements.

---

# 177. SECURITY RECOVERY

After an incident:

* revoke compromised credentials
* rotate secrets
* invalidate affected sessions
* restore secure configuration
* patch vulnerabilities
* verify tenant isolation
* verify data integrity
* monitor for recurrence

---

# 178. SECURITY DOCUMENTATION

Security-sensitive implementation decisions must be documented.

Documentation should explain:

* threat
* control
* reason
* scope
* limitations
* operational procedure

---

# 179. SECURITY CHANGE MANAGEMENT

Security changes must be treated as controlled changes.

Examples:

* permission changes
* authentication changes
* database security changes
* encryption changes
* session changes
* integration security changes

must be reviewed and tested.

---

# 180. SECURITY AND FEATURE FLAGS

Feature flags must not be treated as authorization controls.

A feature flag determines availability.

Permissions determine authorization.

---

# 181. SECURITY AND ADMINISTRATION

Administrative interfaces must be more restrictive than ordinary business interfaces.

Sensitive administrative operations should include:

* stronger authorization
* confirmation
* audit
* potentially MFA/re-authentication

---

# 182. RE-AUTHENTICATION

High-risk operations may require recent authentication.

Examples:

* changing password
* changing MFA
* changing security settings
* viewing highly sensitive information
* exporting sensitive datasets
* managing credentials

---

# 183. SECURITY CONFIRMATIONS

Confirmation dialogs improve UX but are not security controls.

The server must still enforce the operation.

---

# 184. SENSITIVE DATA DISPLAY

Sensitive data should be displayed only when necessary.

Use:

* masking
* reveal controls
* limited exposure
* role-aware visibility

where appropriate.

---

# 185. SECURITY AND PRINTING

Printing must respect permissions.

A user authorized to view a record is not automatically authorized to print/export it if those capabilities are separately restricted.

---

# 186. SECURITY AND CLIPBOARD

Sensitive information should not be unnecessarily copied to the clipboard.

Where appropriate, provide controlled copy behavior.

---

# 187. SECURITY AND BROWSER STORAGE

Do not store highly sensitive authentication information in insecure browser storage.

Evaluate carefully before using:

```text
localStorage
sessionStorage
IndexedDB
```

for sensitive data.

---

# 188. SECURITY AND LOCAL CACHE

Cached data must have:

* expiration
* tenant separation
* invalidation
* secure storage
* permission awareness

where applicable.

---

# 189. SECURITY AND DATA SYNCHRONIZATION

Synchronization must verify:

```text
device
+
user/session
+
tenant
+
operation
+
authorization
+
version
```

before applying changes.

---

# 190. SECURITY AND CONFLICT RESOLUTION

Conflicts must not be resolved by blindly accepting whichever client submitted last.

Security-sensitive and integrity-sensitive data must use authoritative server rules.

---

# 191. SECURITY AND RETRIES

Retries must not accidentally repeat sensitive business actions.

Use idempotency and operation identifiers.

---

# 192. SECURITY AND QUEUES

Message queues must enforce appropriate:

* authentication
* authorization
* tenant context
* message integrity
* access control

---

# 193. SECURITY AND EVENT BUS

Domain events must not expose unnecessary sensitive information.

Consumers must receive only what they need.

---

# 194. SECURITY AND EVENT PAYLOADS

Do not place:

* passwords
* tokens
* secrets
* unnecessary personal information

inside event payloads.

---

# 195. SECURITY AND REPORT GENERATION

Report generation jobs must preserve the requesting user's authorization context.

A privileged worker must not accidentally generate unrestricted reports for a normal user.

---

# 196. SECURITY AND ASYNC EXPORTS

Asynchronous export jobs must verify authorization when:

1. requested
2. processed
3. downloaded

This prevents stale authorization from becoming a data leak.

---

# 197. SECURITY AND SCHEDULED REPORTS

Scheduled reports must execute using controlled ownership and permissions.

If ownership or permissions change, future executions must respect the new authorization state.

---

# 198. SECURITY AND SAVED VIEWS

Saved filters/views must not expose data outside the creator's allowed scope.

Shared views require explicit authorization.

---

# 199. SECURITY AND DASHBOARDS

Dashboards must respect the same authorization model as underlying data.

A KPI must not reveal restricted information indirectly.

---

# 200. SECURITY AND AGGREGATION

Even aggregated data can reveal sensitive information.

Small-group or sensitive aggregations may require additional restrictions.

---

# 201. SECURITY AND CUSTOM REPORT BUILDER

A report builder must not allow users to construct unauthorized queries.

Available fields and relationships must be permission-aware.

---

# 202. SECURITY AND DATABASE REPORT QUERIES

Reporting queries must remain tenant-scoped and permission-aware.

Never create unrestricted reporting endpoints for convenience.

---

# 203. SECURITY AND ADMIN EXPORTS

Platform administrators with cross-tenant capabilities must still operate under explicit controls.

Cross-tenant exports must be:

* rare
* audited
* justified
* restricted

---

# 204. SECURITY AND DATA MIGRATION

Migration scripts must be treated as privileged operations.

They must:

* be reviewed
* be versioned
* be tested
* preserve integrity
* avoid unintended tenant mixing

---

# 205. SECURITY AND SEED DATA

Seed scripts must never contain real credentials or sensitive production information.

---

# 206. SECURITY AND DATABASE MIGRATIONS

A migration must not silently:

* delete important data
* remove security constraints
* weaken tenant isolation
* remove audit information

without explicit review.

---

# 207. SECURITY AND DEPLOYMENT

Production deployments must use controlled credentials and environments.

Do not deploy with development security settings.

---

# 208. SECURITY AND CONTAINERS

Containers should run with least privilege.

Avoid unnecessary:

* root privileges
* host mounts
* capabilities
* network access

---

# 209. SECURITY AND SERVER PROCESSES

Application processes should use restricted operating-system permissions.

---

# 210. SECURITY AND NETWORKING

Production architecture should separate sensitive services where practical.

Examples:

```text
Internet
   ↓
Reverse Proxy
   ↓
Application
   ↓
Database
```

The database should not need direct public exposure.

---

# 211. SECURITY AND HEALTH ENDPOINTS

Health endpoints must not expose:

* secrets
* credentials
* internal configuration
* sensitive database information

---

# 212. READINESS/LIVENESS SECURITY

Operational endpoints should expose only the minimum information required by infrastructure.

---

# 213. SECURITY AND OBSERVABILITY

Observability must balance diagnostic value and privacy/security.

---

# 214. SECURITY AND DEVELOPMENT TOOLS

Development tools must not accidentally remain publicly exposed in production.

Examples:

* admin consoles
* debug endpoints
* database interfaces
* profiling tools
* test routes

---

# 215. SECURITY AND DOCUMENTATION

Internal security documentation should not expose secrets.

Examples and screenshots must use sanitized data.

---

# 216. SECURITY AND DEMO ENVIRONMENTS

Demo environments must use isolated synthetic data.

Never connect demo interfaces directly to production business data.

---

# 217. SECURITY AND SUPPORT ACCESS

Support access should use controlled mechanisms.

Support personnel should not automatically receive unrestricted tenant access.

---

# 218. SUPPORT IMPERSONATION

If support impersonation exists, it must:

* require authorization
* be explicit
* be time-limited
* be visible
* be audited
* never silently impersonate users

---

# 219. SECURITY AND USER DEACTIVATION

Deactivated users must lose access according to policy.

Their historical actions should remain attributable in audit records.

---

# 220. SECURITY AND OWNERSHIP

Deleting or disabling a user must not silently destroy ownership information.

Records should retain appropriate historical attribution.

---

# 221. SECURITY AND ROLE DELETION

Roles referenced by historical records should not be destructively removed if doing so would break auditability.

Prefer controlled deactivation.

---

# 222. SECURITY AND PERMISSION CACHE

Permission caches must have safe invalidation.

When permissions change, stale authorization must not remain active indefinitely.

---

# 223. SECURITY AND TENANT CACHE

Tenant configuration caches must include correct organizational scope.

---

# 224. SECURITY AND CONFIGURATION CACHE

Security-sensitive configuration changes must propagate reliably.

---

# 225. SECURITY AND MULTI-TAB APPLICATIONS

Multiple browser tabs must not create inconsistent authorization assumptions.

The server remains authoritative.

---

# 226. SECURITY AND SESSION EXPIRATION

Expired sessions must not continue performing server operations.

---

# 227. SECURITY AND LONG-RUNNING OPERATIONS

Long-running jobs must re-check authorization where required.

Do not assume authorization remains valid forever.

---

# 228. SECURITY AND USER-CONTROLLED EXPRESSIONS

Custom formulas or expressions must use a restricted expression engine.

Do not execute arbitrary JavaScript supplied by users.

---

# 229. SECURITY AND REGEX

User-provided regular expressions must be controlled to avoid catastrophic backtracking and denial-of-service conditions.

---

# 230. SECURITY AND RESOURCE LIMITS

Customizations, reports, imports, AI tasks, and automation must have resource limits.

---

# 231. SECURITY AND DENIAL OF SERVICE

Protect against resource exhaustion through:

* request limits
* pagination
* query limits
* rate limiting
* job limits
* file limits
* report limits
* AI limits
* concurrency controls

---

# 232. SECURITY AND SEARCH LIMITS

Search must have:

* query length limits
* result limits
* rate limits
* permission filtering
* expensive-query controls

---

# 233. SECURITY AND REPORT LIMITS

Reports must have:

* maximum result size
* query timeout
* export limits
* asynchronous processing for expensive operations

---

# 234. SECURITY AND AI LIMITS

AI usage must support:

* request limits
* token/cost limits
* model restrictions
* tool restrictions
* timeout
* abuse detection

---

# 235. SECURITY AND AUTOMATION LIMITS

Automations must have controls against infinite loops.

For example:

```text
Event
 ↓
Automation
 ↓
Update
 ↓
Event
 ↓
Automation
```

must not create uncontrolled recursion.

---

# 236. SECURITY AND JOB RECURSION

Background jobs must include safeguards against:

* infinite retries
* duplicate execution
* recursive scheduling
* uncontrolled queue growth

---

# 237. SECURITY AND RETRY POLICY

Retries must use:

* bounded attempts
* exponential backoff
* jitter
* dead-letter handling

where appropriate.

---

# 238. SECURITY AND CIRCUIT BREAKERS

External integrations should use circuit breakers where failure could create resource exhaustion.

---

# 239. SECURITY AND TIMEOUTS

All external network calls must have appropriate timeouts.

Never allow indefinite waits.

---

# 240. SECURITY AND RESOURCE OWNERSHIP

Every privileged resource should have clear ownership.

Examples:

* integration credential
* API key
* scheduled report
* automation
* workflow
* service account

---

# 241. SECURITY AND REVOCATION

Security-sensitive resources must support revocation where practical.

Examples:

* sessions
* API keys
* devices
* integration credentials
* temporary privileges
* shared links

---

# 242. SECURITY AND SHARED LINKS

Shared links must be:

* unguessable
* scoped
* optionally password protected
* optionally time limited
* revocable
* audited

---

# 243. SECURITY AND QR/BARCODE LINKS

QR/barcode mechanisms must not automatically grant privileged access.

Public identifiers must not be treated as secret authorization credentials.

---

# 244. SECURITY AND MOBILE CLIENTS

Mobile applications must follow the same server-side authorization model.

The mobile client cannot be trusted simply because it is an official application.

---

# 245. SECURITY AND DESKTOP CLIENTS

Desktop applications must also assume that local users can inspect or modify client-side code.

Sensitive authorization must remain server-side where applicable.

---

# 246. SECURITY AND API CLIENTS

All clients are considered untrusted:

```text
Web
Mobile
Desktop
Third-party Integration
AI
```

All must pass through controlled server boundaries.

---

# 247. SECURITY AND INTERNAL APIS

Internal API does not mean automatically trusted.

Internal calls must still use:

* authenticated service identity
* appropriate authorization
* controlled network access

where required.

---

# 248. SECURITY AND MICROSERVICE FUTURE

If services are split in the future, security boundaries must become explicit.

Do not assume:

```text
internal network = trusted
```

---

# 249. SECURITY AND MODULAR MONOLITH

The current modular monolith must still maintain module boundaries.

Modules must not bypass:

* authorization
* domain services
* audit
* tenant scope

---

# 250. SECURITY AND REPOSITORIES

Repositories must never silently remove tenant or authorization context.

Application services must provide the correct security context.

---

# 251. SECURITY AND DOMAIN SERVICES

Domain services must reject invalid state transitions even when invoked from trusted-looking application code.

---

# 252. SECURITY AND CONTROLLERS

Controllers must not contain complex security decisions that should exist in reusable authorization/application layers.

---

# 253. SECURITY AND MIDDLEWARE

Middleware may establish:

* authentication
* request context
* correlation IDs

but deeper authorization must still occur where resource-specific decisions are required.

---

# 254. SECURITY AND CORRELATION IDS

Every request should have a correlation/request identifier.

This supports:

* incident investigation
* audit correlation
* debugging
* distributed tracing

Do not use correlation IDs as authorization credentials.

---

# 255. SECURITY AND REQUEST CONTEXT

Request context may include:

```text
user
session
organization
company
branch
device
request ID
```

It must be constructed from trusted server-side information.

---

# 256. SECURITY CONTEXT PROPAGATION

Security context must remain intact when work moves through:

* application services
* jobs
* queues
* events
* integrations
* reporting
* AI tools

---

# 257. SECURITY AND EVENT CONSUMERS

Event consumers must not assume that event publication grants unrestricted authority.

Consumers should perform appropriate checks for their own actions.

---

# 258. SECURITY AND DOMAIN EVENTS

Events should carry only information required by consumers.

---

# 259. SECURITY AND AUDIT EVENTS

Audit events must preserve enough information to determine:

* who
* what
* when
* where
* under which organization
* result

---

# 260. SECURITY AND DATA INTEGRITY

Security protects not only confidentiality but also correctness.

A user who is allowed to view a record may still be prohibited from changing its authoritative state.

---

# 261. SECURITY AND BUSINESS RULES

Business rules are part of security when they prevent unauthorized state changes.

Examples:

* credit limits
* approval thresholds
* inventory restrictions
* accounting period locks
* refund limits

---

# 262. SECURITY AND PERIOD CLOSING

Closed financial periods must not be modified through ordinary APIs.

Reopening must require explicit authority and audit.

---

# 263. SECURITY AND ACCOUNTING POSTING

Posting financial transactions must be protected separately from drafting.

A user may have:

```text
create journal
```

without having:

```text
post journal
```

---

# 264. SECURITY AND INVENTORY POSTING

Creating an inventory draft does not automatically grant permission to finalize stock movement.

---

# 265. SECURITY AND POS CASH CONTROL

Cash drawer operations must be permission-aware.

Examples:

* opening drawer
* cash withdrawal
* cash addition
* closing drawer
* approving variance

---

# 266. SECURITY AND CUSTOMER DATA

Customer records must respect organization and branch access rules.

---

# 267. SECURITY AND SUPPLIER DATA

Supplier records must respect organizational and role permissions.

---

# 268. SECURITY AND EMPLOYEE DATA

Employee and payroll data requires stronger access restrictions than ordinary business records.

---

# 269. SECURITY AND HR

HR administrators should not automatically receive unrestricted accounting or system administration access.

---

# 270. SECURITY AND PAYROLL

Payroll access should support highly restricted roles and audit trails.

---

# 271. SECURITY AND TAX DATA

Tax configuration changes can materially affect financial operations and should be restricted and audited.

---

# 272. SECURITY AND BANKING

Bank account and reconciliation information must have controlled access.

---

# 273. SECURITY AND PAYMENT DATA

Sensitive payment information must be minimized.

Do not store unnecessary card data.

Use compliant payment providers where card processing is required.

---

# 274. SECURITY AND THIRD-PARTY PAYMENT PROVIDERS

Payment integrations must use provider-approved secure mechanisms.

Do not store sensitive payment credentials unnecessarily.

---

# 275. SECURITY AND E-COMMERCE

E-commerce synchronization must enforce:

* tenant mapping
* external identity mapping
* authorization
* webhook validation
* inventory integrity
* order integrity

---

# 276. SECURITY AND LOGISTICS

Delivery and fleet information may expose operationally sensitive data.

Access must follow role and organizational scope.

---

# 277. SECURITY AND LOCATION DATA

Location information must only be collected and exposed when required by the feature and authorized.

---

# 278. SECURITY AND DOCUMENT OCR

OCR services may receive sensitive documents.

OCR integrations must:

* use secure transmission
* minimize retained data
* protect credentials
* enforce tenant scope
* audit processing where appropriate

---

# 279. SECURITY AND AI OCR

Extracted OCR data must be treated as untrusted until validated.

---

# 280. SECURITY AND DATA CLASSIFICATION

The platform should support classification of sensitive information where required.

Possible categories:

```text
Public
Internal
Confidential
Highly Confidential
Restricted
```

Exact labels may be configurable.

---

# 281. SECURITY AND CLASSIFICATION

Classification must influence:

* visibility
* export
* sharing
* storage
* retention
* audit
* notifications

where applicable.

---

# 282. SECURITY AND PRIVACY BY DESIGN

New features must consider privacy and security during design, not after implementation.

---

# 283. SECURITY THREAT MODELING

High-risk features should receive threat modeling.

At minimum consider:

* assets
* actors
* attack surfaces
* trust boundaries
* threats
* mitigations
* residual risks

---

# 284. SECURITY REVIEW BEFORE IMPLEMENTATION

High-risk features should be reviewed before coding begins.

---

# 285. SECURITY REVIEW BEFORE RELEASE

A feature must not be considered production-ready until its security controls are verified.

---

# 286. SECURITY DEFINITION OF DONE

A feature is security-complete only when:

* authentication is defined
* authorization is defined
* tenant scope is defined
* input validation exists
* output security exists
* business integrity is enforced
* audit behavior exists
* error handling is safe
* sensitive data handling is reviewed
* offline behavior is reviewed
* integration behavior is reviewed
* AI behavior is reviewed where applicable
* tests exist
* security review is complete

---

# 287. SECURITY CODE REVIEW CHECKLIST

Reviewers must ask:

### Authentication

* Is authentication required?
* Are sessions secure?
* Are credentials protected?

### Authorization

* Is permission checked?
* Is scope checked?
* Is default deny enforced?

### Tenant Isolation

* Is tenant context server-derived?
* Are repository queries scoped?
* Can cross-tenant access occur?

### Input

* Is every external input validated?
* Is injection prevented?

### Data

* Is sensitive information minimized?
* Is it protected at rest and in transit?

### Business Integrity

* Can a user bypass workflow?
* Can financial/inventory records be corrupted?

### Files

* Are uploads validated?
* Is file access authorized?

### Offline

* Is cached data protected?
* Are queued operations secure?

### Integrations

* Are credentials protected?
* Are webhooks verified?

### AI

* Does AI receive only authorized information?
* Are tool actions controlled?

### Audit

* Are important actions logged?

### Testing

* Are negative and escalation cases tested?

---

# 288. SECURITY DEVELOPMENT CHECKLIST

Before merging security-sensitive code:

```text
[ ] Authentication reviewed
[ ] Authorization reviewed
[ ] Tenant isolation reviewed
[ ] Input validation reviewed
[ ] Output handling reviewed
[ ] Database access reviewed
[ ] Business rules reviewed
[ ] Financial/inventory integrity reviewed
[ ] File handling reviewed
[ ] Session handling reviewed
[ ] Secret handling reviewed
[ ] Audit reviewed
[ ] Error handling reviewed
[ ] Offline behavior reviewed
[ ] Integration behavior reviewed
[ ] AI behavior reviewed if applicable
[ ] Security tests added
[ ] Dependency impact reviewed
[ ] Documentation updated
```

---

# 289. SECURITY RELEASE CHECKLIST

Before production deployment:

```text
[ ] No secrets committed
[ ] Production security configuration verified
[ ] Authentication tested
[ ] Authorization tested
[ ] Tenant isolation tested
[ ] Critical security endpoints tested
[ ] Rate limits verified
[ ] Security headers verified
[ ] CORS verified
[ ] File upload protections verified
[ ] Database access restricted
[ ] Backups verified
[ ] Monitoring enabled
[ ] Audit logging enabled
[ ] Error leakage checked
[ ] Dependency vulnerabilities reviewed
[ ] Security-critical migrations reviewed
[ ] Incident response available
```

---

# 290. FINAL SECURITY ARCHITECTURE

The platform security model is:

```text
Client
   ↓
Secure Transport
   ↓
Authentication
   ↓
Session / Identity
   ↓
Tenant Context
   ↓
Permission / Scope Authorization
   ↓
Request Validation
   ↓
Application Service
   ↓
Domain Rules
   ↓
Workflow / Approval Rules
   ↓
Transaction / Concurrency Controls
   ↓
Repository
   ↓
PostgreSQL
   ↓
Audit / Events
```

Supporting boundaries:

```text
AI
 ↓
Allowlisted Tool
 ↓
Application Service
 ↓
Authorization
```

```text
Integration
 ↓
Adapter
 ↓
Validation
 ↓
Authorization
 ↓
Application Service
```

```text
Offline Client
 ↓
Secure Local Store
 ↓
Operation Queue
 ↓
Authenticated Sync
 ↓
Server Authorization
 ↓
Conflict Resolution
 ↓
Authoritative Database
```

---

# 291. FINAL SECURITY RULE

No client, integration, background job, AI system, offline queue, custom workflow, or administrative interface may bypass the platform's:

* authentication
* authorization
* tenant isolation
* business rules
* workflow controls
* financial integrity
* inventory integrity
* audit requirements
* security boundaries

---

# 292. FINAL DEVELOPMENT PRINCIPLE

> **Security must be enforced at the point where data and business state are actually controlled, not merely where the user interface is displayed.**

The frontend may guide the user.

The API may validate the request.

The application layer may enforce the operation.

The domain layer must protect business integrity.

The database must protect structural integrity.

The audit system must preserve accountability.

Together these layers form the platform's security boundary.

---

# 293. SOURCE-OF-TRUTH RULE

This document is the mandatory implementation security standard.

If another development document conflicts with this document on security behavior, the stricter security requirement must be followed and the conflict must be resolved before implementation.

Security cannot be weakened for convenience.

---

# 294. COMPLETION CRITERIA

The development team must consider this security standard successfully implemented only when:

1. Authentication is centrally enforced.
2. Authorization is server-side.
3. Tenant isolation is mandatory.
4. Permissions are default-deny.
5. Sensitive operations are audited.
6. Financial integrity is protected.
7. Inventory integrity is protected.
8. Workflow approvals cannot be bypassed.
9. Files are securely handled.
10. Integrations are authenticated.
11. Offline data is protected.
12. AI access is permission-aware.
13. Secrets are protected.
14. Security tests exist.
15. Production configuration is hardened.
16. Backup security is implemented.
17. Monitoring and incident response exist.
18. Security-sensitive changes receive review.

---

# 295. FINAL SECURITY STATEMENT

The platform is an enterprise business system handling potentially sensitive organizational, financial, operational, employee, customer, supplier, inventory, document, and integration data.

Therefore:

```text
Security is not a module.
Security is not middleware only.
Security is not frontend logic.
Security is not a checklist added at the end.

Security is an architectural and development requirement
that exists throughout the entire platform.
```

**END OF DEVELOPMENT SECURITY RULES**
