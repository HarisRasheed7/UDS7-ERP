# ADR-009: Dual-Stream Audit Trail, Structured Logging & Error Envelope

* **Status:** Approved by Specification (`00-MASTER-INSTRUCTIONS.md` Sec 65, 88, 92; `14-API-SPECIFICATION.md` Sec 36; `PHASES.md` Phase 12)
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval

## Context
`docs/PHASES.md` Phase 12 explicitly mandates: *"Distinguish business audit history from diagnostic logs."* Business auditors need tamper-proof records of financial, security, and operational state changes, while operators need searchable technical logs without secret/PII exposure.

## Decision
1. **Stream 1 — Immutable Business Audit Trail (`audit_logs` in PostgreSQL):**
   * Records `id`, `organization_id`, `actor_user_id`, `actor_type`, `action`, `entity_type`, `entity_id`, `previous_state`, `new_state`, `request_id`, `correlation_id`, `ip_address`, `created_at`.
   * Written inside the same transaction as sensitive mutations when atomicity is required; protected by PostgreSQL immutability trigger and `audit.logs.view` authorization.
   * Sensitive fields (`password_hash`, `mfa_secret`, `api_key`) are explicitly redacted before persistence.
2. **Stream 2 — Structured Diagnostic Logs (`pino` JSON logger):**
   * Every HTTP request receives `X-Request-ID` and `X-Correlation-ID`.
   * Logs redact `authorization`, `cookie`, `password`, `token`, and secret headers automatically via `pino` redact paths.
   * Diagnostic logs go to stdout (container-ready) and never block transactions.
3. **Standardized Error Taxonomy:**
   * All domain/validation/auth failures map to explicit error codes (`VALIDATION_ERROR`, `FORBIDDEN`, `CONFLICT`, `BUSINESS_RULE_VIOLATION`, etc.) formatted as `{ success: false, error: { code, message, details }, requestId }`.
   * Internal stack traces, SQL states, and infrastructure metadata are strictly suppressed from HTTP responses.

## Consequences
* Complete forensic traceability for compliance audits alongside safe, fast incident debugging.
