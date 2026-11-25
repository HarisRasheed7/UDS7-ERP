# ADR-008: Staged Infrastructure (PostgreSQL Outbox First) & File Storage Abstraction

* **Status:** Proposed — Recommended for Project Owner Sign-off
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval

## Context
`docs/00-MASTER-INSTRUCTIONS.md` Sec 15 & 121 and `docs/PHASES.md` state: *"Add Redis or other infrastructure only when justified by approved requirements and architecture... Avoid unnecessary operational complexity."* Meanwhile, `docs/03-ARCHITECTURE.md` Sec 17–19 requires background job capability, caching interfaces, and non-DB binary file storage.

## Options Considered
* **Option A: Staged Infrastructure — PostgreSQL Outbox/Job Queue + In-Process/DB Cache First (Phases 03–18), adding Redis + BullMQ in Phase 19 when background scale justifies it; Storage Adapter (`local FS` dev / `S3-MinIO` prod).**
* **Option B:** Require Redis, BullMQ, MinIO, and Elasticsearch containers from Phase 03 day one.

## Decision
**Adopt Option A (Staged Infrastructure Behind Clean Abstractions):**
1. **Background Jobs & Cache Interfaces:** Define clean `server/src/jobs/` and `server/src/services/cache/` interfaces in Phases 06–12. Initial implementation uses PostgreSQL (`domain_outbox_events` / `background_jobs` table) for reliable queued work, keeping local developer setup to just **Node.js + PostgreSQL**.
2. **Redis & BullMQ Activation:** Introduce Redis + BullMQ cleanly at **Phase 19 (Background jobs)** and **Phase 80 (Scale testing)** behind the existing adapters without changing module domain code.
3. **File Storage (`server/src/files/`):** Binary assets never live in PostgreSQL BYTEA or `client/public/`. All uploads pass size/MIME/filename validation and go through a `StorageProvider` interface:
   * `LocalDiskStorageProvider` (writes to ignored private `storage/` directory outside web root) for local dev/testing.
   * `S3StorageProvider` (AWS S3 / MinIO compatible) for staging/production.
   * All downloads flow through authenticated, tenant-checked, record-authorized endpoints.

## Consequences
* Frictionless onboarding and CI execution during foundational phases without heavy Docker orchestration overhead.
* Preserves full architectural readiness for high-throughput Redis queues and S3 object storage.
