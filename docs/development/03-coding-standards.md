# CODING STANDARDS

## Professional ERP & Business Management Platform

**Document:** `development/03-coding-standards.md`
**Status:** Development Standard
**Version:** 1.0
**Purpose:** Define mandatory JavaScript, React, backend, database-access, API, security, performance, accessibility, and maintainability standards for production code.

---

# 1. DOCUMENT PURPOSE

This document defines how source code must be written throughout the platform.

The objective is to ensure that the codebase remains:

* readable;
* predictable;
* secure;
* maintainable;
* testable;
* modular;
* performant;
* accessible;
* scalable;
* consistent across modules.

These standards apply to:

* frontend code;
* backend code;
* shared code;
* API implementations;
* application services;
* domain logic;
* repositories;
* background jobs;
* integrations;
* workflows;
* offline synchronization;
* reporting;
* AI tooling;
* tests;
* scripts.

---

# 2. TECHNOLOGY STANDARD

The current implementation language is:

```text
JavaScript
```

Frontend:

```text
React
Next.js where applicable
JSX
Custom CSS
```

Backend:

```text
JavaScript
Node.js
```

Database:

```text
PostgreSQL
```

API:

```text
REST
/api/v1
```

The codebase must not introduce TypeScript unless the project technology decision is explicitly changed.

---

# 3. TYPESCRIPT PROHIBITION

The current project is JavaScript-based.

Do not create:

```text
.ts
.tsx
```

files.

Do not introduce TypeScript configuration merely because a third-party package supports it.

Use:

```text
.js
.jsx
```

for application source code.

Where stronger documentation of function contracts is needed, use:

* JSDoc;
* validation schemas;
* API contracts;
* database constraints;
* tests.

---

# 4. TAILWIND PROHIBITION

Tailwind CSS must not be introduced.

Use:

* custom CSS;
* CSS variables;
* design tokens;
* component styles;
* theme classes;
* responsive styles.

Styling decisions must follow the approved design system.

---

# 5. GENERAL CODE QUALITY RULE

Code must optimize for:

```text
Correctness
Security
Clarity
Maintainability
Testability
Performance
```

Do not optimize primarily for:

```text
Fewest lines
Shortest implementation
Clever syntax
Maximum abstraction
```

Readable code is preferred over clever code.

---

# 6. EXPLICITNESS OVER CLEVERNESS

Avoid unnecessarily clever implementations.

Bad:

```javascript
const result = items?.filter(x => x.a)?.map(x => x.b)?.reduce((a, b) => a + b, 0) || 0;
```

when the operation is complex enough to require explanation.

Prefer clear intermediate logic when it improves readability.

---

# 7. FUNCTION RESPONSIBILITY

Functions should have one clear responsibility.

Prefer:

```javascript
validateSale()
calculateSaleTotals()
reserveStock()
createPayment()
completeSale()
```

over:

```javascript
processEverything()
```

A function may coordinate multiple operations when that is its intended application-service responsibility.

---

# 8. FUNCTION SIZE

There is no arbitrary line-count limit.

However, a function should be reconsidered when it contains:

* multiple unrelated responsibilities;
* deeply nested conditions;
* repeated logic;
* multiple transaction boundaries;
* difficult-to-test branches.

The question should be:

> Can another developer understand what this function is responsible for without reading its entire implementation?

---

# 9. PARAMETER DESIGN

Avoid functions with excessive unrelated parameters.

Bad:

```javascript
createUser(a, b, c, d, e, f, g, h);
```

Prefer a clear object:

```javascript
createUser({
    name,
    email,
    role,
    organizationId
});
```

Object parameters must still be validated.

---

# 10. RETURN VALUES

Functions should have predictable return behavior.

Avoid:

```javascript
function getUser() {
    if (!user) return;
    return user;
}
```

when callers cannot clearly distinguish absence from an error.

Use intentional contracts such as:

```javascript
return null;
```

or:

```javascript
throw new NotFoundError();
```

depending on the application's semantics.

---

# 11. NAMING

Names must communicate purpose.

Prefer:

```javascript
customerAccount
stockMovement
approvalRequest
paymentTransaction
organizationId
```

Avoid:

```javascript
data
obj
thing
item2
temp
x
foo
```

Short names are acceptable for very local, obvious variables.

---

# 12. BOOLEAN NAMING

Boolean variables should communicate a true/false state.

Preferred:

```javascript
isActive
hasPermission
canEdit
shouldSync
isOffline
isApproved
```

Avoid:

```javascript
active
permission
edit
sync
```

when the meaning is ambiguous.

---

# 13. COLLECTION NAMING

Collections should use plural or clearly collective names.

Preferred:

```javascript
users
products
stockMovements
permissions
```

Avoid:

```javascript
user
product
movement
```

for arrays.

---

# 14. ID NAMING

IDs must communicate what they identify.

Preferred:

```javascript
organizationId
customerId
invoiceId
warehouseId
transactionId
```

Avoid generic:

```javascript
id
```

when multiple IDs are present in the same scope.

---

# 15. CONSTANTS

Constants should be used for values that have shared semantic meaning.

Example:

```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const DEFAULT_PAGE_SIZE = 50;
```

Do not replace every simple local value with a global constant unnecessarily.

---

# 16. MAGIC VALUES

Avoid unexplained magic values.

Bad:

```javascript
if (status === 7) {
```

Prefer:

```javascript
if (status === INVOICE_STATUS.POSTED) {
```

Use named constants or enums where the value has domain meaning.

---

# 17. ENUM-LIKE VALUES

JavaScript does not require TypeScript enums.

Use controlled constants when appropriate.

Example:

```javascript
const INVOICE_STATUS = Object.freeze({
    DRAFT: "draft",
    SUBMITTED: "submitted",
    APPROVED: "approved",
    POSTED: "posted",
    PAID: "paid",
    CANCELLED: "cancelled"
});
```

Do not allow arbitrary strings throughout the application when the value represents a controlled domain state.

---

# 18. OBJECT IMMUTABILITY

Do not mutate shared objects unexpectedly.

Prefer creating controlled state transitions.

Bad:

```javascript
user.permissions.push(permission);
```

when `user` is shared state.

Prefer:

```javascript
const updatedUser = {
    ...user,
    permissions: [...user.permissions, permission]
};
```

Backend domain objects may use controlled mutation internally where appropriate, but side effects must remain explicit.

---

# 19. ARRAY MUTATION

Be intentional when using:

```javascript
push()
pop()
splice()
sort()
reverse()
```

on shared application state.

Frontend state should generally be updated immutably.

Backend local collections may be mutated when safe and local.

---

# 20. OPTIONAL CHAINING

Optional chaining may be used where absence is genuinely valid.

Example:

```javascript
customer?.contact?.email
```

Do not use optional chaining to hide required data errors.

Bad:

```javascript
invoice?.customer?.account?.balance
```

if the application requires all those relationships to exist.

---

# 21. NULLISH COALESCING

Use `??` when distinguishing between:

* missing/null values;
* valid falsy values.

Example:

```javascript
const pageSize = request.pageSize ?? DEFAULT_PAGE_SIZE;
```

Do not blindly use `||` when `0`, `false`, or `""` are valid values.

---

# 22. STRICT EQUALITY

Use:

```javascript
===
!==
```

instead of loose equality:

```javascript
==
!=
```

unless there is a very deliberate documented reason.

---

# 23. CONDITIONAL LOGIC

Prefer readable conditions.

Avoid excessive nested ternaries.

Bad:

```javascript
const status = a ? b ? c : d : e ? f : g;
```

Use clear conditional logic when complexity increases.

---

# 24. EARLY RETURNS

Use early returns to reduce unnecessary nesting.

Example:

```javascript
if (!user) {
    return null;
}

if (!user.isActive) {
    return null;
}

return getDashboard(user);
```

This is preferred over deeply nested blocks.

---

# 25. ERROR HANDLING

Never silently swallow errors.

Bad:

```javascript
try {
    await save();
} catch (error) {
}
```

If an error is intentionally ignored, that decision must be explicit and documented.

---

# 26. ASYNC/AWAIT

Use `async/await` for asynchronous business operations where it improves readability.

Preferred:

```javascript
const customer = await customerService.getById(customerId);
```

rather than deeply nested promise chains.

---

# 27. PROMISE HANDLING

Every Promise must have intentional handling.

Do not create unhandled asynchronous operations accidentally.

Bad:

```javascript
sendNotification();
```

when failure matters.

Either:

```javascript
await sendNotification();
```

or explicitly dispatch it to a controlled background mechanism.

---

# 28. PARALLEL ASYNC OPERATIONS

Use parallel execution only when operations are independent.

Example:

```javascript
const [customer, products] = await Promise.all([
    getCustomer(customerId),
    getProducts()
]);
```

Do not parallelize operations that depend on each other.

---

# 29. ERROR CONTEXT

When throwing an error, preserve useful context.

Example:

```javascript
throw new BusinessRuleError(
    "Stock cannot be transferred because the source warehouse does not have sufficient available quantity."
);
```

Do not expose internal implementation details to users.

---

# 30. CUSTOM ERROR TYPES

Use meaningful application error classes.

Examples:

```javascript
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
BusinessRuleError
ConcurrencyError
IntegrationError
```

Avoid throwing generic strings.

Bad:

```javascript
throw "Invalid";
```

---

# 31. ERROR MESSAGES

User-facing errors must be:

* understandable;
* actionable;
* safe.

Bad:

```text
ECONNREFUSED 10.0.0.4:5432
```

User-facing:

```text
The operation could not be completed because the service is temporarily unavailable.
```

Internal diagnostics remain in secure logs.

---

# 32. IMPORT ORDER

Imports should follow a predictable order.

Recommended conceptual order:

```text
1. External dependencies
2. Shared project dependencies
3. Module dependencies
4. Local files
```

Avoid random import ordering.

---

# 33. IMPORT PATHS

Use stable project aliases where the project configuration supports them.

Avoid extremely fragile paths such as:

```javascript
../../../../../../utils
```

Prefer clear module paths.

---

# 34. UNUSED IMPORTS

Unused imports must be removed.

Do not leave dead dependencies in files.

---

# 35. EXPORTS

Export only what other code needs.

Do not expose internal implementation unnecessarily.

A module should have a controlled public API.

---

# 36. CIRCULAR DEPENDENCIES

Avoid circular imports.

If:

```text
A → B
B → C
C → A
```

appears, reconsider the design.

Potential solutions include:

* extracting shared logic;
* dependency inversion;
* application service;
* event;
* shared contract.

---

# 37. COMMENTS

Comments should explain:

* why;
* business constraints;
* unusual behavior;
* security requirements;
* non-obvious algorithms.

Do not write comments that merely repeat the code.

Bad:

```javascript
// Increment count
count++;
```

Useful:

```javascript
// This sequence is generated server-side to guarantee uniqueness
// across offline POS devices after synchronization.
```

---

# 38. JSDOC

Use JSDoc when function behavior or data contracts need clarification.

Example:

```javascript
/**
 * Completes a sale and creates the associated inventory,
 * payment, and accounting effects.
 *
 * @param {Object} input
 * @returns {Promise<Object>}
 */
async function completeSale(input) {
    // ...
}
```

Do not create excessive documentation that becomes inaccurate.

---

# 39. DEAD CODE

Do not leave:

* unused functions;
* commented-out implementations;
* obsolete branches;
* abandoned components;
* old APIs.

Use version control instead of keeping old code commented out.

---

# 40. DUPLICATE LOGIC

Repeated business logic must be consolidated.

If three modules independently implement the same business rule, determine whether the rule belongs in:

* shared domain logic;
* application service;
* utility;
* policy;
* configuration.

Do not blindly abstract code that is only superficially similar.

---

# 41. ABSTRACTION RULE

Do not create an abstraction before there is a meaningful responsibility.

Avoid:

```javascript
BaseUniversalEntityManager
GenericEnterpriseProcessorFactory
AbstractBusinessThing
```

unless the abstraction solves a real architectural problem.

Prefer simple, explicit code until reuse is justified.

---

# 42. REACT COMPONENT NAMING

React components use PascalCase.

Examples:

```text
InventoryDashboard.jsx
StockMovementTable.jsx
CustomerBalanceCard.jsx
ApprovalInbox.jsx
```

---

# 43. REACT COMPONENT RESPONSIBILITY

A component should have a clear UI responsibility.

Avoid components that simultaneously:

* fetch unrelated APIs;
* manage global state;
* calculate accounting;
* control workflows;
* render multiple unrelated screens.

---

# 44. COMPONENT PROPS

Props should be:

* meaningful;
* minimal;
* predictable.

Avoid passing large unrelated objects when only a few fields are required.

Prefer:

```jsx
<CustomerSummary
    customerId={customer.id}
    name={customer.name}
    balance={customer.balance}
/>
```

where appropriate.

---

# 45. PROP DRILLING

If state must pass through many unrelated components, reconsider the architecture.

Possible solutions:

* context;
* state management;
* composition;
* module service;
* route-level data loading.

Do not introduce global state merely to avoid one or two levels of prop passing.

---

# 46. CONTROLLED INPUTS

Forms should generally use controlled or intentionally managed input patterns.

Form behavior must remain predictable.

---

# 47. REACT STATE

Keep state at the lowest reasonable level.

Examples:

```text
Modal open state
→ modal/page

Filter state
→ table/page/module

User session
→ application/session state

Organization selection
→ organization context/global state
```

---

# 48. EFFECTS

React effects should represent external synchronization.

Do not use effects for calculations that can be performed during rendering.

Avoid effect chains where one effect changes state only to trigger another effect.

---

# 49. EFFECT DEPENDENCIES

Dependencies must be intentionally declared.

Do not suppress dependency warnings simply to make an effect behave.

If an effect requires architectural redesign, redesign it.

---

# 50. MEMOIZATION

Use memoization when there is a measurable or obvious benefit.

Do not wrap everything in:

```text
useMemo
useCallback
memo
```

without reason.

Premature memoization can increase complexity.

---

# 51. EVENT HANDLERS

Event handlers should remain readable.

Avoid putting large business processes directly inside:

```jsx
onClick={() => {
    // 100 lines
}}
```

Call a meaningful function instead.

---

# 52. FRONTEND API CALLS

API calls should use centralized clients/services.

Avoid scattered raw `fetch()` calls throughout components.

Preferred:

```javascript
inventoryApi.getStock(filters);
```

rather than every page constructing its own request.

---

# 53. FRONTEND BUSINESS VALIDATION

Client-side validation improves user experience.

It must not be treated as authoritative.

The backend must repeat important validation.

---

# 54. FRONTEND PERMISSIONS

UI permissions should determine:

* whether an action appears;
* whether an action is enabled;
* whether a route is accessible.

They must not be treated as security enforcement.

---

# 55. DATA FETCHING

Data fetching should account for:

* loading;
* error;
* empty;
* retry;
* stale data;
* cancellation;
* pagination;
* permissions.

Avoid uncontrolled duplicate requests.

---

# 56. REQUEST CANCELLATION

Long-running client requests should be cancellable where appropriate.

This is especially useful for:

* search;
* autocomplete;
* report filtering;
* rapidly changing queries.

---

# 57. DEBOUNCING

Use debouncing for high-frequency operations such as:

* search;
* autocomplete;
* filtering.

Do not debounce actions that require immediate transactional execution.

---

# 58. FORM SUBMISSION

A submit action must prevent accidental duplicate requests.

Typical pattern:

```text
Idle
 ↓
Submitting
 ↓
Success / Error
```

Disable or guard repeated submission where appropriate.

---

# 59. UI TRANSACTION STATES

For important operations, the UI should distinguish:

```text
Draft
Submitting
Processing
Completed
Failed
Queued
Syncing
Conflict
```

Do not label a locally queued operation as server-confirmed.

---

# 60. CSS STANDARDS

CSS must follow the design system.

Prefer:

```css
var(--color-primary);
var(--spacing-md);
var(--radius-md);
```

over arbitrary values repeated throughout the codebase.

---

# 61. CSS CLASS NAMING

Class names must communicate component responsibility.

Avoid:

```text
.blueBox
.bigThing
.test2
```

Prefer:

```text
.inventory-summary
.stock-movement-row
.approval-status
```

The project's final naming convention may use another established methodology, but it must remain consistent.

---

# 62. CSS DUPLICATION

Do not copy entire style blocks between modules.

If a pattern is genuinely reusable, extract it into the design system or shared component.

---

# 63. INLINE STYLES

Inline styles should be limited to genuinely dynamic values.

Do not use inline styles as the primary styling system.

---

# 64. RESPONSIVE CSS

Responsive behavior should be defined consistently.

Do not create arbitrary breakpoints in individual modules.

Use the project's approved breakpoint tokens.

---

# 65. THEME SUPPORT

Components must consume semantic design tokens.

Do not hardcode theme-specific colors into business components.

Bad:

```css
color: #0057ff;
```

when the color represents the semantic primary color.

Prefer:

```css
color: var(--color-primary);
```

---

# 66. REDUCED MOTION

Animations must respect reduced-motion preferences.

Do not create motion that becomes unavoidable for users who request reduced motion.

---

# 67. ACCESSIBILITY CODE

Interactive controls must use appropriate semantics.

Prefer:

```html
<button>
```

for actions.

Do not use:

```html
<div onClick={...}>
```

as a button replacement unless there is a compelling specialized reason and complete accessibility behavior is implemented.

---

# 68. FORM ACCESSIBILITY

Form controls should have:

* labels;
* accessible names;
* error associations;
* keyboard access;
* appropriate input types.

---

# 69. TABLE ACCESSIBILITY

Tables should maintain meaningful:

* headers;
* row/column relationships;
* keyboard interaction where applicable;
* readable focus behavior.

---

# 70. BACKEND NAMING

Backend JavaScript names should follow the same clarity rules.

Examples:

```text
inventoryService.js
stockMovementRepository.js
receiveStock.js
purchaseOrderController.js
```

---

# 71. CONTROLLER STANDARDS

Controllers should generally:

1. receive request;
2. validate/normalize;
3. obtain authenticated context;
4. call application service;
5. serialize response.

Controllers should not:

* contain large business algorithms;
* execute arbitrary SQL;
* decide financial posting rules;
* bypass authorization.

---

# 72. APPLICATION SERVICE STANDARDS

Application services should:

* represent business use cases;
* coordinate domain operations;
* enforce transaction boundaries;
* invoke authorization where appropriate;
* invoke repositories;
* publish events;
* trigger audit;
* coordinate workflows.

---

# 73. DOMAIN SERVICE STANDARDS

Domain services should contain business logic that:

* does not naturally belong to one entity;
* requires multiple domain objects;
* represents a reusable business rule.

Do not put infrastructure operations into domain services.

---

# 74. REPOSITORY STANDARDS

Repositories are responsible for persistence operations.

They should not decide:

* whether a user has permission;
* whether an invoice can be posted;
* whether a stock transfer is valid.

Those decisions belong to application/domain layers.

---

# 75. DATABASE QUERY CODE

Queries must:

* be parameterized;
* be scoped;
* be readable;
* be efficient;
* avoid accidental full-table operations.

Do not concatenate user input into SQL.

---

# 76. TRANSACTION CODE

Transaction boundaries must be obvious.

Example:

```javascript
await database.transaction(async (transaction) => {
    await createSale(..., transaction);
    await reduceStock(..., transaction);
    await createPayment(..., transaction);
});
```

The exact implementation depends on the database library.

The architectural requirement is that related changes are atomic where required.

---

# 77. MONEY

Never use JavaScript floating-point arithmetic casually for financial values.

Bad:

```javascript
0.1 + 0.2
```

for authoritative accounting calculations.

Use precise numeric representations and database `NUMERIC`/decimal-compatible handling.

---

# 78. QUANTITIES

Inventory quantities may require decimal precision depending on unit of measure.

Examples:

* kilograms;
* liters;
* meters;
* fractional quantities.

Quantity precision must be defined by the business context.

---

# 79. CURRENCY

Currency must be explicit.

Avoid functions such as:

```javascript
calculateTotal(amount);
```

when currency context is relevant.

Prefer:

```javascript
calculateTotal({
    amount,
    currency
});
```

where appropriate.

---

# 80. DATE/TIME

Do not rely blindly on:

```javascript
new Date()
```

for business semantics without considering timezone.

Business dates, timestamps, fiscal dates, and user-local dates must be intentionally defined.

---

# 81. TIMEZONE

The system must distinguish:

* server timezone;
* organization timezone;
* user timezone;
* stored timestamp semantics.

Formatting and business calculation must not accidentally use different timezones.

---

# 82. PAGINATION

Large collections must not be loaded entirely by default.

API and database code should support appropriate pagination.

Preferred strategies depend on the query and scale:

* offset pagination;
* cursor pagination;
* keyset pagination.

---

# 83. FILTERING

Filtering should be validated and bounded.

Do not allow users to construct unrestricted database queries.

Filter capabilities must be explicitly defined.

---

# 84. SORTING

Sort fields must be allowlisted.

Do not directly insert user-provided column names into SQL.

Bad conceptual pattern:

```javascript
ORDER BY ${req.query.sort}
```

without validation.

---

# 85. SEARCH

Search input must be:

* validated;
* normalized where appropriate;
* parameterized;
* tenant-scoped;
* permission-scoped.

---

# 86. LOGGING CODE

Use structured logging.

Include useful context such as:

```text
requestId
organizationId
userId
module
action
entityId
```

when appropriate and safe.

Never log secrets.

---

# 87. SECURITY-SENSITIVE CODE

Security-sensitive code must favor explicit behavior over clever abstractions.

Examples:

* authentication;
* authorization;
* password handling;
* token validation;
* encryption;
* file validation;
* permission resolution.

These areas require tests and review.

---

# 88. PASSWORDS

Passwords must never be:

* logged;
* returned;
* stored in plaintext;
* placed in client state;
* included in audit payloads.

Use a strong password hashing mechanism appropriate to the platform.

---

# 89. TOKENS

Tokens and secrets must not be casually placed in:

* URLs;
* logs;
* browser local storage when inappropriate;
* error messages;
* database records without protection.

Token storage strategy must follow the authentication architecture.

---

# 90. API RESPONSE DESIGN

Responses should be predictable.

Conceptual success:

```json
{
  "success": true,
  "data": {}
}
```

Conceptual error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data.",
    "details": []
  }
}
```

The final response contract must follow the approved API specification.

---

# 91. API RESPONSE SECURITY

Do not return internal database objects directly.

Map database records into controlled API representations.

This prevents accidental exposure of internal fields.

---

# 92. PAGINATED RESPONSE

A paginated response should contain enough metadata for the client to understand the result.

Conceptually:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 1200
  }
}
```

Cursor-based APIs may use a different structure.

---

# 93. API VERSIONING

Current API version:

```text
/api/v1
```

Breaking changes must not silently change the meaning of an existing API.

---

# 94. IDEMPOTENCY CODE

Operations requiring idempotency should accept or derive a controlled operation identifier.

Examples:

* payment;
* webhook;
* offline push;
* import;
* external synchronization.

Duplicate requests must produce a controlled result.

---

# 95. CONCURRENCY CODE

Where records can be modified concurrently, use appropriate mechanisms such as:

* version number;
* `updated_at`;
* optimistic locking;
* database locks.

Do not silently overwrite another user's changes.

---

# 96. BACKGROUND JOB CODE

Jobs must:

* be retry-safe;
* record status;
* avoid duplicate side effects;
* log failures;
* expose meaningful job IDs;
* support controlled retry behavior.

---

# 97. RETRY RULES

Do not retry every error blindly.

Retry transient failures such as:

* temporary network failure;
* service timeout;
* temporary provider unavailability.

Do not automatically retry permanent validation or authorization failures.

---

# 98. INTEGRATION CODE

External API calls must use:

* timeout;
* retry policy;
* error classification;
* authentication;
* idempotency where appropriate;
* response validation;
* logging;
* monitoring.

Never assume an external provider will always respond correctly.

---

# 99. WEBHOOK CODE

Webhook processing must validate:

* signature;
* timestamp where supported;
* event type;
* payload;
* tenant/integration mapping.

Webhook handlers must be idempotent.

---

# 100. FILE UPLOAD CODE

File uploads must validate:

* size;
* type;
* MIME;
* extension;
* content where required;
* authorization;
* storage path.

Never trust a filename supplied by the client.

---

# 101. OFFLINE CODE

Offline logic must distinguish:

```text
local state
queued state
server-confirmed state
conflict state
```

Do not treat all four as equivalent.

---

# 102. SYNC CODE

Synchronization code must support:

* operation IDs;
* dependency ordering;
* retries;
* conflict detection;
* server versioning;
* acknowledgements;
* failure states.

---

# 103. CONFLICT HANDLING

Conflicts must be explicit.

Do not silently overwrite server data.

Examples of conflict outcomes:

```text
auto-resolved
server-wins
client-wins
manual-resolution-required
blocked
```

The correct policy depends on the data domain.

Financial and inventory conflicts require strict handling.

---

# 104. AI TOOL CODE

AI tools must be explicit allowlisted functions.

Example:

```javascript
const allowedTools = {
    searchCustomers,
    getInventoryAvailability,
    getSalesSummary
};
```

Do not allow arbitrary function execution based on model output.

---

# 105. AI OUTPUT VALIDATION

AI output must be treated as untrusted.

Validate AI-generated:

* IDs;
* filters;
* actions;
* parameters;
* structured data;
* proposed business operations.

AI output must not directly become database commands.

---

# 106. REPORT QUERY CODE

Reports must use approved query builders/services.

Do not expose arbitrary SQL execution through the reporting UI.

---

# 107. TEST CODE STANDARDS

Tests must be readable like production code.

A test should communicate:

```text
Given
When
Then
```

Example:

```javascript
it("prevents a sale when available stock is insufficient", async () => {
    // Given
    // When
    // Then
});
```

---

# 108. TEST NAMING

Test names should describe behavior.

Good:

```text
prevents unauthorized cross-organization access
```

Bad:

```text
test1
works
should pass
```

---

# 109. TEST ISOLATION

Tests must not depend on:

* execution order;
* developer machine state;
* previous test data;
* external services unless explicitly integration-tested.

---

# 110. MOCKING

Mock external boundaries when appropriate.

Do not mock everything.

Over-mocking can cause tests to pass while real integration fails.

Critical paths should have real integration tests.

---

# 111. ASSERTIONS

Tests should verify meaningful behavior.

Do not write tests that only verify that a function was called.

Prefer verifying:

* resulting state;
* business rules;
* database effects;
* API behavior;
* authorization.

---

# 112. SECURITY TESTING IN CODE REVIEW

For every protected endpoint, verify:

```text
Authentication
Authorization
Tenant Scope
Record Scope
Field Scope
Workflow Authority
```

where applicable.

---

# 113. PERFORMANCE TESTING

Performance-sensitive code should be measured rather than optimized based solely on assumptions.

Examples:

* large table rendering;
* report generation;
* search;
* inventory queries;
* synchronization;
* bulk imports.

---

# 114. DATABASE PERFORMANCE

Developers should understand the query being generated.

Avoid:

* N+1 queries;
* unnecessary joins;
* unbounded queries;
* missing indexes;
* repeated identical queries.

---

# 115. FRONTEND PERFORMANCE

Avoid:

* unnecessary re-renders;
* large initial bundles;
* loading all module data at startup;
* rendering massive tables;
* duplicate requests.

Use lazy loading and code splitting where appropriate.

---

# 116. NETWORK PERFORMANCE

API requests should avoid returning excessive data.

Use:

* pagination;
* field selection where appropriate;
* compressed responses;
* caching;
* incremental loading.

---

# 117. ACCESSIBILITY CODE REVIEW

Review interactive features for:

* keyboard access;
* focus;
* labels;
* semantic HTML;
* screen readers;
* error messaging;
* contrast;
* reduced motion.

---

# 118. INTERNATIONALIZATION

User-facing text should not be scattered in ways that prevent future localization.

Avoid embedding language-specific business logic into calculations.

---

# 119. USER-FACING STRINGS

Where the platform uses a localization system, user-facing text should use the approved translation mechanism.

Do not duplicate slightly different messages for the same meaning.

---

# 120. NO BUSINESS RULES IN TRANSLATIONS

Translation files must contain text, not logic.

Bad:

```text
if balance > 0 then ...
```

Business decisions belong in application logic.

---

# 121. CONFIGURATION CODE

Configuration should be:

* explicit;
* validated;
* environment-aware;
* documented.

Do not silently fall back to insecure values.

---

# 122. ENVIRONMENT VARIABLES

Environment variables should be parsed and validated at application startup.

If a required production variable is missing, fail clearly rather than silently using an unsafe default.

---

# 123. FEATURE FLAGS IN CODE

Feature flags should use a centralized mechanism.

Avoid scattered:

```javascript
if (true) {
```

or undocumented environment checks.

---

# 124. DEPRECATION

Deprecated code should be clearly identified and have a removal plan.

Do not keep obsolete APIs indefinitely.

---

# 125. SECURITY PATCHES

Dependency or security updates must be reviewed for:

* breaking changes;
* migration impact;
* vulnerabilities;
* compatibility.

Security patches should not be postponed without documented justification.

---

# 126. CODE REVIEW CHECKLIST

Reviewers should ask:

### Correctness

* Does the code satisfy the requirement?
* Are edge cases handled?

### Architecture

* Is the code in the correct module/layer?
* Are dependencies appropriate?

### Security

* Is authorization enforced?
* Is tenant isolation preserved?
* Is sensitive data protected?

### Data

* Are transactions and constraints correct?
* Is concurrency handled?

### Maintainability

* Is the code readable?
* Is duplication controlled?

### Performance

* Are queries and rendering efficient?

### UX

* Are loading/error/empty/offline states handled?

### Testing

* Are meaningful tests included?

---

# 127. CODE REVIEW BLOCKERS

A change should not be approved when it contains:

* known security bypass;
* tenant isolation vulnerability;
* financial integrity issue;
* inventory integrity issue;
* unvalidated privileged operation;
* destructive migration without safety;
* hardcoded secrets;
* arbitrary SQL execution;
* direct AI database access;
* missing critical authorization;
* knowingly broken tests.

---

# 128. FORMATTING AND LINTING

The project should use automated formatting and linting.

The exact tooling may be selected during implementation, but it must enforce:

* syntax correctness;
* unused imports;
* common JavaScript errors;
* consistent formatting;
* problematic patterns.

Developers should not manually debate formatting in code reviews.

---

# 129. AUTOMATED QUALITY GATES

CI should automatically check applicable code for:

```text
Lint
Format
Unit tests
Integration tests
Build
Security checks
Dependency checks
Migration validation
```

Additional checks may be required for sensitive modules.

---

# 130. COMMIT QUALITY

Commits should represent meaningful changes.

Good conceptual examples:

```text
Add stock transfer approval workflow
Implement customer account balance query
Add inventory synchronization conflict handling
```

Avoid:

```text
changes
update
fix stuff
asdf
final
final2
```

---

# 131. REFACTORING WITHOUT BEHAVIOR CHANGE

When a change is purely refactoring, tests should demonstrate that behavior remains unchanged.

Do not combine large refactors with unrelated feature changes unless necessary.

---

# 132. SECURITY OVER CONVENIENCE

If a coding shortcut weakens security, the shortcut is prohibited.

Examples:

```text
Skip authorization
Trust client price
Trust client organization
Trust AI output
Trust uploaded file
Trust webhook payload
Trust offline state
```

None are acceptable.

---

# 133. DATA INTEGRITY OVER CONVENIENCE

If a shortcut can corrupt financial or inventory state, it is prohibited.

The system must prefer:

```text
Safe failure
```

over:

```text
Incorrect success
```

---

# 134. FAIL CLOSED

Security-sensitive systems should fail closed.

For example:

```text
Unknown permission
→ deny

Unknown organization context
→ deny

Invalid signature
→ reject

Unknown workflow state
→ reject
```

---

# 135. FAIL SAFE

Business-critical operations should fail in a way that preserves data integrity.

If a transaction cannot safely complete:

```text
Do not partially complete it.
```

---

# 136. NO SILENT DATA LOSS

Never silently discard:

* user input;
* queued operations;
* failed imports;
* synchronization conflicts;
* integration responses;
* transaction failures.

Users and operators must be able to recover where appropriate.

---

# 137. MAINTAINABILITY RULE

Code should be understandable by another developer six months later.

Avoid implementation choices that only the original developer understands.

---

# 138. DOCUMENT UNUSUAL DECISIONS

If a business or architectural decision is unusual, document why it exists.

This is especially important for:

* financial calculations;
* stock valuation;
* synchronization conflict resolution;
* workflow rules;
* security exceptions;
* integration workarounds.

---

# 139. FINAL CODING STANDARD

All code must satisfy the following principle:

```text
Readable
+
Modular
+
Secure
+
Validated
+
Tested
+
Auditable
+
Performant
+
Maintainable
```

---

# 140. FINAL RULE SUMMARY

The following rules are mandatory:

```text
1. JavaScript only.

2. React/Next.js/custom CSS only according to the approved stack.

3. No TypeScript.

4. No Tailwind CSS.

5. Business logic belongs in the appropriate application/domain layer.

6. Controllers remain thin.

7. Database access remains isolated.

8. Never trust client-provided authorization or business values.

9. Server-side authorization is mandatory.

10. Tenant isolation is mandatory.

11. Financial and inventory operations require controlled integrity.

12. Use transactions where business consistency requires them.

13. Use idempotency for retryable operations.

14. Handle concurrency explicitly.

15. Avoid duplicate business logic.

16. Avoid giant components and functions.

17. Use reusable components where reuse is genuine.

18. API calls belong in controlled services.

19. UI permission handling does not replace backend authorization.

20. Offline state must distinguish local, queued, synchronized, and conflict states.

21. AI output is untrusted and must pass through controlled tools.

22. External integrations must be isolated behind adapters.

23. Secrets must never be committed or logged.

24. Errors must be handled intentionally.

25. Tests must verify behavior, not merely execution.

26. Accessibility is part of implementation quality.

27. Performance must be considered for large datasets.

28. Code must remain understandable and maintainable.

29. Security and data integrity take priority over convenience.

30. No feature is considered complete without appropriate testing and review.
```

---

# 141. FINAL PRINCIPLE

The platform's codebase must communicate its architecture through its implementation.

A developer reading the code should be able to determine:

```text
What does this code do?
Who owns it?
Which module does it belong to?
Which layer is responsible?
What data does it affect?
What permissions are required?
What business rules apply?
What happens if it fails?
How is it tested?
```

If those answers are difficult to determine, the code should be reconsidered before the feature grows further.

**These coding standards are mandatory for all new development and should be progressively applied when existing code is modified.**
