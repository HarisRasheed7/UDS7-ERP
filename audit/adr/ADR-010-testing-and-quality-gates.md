# ADR-010: Testing Stack, Quality Tooling & JavaScript-Only Guardrails

* **Status:** Proposed — Recommended for Project Owner Sign-off
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval

## Context
`docs/04-TECH-STACK.md` Sec 39–40 recommends Vitest or Jest, React Testing Library, Playwright, ESLint, and Prettier. `docs/20-TESTING-QA.md`, `docs/development/08-testing-rules.md`, and `docs/PHASES.md` Phase 04 require fast feedback suites, integration/security/tenant-isolation suites, and static verification of the JavaScript-only & no-Tailwind rules.

## Options Considered
* **Option A: Vitest (Unit/Component/API Integration) + React Testing Library + Playwright (E2E/A11y) + ESLint/Prettier + Custom Static Policy Check Script**
* **Option B:** Jest + Babel transform setup + Cypress.

## Decision
**Adopt Option A:**
1. **Unit, Component & API Integration Runner:** **Vitest** (native ESM/CJS JavaScript ergonomics without complex Babel/TypeScript config, fast watch mode, seamless integration with React Testing Library and Fastify `.inject()` / PostgreSQL test harness).
2. **End-to-End & Accessibility Runner:** **Playwright** (cross-browser responsive verification, keyboard navigation, reduced-motion checks, axe-core accessibility assertions).
3. **Code Quality & Formatting:** **ESLint** (with security, import-boundary, and `eslint-plugin-jsx-a11y` rules) + **Prettier**.
4. **Architectural & Technology Guardrail Script (`scripts/testing/verify-policy.js`):**
   * Fails immediately if any `.ts`, `.tsx`, `tsconfig*`, or Tailwind CSS package/config is introduced.
   * Enforces module import boundaries (forbids cross-module internal repository imports).
5. **Dual Test Organization:**
   * Phase/module verification tracking suite in `audit/verification/` (`test_phase_N.js`) preserving step-by-step audit progress.
   * Full mirror test suite in `tests/` (`unit/`, `integration/`, `api/`, `component/`, `e2e/`, `security/`, `tenant-isolation/`, `accounting/`, `inventory/`, `migration/`, `accessibility/`).

## Consequences
* Fast, deterministic JavaScript-native test execution across backend, frontend, and PostgreSQL integration tests.
* Automated guardrails prevent accidental technology drift (TypeScript or Tailwind) across future phases.
