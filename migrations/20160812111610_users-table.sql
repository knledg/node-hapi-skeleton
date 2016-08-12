---!> MARINER:MIGRATE:UP:
BEGIN;

CREATE TABLE users (
  id serial,
  name text NOT NULL,
  nickname text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW(),
  PRIMARY KEY (id)
);

COMMIT;

---!> MARINER:MIGRATE:DOWN:
BEGIN;

DROP TABLE users;

COMMIT;
