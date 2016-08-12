import {knex} from 'server/lib/knex';
import Promise from 'bluebird';

const MAX_LIMIT = 1000;

/**
 * [execQuery - Adapter for Knex SQL Query Builder
 *              Builds and executes queries
 *              Outputs consistent results for a record / collection
 *              Handles defaults]
 * @param  {null|object}   parent  optional parent object
 * @param  {object}        filters user-specified filters
 * @param  {function} cb   cb to handle the user-specified filters
 * @return {promise}       record|collection {records: [], count}
 */
export function execQuery(parent, filters, cb) {
  let query = cb(knex);

  // Do not edit
  const recordQuery = query
    .debug(process.env.KNEX_DEBUG)
    .limit(filters.limit || MAX_LIMIT)
    .offset(filters.offset || 0)
    .then(res => {
      // If you want your fields to be returned as camelCase, you will need to transform them here
      return res.rows ? res.rows : res;
    });

  let count;
  // If the user is fetching a single object by id, return just the record, otherwise return {records, count}
  if (! filters.limit || filters.limit > 1) {
    count = query
      .clone()
      .first(knex.raw('count(*) AS count')) // overwrite columns with just count
      .limit(1) // overwrite limit with just 1
      .debug(process.env.KNEX_DEBUG)
      .then(res => res.count);

    return Promise.props({records: recordQuery, count});
  }

  return recordQuery;
}
