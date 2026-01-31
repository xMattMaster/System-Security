-- Create non-superuser app role
CREATE ROLE nextjs_app WITH LOGIN;

-- Grant basic connect/usage privileges
GRANT CONNECT ON DATABASE postgres TO nextjs_app;
GRANT USAGE ON SCHEMA public TO nextjs_app;

-- Grant table-level privileges (adjust for your tables)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nextjs_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO nextjs_app;

-- Default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nextjs_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO nextjs_app;
