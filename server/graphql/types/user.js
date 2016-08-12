import {each, assign} from 'lodash';
import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {execQuery} from 'server/graphql/adapters/knex';
import {createdAt, updatedAt, id, collectionArgs} from '../common-fields';
import {toCollection} from 'server/graphql/builder';

// import children GraphQLObjectTypes
import {auditLogType} from 'server/graphql/types/audit-log';

const TABLE_NAME = 'users';
export const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who registered on our web server',
  fields: () => ({
    // Which fields the user is allowed to request
    name: {
      type: GraphQLString,
      description: 'The full name of the user',
    },
    nickname: {
      type: GraphQLString,
      description: 'The nickname of the user',
    },
    email: {
      type: GraphQLString,
      description: 'The email address of the user',
    },
    id: id(),
    auditLogs: toCollection(auditLogType, (parent, filters) => {
      filters.user_id = parent.id;
      return filters;
    }, userType),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  }),
  args: assign({}, {
    // What the user is allowed to use to filter records
    email: {
      type: GraphQLString,
      description: 'The email address of the user',
    },
  }, collectionArgs()),
  resolve: (parent, filters) => execQuery(parent, filters, (knex) => {
    let query = knex(TABLE_NAME);

    // Handle user-specified filters
    const acceptableWhereStatements = {
      id: `${TABLE_NAME}.id`,
      email: `${TABLE_NAME}.email`,
    };
    each(acceptableWhereStatements, (tableFieldName, key) => {
      if (filters[key]) query.where(tableFieldName, filters[key]);
    });

    return query;
  }),
});
