# Authoritative Database Directory

Per `ADR-004` and `docs/development/02-folder-structure.md` Section 82, this directory is the single authoritative home for PostgreSQL schema artifacts:

* `migrations/` — Versioned forward/rollback SQL migrations (introduced in Phase 05).
* `seeds/` — System reference data seeds (never mixing demo data into production seeds).

> Note: PostgreSQL connection pooling and migration execution tooling will be implemented in **Phase 05 — PostgreSQL and migration foundation**.
