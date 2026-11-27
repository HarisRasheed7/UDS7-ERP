-- 0001_init_extensions_and_functions.sql
-- Phase 05 Foundation: Extensions, Non-Superuser Runtime Role, Tenant Context Helper, Triggers

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'erp_app_runtime') THEN
    CREATE ROLE erp_app_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE SCHEMA IF NOT EXISTS app;
GRANT USAGE ON SCHEMA app TO erp_app_runtime;
GRANT USAGE ON SCHEMA public TO erp_app_runtime;

CREATE OR REPLACE FUNCTION app.current_organization_id()
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
$$;

GRANT EXECUTE ON FUNCTION app.current_organization_id() TO erp_app_runtime;

CREATE OR REPLACE FUNCTION app.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.prevent_immutable_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'IMMUTABLE_RECORD: % records cannot be updated or deleted once recorded', TG_TABLE_NAME
    USING ERRCODE = '23514';
END;
$$;
