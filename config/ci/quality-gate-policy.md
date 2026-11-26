# Continuous Integration & Quality-Gate Policy

**Project:** Multi-Organization, Multi-Industry ERP & Business Management Platform  
**Authority:** `docs/PHASES.md` (Phase 04), `docs/20-TESTING-QA.md`, `docs/21-DEPLOYMENT-DEVOPS.md`, `docs/development/08-testing-rules.md`  
**Workflow:** `.github/workflows/ci.yml`

---

## 1. Gate Tiers: Fast Feedback vs Full Verification

| Tier                    | Command               | Executed Checks                                                                                                                                       | Target Runtime | Blocking?           |
| ----------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------- |
| **Fast Feedback**       | `npm run verify:fast` | Static policy (`verify-policy.js`), Migration integrity (`check-migrations.js`), ESLint, Prettier format check, Unit tests (`tests/unit/`)            | < 10s          | **YES (Hard Gate)** |
| **Full Verification**   | `npm run verify:full` | All Fast Gates + Full Vitest suite (with JSON report retention) + Phase Verification suites (`test:phases`) + Next.js production build (`next build`) | < 60s          | **YES (Hard Gate)** |
| **Dependency Security** | `npm run audit:deps`  | `npm audit --audit-level=high`                                                                                                                        | < 10s          | **YES (Hard Gate)** |

---

## 2. Mandatory Non-Ignorable Rules

1. **Zero Silent Failures:** No CI step uses `continue-on-error: true`. Any non-zero exit code fails the workflow and blocks merging.
2. **JavaScript-Only Static Enforcement:** `verify-policy.js` immediately blocks `.ts`, `.tsx`, `tsconfig*`, or `typescript` dependencies.
3. **No Tailwind CSS Static Enforcement:** `verify-policy.js` immediately blocks `tailwind.config.*`, `tailwindcss` dependencies, and `@tailwind` directives in CSS files.
4. **Module & Client Boundary Enforcement:**
   - `verify-policy.js` blocks cross-module imports targeting another module's internal `infrastructure/`, `domain/`, or `repositories/` folders.
   - ESLint + `verify-policy.js` block `client/src/` from importing `server/`, `pg`, `fastify`, or `dotenv`.
5. **Migration Integrity:** `check-migrations.js` enforces sequential `NNNN_snake_case.sql` ordering and forbids floating-point (`REAL`, `FLOAT`, `DOUBLE PRECISION`) column definitions on monetary or quantity fields.
6. **Secret Hygiene:** `.env` (other than `.env.example`), private keys (`BEGIN PRIVATE KEY`), and API/GitHub tokens immediately fail CI.
7. **Test Report Retention:** CI uploads `reports/` (`vitest-report.json`, `ci-summary.json`) as workflow artifacts retained for **14 days** (`if: always()`).

---

## 3. Recommended GitHub Branch Protection Settings (`main`)

- Require pull request reviews before merging (with CODEOWNERS review from `.github/CODEOWNERS`).
- Require status checks to pass before merging:
  - `Fast Feedback & Policy Gates`
  - `Full Verification, Build & Dependency Security`
- Require branches to be up to date before merging.
- Disallow force pushes and branch deletions on `main`.
