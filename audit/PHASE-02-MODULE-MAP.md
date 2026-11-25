# PHASE 02 — COMPLETE 47-MODULE MAP & BOUNDARY SPECIFICATION

**Project:** Multi-Organization, Multi-Industry ERP & Business Management Platform  
**Authority:** `docs/modules/23-MODULES-SPECIFICATION.md`, `docs/PHASES.md` Sec 4, `docs/03-ARCHITECTURE.md` Sec 4–6, `docs/development/02-folder-structure.md` Sec 50–57  
**Phase:** Phase 02 — Architecture and ADR Approval  

---

## 1. Module Directory Convention

Every business module resides in clean parallel client and server boundaries (`docs/development/02-folder-structure.md` Sec 14 & 50–51):
* **Frontend:** `client/src/modules/<slug>/` (pages/views, module-specific components, hooks, module API service, validators).
* **Backend:** `server/src/modules/<slug>/` (`domain/`, `application/`, `infrastructure/`, `api/`, `permissions/`, `workflows/`, `jobs/`, `constants/`, `index.js`).
* **Public Export Rule:** Cross-module imports **must only** target `server/src/modules/<slug>/index.js` or domain events via `server/src/events/`. Direct imports into another module's `infrastructure/repositories/` are strictly forbidden.

---

## 2. Canonical 47-Module Register, Ownership & Dependency Map

*(Reconciled from the 47 module headings in `docs/modules/23-MODULES-SPECIFICATION.md` and `docs/PHASES.md` Section 4.)*

### Tier 0 & 1: Platform Foundations & Shared Engines
| # | Spec Heading | Module Slug | Phase(s) | Authoritative Entities Owned | Allowed Dependencies | Emitted Domain Events |
|---|---|---|---|---|---|---|
| 01 | Organization Management | `organization` | 08 | `organizations`, `companies`, `branches`, `business_units`, `departments`, `locations`, `organization_memberships` | Platform Core (`users`) | `OrganizationCreated`, `BranchUpdated`, `MembershipChanged` |
| 02 | User & Access Management | `users` (+ `auth/`, `authorization/`) | 07–09 | `users`, `user_sessions`, `roles`, `permissions`, `role_permissions`, `user_role_assignments`, `sod_policies` | `organization` | `UserInvited`, `UserActivated`, `RoleAssigned`, `SessionRevoked` |
| 36 | Document Management | `documents` | 14, 55 | `documents`, `document_versions`, `document_links`, `storage_objects` | `organization`, `users`, `files/` | `DocumentUploaded`, `DocumentArchived` |
| 37 | Workflow & Approvals | `workflows` | 17 | `workflow_definitions`, `workflow_versions`, `workflow_instances`, `approval_tasks`, `approval_actions` | `organization`, `users`, `notifications` | `WorkflowStarted`, `ApprovalRequested`, `WorkflowCompleted`, `WorkflowRejected` |
| 41 | Notification Management | `notifications` | 18, 72 | `notifications`, `notification_templates`, `notification_preferences`, `delivery_logs` | `organization`, `users` | `NotificationDispatched`, `NotificationFailed` |
| 44 | System Administration | `administration` | 03–04, 12, 79–86 | `system_settings`, `health_checks`, `maintenance_windows` | `organization`, `users`, `audit` | `SystemSettingChanged` |
| 45 | Configuration & Customization | `customization` | 15–16 | `module_registry`, `organization_modules`, `feature_flags`, `custom_field_definitions`, `custom_field_values`, `numbering_sequences` | `organization`, `users` | `ModuleEnabled`, `CustomFieldUpdated` |
| 46 | Audit & Activity Management | `audit` | 12 | `audit_logs` (append-only), `security_events` | Platform Core | *(Terminal sink — emits nothing to avoid loops)* |
| 47 | Search & Command Center | `command-center` | 20, 70 | `search_index_entries`, `user_favorites`, `recent_items`, `command_definitions` | All enabled modules (Read-only via Search Providers) | `SearchIndexRebuilt` |

### Tier 2: Core Master Data, Supply & Order Management
| # | Spec Heading | Module Slug | Phase(s) | Authoritative Entities Owned | Allowed Dependencies | Emitted Domain Events |
|---|---|---|---|---|---|---|
| 03 | Product & Service Management | `products` | 13 | `products`, `product_variants`, `product_categories`, `units_of_measure`, `uom_conversions`, `barcodes`, `price_lists` | `organization`, `documents` | `ProductCreated`, `ProductUpdated`, `PriceChanged` |
| 04 | Inventory Management | `inventory` | 21 | `inventory_movements` (immutable), `inventory_balances`, `inventory_reservations`, `stock_adjustments`, `stock_counts` | `organization`, `products`, `warehouses`, `workflows` | `StockReceived`, `StockIssued`, `StockReserved`, `StockAdjusted`, `LowStockDetected` |
| 05 | Warehouse Management | `warehouses` | 22 | `warehouses`, `warehouse_zones`, `warehouse_bins`, `stock_transfers`, `batches`, `serial_numbers` | `organization`, `products`, `inventory` | `TransferDispatched`, `TransferCompleted`, `BatchExpiring` |
| 06 | Sales Management | `sales` | 25 | `quotations`, `sales_orders`, `sales_order_lines`, `sales_returns` | `organization`, `products`, `inventory`, `crm`, `taxation`, `workflows` | `QuotationAccepted`, `SalesOrderConfirmed`, `SalesOrderCancelled`, `SalesReturnAuthorized` |
| 07 | POS Management | `pos` | 26–27, 74 | `pos_terminals`, `pos_sessions`, `pos_sales`, `pos_payments`, `cash_drawer_movements` | `organization`, `products`, `inventory`, `sales`, `crm`, `banking`, `taxation` | `PosSessionOpened`, `PosSaleCompleted`, `PosSaleVoided`, `PosSessionClosed` |
| 08 | CRM | `crm` | 28 | `customers`, `contacts`, `addresses`, `leads`, `opportunities`, `crm_activities` | `organization`, `users`, `notifications` | `LeadConverted`, `CustomerCreated`, `CustomerCreditUpdated` |
| 09 | Purchase Management | `purchasing` | 23 | `purchase_requests`, `rfqs`, `purchase_orders`, `purchase_order_lines`, `goods_receipts`, `purchase_returns` | `organization`, `products`, `suppliers`, `inventory`, `workflows` | `PurchaseOrderApproved`, `GoodsReceived`, `PurchaseReturnCreated` |
| 10 | Supplier Management | `suppliers` | 24 | `suppliers`, `supplier_contacts`, `supplier_terms`, `supplier_evaluations` | `organization`, `documents` | `SupplierCreated`, `SupplierApproved` |

### Tier 3: Financial Core & Accounting Subledgers
| # | Spec Heading | Module Slug | Phase(s) | Authoritative Entities Owned | Allowed Dependencies | Emitted Domain Events |
|---|---|---|---|---|---|---|
| 11 | Accounting & Finance | `accounting` | 29–35 | `charts_of_accounts`, `accounts`, `fiscal_years`, `fiscal_periods`, `journal_entries` (immutable), `journal_entry_lines`, `cost_centers`, `exchange_rates` | `organization`, `customization`, `workflows` | `JournalPosted`, `JournalReversed`, `FiscalPeriodClosed` |
| 12 | Accounts Receivable | `receivables` | 30 | `customer_invoices`, `invoice_lines`, `credit_notes`, `ar_allocations` | `organization`, `crm`, `sales`, `accounting`, `taxation` | `CustomerInvoicePosted`, `InvoicePaid`, `CreditNoteIssued` |
| 13 | Accounts Payable | `payables` | 31 | `supplier_bills`, `bill_lines`, `debit_notes`, `ap_allocations` | `organization`, `suppliers`, `purchasing`, `accounting`, `taxation`, `workflows` | `SupplierBillPosted`, `BillApproved`, `BillSettled` |
| 14 | Cash & Banking | `banking` | 32 | `bank_accounts`, `cash_accounts`, `payments`, `bank_statements`, `bank_reconciliations` | `organization`, `accounting`, `receivables`, `payables` | `PaymentRecorded`, `PaymentReversed`, `BankReconciled` |
| 15 | Expense Management | `expenses` | 33 | `expense_categories`, `expense_claims`, `expense_items`, `reimbursements` | `organization`, `employees`, `accounting`, `banking`, `budgeting`, `workflows` | `ExpenseSubmitted`, `ExpenseApproved`, `ExpenseReimbursed` |
| 16 | Budgeting | `budgeting` | 34 | `budgets`, `budget_versions`, `budget_lines`, `budget_alerts` | `organization`, `accounting`, `workflows` | `BudgetApproved`, `BudgetThresholdExceeded` |
| 17 | Tax Management | `taxation` | 35 | `tax_profiles`, `tax_rates`, `tax_rules`, `tax_exemptions`, `tax_ledger_lines` | `organization`, `accounting` | `TaxRateUpdated` |

### Tier 4: People, Manufacturing, Supply Chain & Operations
| # | Spec Heading | Module Slug | Phase(s) | Authoritative Entities Owned | Allowed Dependencies | Emitted Domain Events |
|---|---|---|---|---|---|---|
| 18 | HR Management | `hr` | 36 | `hr_policies`, `positions`, `job_grades`, `onboarding_checklists` | `organization`, `employees` | `PositionCreated` |
| 19 | Employee Management | `employees` | 36 | `employees`, `employment_contracts`, `employee_documents` | `organization`, `users`, `hr`, `documents` | `EmployeeOnboarded`, `EmployeeTerminated` |
| 20 | Attendance & Leave | `attendance` | 37 | `shift_schedules`, `attendance_logs`, `timesheets`, `leave_types`, `leave_balances`, `leave_requests` | `organization`, `employees`, `workflows` | `LeaveApproved`, `TimesheetApproved` |
| 21 | Payroll | `payroll` | 38 | `pay_periods`, `compensation_structures`, `payroll_runs`, `payslips` | `organization`, `employees`, `attendance`, `accounting`, `banking`, `taxation`, `workflows` | `PayrollCalculated`, `PayrollApproved`, `PayrollSettled` |
| 22 | Manufacturing / MRP | `manufacturing` | 39 | `work_centers`, `production_orders`, `material_consumptions`, `production_outputs`, `mrp_runs` | `organization`, `products`, `bom`, `inventory`, `purchasing` | `ProductionReleased`, `MaterialConsumed`, `ProductionCompleted` |
| 23 | Bill of Materials | `bom` | 40 | `boms`, `bom_revisions`, `bom_lines`, `routings` | `organization`, `products`, `workflows` | `BomRevisionApproved` |
| 24 | Production Planning | `production` | 41 | `capacity_plans`, `production_schedules`, `planned_orders` | `organization`, `manufacturing`, `bom`, `inventory` | `ProductionSchedulePublished` |
| 25 | Quality Management | `quality` | 42 | `inspection_plans`, `quality_checks`, `nonconformances`, `corrective_actions` | `organization`, `inventory`, `manufacturing`, `purchasing` | `QualityHoldPlaced`, `QualityReleased`, `NonconformanceLogged` |
| 26 | Supply Chain Management | `supply-chain` | 43 | `replenishment_rules`, `supply_plans`, `lead_time_metrics` | `organization`, `inventory`, `purchasing`, `sales`, `manufacturing` | `ReplenishmentSuggested` |
| 27 | Logistics & Delivery | `logistics` | 44 | `shipments`, `shipment_items`, `delivery_routes`, `proof_of_delivery` | `organization`, `sales`, `warehouses`, `fleet`, `integrations` | `ShipmentDispatched`, `DeliveryConfirmed`, `DeliveryFailed` |
| 28 | Fleet Management | `fleet` | 45 | `vehicles`, `driver_assignments`, `fuel_logs`, `vehicle_inspections` | `organization`, `employees`, `assets`, `maintenance` | `VehicleInspectionDue` |
| 29 | Asset Management | `assets` | 46 | `fixed_assets`, `asset_transfers`, `depreciation_schedules`, `asset_disposals` | `organization`, `accounting`, `purchasing` | `AssetCapitalized`, `DepreciationPosted`, `AssetDisposed` |
| 30 | Maintenance Management | `maintenance` | 47 | `maintenance_plans`, `maintenance_work_orders`, `parts_usage` | `organization`, `assets`, `fleet`, `inventory` | `MaintenanceScheduled`, `WorkOrderCompleted` |
| 31 | Project Management | `projects` | 48 | `projects`, `milestones`, `tasks`, `project_budgets`, `project_timesheets` | `organization`, `employees`, `crm`, `accounting`, `expenses` | `ProjectCreated`, `MilestoneCompleted` |
| 32 | Contract Management | `contracts` | 49 | `contracts`, `contract_versions`, `obligations`, `renewal_alerts` | `organization`, `crm`, `suppliers`, `documents`, `workflows` | `ContractActivated`, `ContractExpiring` |
| 33 | Service Management | `services` | 50 | `service_orders`, `service_slas`, `field_assignments` | `organization`, `crm`, `products`, `inventory`, `projects`, `contracts` | `ServiceOrderCompleted` |
| 34 | Help Desk / Support | `help-desk` | 51 | `support_tickets`, `ticket_comments`, `sla_timers`, `escalation_rules` | `organization`, `crm`, `users`, `notifications`, `services` | `TicketCreated`, `SlaBreached`, `TicketResolved` |
| 35 | Appointment Management | `appointments` | 52 | `calendars`, `availability_slots`, `appointments` | `organization`, `crm`, `employees`, `notifications` | `AppointmentBooked`, `AppointmentCancelled` |

### Tier 5: Marketing, E-Commerce, BI, Integrations & AI
| # | Spec Heading | Module Slug | Phase(s) | Authoritative Entities Owned | Allowed Dependencies | Emitted Domain Events |
|---|---|---|---|---|---|---|
| 38 | Marketing Management | `marketing` | 53 | `campaigns`, `audience_segments`, `campaign_events`, `opt_outs` | `organization`, `crm`, `notifications` | `CampaignLaunched`, `ContactOptedOut` |
| 39 | E-commerce / Commerce | `commerce` | 54 | `commerce_channels`, `catalog_mappings`, `external_orders` | `organization`, `products`, `inventory`, `sales`, `integrations` | `ExternalOrderIngested` |
| 40 | Reporting / BI | `reporting` | 69–70 | `report_definitions`, `saved_reports`, `dashboards`, `kpi_snapshots` | All modules (Read-only analytical projections) | `ReportExportReady` |
| 42 | Integration Management | `integrations` | 71 | `integration_connections`, `webhook_endpoints`, `webhook_deliveries`, `external_id_maps` | `organization`, `jobs`, `audit` | `WebhookFailed`, `IntegrationSyncCompleted` |
| 43 | AI & Automation | `ai` | 75–76 | `ai_tool_allowlists`, `ai_sessions`, `ai_action_proposals`, `ai_evaluations` | `organization`, `users`, `workflows`, `audit` *(via App Services only)* | `AiProposalCreated`, `AiActionApproved` |

---

## 3. Dependency Enforcement Rules

1. **Downward Dependency Only:** A higher-tier module (e.g., Tier 3 `receivables`) may call Tier 2 (`sales`, `crm`) and Tier 0 (`organization`, `users`), never vice versa.
2. **Core Ledger Protection:** Only `accounting` writes to `journal_entries` and `journal_entry_lines`; `sales`, `purchasing`, `pos`, `receivables`, `payables`, `banking`, and `payroll` submit validated posting requests through `accountingModule.postJournal(tx, context, entryInput)`.
3. **Stock Ledger Protection:** Only `inventory` writes to `inventory_movements` and `inventory_balances`; `sales`, `pos`, `purchasing`, `warehouses`, and `manufacturing` invoke `inventoryModule.recordMovement(...)` or `reserveStock(...)`.
4. **Static Dependency Linting:** Automated lint rules (Phase 04) will fail builds if any module imports internal files (`infrastructure/`, `domain/`) of another module instead of its public `index.js`.
