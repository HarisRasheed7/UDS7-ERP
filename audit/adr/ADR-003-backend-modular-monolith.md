# ADR-003: Modular Monolith Backend Framework (Node.js + Fastify)

* **Status:** Proposed — Recommended for Project Owner Sign-off
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval
* **Resolves:** `DEC-05` (from Phase 00 Audit)

## Context
`docs/04-TECH-STACK.md` Sec 16 specifies JavaScript + Node.js and lists Fastify, Express, or NestJS as potential frameworks. `docs/development/02-folder-structure.md` Sec 38 prescribes a dedicated `server/` directory alongside `client/` as a **Modular Monolith First** (`docs/00-MASTER-INSTRUCTIONS.md` Sec 17, `docs/03-ARCHITECTURE.md` Sec 34–35).

## Options Considered
* **Option A: Dedicated `server/` Node.js Modular Monolith using Fastify**
  * Fastify provides native plugin encapsulation per module, built-in JSON schema / Zod validation hooks, high throughput, built-in `pino` structured logging, and clean separation from Next.js frontend bundling.
* **Option B: Next.js API Route Handlers as the entire backend**
  * Couples backend domain modules, background workers, and long-running jobs tightly to Next.js serverless/edge build lifecycles and complicates future independent API deployment or mobile client consumption.
* **Option C: Express or NestJS**
  * Express lacks modern async error propagation and native encapsulation out of the box (Express 4). NestJS relies heavily on TypeScript decorators and experimental metadata reflection, which conflicts with the JavaScript-only rule.

## Decision
**Adopt Option A: Standalone `server/` Node.js Modular Monolith powered by Fastify (`/api/v1`).**
* Each business module exposes a Fastify route plugin registered under `/api/v1` and a JavaScript public module facade (`server/src/modules/<slug>/index.js`).
* Strict layer boundary: `Route` $\to$ `Middleware` $\to$ `Thin Controller` $\to$ `Application Service` $\to$ `Domain Rules` $\to$ `Repository` $\to$ `PostgreSQL`.
* Next.js in `client/` acts solely as the frontend application server and UI consumer over HTTPS.

## Consequences
* Clean mobile-ready API boundary (`docs/22-MOBILE-FUTURE.md`) independent of Next.js web rendering.
* Zero TypeScript-first decorator hacks required (unlike NestJS).
* Each module (`inventory`, `accounting`, `ai`, etc.) remains cleanly encapsulated for optional future service extraction.
