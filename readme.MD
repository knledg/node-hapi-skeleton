# Node Hapi Skeleton

Node Hapi Skeleton is a Node.js server running with the [Hapi framework](https://github.com/hapijs/hapi).

## Interface
- Utilizes a [Swagger](http://swagger.io/) interface to easily test all HTTP endpoints. Swagger self-documents your HTTP endpoints to make it easy for your frontend developers to access data. [Localhost Swagger](http://localhost:8009/)
- Structured to easily support versioning of endpoints

## GraphQL w/ GraphiQL
- Implements a GraphQL endpoint to fetch/search your records/collections [Localhost Graphql](http://localhost:8009/graphql)

## Validation
- Utilizes [Joi Validation](https://github.com/hapijs/joi/blob/v9.0.0-2/API.md) to easily test that the users' payloads are what you expect them to be.

## Processes

The framework is setup to run three processes: web, crons, and workers.

- Web
  - Will boot up the Hapi server and Swagger interface
- Crons
  - These are processes that run in the background at set intervals
- Workers
  - Workers are background processes that may take quite a bit of time to complete, so they are enqueued to a RabbitMQ server via [Heretic, a simple RabbitMQ interface](https://github.com/bjyoungblood/heretic)

## Logging

- Supports sending all server logs to [Logentries](https://logentries.com/) if a LOGENTRIES_TOKEN is present.
- Supports sending uncaught/unhandled errors to [Rollbar](https://rollbar.com) if a ROLLBAR_TOKEN is present.

## Database

- Utilizes [Mariner](https://github.com/bjyoungblood/mariner) to easily create database migrations using raw SQL statements instead of from a module.
- Utilizes [Knex](http://knexjs.org/) to handle your more robust queries
- Pre-built `Hapi Pre` functions to handle the bulk of your standard REST database queries automatically.
  - Fetch
  - Search
  - Upsert
  - Delete

## To Start The Web Server
- `npm install`
- `cp dev.env .env`
- Get .env vars from another developer
- `docker-compose up -d`
- `make web`

### Required Dependencies
- Docker for Postgres and RabbitMQ

