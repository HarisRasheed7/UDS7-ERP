# ADR-007: Atomic Transactions, Immutable Ledgers, Concurrency & Outbox

* **Status:** Approved by Specification (`00-MASTER-INSTRUCTIONS.md` Sec 33–41, `13-DATA-MODEL.md`, `development/05-database-rules.md`)
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval

## Context
Enterprise ERP workflows (POS checkouts, sales fulfillment, inventory transfers, financial postings) span multiple domains and face concurrent users, network retries, and strict audit compliance.

## Decision
1. **Unit-of-Work Atomic Transactions:** Cross-module synchronous state mutations (e.g., finalizing a POS sale $\to$ sale header + lines + stock movement + payment + journal entry + audit event + outbox event) execute inside one shared PostgreSQL transaction (`tx`). Any failure rolls back the entire operation.
2. **Database-Enforced Immutability:**
   * Posted `journal_entries`, `journal_entry_lines`, `inventory_movements`, and `audit_logs` are strictly **append-only**.
   * PostgreSQL `BEFORE UPDATE OR DELETE` triggers reject tampering on posted/immutable rows directly at the database engine level (`SQLSTATE 23514`). Corrections require explicit reversal/compensating entries.
3. **Concurrency Control:**
   * **Pessimistic Row Locking (`SELECT ... FOR UPDATE`):** Mandatory when allocating or deducting stock in `inventory_balances` and allocating `numbering_sequences`. Multi-item locks are acquired in ascending UUID/product order to prevent deadlocks.
   * **Optimistic Concurrency (`version` + `If-Match`):** Required for concurrent updates on editable master/draft documents.
4. **Idempotency Store:** Retriable mutation endpoints require `Idempotency-Key`, tracked in `idempotency_keys` within the transaction to guarantee at-most-once business execution.
5. **Transactional Outbox (`domain_outbox_events`):** Asynchronous events (notifications, search re-indexing, webhooks, async reports) are persisted inside the business transaction and published reliably after commit.

## Consequences
* Prevents silent partial transactions, overselling race conditions, duplicate financial postings, and dual-write inconsistencies.
* Validated early via `SPIKE-02` in Phase 05.
