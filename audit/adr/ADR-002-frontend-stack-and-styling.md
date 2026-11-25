# ADR-002: JavaScript-Only Frontend, Next.js App Router & CSS Modules

* **Status:** Approved by Specification (`00-MASTER-INSTRUCTIONS.md` Sec 9–12, `04-TECH-STACK.md` Sec 2–15)
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval

## Context
The ERP platform requires a rich, dense, accessible, multi-theme enterprise web UI built strictly without TypeScript and strictly without Tailwind CSS.

## Decision
1. **Language:** **JavaScript (`ES6+`, `.js` / `.jsx`) strictly**. Zero `.ts`, `.tsx`, or `tsconfig.json` files permitted anywhere in the repository. Public module interfaces and shared objects use **JSDoc** annotations and **Zod** runtime schemas for contract clarity.
2. **Framework:** **Next.js (App Router)** under `client/src/app/` paired with **React** components under `client/src/components/` and `client/src/modules/*/components/`.
   * Rendering strategy is chosen per route: SSR/Server Components where beneficial for initial shell/public pages; Client Components (`'use client'`) for dense interactive ERP workspaces, tables, and POS terminals.
   * Next.js must never directly access PostgreSQL; all data flows via `/api/v1` HTTP boundaries.
3. **Styling Architecture:** **Custom CSS, CSS Modules (`*.module.css`), and CSS Custom Properties (`var(--token-*)`)** exclusively. **Tailwind CSS is strictly prohibited** (verified via CI/automated test checks).
   * Supports 10+ runtime themes (`data-theme="ocean-blue"` ... `"dark-professional"`) via token sheets in `client/src/styles/themes/` and honors `prefers-reduced-motion` per `docs/07-THEME-SYSTEM.md` and `docs/08-ANIMATION-MOTION.md`.
4. **Client State, Forms & Primitives:**
   * **TanStack Query** for server-state caching, pagination, and background invalidation.
   * **Zustand + React Context** strictly for minimal local UI/session state (sidebar collapsed, active theme, active POS cart).
   * **React Hook Form + Zod** for complex ERP forms with dynamic/custom fields.
   * **Radix UI Primitives** (unstyled accessible dialogs, popovers, tabs, dropdowns) styled with CSS Modules + **Lucide React** icons.

## Consequences
* Guarantees 100% compliance with the non-negotiable JavaScript-only and no-Tailwind mandates.
* Accessible keyboard navigation (`Ctrl+K` Command Palette, ARIA dialogs) is inherited from Radix primitives without importing an opinionated external CSS framework.
