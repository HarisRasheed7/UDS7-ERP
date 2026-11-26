## Pull Request Summary

### Purpose & Scope

- Describe the module, phase, or defect addressed:
- Related Phase / Requirement ID(s):

### Affected Layers & Modules

- Affected module(s):
- Database migration impact (list `database/migrations/*.sql` files or `None`):
- API contract impact (`/api/v1` changes or `None`):
- Security / Tenant Isolation / Permission impact:

### Mandatory Pre-Merge Verification Checklist

- [ ] **JavaScript-only & No Tailwind:** `npm run policy:check` passes (zero `.ts`/`.tsx`/Tailwind).
- [ ] **Migration safety:** `npm run migrations:check` passes (sequential numbering, `NUMERIC(20, 4)` precision).
- [ ] **Code quality:** `npm run lint` and `npm run format:check` pass cleanly.
- [ ] **Automated tests:** `npm run verify:full` (Vitest unit/API + Phase verification + `next build`) passes.
- [ ] **Server authority:** Authorization, tenant isolation (`organization_id`), and business rules are enforced server-side.
- [ ] **Secrets hygiene:** No `.env` files, credentials, or API keys committed.
- [ ] **Documentation & Phase Tracker:** Updated specs and `audit/verification/PHASE-TRACKER.md` if applicable.

### Rollback / Recovery Notes

- How can this change be safely reverted if needed?
