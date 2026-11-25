# Environment Separation Configuration

Per `docs/21-DEPLOYMENT-DEVOPS.md` Section 5 and `docs/00-MASTER-INSTRUCTIONS.md` Section 123:

* `development`: Local developer runtime with safe `.env` defaults (`LOCAL_STORAGE_PATH=./storage`).
* `test`: Isolated test environment invoked by Vitest (`NODE_ENV=test`), never pointing at staging or production databases.
* `staging`: Production-like topology validating migrations, TLS, and builds with strict non-default `SESSION_SECRET` and `DATABASE_URL`.
* `production`: Hardened runtime enforcing strict secret validation in `shared/schemas/envSchema.js`.

Secrets are **never** stored in this directory. Copy `.env.example` to `.env` locally.
