# FOLDER STRUCTURE

## Professional ERP & Business Management Platform

**Document:** `development/02-folder-structure.md`
**Status:** Development Standard
**Version:** 1.0
**Purpose:** Define the canonical project folder structure, directory responsibilities, module boundaries, naming conventions, and dependency rules.

---

# 1. DOCUMENT PURPOSE

This document defines the canonical source-code organization for the platform.

The folder structure must make the architecture visible in the codebase.

The structure must support:

* modular development;
* multi-organization architecture;
* domain separation;
* frontend/backend separation;
* reusable components;
* API boundaries;
* business services;
* database access;
* workflows;
* permissions;
* offline functionality;
* integrations;
* AI;
* reporting;
* testing;
* deployment;
* future extensibility.

The structure is designed for a **modular monolith first**.

It must not force the platform into microservices prematurely.

---

# 2. STRUCTURAL PRINCIPLES

The folder structure follows these principles:

1. Features belong to modules.
2. Shared infrastructure belongs to shared infrastructure.
3. UI components must not own business rules.
4. Controllers must not own domain logic.
5. Database access must remain isolated.
6. Security must be centralized and reusable.
7. Cross-module dependencies must be intentional.
8. Tests should mirror the code they test.
9. Configuration must be separated from application logic.
10. Documentation must remain separate from runtime source code.
11. Future service extraction must remain possible.
12. No `misc`, `random`, or uncontrolled catch-all architecture.

---

# 3. CANONICAL REPOSITORY STRUCTURE

The recommended root structure is:

```text
erp-platform/
│
├── client/
├── server/
├── shared/
├── tests/
├── scripts/
├── config/
├── docs/
├── database/
├── public/
├── .github/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── ...
```

The exact root directory name is project-name dependent.

---

# 4. CLIENT

The `client/` directory contains the frontend application.

It is responsible for:

* UI;
* navigation;
* presentation;
* client-side state;
* forms;
* user interaction;
* frontend validation;
* API consumption;
* offline client behavior;
* responsive layouts;
* accessibility;
* theme handling.

It must not contain:

* direct database access;
* server secrets;
* unrestricted SQL;
* authoritative financial rules;
* authoritative inventory rules;
* server-side authorization logic.

---

# 5. CLIENT STRUCTURE

Recommended structure:

```text
client/
├── public/
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── modules/
│   ├── navigation/
│   ├── pages/
│   ├── permissions/
│   ├── routes/
│   ├── services/
│   ├── state/
│   ├── styles/
│   ├── utils/
│   ├── validators/
│   ├── offline/
│   └── main.jsx
│
├── package.json
└── ...
```

---

# 6. CLIENT `app/`

The `app/` directory contains application-level initialization and framework-specific application structure.

Responsibilities may include:

* application bootstrap;
* root providers;
* global initialization;
* framework entry points;
* application metadata;
* global error boundaries.

It must not become a general-purpose dumping ground.

---

# 7. CLIENT `assets/`

Contains frontend assets such as:

```text
assets/
├── icons/
├── images/
├── illustrations/
├── fonts/
└── static/
```

Assets must be organized by purpose.

Do not place business documents or user-uploaded files here.

User files belong to the file/storage subsystem.

---

# 8. CLIENT `components/`

Contains globally reusable UI components.

Example:

```text
components/
├── common/
├── data-display/
├── data-entry/
├── feedback/
├── navigation/
├── overlays/
├── forms/
├── tables/
├── charts/
├── files/
└── security/
```

Examples:

```text
DataTable
FilterBar
SearchBar
FormField
Modal
Drawer
ConfirmationDialog
StatusBadge
Timeline
MetricCard
FileUploader
FilePreview
NotificationCenter
CommandPalette
PermissionGate
```

---

# 9. SHARED VS MODULE COMPONENTS

A component belongs in `components/` only when it is genuinely reusable across multiple modules.

For example:

```text
client/src/components/data-display/DataTable/
```

is appropriate.

But:

```text
client/src/modules/inventory/components/StockMovementTable/
```

belongs to Inventory if its behavior is specific to inventory.

Do not put every component into the global components directory.

---

# 10. CLIENT `config/`

Contains frontend configuration that is safe to expose to the client.

Examples:

```text
config/
├── app.config.js
├── environment.js
├── featureFlags.js
├── routes.config.js
└── ui.config.js
```

Never place secrets here.

---

# 11. CLIENT `contexts/`

Contains React context providers used for application-level concerns.

Examples:

```text
contexts/
├── AuthContext.jsx
├── OrganizationContext.jsx
├── ThemeContext.jsx
├── NotificationContext.jsx
├── OfflineContext.jsx
└── PreferencesContext.jsx
```

Contexts must not become replacements for proper domain architecture.

Do not store all application state inside contexts.

---

# 12. CLIENT `hooks/`

Contains reusable React hooks.

Examples:

```text
hooks/
├── useAuth.js
├── usePermissions.js
├── useOrganization.js
├── useDebounce.js
├── usePagination.js
├── useMediaQuery.js
├── useOfflineStatus.js
└── useNotifications.js
```

Hooks should have focused responsibilities.

Do not create hooks containing unrelated business logic.

---

# 13. CLIENT `layouts/`

Contains application layout structures.

Example:

```text
layouts/
├── AppLayout/
├── AuthLayout/
├── AdminLayout/
├── WorkspaceLayout/
├── ModuleLayout/
└── MobileLayout/
```

Layouts may control:

* sidebar;
* header;
* navigation;
* breadcrumbs;
* page container;
* command center;
* notification center.

Layouts should not contain module-specific business logic.

---

# 14. CLIENT `modules/`

This is the primary location for module-specific frontend functionality.

Recommended structure:

```text
modules/
├── organization/
├── users/
├── products/
├── inventory/
├── warehouses/
├── sales/
├── pos/
├── crm/
├── purchasing/
├── suppliers/
├── accounting/
├── receivables/
├── payables/
├── banking/
├── expenses/
├── budgeting/
├── taxation/
├── hr/
├── employees/
├── attendance/
├── payroll/
├── manufacturing/
├── bom/
├── production/
├── quality/
├── supply-chain/
├── logistics/
├── fleet/
├── assets/
├── maintenance/
├── projects/
├── contracts/
├── services/
├── help-desk/
├── appointments/
├── documents/
├── workflows/
├── marketing/
├── commerce/
├── reporting/
├── notifications/
├── integrations/
├── ai/
├── administration/
├── customization/
├── audit/
└── command-center/
```

The names must align with the approved module specification.

---

# 15. MODULE FRONTEND STRUCTURE

Each module should use a consistent structure.

Example:

```text
modules/inventory/
├── components/
├── pages/
├── forms/
├── tables/
├── dialogs/
├── hooks/
├── services/
├── state/
├── validators/
├── constants/
├── permissions/
├── routes.js
├── navigation.js
└── index.js
```

Not every module needs every directory.

Only create directories that have actual responsibility.

---

# 16. MODULE `pages/`

Contains module-level pages/screens.

Examples:

```text
inventory/pages/
├── InventoryDashboard.jsx
├── StockOverview.jsx
├── StockMovements.jsx
├── StockTransfers.jsx
├── StockAdjustments.jsx
└── StockCounts.jsx
```

Pages orchestrate UI components.

Pages should not become the location for complex business rules.

---

# 17. MODULE `components/`

Contains components specific to the module.

Example:

```text
inventory/components/
├── StockSummary/
├── StockStatus/
├── StockMovementTimeline/
├── WarehouseSelector/
├── InventoryFilters/
└── StockAvailability/
```

If a component becomes useful across many modules, consider moving it into shared components.

---

# 18. MODULE `forms/`

Contains module-specific forms.

Example:

```text
inventory/forms/
├── StockAdjustmentForm/
├── StockTransferForm/
├── StockCountForm/
└── WarehouseAssignmentForm/
```

Forms should use centralized validation and API services.

---

# 19. MODULE `tables/`

Contains module-specific table configurations and specialized table components.

Example:

```text
inventory/tables/
├── InventoryTable/
├── StockMovementTable/
├── TransferTable/
└── StockCountTable/
```

Generic table infrastructure remains in shared components.

---

# 20. MODULE `dialogs/`

Contains module-specific dialogs.

Examples:

```text
dialogs/
├── ConfirmStockAdjustment/
├── TransferApproval/
├── StockMovementDetails/
└── ResolveInventoryConflict/
```

---

# 21. MODULE `services/`

Frontend module services should communicate with backend APIs.

Example:

```text
inventory/services/
├── inventoryApi.js
├── stockMovementApi.js
├── warehouseApi.js
└── stockTransferApi.js
```

They should not contain authoritative business logic.

---

# 22. MODULE `state/`

Contains module-specific client state.

Examples:

```text
inventory/state/
├── inventoryStore.js
├── inventorySelectors.js
└── inventoryActions.js
```

Do not duplicate server state unnecessarily.

---

# 23. MODULE `validators/`

Contains client-side validation schemas where useful.

Server-side validation remains authoritative.

Example:

```text
inventory/validators/
├── stockAdjustmentValidator.js
├── stockTransferValidator.js
└── stockCountValidator.js
```

---

# 24. MODULE `permissions/`

Contains frontend permission mappings.

Example:

```text
inventory/permissions/
└── inventoryPermissions.js
```

This is for UI behavior.

It does not replace backend authorization.

---

# 25. MODULE `navigation.js`

Defines module navigation.

Example:

```text
inventory/navigation.js
```

may define:

* Inventory Overview;
* Stock;
* Movements;
* Transfers;
* Counts;
* Adjustments.

Navigation must remain permission-aware.

---

# 26. MODULE `routes.js`

Defines frontend routes owned by the module.

Example:

```text
inventory/routes.js
```

Routes should use application-level authentication and authorization mechanisms.

---

# 27. CLIENT `navigation/`

Contains application-wide navigation architecture.

Example:

```text
navigation/
├── primaryNavigation.js
├── moduleNavigation.js
├── commandRegistry.js
├── breadcrumbs.js
└── navigationGuards.js
```

Module-specific navigation remains inside modules.

---

# 28. CLIENT `pages/`

Global pages that are not owned by a business module may live here.

Examples:

```text
pages/
├── Login/
├── NotFound/
├── Unauthorized/
├── ServerError/
├── Offline/
├── Settings/
└── SystemHealth/
```

Business module pages should generally remain inside their modules.

---

# 29. CLIENT `permissions/`

Contains shared permission utilities.

Example:

```text
permissions/
├── permissionConstants.js
├── permissionResolver.js
├── scopeResolver.js
├── permissionHelpers.js
└── permissionTypes.js
```

These support UI behavior only.

Authoritative permission enforcement remains on the server.

---

# 30. CLIENT `routes/`

Contains global route configuration.

Example:

```text
routes/
├── publicRoutes.js
├── protectedRoutes.js
├── adminRoutes.js
├── routeRegistry.js
└── routeGuards.js
```

Module routes should be registered here rather than duplicated.

---

# 31. CLIENT `services/`

Contains shared client-side services.

Examples:

```text
services/
├── apiClient.js
├── authService.js
├── fileService.js
├── notificationService.js
├── searchService.js
├── exportService.js
└── telemetryService.js
```

Module-specific API logic should remain inside modules.

---

# 32. CLIENT `state/`

Contains only genuinely global state.

Examples:

```text
state/
├── auth/
├── session/
├── organization/
├── preferences/
├── notifications/
└── application/
```

Avoid putting every module's state here.

---

# 33. CLIENT `styles/`

Contains the centralized styling system.

Recommended:

```text
styles/
├── tokens/
├── themes/
├── globals/
├── components/
├── layouts/
├── utilities/
├── responsive/
└── motion/
```

The design system must remain centralized.

---

# 34. DESIGN TOKENS

Example:

```text
styles/tokens/
├── colors.css
├── typography.css
├── spacing.css
├── radius.css
├── shadows.css
├── breakpoints.css
└── motion.css
```

Themes should consume tokens rather than redefining the application architecture.

---

# 35. CLIENT `utils/`

Contains small reusable utilities.

Examples:

```text
utils/
├── date.js
├── currency.js
├── number.js
├── formatting.js
├── validation.js
├── url.js
└── object.js
```

Utilities must remain focused.

Do not put business workflows into `utils/`.

---

# 36. CLIENT `validators/`

Contains reusable generic validation helpers.

Examples:

```text
validators/
├── commonValidators.js
├── dateValidators.js
├── numericValidators.js
└── fileValidators.js
```

Domain-specific validators should remain inside the appropriate module.

---

# 37. CLIENT `offline/`

Contains frontend offline infrastructure.

Recommended:

```text
offline/
├── serviceWorker/
├── indexedDb/
├── cache/
├── outbox/
├── sync/
├── conflicts/
├── connectivity/
├── encryption/
└── offlineState/
```

This subsystem must be treated as infrastructure rather than scattered across modules.

---

# 38. SERVER

The `server/` directory contains backend application code.

Recommended:

```text
server/
├── src/
│   ├── config/
│   ├── api/
│   ├── application/
│   ├── auth/
│   ├── authorization/
│   ├── domain/
│   ├── modules/
│   ├── repositories/
│   ├── services/
│   ├── workflows/
│   ├── events/
│   ├── jobs/
│   ├── integrations/
│   ├── offline/
│   ├── files/
│   ├── reporting/
│   ├── ai/
│   ├── audit/
│   ├── database/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── package.json
└── ...
```

---

# 39. SERVER `config/`

Contains backend configuration.

Example:

```text
config/
├── environment.js
├── database.js
├── auth.js
├── storage.js
├── queue.js
├── integrations.js
└── featureFlags.js
```

Secrets should come from secure environment/configuration mechanisms.

---

# 40. SERVER `api/`

Contains HTTP API implementation.

Recommended:

```text
api/
├── routes/
├── controllers/
├── validators/
├── serializers/
├── responses/
└── documentation/
```

API infrastructure should not contain domain logic.

---

# 41. SERVER `api/routes/`

Routes define:

* HTTP method;
* endpoint;
* middleware;
* controller.

Routes must remain thin.

Example:

```text
routes/
├── auth.routes.js
├── organizations.routes.js
├── inventory.routes.js
├── sales.routes.js
└── accounting.routes.js
```

---

# 42. SERVER `api/controllers/`

Controllers translate HTTP requests into application operations.

Controllers may handle:

* request extraction;
* validation invocation;
* application service invocation;
* response formatting.

Controllers should not contain complex business rules.

---

# 43. SERVER `api/validators/`

Contains request validation.

Example:

```text
validators/
├── auth/
├── organization/
├── inventory/
├── sales/
├── accounting/
└── common/
```

Validation should happen before business operations are executed.

---

# 44. SERVER `api/serializers/`

Responsible for controlled API output.

Serializers prevent accidental exposure of:

* internal database fields;
* secrets;
* private metadata;
* unauthorized fields.

---

# 45. SERVER `application/`

Contains application-level orchestration.

Example:

```text
application/
├── commands/
├── queries/
├── services/
├── transactions/
└── policies/
```

Application services coordinate domain behavior.

---

# 46. COMMANDS AND QUERIES

Where useful, separate:

```text
Command
→ changes state

Query
→ retrieves data
```

Example:

```text
CompleteSaleCommand
StockTransferCommand
ApprovePurchaseCommand
```

and:

```text
GetInventoryQuery
GetCustomerBalanceQuery
GetSalesDashboardQuery
```

Do not force formal CQRS everywhere.

Use the separation where it improves clarity and scale.

---

# 47. SERVER `auth/`

Contains authentication infrastructure.

Example:

```text
auth/
├── login/
├── registration/
├── sessions/
├── password/
├── mfa/
├── tokens/
├── recovery/
└── identity.js
```

---

# 48. SERVER `authorization/`

Contains authorization infrastructure.

Recommended:

```text
authorization/
├── permissions/
├── roles/
├── scopes/
├── policies/
├── accessChecks/
├── ownership/
└── permissionResolver.js
```

This layer must support the platform's granular access model.

---

# 49. SERVER `domain/`

Contains genuinely shared domain concepts that are not owned by one module.

Examples may include:

```text
domain/
├── valueObjects/
├── errors/
├── events/
├── money/
├── quantities/
├── identifiers/
└── sharedRules/
```

Do not turn `domain/` into another generic dumping ground.

Module-specific domain logic belongs to the module.

---

# 50. SERVER `modules/`

This is the primary backend business module directory.

Example:

```text
modules/
├── organization/
├── users/
├── products/
├── inventory/
├── warehouses/
├── sales/
├── pos/
├── crm/
├── purchasing/
├── suppliers/
├── accounting/
├── receivables/
├── payables/
├── banking/
├── expenses/
├── budgeting/
├── taxation/
├── hr/
├── employees/
├── attendance/
├── payroll/
├── manufacturing/
├── bom/
├── production/
├── quality/
├── supply-chain/
├── logistics/
├── fleet/
├── assets/
├── maintenance/
├── projects/
├── contracts/
├── services/
├── help-desk/
├── appointments/
├── documents/
├── workflows/
├── marketing/
├── commerce/
├── reporting/
├── notifications/
├── integrations/
├── ai/
├── administration/
├── customization/
├── audit/
└── command-center/
```

---

# 51. BACKEND MODULE STRUCTURE

Each module should follow a consistent internal structure where applicable.

Example:

```text
modules/inventory/
├── domain/
│   ├── entities/
│   ├── valueObjects/
│   ├── rules/
│   └── events/
│
├── application/
│   ├── commands/
│   ├── queries/
│   └── services/
│
├── infrastructure/
│   ├── repositories/
│   └── mappers/
│
├── api/
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── serializers/
│
├── permissions/
├── workflows/
├── jobs/
├── integrations/
├── constants/
└── index.js
```

Not every module requires every directory.

---

# 52. MODULE DOMAIN

Contains business concepts owned by the module.

Examples:

```text
inventory/domain/
├── entities/
├── valueObjects/
├── rules/
└── events/
```

This is where module-specific invariants should live.

---

# 53. MODULE APPLICATION

Contains use cases.

Examples:

```text
inventory/application/
├── commands/
│   ├── receiveStock.js
│   ├── transferStock.js
│   └── adjustStock.js
│
├── queries/
│   ├── getStock.js
│   └── getStockMovements.js
│
└── services/
```

---

# 54. MODULE INFRASTRUCTURE

Contains implementation details such as:

* database repositories;
* persistence mappings;
* external providers.

Example:

```text
inventory/infrastructure/
├── repositories/
├── mappers/
└── persistence/
```

Business rules should not depend directly on infrastructure details.

---

# 55. MODULE API

A module may own its API definitions.

Example:

```text
inventory/api/
├── controllers/
├── routes/
├── validators/
└── serializers/
```

These are registered with the global API.

---

# 56. MODULE PERMISSIONS

Each module may define its permission catalogue.

Example:

```text
inventory/permissions/
├── inventory.permissions.js
└── inventory.scopes.js
```

Example conceptual permissions:

```text
inventory.view
inventory.create
inventory.edit
inventory.adjust
inventory.transfer
inventory.approve
inventory.export
inventory.configure
```

Actual permissions must align with the approved authorization specification.

---

# 57. MODULE WORKFLOWS

Workflow definitions owned by a module should remain close to the module.

Example:

```text
inventory/workflows/
├── stockAdjustment.workflow.js
├── stockTransfer.workflow.js
└── stockCount.workflow.js
```

The central workflow engine executes them.

---

# 58. SERVER `repositories/`

Contains shared repository infrastructure and abstractions where appropriate.

However, repositories should generally be owned by modules when their data access is module-specific.

Avoid a giant:

```text
repositories/
└── everythingRepository.js
```

---

# 59. SERVER `services/`

Contains shared application infrastructure that is not domain-owned by a specific module.

Examples:

```text
services/
├── email/
├── storage/
├── cache/
├── encryption/
├── hashing/
├── search/
└── scheduling/
```

Domain-specific services belong inside their modules.

---

# 60. SERVER `workflows/`

Contains the centralized workflow engine.

Recommended:

```text
workflows/
├── engine/
├── definitions/
├── runtime/
├── approvals/
├── assignments/
├── escalation/
├── delegation/
├── conditions/
├── actions/
├── versioning/
└── audit/
```

Module-specific workflow definitions may remain in modules.

---

# 61. SERVER `events/`

Contains event infrastructure.

Recommended:

```text
events/
├── bus/
├── publishers/
├── subscribers/
├── handlers/
├── registry/
└── contracts/
```

Events must remain tenant-aware.

---

# 62. SERVER `jobs/`

Contains background job infrastructure.

Recommended:

```text
jobs/
├── queue/
├── workers/
├── schedulers/
├── retries/
├── deadLetter/
└── definitions/
```

Module-specific jobs may live inside modules.

---

# 63. SERVER `integrations/`

Contains integration infrastructure.

Recommended:

```text
integrations/
├── core/
├── providers/
├── authentication/
├── mappings/
├── webhooks/
├── synchronization/
├── reconciliation/
└── monitoring/
```

Provider-specific implementation must remain isolated.

---

# 64. SERVER `offline/`

Contains server-side synchronization infrastructure.

Recommended:

```text
offline/
├── bootstrap/
├── changes/
├── push/
├── acknowledge/
├── conflicts/
├── cursors/
├── devices/
└── synchronization/
```

This must coordinate with the frontend offline subsystem.

---

# 65. SERVER `files/`

Contains file-management infrastructure.

Recommended:

```text
files/
├── upload/
├── download/
├── storage/
├── validation/
├── permissions/
├── thumbnails/
├── scanning/
└── metadata/
```

Actual storage may be:

* local;
* object storage;
* enterprise storage;
* provider-backed storage.

---

# 66. SERVER `reporting/`

Contains reporting infrastructure.

Recommended:

```text
reporting/
├── definitions/
├── queries/
├── builders/
├── exports/
├── scheduling/
├── datasets/
├── dashboards/
├── caching/
└── permissions/
```

Reports must not bypass authorization.

---

# 67. SERVER `ai/`

Contains AI infrastructure.

Recommended:

```text
ai/
├── providers/
├── models/
├── prompts/
├── tools/
├── agents/
├── retrieval/
├── embeddings/
├── safety/
├── evaluation/
├── usage/
└── audit/
```

AI must interact with business functionality through approved application tools.

---

# 68. SERVER `audit/`

Contains audit infrastructure.

Recommended:

```text
audit/
├── recording/
├── querying/
├── retention/
├── integrity/
└── exports/
```

Audit data must remain protected.

---

# 69. SERVER `database/`

Contains database infrastructure.

Recommended:

```text
database/
├── migrations/
├── seeds/
├── fixtures/
├── connection/
├── transactions/
├── queries/
├── indexes/
└── maintenance/
```

Database migrations must be version-controlled.

---

# 70. SERVER `middleware/`

Contains cross-cutting HTTP middleware.

Examples:

```text
middleware/
├── authentication.js
├── authorization.js
├── tenantContext.js
├── validation.js
├── rateLimit.js
├── errorHandler.js
├── requestId.js
├── logging.js
├── securityHeaders.js
└── csrf.js
```

Middleware should remain focused.

---

# 71. SERVER `utils/`

Contains small generic infrastructure utilities.

Examples:

```text
utils/
├── dates.js
├── numbers.js
├── strings.js
├── ids.js
├── collections.js
└── errors.js
```

Business logic must not be hidden in generic utilities.

---

# 72. SHARED DIRECTORY

The `shared/` directory contains carefully controlled code that is safe and useful to share between client and server.

Example:

```text
shared/
├── constants/
├── contracts/
├── enums/
├── schemas/
├── permissions/
├── events/
├── types/
└── utils/
```

Only genuinely platform-neutral code belongs here.

---

# 73. SHARED CONTRACTS

Examples:

```text
shared/contracts/
├── api/
├── events/
├── sync/
└── integrations/
```

Shared contracts may define:

* API shapes;
* event structures;
* synchronization contracts;
* common validation schemas.

Do not move server-only business logic into `shared/`.

---

# 74. SHARED ENUMS

Shared enumerations may include:

* status values;
* operation states;
* synchronization states;
* supported categories.

But domain-specific enums should remain owned by the appropriate module.

---

# 75. SHARED SCHEMAS

Schemas shared by client and server may be used for consistent validation and contracts where technically appropriate.

The server remains authoritative.

---

# 76. TESTS

Testing must have a dedicated structure.

Recommended:

```text
tests/
├── unit/
├── integration/
├── api/
├── component/
├── e2e/
├── security/
├── authorization/
├── tenant-isolation/
├── workflow/
├── accounting/
├── inventory/
├── pos/
├── offline/
├── migration/
├── performance/
├── accessibility/
├── fixtures/
├── factories/
├── mocks/
└── helpers/
```

Tests may also live beside source files where the testing framework/project convention requires it.

The important rule is consistency.

---

# 77. TEST MIRRORING

Where practical, tests should mirror source structure.

Example:

```text
modules/inventory/application/commands/receiveStock.js
```

may have:

```text
tests/unit/inventory/application/commands/receiveStock.test.js
```

This makes ownership obvious.

---

# 78. SECURITY TESTS

Security tests must explicitly cover:

* unauthorized access;
* cross-tenant access;
* privilege escalation;
* object-level authorization;
* role restrictions;
* scope restrictions;
* sensitive field exposure;
* authentication failures;
* rate limiting;
* malicious input.

---

# 79. DATABASE TESTS

Database tests must verify:

* foreign keys;
* unique constraints;
* tenant isolation;
* transactions;
* concurrency;
* financial integrity;
* inventory integrity;
* migrations.

---

# 80. `scripts/`

Contains developer and operational scripts.

Example:

```text
scripts/
├── dev/
├── build/
├── database/
├── migrations/
├── testing/
├── lint/
├── formatting/
├── deployment/
├── backup/
└── maintenance/
```

Scripts must be documented and safe.

---

# 81. `config/`

Root-level configuration should contain non-secret project configuration.

Example:

```text
config/
├── environments/
├── build/
├── lint/
├── test/
└── deployment/
```

Secrets must not be committed.

---

# 82. `database/` ROOT DIRECTORY

The root `database/` directory may contain database-level project assets that are not tightly coupled to server runtime code.

Example:

```text
database/
├── schema/
├── migrations/
├── seeds/
├── reference-data/
└── documentation/
```

If the selected framework already centralizes migrations inside `server/database`, do not duplicate them.

There must be one authoritative migration location.

---

# 83. `docs/`

The documentation repository should contain the approved specification structure.

Example:

```text
docs/
├── 00-MASTER-INSTRUCTIONS.md
├── 01-PROJECT-VISION.md
├── 02-PRODUCT-REQUIREMENTS.md
├── 03-ARCHITECTURE.md
├── 04-TECH-STACK.md
├── 05-DESIGN-SYSTEM.md
├── 06-UI-UX-SPECIFICATION.md
├── 07-THEME-SYSTEM.md
├── 08-ANIMATION-MOTION.md
├── 09-AUTH-SECURITY.md
├── 10-MULTI-TENANCY.md
├── 11-CUSTOMIZATION-ENGINE.md
├── 12-WORKFLOW-APPROVAL-ENGINE.md
├── 13-DATA-MODEL.md
├── 14-API-SPECIFICATION.md
├── 15-OFFLINE-SYNC.md
├── 16-NOTIFICATIONS.md
├── 17-INTEGRATIONS.md
├── 18-AI-AUTOMATION.md
├── 19-REPORTING-BI.md
├── 20-TESTING-QA.md
├── 21-DEPLOYMENT-DEVOPS.md
├── 22-MOBILE-FUTURE.md
├── 23-MODULES-SPECIFICATION.md
├── 24-INDUSTRY-SPECIFICATION.md
├── 25-FEATURE-SPECIFICATION.md
│
└── development/
    ├── 01-development-rules.md
    ├── 02-folder-structure.md
    ├── 03-coding-standards.md
    ├── 04-component-rules.md
    ├── 05-database-rules.md
    ├── 06-api-rules.md
    ├── 07-security-rules.md
    ├── 08-testing-rules.md
    └── 09-feature-development-process.md
```

This documentation structure is the project development reference.

---

# 84. ROOT `.github/`

If GitHub is used, repository automation may be organized as:

```text
.github/
├── workflows/
├── ISSUE_TEMPLATE/
├── pull_request_template.md
└── CODEOWNERS
```

CI/CD workflows must not contain secrets directly.

---

# 85. PUBLIC DIRECTORY

The root `public/` directory is for truly static public assets where the selected frontend framework requires them.

Do not place:

* private documents;
* customer files;
* invoices;
* financial exports;
* user uploads

inside a public directory.

---

# 86. PACKAGE MANAGEMENT

The repository may use a root package manager configuration.

For example:

```text
package.json
```

must define approved scripts and workspace behavior if a monorepo/workspace structure is used.

Do not maintain unnecessary duplicate dependency definitions.

---

# 87. MODULE DEPENDENCY DIRECTION

The preferred dependency direction is:

```text
UI
 ↓
API Client
 ↓
Application API
 ↓
Application Services
 ↓
Domain
 ↓
Repositories
 ↓
Database
```

Infrastructure dependencies should point inward rather than forcing the domain to depend on infrastructure.

---

# 88. FRONTEND DEPENDENCY DIRECTION

Preferred:

```text
Page
 ↓
Module Components
 ↓
Shared Components
```

and:

```text
Page
 ↓
Module Service
 ↓
API Client
```

Do not allow:

```text
Shared Component
 ↓
Inventory Module
```

unless the shared component is intentionally designed as a generic abstraction.

---

# 89. MODULE-TO-MODULE DEPENDENCIES

Module dependencies must be explicit.

Example:

```text
Sales
 ↓
Products
 ↓
Inventory
```

but Sales should not directly import internal database repositories from Inventory.

Use:

* application services;
* public module APIs;
* domain events;
* shared contracts.

---

# 90. CROSS-MODULE TRANSACTIONS

Cross-module business operations should be coordinated by application services.

Example:

```text
Complete Sale
    ↓
Sales Service
    ├── Inventory Service
    ├── Receivables Service
    ├── Accounting Service
    └── Audit Service
```

Each participating service must preserve its own invariants.

---

# 91. CROSS-MODULE EVENTS

Use events where synchronous coupling is unnecessary.

Example:

```text
SaleCompleted
    ↓
Notification
Reporting
Customer Timeline
Analytics
```

Do not use events merely to hide required synchronous business operations.

---

# 92. FILE NAMING

Use descriptive names.

Examples:

```text
inventoryApi.js
stockMovementService.js
StockMovementTable.jsx
stockAdjustmentValidator.js
receiveStock.js
```

Avoid:

```text
data.js
thing.js
helper.js
stuff.js
common.js
misc.js
```

unless the scope is genuinely generic and obvious.

---

# 93. DIRECTORY NAMING

Use consistent directory naming.

Recommended:

```text
modules/
services/
components/
repositories/
controllers/
validators/
workflows/
integrations/
```

Do not randomly mix:

```text
Components/
components/
COMP/
ui/
UI/
```

---

# 94. FILE OWNERSHIP

Every file should have an obvious architectural owner.

A developer should be able to answer:

> Which layer and module owns this file?

If the answer is unclear, the structure should be reconsidered.

---

# 95. NO ROOT-LEVEL BUSINESS LOGIC

Do not place business logic directly in:

```text
src/
server/
root/
```

without a clear architectural purpose.

Root directories should primarily contain:

* configuration;
* entry points;
* project metadata;
* documentation;
* infrastructure.

---

# 96. INDEX FILES

`index.js` may be used for controlled module exports.

Do not create deep chains of re-export files that make dependencies difficult to understand.

Use barrel files only when they improve maintainability.

---

# 97. CIRCULAR IMPORT PREVENTION

Folder organization must help prevent circular imports.

If a dependency graph becomes:

```text
A → B → C → A
```

reconsider the abstraction.

Possible solutions:

* shared contract;
* domain event;
* application service;
* dependency inversion;
* extraction of a shared value object.

---

# 98. MODULE PUBLIC API

A module should expose only the functionality other modules actually need.

Conceptually:

```text
modules/inventory/index.js
```

may expose:

```text
receiveStock()
transferStock()
getAvailableStock()
reserveStock()
```

while keeping internal repository details private.

---

# 99. PRIVATE MODULE IMPLEMENTATION

Other modules must not directly import:

```text
modules/inventory/infrastructure/repositories/InternalInventoryRepository.js
```

unless explicitly designated as a shared infrastructure contract.

Internal implementation must remain private.

---

# 100. DEVELOPMENT-ONLY FOLDERS

Development tools may be placed under:

```text
scripts/
tests/
config/
```

Do not mix development tooling into production runtime modules.

---

# 101. GENERATED FILES

Generated files should not be manually edited when they can be regenerated.

Examples:

* generated API clients;
* generated documentation;
* generated build output;
* generated database artifacts.

Generated output should be clearly identified.

---

# 102. BUILD OUTPUT

Build artifacts must remain separate from source.

Typical examples:

```text
dist/
build/
.next/
coverage/
```

These should not be treated as source directories.

---

# 103. LOG FILES

Runtime logs should not be committed to source control.

Examples:

```text
logs/
*.log
```

must follow repository ignore rules.

Production log storage must be handled by deployment infrastructure.

---

# 104. TEMPORARY FILES

Temporary files must not become part of the repository.

Avoid permanent directories such as:

```text
temp/
tmp/
old/
backup-old/
new/
final/
final2/
```

for source management.

---

# 105. ARCHIVE RULE

Old implementations must not remain beside active implementations indefinitely.

Avoid:

```text
inventoryOld/
inventoryNew/
inventoryFinal/
inventoryFinal2/
```

Use version control and documented migration instead.

---

# 106. FUTURE SERVICE EXTRACTION

The folder structure must allow future extraction of modules into services if scale requires it.

A future extraction might transform:

```text
server/src/modules/inventory/
```

into:

```text
inventory-service/
```

without rewriting the business model from scratch.

This is one reason module boundaries are mandatory.

---

# 107. MICROSERVICE PREPARATION WITHOUT MICROSERVICE COMPLEXITY

The platform should prepare for service extraction without introducing:

* unnecessary network calls;
* distributed transactions;
* excessive infrastructure;
* service discovery complexity;
* deployment overhead.

Strong modularity is the priority.

---

# 108. MONOREPO VS MULTI-REPOSITORY

The recommended initial structure is compatible with a monorepo-style repository:

```text
erp-platform/
├── client/
├── server/
├── shared/
├── tests/
├── scripts/
└── docs/
```

Separate repositories may be introduced later if organizational or deployment requirements justify them.

---

# 109. TESTING STRUCTURE RULE

Testing structure must reflect ownership.

For example:

```text
Inventory
    ↓
Unit tests
Integration tests
API tests
E2E tests
Security tests
Offline tests
```

Testing must not become one enormous unrelated directory.

---

# 110. DOCUMENTATION STRUCTURE RULE

Documentation should be organized by purpose.

The major distinction is:

```text
Product Specification
Architecture
Development Standards
Implementation Documentation
Operational Documentation
```

Do not mix all documentation into one file.

---

# 111. IMPLEMENTATION DOCUMENTATION

Module implementation documentation may live near the module when appropriate.

Example:

```text
modules/inventory/
├── README.md
└── ...
```

This should explain implementation-specific details without replacing the main specification.

---

# 112. README RULE

Each major subsystem may have a README when useful.

A module README may contain:

* purpose;
* responsibilities;
* dependencies;
* entry points;
* important commands;
* testing;
* operational notes.

Do not duplicate the entire module specification.

---

# 113. CONFIGURATION VS CODE

If behavior is intentionally configurable, configuration should not be encoded as source-code modifications.

For example:

```text
Business Template
→ configuration

Approval threshold
→ configuration

Custom field
→ metadata

Workflow
→ workflow definition
```

rather than requiring developers to modify code for every customer-specific variation.

---

# 114. CUSTOM CODE EXTENSIONS

Some advanced customers may eventually require custom development.

Such extensions must be isolated from core platform code.

Potential structure:

```text
extensions/
├── organization/
├── industry/
├── integration/
└── custom/
```

Extensions must still respect:

* authorization;
* tenant isolation;
* audit;
* security;
* platform APIs.

---

# 115. NO UNCONTROLLED EXTENSIONS

Custom extensions must not directly modify core database structures or bypass core services without approved extension mechanisms.

---

# 116. ENVIRONMENT STRUCTURE

The project should distinguish:

```text
development
test
staging
production
```

Environment-specific behavior should come from configuration, not duplicated source code.

---

# 117. SOURCE CONTROL IGNORE RULES

The repository should ignore:

```text
node_modules/
dist/
build/
coverage/
.env
.env.*
logs/
temporary files
OS metadata
editor metadata
generated runtime artifacts
```

while keeping:

```text
.env.example
```

or equivalent safe configuration templates.

---

# 118. SECURITY OF FOLDER STRUCTURE

Folder organization must never be treated as a security mechanism.

For example:

```text
admin/
```

does not make a route secure.

Authorization must still be implemented.

---

# 119. DEPENDENCY REVIEW

When moving code between folders, verify its dependencies.

Moving a file without reviewing:

* imports;
* module ownership;
* permissions;
* routes;
* tests;
* configuration;
* documentation

can introduce architectural problems.

---

# 120. REFACTORING FOLDER STRUCTURE

Folder restructuring should be treated as an architectural change when it changes module boundaries.

Before restructuring:

```text
Identify ownership
 ↓
Map imports
 ↓
Map dependencies
 ↓
Move
 ↓
Update tests
 ↓
Run validation
```

---

# 121. FOLDER STRUCTURE COMPLETENESS CHECK

A new module should normally answer:

```text
Where are its pages?
Where are its components?
Where are its API calls?
Where are its validators?
Where are its permissions?
Where is its state?
Where are its backend use cases?
Where is its domain logic?
Where are its repositories?
Where are its routes?
Where are its workflows?
Where are its tests?
```

Not every module requires every category.

The purpose is architectural clarity.

---

# 122. CANONICAL HIGH-LEVEL STRUCTURE

The preferred complete structure is:

```text
erp-platform/
│
├── client/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── components/
│       ├── config/
│       ├── contexts/
│       ├── hooks/
│       ├── layouts/
│       ├── modules/
│       ├── navigation/
│       ├── pages/
│       ├── permissions/
│       ├── routes/
│       ├── services/
│       ├── state/
│       ├── styles/
│       ├── utils/
│       ├── validators/
│       ├── offline/
│       └── main.jsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── api/
│       ├── application/
│       ├── auth/
│       ├── authorization/
│       ├── domain/
│       ├── modules/
│       ├── repositories/
│       ├── services/
│       ├── workflows/
│       ├── events/
│       ├── jobs/
│       ├── integrations/
│       ├── offline/
│       ├── files/
│       ├── reporting/
│       ├── ai/
│       ├── audit/
│       ├── database/
│       ├── middleware/
│       └── utils/
│
├── shared/
│   ├── constants/
│   ├── contracts/
│   ├── enums/
│   ├── schemas/
│   ├── permissions/
│   ├── events/
│   └── utils/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── api/
│   ├── component/
│   ├── e2e/
│   ├── security/
│   ├── authorization/
│   ├── tenant-isolation/
│   ├── workflow/
│   ├── accounting/
│   ├── inventory/
│   ├── pos/
│   ├── offline/
│   ├── migration/
│   ├── performance/
│   ├── accessibility/
│   ├── fixtures/
│   ├── factories/
│   ├── mocks/
│   └── helpers/
│
├── scripts/
│   ├── dev/
│   ├── build/
│   ├── database/
│   ├── migrations/
│   ├── testing/
│   ├── deployment/
│   ├── backup/
│   └── maintenance/
│
├── config/
│   ├── environments/
│   ├── build/
│   ├── lint/
│   ├── test/
│   └── deployment/
│
├── database/
│   ├── schema/
│   ├── migrations/
│   ├── seeds/
│   ├── reference-data/
│   └── documentation/
│
├── docs/
│   ├── core specifications...
│   └── development/
│
├── .github/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# 123. STRUCTURE DECISION RULE

The folder structure is not an excuse to create directories for every theoretical future capability.

Create a directory when it has a real responsibility.

Prefer:

```text
Simple
Clear
Discoverable
Consistent
```

over:

```text
Deep
Fragmented
Over-engineered
Artificially complex
```

---

# 124. FINAL FOLDER STRUCTURE RULES

The following rules are mandatory:

```text
1. Business modules belong inside modules/.

2. Shared UI belongs inside shared client components.

3. Module-specific UI belongs inside the owning module.

4. Business logic belongs in application/domain layers.

5. Database access belongs in repositories/infrastructure.

6. API routes remain thin.

7. Controllers do not contain complex business logic.

8. Client code never directly accesses the database.

9. AI never directly accesses the database.

10. Cross-module dependencies must be intentional.

11. Financial and inventory logic must remain domain-controlled.

12. Offline infrastructure must remain explicit.

13. Security infrastructure must remain centralized.

14. Configuration must not become hardcoded business logic.

15. Tests must have clear ownership.

16. Generated artifacts must remain separate from source.

17. Secrets must never be stored in source code.

18. Folder structure must support future module extraction.

19. The initial architecture remains a modular monolith.

20. Every directory must have a clear responsibility.
```

---

# 125. FINAL PRINCIPLE

The folder structure should allow a developer unfamiliar with the codebase to understand the platform simply by inspecting its directories.

A developer should be able to answer:

> Where does this feature belong?

> Which module owns it?

> Where is its business logic?

> Where is its database access?

> Where is its API?

> Where is its authorization?

> Where is its workflow?

> Where are its tests?

> Where is its documentation?

If the structure makes those answers obvious, the architecture is working correctly.

**This folder structure is the canonical implementation organization for the platform unless a formally approved architectural change replaces it.**
