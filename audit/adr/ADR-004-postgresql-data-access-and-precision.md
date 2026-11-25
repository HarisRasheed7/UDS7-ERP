# ADR-004: PostgreSQL Data Access (`pg` + SQL Migrations) & Precision Strategy

* **Status:** Proposed — Recommended for Project Owner Sign-off
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval
* **Resolves:** `DEC-P1-03` (from Phase 01)

## Context
`docs/04-TECH-STACK.md` Sec 18–19 mandates PostgreSQL as the authoritative database and warns: *"Do not hide important business-critical queries behind abstractions that prevent optimization."* The platform requires PostgreSQL Row-Level Security (`SET LOCAL`), database triggers blocking mutations on posted journals/audit logs, pessimistic row locking (`SELECT ... FOR UPDATE`), exact decimal currency precision, and reproducible migrations.

## Options Considered
* **Option A: `node-postgres` (`pg`) + Versioned Forward/Rollback SQL Migrations (`node-pg-migrate` / controlled SQL runner)**
  * Full native access to PostgreSQL triggers, RLS `SET LOCAL`, `SELECT ... FOR UPDATE`, partial composite indexes, `NUMERIC(20, 4)` exact strings, and deterministic query optimization without ORM codegen or TypeScript schema DSLs.
* **Option B: Prisma ORM**
  * Historically relies on TypeScript client codegen, struggles cleanly with PostgreSQL RLS session variables across pooled queries, and abstracts away complex locking/reporting SQL.
* **Option C: Knex / Drizzle**
  * Drizzle targets TypeScript primarily; Knex adds query-builder abstraction without enforcing domain boundaries.

## Decision
**Adopt Option A: `node-postgres` (`pg`) with Parameterized SQL Repository Helpers + Versioned SQL Migrations (`database/migrations/`).**
1. **Query Safety:** 100% parameterized queries (`$1, $2...`); dynamic column sorting strictly validated against module allowlists (`docs/development/06-api-rules.md` Sec 18).
2. **Migrations:** Single authoritative migration path in `database/migrations/` using timestamp/sequential SQL scripts (`0001_init_core.sql`, etc.) with tracked execution history in `schema_migrations`.
3. **Money & Quantity Precision:**
   * All monetary columns use `NUMERIC(20, 4)` and exchange rates use `NUMERIC(18, 6)` in PostgreSQL.
   * `pg` parser returns `NUMERIC` as strings to JavaScript; all arithmetic uses **`decimal.js`** (`shared/utils/money.js`) — **zero floating-point `Number` arithmetic** for currency or quantities.
4. **Dates & Identifiers:**
   * All timestamps stored as `TIMESTAMPTZ` in UTC; calendar-only dates stored as `DATE`.
   * Primary keys are `UUID` (`id`), decoupled from sequential human-readable business document numbers (`invoice_number`, `journal_number`).

## Consequences
* Complete control over SQL execution plans, locks, triggers, and RLS without ORM magic or TypeScript codegen.
* Requires disciplined repository unit/integration tests (Phase 05) to verify SQL queries and migration reversibility.
