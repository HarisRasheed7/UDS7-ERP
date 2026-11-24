# COMPONENT RULES

## Professional ERP & Business Management Platform

**Document:** `development/04-component-rules.md`
**Status:** Development Standard
**Purpose:** Define the mandatory rules for designing, implementing, organizing, testing, and maintaining React components throughout the platform.

---

# 1. Purpose

This document defines the component engineering standards for the ERP and Business Management Platform.

Components must be:

* reusable where appropriate
* predictable
* maintainable
* accessible
* responsive
* permission-aware
* theme-aware
* performance-conscious
* testable
* compatible with offline and synchronization states
* independent from backend implementation details
* aligned with the platform design system

The objective is to prevent the frontend from becoming a collection of unrelated screens, duplicated UI, oversized components, and inconsistent business behavior.

---

# 2. Scope

These rules apply to:

* application shell components
* layouts
* pages
* module components
* shared components
* forms
* tables
* data grids
* dialogs
* drawers
* filters
* navigation
* dashboards
* charts
* workflow components
* approval components
* permission components
* file components
* notification components
* offline components
* synchronization components
* command-center components
* mobile and responsive components
* reusable hooks associated with components

---

# 3. Technology Standard

The frontend component system uses:

* JavaScript
* React
* Next.js where applicable
* custom CSS
* CSS variables/design tokens
* reusable JavaScript modules

The project does **not** use:

* TypeScript
* Tailwind CSS
* arbitrary UI framework styling as the primary design system

---

# 4. Component Architecture Principle

Every component must have a clear responsibility.

A component should answer:

> What part of the interface does this component own?

A component should not simultaneously become:

* page controller
* API client
* database layer
* business-rule engine
* permission engine
* workflow engine
* report engine
* UI renderer

Complex behavior must be separated into appropriate layers.

---

# 5. Component Hierarchy

The frontend should generally follow this hierarchy:

```text
Application
    ↓
Layout
    ↓
Page
    ↓
Module Container
    ↓
Feature Component
    ↓
Shared UI Component
    ↓
Primitive UI Component
```

Example:

```text
InventoryPage
    ↓
InventoryLayout
    ↓
InventoryList
    ↓
InventoryDataTable
    ↓
DataTable
    ↓
Table
```

The exact hierarchy may vary, but ownership must remain clear.

---

# 6. Component Categories

Components should be classified into appropriate categories.

### Application Components

Global application infrastructure.

Examples:

```text
AppShell
GlobalHeader
Sidebar
CommandCenter
NotificationCenter
GlobalSearch
```

### Layout Components

Responsible for page structure.

Examples:

```text
DashboardLayout
ModuleLayout
RecordLayout
SettingsLayout
```

### Page Components

Represent application routes/screens.

Examples:

```text
ProductsPage
InventoryPage
SalesPage
PurchaseOrdersPage
CustomerDetailsPage
```

### Feature Components

Represent meaningful business UI.

Examples:

```text
ProductPricingPanel
StockMovementTable
PurchaseApprovalPanel
CustomerBalanceSummary
InvoicePaymentSection
```

### Shared Components

Reusable across multiple modules.

Examples:

```text
DataTable
Modal
Drawer
DatePicker
SearchBar
StatusBadge
FileUploader
```

### Primitive Components

Small foundational UI pieces.

Examples:

```text
Button
Input
Label
IconButton
Divider
Spinner
```

---

# 7. Component Ownership

Every component must have a clear owner.

Ownership determines:

* where the component lives
* who may modify it
* whether it is reusable
* what dependencies it may have

A module-specific component should not be placed in the global shared component directory simply because it is visually reusable.

---

# 8. Shared Components

A component should become shared only when reuse is meaningful.

Do not create shared components merely because two screens look similar.

Shared components should represent stable concepts.

Good examples:

```text
Modal
DataTable
SearchBar
DateRangePicker
PermissionGate
StatusBadge
```

Poor examples:

```text
ProductPageBlueBox
CustomerPageSpecialCard
InventoryPagePanel
```

---

# 9. Avoid Premature Abstraction

Do not abstract a component before its behavior is understood.

A component may initially remain module-specific.

After repeated, stable reuse is demonstrated, it may be promoted to a shared component.

---

# 10. Component Naming

Use descriptive PascalCase names.

Correct:

```text
CustomerBalanceCard
InventoryMovementTable
PurchaseApprovalDialog
ProductImageGallery
```

Avoid:

```text
Box
Thing
Panel1
CommonComponent
Data
Widget
```

---

# 11. File Naming

Component files should use PascalCase.

Example:

```text
CustomerBalanceCard.jsx
InventoryMovementTable.jsx
PurchaseApprovalDialog.jsx
```

Hooks should use:

```text
useInventory.js
usePermissions.js
useCustomerSearch.js
```

Utility files should use descriptive names.

---

# 12. Component Folder Structure

Complex components should have their own directory.

Example:

```text
CustomerBalanceCard/
    CustomerBalanceCard.jsx
    CustomerBalanceCard.css
    CustomerBalanceCard.test.jsx
```

Simple components may remain as individual files.

---

# 13. Component API

Component props must form a clear API.

Example:

```javascript
<DataTable
    columns={columns}
    rows={rows}
    loading={loading}
    onRowClick={handleRowClick}
/>
```

Avoid components requiring large numbers of unrelated props.

---

# 14. Prop Responsibility

Every prop must have a clear purpose.

Avoid:

```javascript
<Component
    a={...}
    b={...}
    x={...}
    data1={...}
    data2={...}
/>
```

Prefer descriptive properties.

---

# 15. Boolean Props

Boolean props should clearly describe behavior.

Good:

```javascript
disabled
loading
readOnly
required
compact
fullWidth
```

Avoid ambiguous names:

```javascript
mode
flag
activeThing
```

---

# 16. Event Props

Event props should use consistent naming.

Examples:

```javascript
onClick
onChange
onSubmit
onCancel
onDelete
onApprove
onSelect
onRowClick
```

Business-specific events may also be used when meaningful.

---

# 17. Avoid Prop Explosion

A component with too many configuration props may indicate that it is performing multiple responsibilities.

If a component requires excessive configuration, consider:

* composition
* child components
* configuration objects
* specialized feature components

Do not automatically create abstractions merely to reduce prop count.

---

# 18. Composition Over Configuration

Prefer composition when a component contains multiple independent regions.

Example:

```jsx
<Modal>
    <ModalHeader />
    <ModalBody />
    <ModalFooter />
</Modal>
```

rather than:

```jsx
<Modal
    title="..."
    showFooter
    footerButtons={...}
    headerIcon={...}
    ...
/>
```

---

# 19. Children

Use `children` when the component provides a structural container.

Examples:

```jsx
<Card>
    ...
</Card>
```

```jsx
<Drawer>
    ...
</Drawer>
```

Do not use children merely to hide unclear APIs.

---

# 20. Render Responsibility

A component should primarily be responsible for rendering and coordinating UI behavior.

Business calculations that affect financial, inventory, workflow, or authorization integrity must not be implemented only inside the component.

---

# 21. No Direct Database Access

React components must never directly access the database.

Forbidden:

```text
Component → PostgreSQL
```

Required:

```text
Component
    ↓
Frontend service/API layer
    ↓
Backend API
    ↓
Application service
    ↓
Domain logic
    ↓
Database
```

---

# 22. No Raw API Scattering

Do not scatter raw `fetch()` or HTTP calls throughout components.

Avoid:

```javascript
function ProductPage() {
    fetch("/api/v1/products");
}
```

Prefer:

```text
Component
    ↓
Hook / data service
    ↓
API client
    ↓
Backend
```

---

# 23. API Client Separation

The application should have a centralized API client.

The API client handles common concerns such as:

* authentication
* request headers
* error normalization
* request IDs
* retries where appropriate
* response parsing
* session handling

---

# 24. Data Fetching Separation

Components should consume data through hooks or application-level data services.

Example:

```javascript
const {
    products,
    loading,
    error,
    refresh
} = useProducts(filters);
```

The component should not need to understand backend implementation details.

---

# 25. Business Logic Separation

Do not place complex business rules directly inside JSX.

Bad:

```javascript
if (
    user.role === "manager" &&
    invoice.status === "pending" &&
    invoice.total > 50000
) {
    ...
}
```

Permission and approval decisions should come from the appropriate authorization/workflow systems.

---

# 26. UI Logic vs Business Logic

UI logic includes:

* opening a modal
* changing a tab
* expanding a row
* selecting a filter
* displaying loading state

Business logic includes:

* calculating accounting entries
* determining stock availability
* approving transactions
* determining tax liability
* calculating financial posting
* enforcing approval thresholds

Business logic belongs outside the presentation component.

---

# 27. State Ownership

State must be owned by the lowest component that genuinely needs it.

Do not place all state in global state.

Use:

```text
Local state
    ↓
Feature state
    ↓
Page state
    ↓
Application/global state
```

only as required.

---

# 28. Local UI State

Use local component state for temporary UI state.

Examples:

```text
modalOpen
activeTab
expandedRow
inputDraft
isDropdownOpen
```

---

# 29. Feature State

Use feature-level state for state shared by related components.

Examples:

```text
inventory filters
selected warehouse
active product
purchase order draft
```

---

# 30. Global State

Global state should be reserved for truly global information.

Examples:

* authenticated session
* current organization
* current company
* current branch
* global appearance settings
* notification state
* application connectivity state
* global command-center state where required

---

# 31. Do Not Abuse Context

React Context should not become a replacement for all application state.

Use Context for genuinely cross-cutting concerns.

Examples:

```text
AuthenticationContext
ThemeContext
OrganizationContext
PermissionContext
```

Avoid putting large transactional datasets into global context.

---

# 32. Controlled Components

Forms should normally use controlled inputs where validation and state synchronization require it.

Example:

```jsx
<Input
    value={form.name}
    onChange={handleNameChange}
/>
```

---

# 33. Uncontrolled Components

Uncontrolled inputs may be used when:

* integration requires it
* performance benefits are significant
* the value does not require continuous React state
* file inputs require browser-native behavior

The choice should be intentional.

---

# 34. Form Components

Forms must provide:

* labels
* validation
* required-state indication
* field-level errors
* submission state
* server validation handling
* keyboard accessibility
* unsaved-change handling where necessary

---

# 35. Form Validation

Frontend validation improves usability but does not replace backend validation.

Required:

```text
Frontend validation
+
Backend validation
```

Never assume frontend validation protects the system.

---

# 36. Server Validation Errors

Server-side validation errors should map back to the appropriate fields whenever possible.

Example:

```text
Product code already exists.
```

should appear near the relevant product-code field.

---

# 37. Form Submission State

After submission begins:

```text
idle
→ submitting
→ success
```

or:

```text
idle
→ submitting
→ error
```

The UI must prevent accidental duplicate submission when appropriate.

---

# 38. Transactional Form Behavior

Forms representing important transactions must clearly communicate:

* draft state
* validation state
* pending submission
* successful posting
* failed posting
* approval state
* synchronization state where applicable

---

# 39. Financial Forms

Financial forms must not perform authoritative financial calculations solely in the browser.

The UI may display calculations for convenience, but the server must validate and authorize final financial results.

---

# 40. Inventory Forms

Inventory forms must not directly modify stock quantities.

The UI must invoke inventory operations through the appropriate API/service.

Examples:

```text
Goods Receipt
Stock Issue
Transfer
Adjustment
Stock Count
Reservation
```

---

# 41. POS Components

POS components must be optimized for rapid operation.

Important considerations:

* keyboard support
* barcode scanner input
* product search
* cart updates
* payment selection
* receipt flow
* duplicate-action prevention
* offline state
* cashier permissions
* transaction confirmation

---

# 42. POS Transaction Integrity

The UI must never assume that a sale succeeded simply because a button was clicked.

The authoritative result must come from the transaction service.

Possible states:

```text
Draft
Processing
Completed
Failed
Pending Sync
Conflict
```

---

# 43. Data Tables

The platform requires a reusable data-table system.

Common features include:

* column configuration
* sorting
* filtering
* pagination
* search
* row selection
* bulk actions
* column visibility
* resizing where appropriate
* saved views
* export
* responsive behavior
* loading states
* empty states
* permission-aware actions

---

# 44. Data Table Responsibility

The generic `DataTable` should handle presentation behavior.

Module-specific components should supply:

* columns
* row data
* actions
* business-specific formatting
* permissions
* filters

---

# 45. Table Columns

Column definitions should be explicit.

Example:

```javascript
{
    key: "status",
    label: "Status",
    render: (row) => (
        <StatusBadge status={row.status} />
    )
}
```

---

# 46. Table Actions

Actions must be permission-aware.

Example:

```text
View
Edit
Delete
Approve
Reject
Export
Print
Post
Reverse
```

Not every user should see or execute every action.

---

# 47. Bulk Actions

Bulk operations must clearly communicate:

* number of selected records
* affected operation
* authorization
* validation
* progress
* partial failure
* completion

Bulk actions must not silently modify thousands of records.

---

# 48. Destructive Actions

Destructive actions require confirmation where appropriate.

Examples:

```text
Delete
Archive
Cancel
Reverse
Deactivate
Bulk delete
```

Financial reversal must be presented as a controlled transaction, not ordinary deletion.

---

# 49. Modals

Use modals for focused decisions or short interactions.

Good examples:

```text
Confirm deletion
Quick create
Approval decision
Small configuration
```

Do not put entire complex workflows into an oversized modal.

---

# 50. Drawers

Use drawers when the user needs contextual interaction while maintaining visibility of the underlying page.

Examples:

```text
Record preview
Filter panel
Quick edit
Related records
Activity timeline
```

---

# 51. Full Pages vs Modals

Use a full page for:

* complex forms
* multi-step workflows
* large datasets
* detailed record management
* long configuration screens

Use modals for:

* focused actions
* confirmations
* short forms

---

# 52. Dialog Accessibility

Dialogs must:

* trap focus appropriately
* provide a meaningful title
* support keyboard interaction
* close safely
* return focus to the initiating element
* expose appropriate accessibility semantics

---

# 53. Tabs

Tabs should represent related content sections.

Do not use tabs merely to avoid designing proper navigation.

Tabs must preserve context and clearly indicate the active section.

---

# 54. Stepper Components

Use steppers for genuinely sequential processes.

Examples:

```text
Create Purchase Order
→ Review
→ Approval
→ Confirmation
```

Do not use a stepper for unrelated screens.

---

# 55. Timeline Components

Timelines are appropriate for:

* activity history
* audit events
* workflow history
* customer interaction history
* transaction history

Timeline data must respect permissions.

---

# 56. Loading States

Every data-dependent component should have an appropriate loading state.

Possible patterns:

```text
Skeleton
Spinner
Progress indicator
Placeholder
```

Choose according to context.

---

# 57. Skeletons

Skeletons should resemble the final content structure.

Avoid excessive animation.

Respect reduced-motion preferences.

---

# 58. Empty States

Empty states must explain:

1. what is empty
2. why it may be empty
3. what the user can do next

Example:

```text
No products found.

Try changing your filters or create a new product.
```

---

# 59. Error States

Errors must be actionable.

Avoid:

```text
Something went wrong.
```

when more useful information can safely be provided.

The UI should distinguish:

```text
Validation error
Permission error
Network error
Conflict
Server error
Offline limitation
Authentication expiration
```

---

# 60. Permission Components

Permission-aware UI should use centralized authorization information.

Example:

```jsx
<PermissionGate permission="inventory.adjust">
    <AdjustmentButton />
</PermissionGate>
```

However, this is only a UI convenience.

The backend must enforce the permission.

---

# 61. Permission-Aware Rendering

Do not merely hide unauthorized actions when the user may still access the underlying operation through another route.

Every protected operation must be enforced server-side.

---

# 62. Disabled vs Hidden Actions

Use hidden actions when the user has no reason to see them.

Use disabled actions when visibility helps explain workflow state or unavailable prerequisites.

Example:

```text
Approve
```

may be visible but disabled if:

```text
Approval prerequisites are incomplete.
```

---

# 63. Workflow Components

Workflow-aware UI should display:

* current state
* available transitions
* assigned approver
* approval history
* pending tasks
* deadlines
* escalation
* rejection/rework state

The frontend must consume workflow decisions from the workflow engine.

---

# 64. Approval Components

Approval actions must clearly show:

* what is being approved
* relevant amount/impact
* current status
* approval authority
* comments
* supporting documents
* previous decisions

---

# 65. Self-Approval Prevention

The UI may indicate that self-approval is unavailable, but the backend must enforce maker-checker and separation-of-duties rules.

---

# 66. Search Components

Search components should support:

* debounce
* keyboard navigation
* loading state
* no-result state
* permission-aware results
* recent searches where enabled
* clear action

---

# 67. Global Search

Global search must not expose records that the current user cannot access.

Search results must be filtered by authorization and organization context.

---

# 68. Command Center

The command center may provide:

* navigation
* actions
* records
* reports
* commands
* recent items

AI-assisted command suggestions must remain permission-aware.

---

# 69. Filters

Filters should be reusable and predictable.

Support where appropriate:

```text
Date
Status
Organization
Company
Branch
Department
Warehouse
User
Owner
Amount
Category
Tags
```

---

# 70. Filter State

Filter state should be represented explicitly.

Users should be able to:

* apply
* clear
* reset
* save views where supported
* share views where permitted

---

# 71. Date Filters

Date filters must respect the user's configured:

* timezone
* locale
* date format
* fiscal/calendar configuration

Do not assume browser timezone equals organization timezone.

---

# 72. Responsive Components

Every reusable component must define behavior across:

```text
Desktop
Laptop
Tablet
Mobile
```

Responsive behavior should be intentional.

---

# 73. Responsive Tables

Large tables may:

* horizontally scroll
* collapse secondary columns
* provide mobile card views
* prioritize critical fields

Do not simply shrink every table until it becomes unreadable.

---

# 74. Responsive Forms

Forms should adapt:

```text
Desktop:
multi-column

Tablet:
reduced columns

Mobile:
single-column
```

Fields must remain usable and accessible.

---

# 75. Mobile Interaction

Mobile components should consider:

* touch targets
* touch gestures
* keyboard visibility
* scrolling
* fixed action areas
* bottom navigation where appropriate

---

# 76. CSS Architecture

Components should use predictable CSS organization.

Example:

```text
Component/
    Component.jsx
    Component.css
```

Styles should remain scoped conceptually to the component.

---

# 77. CSS Naming

Use descriptive class names.

Example:

```text
data-table
data-table__header
data-table__row
data-table__cell
data-table__actions
```

Avoid generic names:

```text
box
container2
blueThing
left
```

---

# 78. Design Tokens

Components must use design tokens instead of hardcoded design values where appropriate.

Tokens should cover:

* colors
* spacing
* typography
* borders
* radius
* shadows
* transitions
* z-index
* component dimensions

---

# 79. Theme Support

Components must work with the platform theme system.

Do not hardcode colors that prevent theme switching.

Prefer:

```css
color: var(--color-text-primary);
```

over:

```css
color: #222;
```

when the value is part of the design system.

---

# 80. Semantic Colors

Semantic colors should represent meaning consistently.

Examples:

```text
success
warning
danger
info
neutral
```

Do not use color as the only way to communicate meaning.

---

# 81. Accessibility

All components must meet the platform accessibility standard.

Requirements include:

* semantic HTML
* keyboard support
* visible focus
* labels
* accessible names
* appropriate ARIA
* sufficient contrast
* screen-reader compatibility

---

# 82. Keyboard Navigation

Important actions must be keyboard accessible.

Examples:

```text
Tab
Shift+Tab
Enter
Space
Escape
Arrow keys
```

Components such as dropdowns, dialogs, tables, command palettes, and menus require deliberate keyboard behavior.

---

# 83. Focus Management

Focus must be managed when UI context changes.

Examples:

```text
Open dialog → focus dialog
Close dialog → return focus
Navigate to important error → focus/announce error
```

---

# 84. Form Accessibility

Every form field must have a meaningful accessible label.

Do not rely only on placeholder text.

---

# 85. Error Accessibility

Validation errors should be accessible to assistive technologies.

Important error changes should be announced where appropriate.

---

# 86. Color Independence

Do not communicate state only through color.

Example:

Bad:

```text
red = failed
green = successful
```

Better:

```text
Failed
[error icon]
```

with color as an additional cue.

---

# 87. Animation Rules

Animations should:

* communicate state
* guide attention
* preserve context
* feel professional
* remain short and purposeful

Avoid decorative animation that slows business workflows.

---

# 88. Reduced Motion

The UI must respect:

```text
prefers-reduced-motion
```

Animations should be reduced or disabled when requested by the user.

---

# 89. Performance

Components must avoid unnecessary rendering.

Use optimization only where it solves a measurable or meaningful problem.

Possible techniques:

```text
memoization
stable callbacks
virtualization
lazy loading
code splitting
pagination
deferred rendering
```

---

# 90. Memoization

Do not automatically wrap every component in `React.memo`.

Use memoization when:

* renders are expensive
* props are stable
* repeated rendering is measurable

---

# 91. Virtualization

Large datasets should use virtualization where appropriate.

Examples:

```text
10,000+ inventory records
large audit logs
large search result lists
```

Never attempt to render massive datasets unnecessarily.

---

# 92. Pagination

Large server-side datasets should normally use server-side pagination.

The frontend must not download the entire database simply to display the first page.

---

# 93. Debouncing

Use debouncing for appropriate high-frequency operations.

Examples:

```text
search
filter text
autocomplete
command search
```

Do not debounce actions where immediate execution is required.

---

# 94. Request Cancellation

Long-running or superseded requests should be cancellable where practical.

Example:

```text
User searches:
"apple"

then immediately:
"apple juice"
```

The outdated request should not overwrite the newer result.

---

# 95. Race Conditions

Components must handle asynchronous race conditions.

The UI must not allow an older response to overwrite a newer state.

---

# 96. Offline UI

Offline-capable components must explicitly represent connectivity state.

Possible states:

```text
Online
Offline
Syncing
Pending
Failed
Conflict
Blocked
```

---

# 97. Offline Data Indicators

Cached or stale data should be identifiable where relevant.

Examples:

```text
Offline
Last updated 10 minutes ago
Pending synchronization
```

Do not present stale information as guaranteed current.

---

# 98. Offline Mutations

When an action is queued offline, the UI should communicate that it has been queued rather than pretending it has been permanently committed.

Example:

```text
Sale queued for synchronization.
```

---

# 99. Sync Status

Components should be able to show:

```text
Pending
Syncing
Synced
Failed
Conflict
```

The sync engine remains responsible for synchronization logic.

---

# 100. Conflict UI

Conflict screens should explain:

* record
* conflicting changes
* local state
* server state
* resolution options
* current status

Financial and inventory conflicts must follow server-authoritative rules.

---

# 101. Error Boundaries

Major application sections should use error boundaries.

A component failure should not necessarily crash the entire application.

Example boundaries:

```text
Application
Module
Dashboard widget
Complex feature
```

---

# 102. Error Recovery

Where possible, error boundaries should provide:

* retry
* reload section
* return to previous screen
* support/error reference ID

Do not expose sensitive technical details.

---

# 103. Notifications

Components should use the centralized notification system.

Do not create independent notification mechanisms in every module.

Supported notification types may include:

```text
success
info
warning
error
```

---

# 104. Notification Content

Notifications should be concise and actionable.

Avoid exposing:

* stack traces
* database errors
* secrets
* internal infrastructure details

---

# 105. File Upload Components

File upload components must support where required:

* file selection
* drag/drop
* type validation
* size validation
* upload progress
* failure handling
* retry
* preview
* removal
* permission checks

---

# 106. File Security

Frontend file validation is only a usability layer.

The server must independently validate:

* file type
* content
* size
* authorization
* storage destination
* malware/security requirements where implemented

---

# 107. Image Components

Image components should support:

* loading state
* fallback
* preview
* appropriate sizing
* responsive behavior
* accessibility text
* permission-aware access

Do not assume every stored image URL is publicly accessible.

---

# 108. Charts

Charts should be wrapped in reusable visualization components.

They must support:

* loading
* empty state
* error state
* legends where useful
* accessible labels/alternatives
* responsive sizing
* date/filter context

---

# 109. Financial Charts

Financial charts must clearly communicate:

* currency
* period
* aggregation
* data freshness
* filters

Do not mix currencies without clear conversion rules.

---

# 110. KPI Components

KPI widgets should communicate:

* metric name
* current value
* period
* comparison where applicable
* trend
* data freshness
* permission restrictions

---

# 111. Dashboard Components

Dashboards should use reusable widgets.

A dashboard component must not embed module-specific database logic.

Dashboard data should come from appropriate reporting/query services.

---

# 112. Custom Dashboards

User-configurable dashboards should be driven by metadata/configuration rather than hardcoded layouts wherever appropriate.

Users may be allowed to:

* add widgets
* remove widgets
* reorder widgets
* resize widgets
* configure filters

Permissions remain authoritative.

---

# 113. Record Detail Components

Record pages should use consistent sections.

Typical structure:

```text
Header
Status
Primary Information
Financial/Operational Summary
Related Records
Documents
Activity
Workflow
Audit
```

Only relevant sections should appear.

---

# 114. Related Records

Related records must respect authorization.

Examples:

```text
Customer
→ Sales Orders
→ Invoices
→ Payments
→ Communications
```

A user must not gain access to restricted records merely because they are related.

---

# 115. Activity Components

Activity timelines may show:

* created
* updated
* approved
* rejected
* commented
* assigned
* status changed
* synchronized

Sensitive events must follow permission rules.

---

# 116. Audit Components

Audit information should be read-only.

Users must not be able to edit audit records through ordinary UI components.

---

# 117. Reusable Status Components

Use centralized status rendering.

Example:

```jsx
<StatusBadge status={invoice.status} />
```

Status appearance should remain consistent across modules.

---

# 118. Status Semantics

Status colors and labels must come from centralized definitions where possible.

Do not redefine:

```text
Pending
Approved
Rejected
Cancelled
Completed
```

differently in every module without justification.

---

# 119. Breadcrumbs

Breadcrumbs should communicate hierarchy.

Example:

```text
Sales
→ Orders
→ SO-2026-00125
```

They should remain usable on responsive screens.

---

# 120. Navigation Components

Navigation must respect:

* permissions
* enabled modules
* organization configuration
* feature flags
* role visibility

A disabled module should not appear as fully available.

---

# 121. Feature Flags

Components may use feature flags to control rollout.

Feature flags must not become permanent hidden business logic.

Flags should be:

* documented
* centrally managed
* auditable where necessary
* removable after rollout

---

# 122. Module Availability

A component must distinguish:

```text
Not installed
Disabled
Not licensed
Not authorized
Unavailable offline
Temporarily unavailable
```

These states should not all look identical.

---

# 123. Localization

User-facing text should be externalizable for future localization.

Do not hardcode business logic around English strings.

---

# 124. Currency Display

Currency display must use organization/user configuration.

Components should not assume:

```text
$
```

or:

```text
PKR
```

unless configured.

---

# 125. Number Formatting

Number formatting should respect:

* locale
* decimal precision
* quantity rules
* currency rules
* organization settings

---

# 126. Date and Time Display

Date/time components must respect configured timezone and format.

Do not blindly use browser-local time for business records.

---

# 127. Unsaved Changes

Complex forms should detect unsaved changes where appropriate.

The user should receive a clear warning before losing meaningful work.

---

# 128. Duplicate Submission Prevention

Important actions should prevent accidental repeated submission.

Examples:

```text
Post Invoice
Approve Payment
Submit Payroll
Complete Sale
Transfer Stock
```

---

# 129. Confirmation for High-Impact Actions

Confirmation should communicate consequences.

Bad:

```text
Are you sure?
```

Better:

```text
Post this invoice?

Posting will create the financial transaction and cannot be edited as a normal draft afterward.
```

The exact message must reflect the operation.

---

# 130. Transaction Result Handling

After a successful transaction, the component should display a meaningful result.

Examples:

```text
Invoice posted successfully.
Stock transfer completed.
Payment recorded.
Purchase order submitted for approval.
```

Where applicable, provide:

* record link
* print
* receipt
* next action

---

# 131. Component-Level Security

Components must never expose sensitive data merely because the API returned it accidentally.

Sensitive data must be protected at the backend/API layer first.

The UI should additionally respect visibility rules.

---

# 132. Sensitive Information

Sensitive values may require:

* masking
* restricted rendering
* explicit reveal
* permission checks
* audit logging for access where required

---

# 133. No Security Through Obscurity

Hiding a button is not security.

Security must exist at:

```text
API
Application Service
Domain
Database where appropriate
```

---

# 134. Component Testing

Reusable components must have tests appropriate to their complexity.

Test:

* rendering
* props
* interactions
* validation
* accessibility
* error states
* permission states
* loading states

---

# 135. Form Testing

Forms should test:

* required fields
* invalid values
* valid submission
* server errors
* disabled state
* duplicate submission prevention
* keyboard behavior

---

# 136. Table Testing

Tables should test:

* loading
* empty
* populated
* sorting
* filtering
* pagination
* row actions
* bulk actions
* permissions

---

# 137. Permission Testing

Permission-aware components should test at least:

```text
Authorized
Unauthorized
Restricted action
Restricted data
```

---

# 138. Offline Testing

Offline-capable components should test:

```text
Online
Offline
Reconnect
Pending operation
Failed operation
Conflict
```

---

# 139. Accessibility Testing

Important reusable components should be checked for:

* keyboard navigation
* accessible names
* focus management
* labels
* semantic structure
* contrast
* screen-reader behavior where applicable

---

# 140. Component Documentation

Complex reusable components should document:

* purpose
* props
* expected usage
* states
* restrictions
* accessibility requirements
* examples

---

# 141. Story/Preview Environment

Where the development environment supports component previews, complex reusable components should have isolated previews.

Examples:

```text
DataTable
Modal
FormField
StatusBadge
DatePicker
FileUploader
Notification
```

Each important state should be represented.

---

# 142. Component State Matrix

Complex components should define their states.

Example:

| State        | Expected UI       |
| ------------ | ----------------- |
| Loading      | Skeleton/progress |
| Empty        | Empty state       |
| Ready        | Normal content    |
| Error        | Error state       |
| Unauthorized | Restricted state  |
| Offline      | Offline indicator |
| Pending sync | Pending indicator |
| Conflict     | Conflict UI       |

---

# 143. Avoid Giant Components

A component should be split when it becomes responsible for unrelated concerns.

Warning signs:

* very large JSX
* many unrelated states
* multiple API operations
* multiple forms
* many effects
* complicated permission checks
* difficult testing
* unrelated UI sections

---

# 144. Component Splitting

Split by meaningful responsibility.

Bad:

```text
HugeCustomerPage.jsx
```

Better:

```text
CustomerPage
├── CustomerHeader
├── CustomerSummary
├── CustomerContacts
├── CustomerTransactions
├── CustomerDocuments
├── CustomerActivity
└── CustomerActions
```

---

# 145. Avoid Over-Splitting

Do not create a separate component for every `<div>`.

A component should have a meaningful responsibility or reusable value.

---

# 146. Hooks

Custom hooks should encapsulate reusable behavior.

Examples:

```text
usePermissions
usePagination
useDebounce
useOfflineStatus
useSyncStatus
useForm
useProductSearch
```

Hooks must not become hidden giant service layers.

---

# 147. Hook Responsibility

A hook should have a clear responsibility.

Bad:

```text
useEverything()
```

Better:

```text
useCustomerSearch()
useCustomerPermissions()
useCustomerTransactions()
```

---

# 148. Hook and UI Separation

Hooks may manage:

* data fetching
* state
* subscriptions
* reusable interaction behavior

Components remain responsible for rendering.

---

# 149. Effects

Use effects for external synchronization.

Examples:

* browser APIs
* subscriptions
* event listeners
* network synchronization where appropriate

Do not use effects for calculations that can be performed during rendering.

---

# 150. Derived Data

Prefer deriving values from existing state rather than duplicating state.

Avoid:

```text
products
filteredProducts
```

as separate state when `filteredProducts` can be derived from `products` and filters.

---

# 151. Event Handlers

Event handlers should remain understandable.

If an event handler becomes a large business process, move the operation to a service/hook/application layer.

---

# 152. Navigation

Components should use centralized navigation conventions.

Avoid scattering manually constructed URLs throughout the application.

---

# 153. Route Parameters

Components should validate and safely interpret route parameters.

Do not assume a route ID corresponds to a record the user can access.

---

# 154. Multi-Organization Context

Components displaying organization-scoped data must receive the correct organization context.

Users must not accidentally see data from another organization due to stale frontend state.

---

# 155. Company and Branch Context

Where applicable, components must respect:

```text
Organization
Company
Branch
Department
Warehouse
Location
```

context.

---

# 156. Context Switching

When organization/company/branch context changes:

* dependent data must refresh
* stale data must not remain visible
* unsaved work must be handled
* caches must be partitioned appropriately
* permissions must be re-evaluated

---

# 157. Cache Safety

Frontend caches must be scoped appropriately.

Never use a global cache key such as:

```text
customers
```

when the data is organization-specific.

Prefer context-aware keys conceptually:

```text
organization/{id}/customers
```

---

# 158. Permission Changes

If permissions change during a session, the frontend must not assume old permissions remain valid.

The backend remains authoritative.

Sensitive screens should refresh/revalidate permissions when required.

---

# 159. Session Expiration

When authentication expires, components should transition gracefully to the authentication flow.

Do not leave a false impression that protected data is still writable.

---

# 160. Network Failures

Network failures should not automatically mean that data was not changed.

For transactional operations, the system should provide an appropriate transaction state or verification mechanism.

---

# 161. Retry UI

Retries should be available where safe.

Do not automatically retry non-idempotent transactions blindly.

---

# 162. Idempotency Awareness

Components initiating potentially duplicated operations should support the backend's idempotency mechanism where applicable.

Examples:

```text
Payment
Order submission
POS sale
Inventory transfer
Webhook-triggered action
```

---

# 163. Background Jobs

If an operation is processed asynchronously, the component should communicate:

```text
Queued
Processing
Completed
Failed
```

and provide a way to inspect the result when appropriate.

---

# 164. Import Components

Import UI should support:

* file selection
* template download
* mapping
* validation preview
* error reporting
* duplicate detection
* import progress
* completion summary

---

# 165. Export Components

Export UI should communicate:

* selected records
* applied filters
* format
* permission
* estimated processing behavior
* background job status where applicable

---

# 166. Report Components

Reports should provide:

* filters
* date range
* grouping
* sorting
* refresh
* export
* print where supported
* data freshness

---

# 167. Large Report Rendering

Do not render massive reports entirely in the browser when server-side generation is more appropriate.

Use asynchronous report generation where necessary.

---

# 168. Notification Center

The notification center should support:

* unread/read
* filtering
* priority
* timestamps
* navigation
* grouping
* permission-aware content

---

# 169. Command Palette

The command palette should provide keyboard-first access to:

* navigation
* actions
* search
* recent records
* permitted commands

Unauthorized commands must not be executable.

---

# 170. AI UI Components

AI components may provide:

* suggestions
* summaries
* search assistance
* natural-language queries
* recommendations
* extraction results

AI UI must clearly distinguish generated suggestions from authoritative system data.

---

# 171. AI Confirmation

AI-generated actions that modify data must require appropriate confirmation or workflow authorization.

The AI UI must not imply that a generated recommendation has already been executed.

---

# 172. AI Data Access

AI components must use permission-aware backend tools.

They must not directly query the database.

---

# 173. AI Loading States

AI operations should clearly show:

```text
Generating
Analyzing
Retrieving
Completed
Failed
```

Long operations should support cancellation where technically possible.

---

# 174. AI Confidence

Where confidence is meaningful, the UI may show confidence or uncertainty.

Do not present uncertain AI output as guaranteed fact.

---

# 175. Audit-Aware UI

Where an action creates an audit record, the UI should provide a link or context to the resulting activity when appropriate.

---

# 176. Related Actions

After successful operations, provide useful next actions.

Example:

```text
Product created.

[View Product] [Create Another]
```

Avoid unnecessary navigation jumps.

---

# 177. Progressive Disclosure

Complex ERP screens should reveal advanced options progressively.

Basic users should not be overwhelmed by every possible configuration field.

Advanced controls may be exposed through:

```text
Advanced Filters
More Options
Configuration
Additional Details
```

Permissions still apply.

---

# 178. Custom Fields

Components displaying custom fields must use the platform metadata system.

Do not hardcode every possible custom field.

---

# 179. Dynamic Forms

Dynamic forms should support:

* field metadata
* visibility rules
* required rules
* validation
* ordering
* sections
* permissions
* dependencies

The frontend must safely interpret metadata.

---

# 180. Custom Business Rules

Frontend customization must not become a security boundary.

Any rule affecting authorization, financial integrity, inventory integrity, or other authoritative behavior must be enforced server-side.

---

# 181. Configuration-Driven Components

Reusable platform components may accept configuration objects.

Configuration should be validated and have safe defaults.

---

# 182. Safe Defaults

Components must behave safely when optional configuration is missing.

Avoid undefined behavior.

---

# 183. Defensive Rendering

Components should handle:

```text
null
undefined
empty arrays
missing optional fields
unexpected values
loading
errors
```

without crashing.

---

# 184. Data Formatting

Formatting should be centralized where possible.

Examples:

```text
formatCurrency()
formatDate()
formatDateTime()
formatQuantity()
formatPercentage()
formatPhone()
```

Avoid duplicating formatting rules across components.

---

# 185. Localization-Safe Formatting

Formatting functions must respect:

* locale
* currency
* timezone
* precision
* organization settings

---

# 186. Print Components

Print views should be separate from normal interactive layouts where necessary.

Print output must:

* hide unnecessary controls
* preserve important information
* respect organization branding
* maintain readable pagination
* avoid exposing unauthorized information

---

# 187. Receipt Components

Receipt UI must be designed for:

* standard printing
* thermal printing where applicable
* digital display
* reprint
* transaction reference

---

# 188. Document Viewer

Document viewers should support appropriate:

* preview
* download
* zoom
* pagination
* permissions
* loading
* failure handling

---

# 189. Component Security Review

Before releasing a reusable component, review:

* data exposure
* permission handling
* injection risks
* file handling
* URL handling
* unsafe HTML
* sensitive values
* unauthorized actions

---

# 190. Unsafe HTML

Do not render arbitrary HTML from users or external sources without appropriate sanitization and security controls.

---

# 191. External Links

External URLs must be validated and handled safely.

Do not blindly render user-controlled URLs as trusted navigation.

---

# 192. Component Dependencies

Shared components should have minimal dependencies.

A generic component should not depend on a specific ERP module unless intentionally designed as a module component.

---

# 193. Circular Dependency Prevention

Components should not create circular import relationships.

If circular dependencies appear, reassess architecture.

---

# 194. Module Boundaries

Module-specific components should not directly import internal implementation details from unrelated modules.

Use approved shared/application interfaces.

---

# 195. Reuse Across Modules

Cross-module reusable components should live in shared infrastructure only when their responsibility is genuinely cross-module.

Examples:

```text
CustomerSelector
ProductSelector
WarehouseSelector
UserSelector
```

may become shared components if the underlying concepts are globally reusable.

---

# 196. Selector Components

Selectors should support:

* search
* loading
* empty
* permission filtering
* keyboard navigation
* clear selection
* large datasets
* pagination or server-side search

---

# 197. Entity Selectors

Entity selectors must not load enormous datasets unnecessarily.

Use asynchronous search for large entities.

---

# 198. Cascading Selectors

Dependent fields should update safely.

Example:

```text
Company
    ↓
Branch
    ↓
Warehouse
    ↓
Location
```

When the parent changes, invalid child selections must be cleared.

---

# 199. Confirmation Dialog Standards

Confirmation dialogs should state:

* action
* target
* consequence
* available alternatives where useful

Primary action should be clearly identifiable.

---

# 200. Final Component Definition of Done

A component is not complete merely because it renders.

A component is complete when applicable:

```text
[ ] Responsibility is clear
[ ] Correct component category selected
[ ] Naming follows conventions
[ ] Props are understandable
[ ] State ownership is appropriate
[ ] API/data access is separated
[ ] Business logic is not incorrectly embedded
[ ] Permissions are respected
[ ] Responsive behavior is defined
[ ] Theme support works
[ ] Accessibility is implemented
[ ] Loading state exists
[ ] Empty state exists
[ ] Error state exists
[ ] Offline state exists where applicable
[ ] Sync state exists where applicable
[ ] Destructive actions are protected
[ ] Duplicate submission is prevented where required
[ ] Performance is acceptable
[ ] Tests exist where required
[ ] Security review completed where applicable
[ ] Documentation exists for complex reusable components
```

---

# 201. Component Code Review Checklist

Reviewers should ask:

### Architecture

* Does the component have one clear responsibility?
* Is it placed in the correct directory?
* Is it unnecessarily coupled to another module?

### State

* Is state owned at the correct level?
* Is global state being abused?
* Is derived state unnecessarily duplicated?

### Data

* Are API calls separated?
* Is server data authoritative?
* Are race conditions handled?

### Security

* Are permissions respected?
* Could sensitive information be exposed?
* Is backend authorization still relied upon?

### UX

* Are loading, empty, and error states handled?
* Is the workflow understandable?
* Are destructive operations confirmed?

### Accessibility

* Can the component be used with a keyboard?
* Are labels and accessible names correct?
* Is focus managed?

### Responsive Design

* Does it work on desktop?
* tablet?
* mobile?

### Performance

* Are unnecessary renders occurring?
* Is a large dataset being rendered unnecessarily?
* Is virtualization or pagination required?

### Offline

* Is offline behavior explicit?
* Are pending/sync/conflict states represented?

### Maintainability

* Is the component too large?
* Is there duplicated logic?
* Are abstractions justified?

---

# 202. Component Engineering Principles

The following principles are mandatory:

```text
Clear responsibility
+
Reusable design
+
Explicit state ownership
+
Centralized data access
+
Server-authoritative business rules
+
Permission awareness
+
Accessibility
+
Responsive behavior
+
Offline awareness
+
Performance
+
Testability
=
Professional component architecture
```

---

# 203. Final Rule

The frontend component system must never become the place where critical business integrity is decided.

Components present and coordinate application behavior.

The authoritative system remains:

```text
UI
 ↓
Frontend service/hook
 ↓
API
 ↓
Authorization
 ↓
Application service
 ↓
Domain rules
 ↓
Database/transaction
```

For workflows:

```text
UI
 ↓
API
 ↓
Workflow/Application Service
 ↓
Authorization
 ↓
Business Rules
 ↓
Transaction
 ↓
Audit
 ↓
Notifications/Events
```

For AI:

```text
AI UI
 ↓
AI service
 ↓
Permission-aware allowlisted tool
 ↓
Application service
 ↓
Domain rules
 ↓
Authorization
 ↓
Audit
```

For offline operations:

```text
UI
 ↓
Offline-aware service
 ↓
Local state / IndexedDB
 ↓
Operation queue
 ↓
Synchronization
 ↓
Server validation
 ↓
Authoritative transaction
 ↓
Sync result
```

---

# 204. Final Component Standard

Every component in the platform must follow this principle:

> **Components should make the platform easier to use, not easier to break.**

The component architecture must therefore prioritize:

1. correctness
2. security
3. consistency
4. accessibility
5. maintainability
6. performance
7. reusability
8. responsive behavior
9. offline awareness
10. professional user experience

A component is considered production-ready only when it behaves correctly across normal, exceptional, unauthorized, loading, offline, error, and responsive conditions relevant to its purpose.

---

# END OF COMPONENT RULES
