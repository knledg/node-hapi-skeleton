---!> MARINER:MIGRATE:UP:
BEGIN;

INSERT INTO users (name, nickname, email) VALUES ('Jason', 'Jay', 'jason@knledg.com');
INSERT INTO users (name, nickname, email) VALUES ('Administrator', 'Admin', 'admin@knledg.com');

INSERT INTO audit_log (user_id, note, sentiment, created_at) VALUES (1, 'User 1 started server', 'neutral', '2016-08-09T16:00:00.047902+00');
INSERT INTO audit_log (user_id, note, sentiment, created_at) VALUES (2, 'User 2 tried deleting audit log but did not have permission', 'error', '2016-08-09T16:20:00.047902+00');
INSERT INTO audit_log (user_id, note, sentiment, created_at) VALUES (1, 'User 3 logged in', 'success', '2016-08-09T16:30:00.047902+00');

COMMIT;

---!> MARINER:MIGRATE:DOWN:
BEGIN;

DELETE FROM audit_log WHERE note LIKE 'User %';
TRUNCATE users RESTART IDENTITY; -- needed for up/down migration to work with audit log sample data

COMMIT;
