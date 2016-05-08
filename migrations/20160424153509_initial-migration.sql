---!> MARINER:MIGRATE:UP:
BEGIN;

CREATE OR REPLACE FUNCTION update_record()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


/*
  Used anytime an action occurs, log should be human readable
  It may contain a pathname/query to build a link
  It may contain a user id to link to a user profile
  It must contain a human readable note about what occurred
  It must contain a sentiment - info, error, success, warning
  It may contain an array of tags
*/
CREATE TABLE audit_log (
  id serial NOT NULL PRIMARY KEY,
  user_id numeric,
  pathname character varying,
  query jsonb,
  note TEXT NOT NULL,
  tags character varying[],
  sentiment character varying NOT NULL DEFAULT 'info',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE heretic_jobs (
  id SERIAL NOT NULL PRIMARY KEY,
  queue_name text NOT NULL,
  status text DEFAULT 'pending',
  payload jsonb,
  attempt_logs jsonb[] DEFAULT '{}',
  max_attempts int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_attempted_at timestamptz
);
CREATE INDEX ON heretic_jobs (queue_name);
CREATE INDEX ON heretic_jobs (status);
CREATE TRIGGER update_heretic_jobs_updated_at BEFORE UPDATE ON heretic_jobs FOR EACH ROW EXECUTE PROCEDURE update_record();

CREATE TABLE metrics (
  id serial NOT NULL PRIMARY KEY,
  metric character varying,
  measurement character varying,
  unit character varying,
  tags character varying[],
  metadata jsonb,
  annotation character varying,
  created_at timestamptz DEFAULT current_timestamp
);

COMMENT ON COLUMN metrics.metric IS 'What is being measured. (e.g. Timing or Free Memory)';
COMMENT ON COLUMN metrics.measurement IS 'Value of the metric (e.g. 1799)';
COMMENT ON COLUMN metrics.unit IS 'Unit of measurement (e.g seconds vs milliseconds)';
COMMENT ON COLUMN metrics.tags IS 'Tag a very specific process to the measurement';
COMMENT ON COLUMN metrics.metadata IS 'Used for additional information (e.g. a specific sync it was tied to)';
COMMENT ON COLUMN metrics.annotation IS 'Used to note something externally that could affect a measurement (upgrading a package)';


COMMIT;

---!> MARINER:MIGRATE:DOWN:
BEGIN;

DROP TABLE audit_log;
DROP TABLE heretic_jobs;
DROP TABLE metrics;

COMMIT;
