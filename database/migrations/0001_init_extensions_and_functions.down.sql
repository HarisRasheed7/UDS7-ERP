-- 0001_init_extensions_and_functions.down.sql

DROP FUNCTION IF EXISTS app.prevent_immutable_mutation();
DROP FUNCTION IF EXISTS app.set_updated_at();
DROP FUNCTION IF EXISTS app.current_organization_id();
DROP SCHEMA IF EXISTS app CASCADE;
