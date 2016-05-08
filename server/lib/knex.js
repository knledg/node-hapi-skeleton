/* Return singleton instance of knex, which communicates with your database */
export const knex = require('knex')({
  debug: process.env.KNEX_DEBUG === 'true' ? true : false,
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: process.env.DB_CONNECTION_POOL_MAX || 10,
  },
});
