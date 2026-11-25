# ADR-006: Authentication, Session Lifecycle & Authorization (RBAC + ABAC + SoD)

* **Status:** Approved by Specification (`09-AUTH-SECURITY.md`, `26-USER-ROLES-PERMISSIONS-SPECIFICATION.md`)
* **Date:** November 2026
* **Phase:** Phase 02 — Architecture and ADR Approval

## Context
The platform requires enterprise authentication, immediate session revocation, granular multi-organization authorization, record/branch scoping, and Segregation of Duties (SoD). Additionally, Phase 01 noted both colon-separated and dot-separated permission examples across documents; a single canonical notation must be enforced.

## Decision
1. **Password Security:** **Argon2id** (`argon2` library) for password hashing with unique per-user salts. Password hashes are stripped by API serializers and never returned to clients.
2. **Session & Token Model:**
   * **Browser Clients:** `HttpOnly`, `Secure` (in HTTPS), `SameSite=Lax` cookies carrying a short-lived signed JWT access token (or session ID) + rotating refresh token tracked by `token_family_id` in `user_sessions`.
   * **API / Future Mobile Clients:** Bearer access token + explicit token revocation list/session table check, enabling instant administrator forced logout, password-reset revocation, and replay/family reuse detection.
   * **Brute-Force & CSRF:** Rate limiting per IP/account on `/auth/login` & `/auth/reset-password`; Origin/Referer + CSRF token verification for cookie-authenticated state-changing requests.
3. **Canonical Permission Notation:** Standardize on **dot-notation** `module.resource.action` (per `docs/09-AUTH-SECURITY.md` Sec 25, `docs/26` passim, and `docs/development/02-folder-structure.md` Sec 56 — e.g., `inventory.stock.view`, `inventory.stock.adjust`, `finance.journal.post`, `users.roles.assign`).
4. **Default-Deny Authorization Pipeline (RBAC + ABAC + SoD):**
   * Every protected route declares required permission(s) and scope (`organization`, `company`, `branch`, `warehouse`, `owned`).
   * Server authorization middleware evaluates active `organization_memberships`, assigned roles, ABAC scope constraints, and Segregation of Duties (maker-checker checks verifying `actor.id !== record.created_by` where SoD policy applies).

## Consequences
* Eliminates permission-naming drift across all 47 modules before any module code is written.
* Instant session revocation protects compromised accounts immediately instead of waiting for long-lived stateless JWTs to expire.
