ESLINT = node_modules/.bin/eslint
MARINER = node_modules/.bin/mariner

.PHONY: web lint crons test watch-tests

lint:
	$(ESLINT) --ext .js --ext .jsx . --fix

web:
	nf run nodemon

crons:
	nf run node crons.js

workers:
	nf run node workers.js

migration:
	@while [ -z "$$MIGRATION_NAME" ]; do \
		read -r -p "Enter Migration Name: " MIGRATION_NAME; \
	done ; \
	nf run $(MARINER) create "$$MIGRATION_NAME"

migrate:
	nf run $(MARINER) migrate up

rollback:
	nf run $(MARINER) migrate down
