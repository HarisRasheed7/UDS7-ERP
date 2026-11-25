# UDS7-ERP

UDS7 ERP is a comprehensive, scalable, and modular enterprise resource planning platform designed to manage multiple organizations and industries through a unified ecosystem, integrating business operations, finance, inventory, HR, sales, manufacturing, analytics, automation, and advanced management capabilities.

> **Internal Engineering Baseline:** Per [docs/PROJECT-IDENTITY.md](docs/PROJECT-IDENTITY.md) and [ADR-001](audit/adr/ADR-001-governance-and-specs.md), internal source packages and UI strings use neutral platform naming (`@platform/*`, *"Multi-Organization ERP & Business Management Platform"*) until an official brand identity is finalized.

---

## Architecture & Technology Constraints

* **Language:** JavaScript (`ES6+`) strictly — **TypeScript is prohibited**
* **Frontend:** React + Next.js (App Router) + **Custom CSS / CSS Modules / Design Tokens** — **Tailwind CSS is prohibited**
* **Backend:** Node.js + Fastify Modular Monolith (`/api/v1`)
* **Database:** PostgreSQL (authoritative relational store, wired in Phase 05+)
* **Validation & Testing:** Zod + Vitest + ESLint + Prettier

---

## Canonical Repository Structure

```text
├── client/                  # Next.js (App Router) + React + CSS Modules frontend
├── server/                  # Node.js + Fastify modular monolith API server
├── shared/                  # Platform-neutral constants, Zod schemas & env validators
├── database/                # Authoritative PostgreSQL SQL migrations & seeds (Phase 05+)
├── tests/                   # Mirror unit, integration, API, security & E2E suites
├── scripts/                 # Dev runner, policy checks & validation automation
├── config/                  # Environment policy documentation & shared configs
├── docs/                    # Authoritative product, architecture & development specs
├── audit/                   # Phase audit reports, ADRs (ADR-001..010) & phase tests
├── .env.example             # Safe environment template (never commit .env files)
├── .gitignore               # Secret, artifact & dependency exclusions
└── package.json             # npm workspaces root & validation scripts
```

---

## Local Developer Setup

### 1. Prerequisites
* **Node.js** `>= 20.0.0` (verified on `v26.13.1`)
* **npm** `>= 10.0.0` (verified on `11.20.0`)
* **PostgreSQL** `>= 15` *(required starting in Phase 05; optional during Phases 03–04)*

### 2. Clean Checkout Installation
```bash
git clone https://github.com/HarisRasheed7/UDS7-ERP.git
cd UDS7-ERP
npm install
```

> **Windows PowerShell Note:** If PowerShell blocks `npm` script execution (`npm.ps1 cannot be loaded`), run `npm.cmd install` and `npm.cmd run <script>` or execute commands via Git Bash / Command Prompt.

### 3. Environment Configuration
Copy the template file and adjust local settings (never commit `.env`):
```bash
cp .env.example .env
```
* Server configuration is validated on startup by `shared/schemas/envSchema.js`.
* Safe development defaults are applied automatically in `NODE_ENV=development` and `NODE_ENV=test`, while `staging` and `production` reject placeholder credentials (`CHANGE_ME` or `dev-only`).

### 4. Baseline Commands
| Command | Purpose |
|---|---|
| `npm run dev` | Starts both Fastify API server (`:4000`) and Next.js client (`:3000`) |
| `npm run dev:server` | Starts only the backend API server with watch reload |
| `npm run dev:client` | Starts only the Next.js frontend |
| `npm run build` | Builds the Next.js production bundle |
| `npm run lint` | Runs ESLint across all JavaScript & JSX code |
| `npm run format:check` | Verifies Prettier code formatting |
| `npm run policy:check` | Enforces JS-only, No-Tailwind, and secret hygiene rules |
| `npm test` | Runs Vitest unit & API integration tests |
| `npm run test:phases` | Runs sequential phase verification suites (`audit/verification/`) |
| `npm run validate` | Runs all gates: `policy:check`, `lint`, `format:check`, `test`, `test:phases` |

### 5. Health Verification
When `npm run dev:server` is running:
* **Liveness:** `GET http://127.0.0.1:4000/api/v1/health/live`
* **Readiness:** `GET http://127.0.0.1:4000/api/v1/health/ready`

---

## Troubleshooting

1. **PowerShell blocks `npm`:** Run `npm.cmd run validate` instead of `npm run validate`, or use Command Prompt / Git Bash.
2. **Environment validation error on startup:** Ensure `SESSION_SECRET` is at least 16 characters in development (32+ unique characters in staging/production) and `NEXT_PUBLIC_API_BASE_URL` is a valid URL.
3. **PostgreSQL not installed yet:** `GET /api/v1/health/ready` explicitly reports `pending_phase_05_db_foundation` until Phase 05 wires PostgreSQL pooling and migrations.
