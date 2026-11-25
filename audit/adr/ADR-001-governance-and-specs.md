# ADR-001: Authoritative Specifications, Roadmap & Project Identity Governance

* **Status:** Proposed — Recommended for Project Owner Sign-off
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval
* **Resolves:** `DEC-01`, `DEC-02`, `DEC-03`, `DEC-04` (from Phase 00 Audit)

## Context
The documentation archive contains overlapping governance documents:
1. Root `00-MASTER-INSTRUCTIONS.md` (1,516 lines, 50 sections) vs `docs/00-MASTER-INSTRUCTIONS.md` (3,669 lines, 160 sections).
2. Three execution schedules: `docs/PHASES.md` (86 granular phases), `IMPLEMENTATION-ROADMAP-STAGES.md` (25 stages), and `docs/IMPLEMENTATION-ROADMAP.md`.
3. Consolidated module/industry specs (`docs/modules/23-MODULES-SPECIFICATION.md`, `docs/industries/24-INDUSTRY-SPECIFICATION.md`) vs an older exploded tree outline in `docs/md files structure .md`.
4. Project naming: `docs/PROJECT-IDENTITY.md` specifies Status `TBD` and neutral naming, whereas the repository/workspace is named `UDS7-ERP`.

## Options Considered
* **Option A:** Designate `docs/00-MASTER-INSTRUCTIONS.md` and `docs/PHASES.md` as primary canonical guides, retain the consolidated module/industry specifications, and keep source code/package names project-name neutral.
* **Option B:** Use the shorter root `00-MASTER-INSTRUCTIONS.md` and rewrite/split all consolidated docs into 51 separate files before writing any code.

## Decision
**Adopt Option A:**
1. **`docs/00-MASTER-INSTRUCTIONS.md`** is the authoritative master instruction document (while preserving root `00-MASTER-INSTRUCTIONS.md` unmodified for historical reference).
2. **`docs/PHASES.md`** governs phase sequencing, status vocabulary, and exit criteria, cross-referenced with `IMPLEMENTATION-ROADMAP-STAGES.md` and `docs/IMPLEMENTATION-MASTER-INSTRUCTIONS.md`.
3. **`docs/modules/23-MODULES-SPECIFICATION.md`** (47 module headings) and **`docs/industries/24-INDUSTRY-SPECIFICATION.md`** remain canonical without duplicating or splitting files prematurely.
4. **Project Name Neutrality:** All source packages, identifiers, namespaces, and internal labels remain neutral (`@platform/client`, `@platform/server`, `@platform/shared`) until an official brand name is approved per `docs/PROJECT-IDENTITY.md`.

## Consequences
* Eliminates conflicting rules during implementation.
* Preserves all original documentation files untouched as mandated by Phase 00 restrictions.
* Allows clean future rebranding by updating display labels in one central identity config without touching architecture or package IDs.
