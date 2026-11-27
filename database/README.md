# Authoritative Database Directory

Per `ADR-004` and `docs/development/02-folder-structure.md` Section 82, this directory is the single authoritative home for PostgreSQL schema artifacts:

* `migrator.js` — Deterministic forward/rollback SQL migration runner with SHA-256 checksum immutability enforcement.
* `migrations/` — Versioned forward (`NNNN_*.sql`) and rollback (`NNNN_*.down.sql`) SQL migrations.
* `seeds/` — System reference data seeds (never mixing demo data into production seeds).

### Commands
* `npm run db:bootstrap` — Creates `erp_platform_dev` and `erp_platform_test` if missing.
* `npm run db:migrate` — Applies pending migrations to the active development database.
* `npm run db:migrate:test` — Applies pending migrations to the isolated test database.
* `npm run db:rollback` — Rolls back the latest migration using its `.down.sql` script.
* `npm run db:status` — Prints applied/pending migration status.
