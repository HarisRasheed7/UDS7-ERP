-- 0002_init_foundation_core.sql
-- Phase 05 Foundation Core Tables: Organizations, Immutable Audit Logs,
-- Idempotency Keys, Transactional Outbox, and Concurrency-Safe Document Sequences.

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  legal_name VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'SUSPENDED', 'ARCHIVED')),
  default_currency CHAR(3) NOT NULL DEFAULT 'USD',
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  locale VARCHAR(16) NOT NULL DEFAULT 'en-US',
  version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION app.set_updated_at();

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_organizations ON organizations
  FOR ALL
  TO erp_app_runtime
  USING (id = app.current_organization_id())
  WITH CHECK (id = app.current_organization_id());

GRANT SELECT, UPDATE ON organizations TO erp_app_runtime;

-- ---------------------------------------------------------------------------

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  actor_user_id UUID NULL,
  actor_type VARCHAR(32) NOT NULL DEFAULT 'USER'
    CHECK (actor_type IN ('USER', 'SYSTEM_JOB', 'INTEGRATION_WEBHOOK', 'AI_TOOL')),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NULL,
  previous_state JSONB NULL,
  new_state JSONB NULL,
  request_id VARCHAR(128) NULL,
  correlation_id VARCHAR(128) NULL,
  ip_address INET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_org_created
  ON audit_logs (organization_id, created_at DESC);

CREATE INDEX idx_audit_logs_org_entity
  ON audit_logs (organization_id, entity_type, entity_id);

CREATE TRIGGER trg_audit_logs_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION app.prevent_immutable_mutation();

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
  FOR ALL
  TO erp_app_runtime
  USING (organization_id = app.current_organization_id())
  WITH CHECK (organization_id = app.current_organization_id());

-- Append-only permission for runtime role (plus trigger blocks owner/superuser mutations too)
GRANT SELECT, INSERT ON audit_logs TO erp_app_runtime;

-- ---------------------------------------------------------------------------

CREATE TABLE idempotency_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  route_signature VARCHAR(200) NOT NULL,
  idempotency_key VARCHAR(128) NOT NULL,
  request_hash VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL
    CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED')),
  response_status INTEGER NULL,
  response_body JSONB NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, route_signature, idempotency_key)
);

CREATE INDEX idx_idempotency_keys_expires
  ON idempotency_keys (expires_at);

ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_keys FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_idempotency_keys ON idempotency_keys
  FOR ALL
  TO erp_app_runtime
  USING (organization_id = app.current_organization_id())
  WITH CHECK (organization_id = app.current_organization_id());

GRANT SELECT, INSERT, UPDATE, DELETE ON idempotency_keys TO erp_app_runtime;

-- ---------------------------------------------------------------------------

CREATE TABLE domain_outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  event_type VARCHAR(120) NOT NULL,
  aggregate_type VARCHAR(100) NOT NULL,
  aggregate_id UUID NOT NULL,
  payload JSONB NOT NULL,
  correlation_id VARCHAR(128) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'DEAD_LETTER')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outbox_pending_dispatch
  ON domain_outbox_events (status, available_at)
  WHERE status IN ('PENDING', 'FAILED');

CREATE INDEX idx_outbox_org_created
  ON domain_outbox_events (organization_id, created_at DESC);

ALTER TABLE domain_outbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_outbox_events FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_outbox_events ON domain_outbox_events
  FOR ALL
  TO erp_app_runtime
  USING (organization_id = app.current_organization_id())
  WITH CHECK (organization_id = app.current_organization_id());

GRANT SELECT, INSERT, UPDATE ON domain_outbox_events TO erp_app_runtime;

-- ---------------------------------------------------------------------------

CREATE TABLE document_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  document_type VARCHAR(64) NOT NULL,
  prefix VARCHAR(32) NOT NULL,
  current_value BIGINT NOT NULL DEFAULT 0 CHECK (current_value >= 0),
  padding INTEGER NOT NULL DEFAULT 6 CHECK (padding BETWEEN 1 AND 12),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, document_type)
);

CREATE TRIGGER trg_document_sequences_updated_at
  BEFORE UPDATE ON document_sequences
  FOR EACH ROW
  EXECUTE FUNCTION app.set_updated_at();

ALTER TABLE document_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_sequences FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_document_sequences ON document_sequences
  FOR ALL
  TO erp_app_runtime
  USING (organization_id = app.current_organization_id())
  WITH CHECK (organization_id = app.current_organization_id());

GRANT SELECT, INSERT, UPDATE ON document_sequences TO erp_app_runtime;
