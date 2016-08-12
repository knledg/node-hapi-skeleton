import {each, assign} from 'lodash';
import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {createdAt, updatedAt, id, collectionArgs} from 'server/graphql/common-fields';
import {toRecord} from 'server/graphql/builder';
import {execQuery} from 'server/graphql/adapters/knex';

// import children GraphQLObjectTypes
import {userType} from 'server/graphql/types/user';

const TABLE_NAME = 'audit_log';
export const auditLogType = new GraphQLObjectType({
  name: 'AuditLog',
  description: 'An action that occurred on the server',
  fields: () => ({
    // Which fields the user is allowed to request
    note: {
      type: GraphQLString,
      description: 'Human readable message about the action occurred on the server',
    },
    sentiment: {
      type: GraphQLString,
      description: 'Whether the event was good or bad',
    },
    user: toRecord(userType, (auditLog, userFilters) => {
      // note even though we don't return user_id is fields, it is still fetched from the table
      userFilters.id = auditLog.user_id;
      return userFilters;
    }),
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  }),
  args: assign({}, {
    // What the user is allowed to use to filter records
    sentiment: {
      type: GraphQLString,
      description: 'Whether the event was good or bad',
    },
  }, collectionArgs()),
  resolve: (parent, filters) => execQuery(parent, filters, (knex) => {
    let query = knex(TABLE_NAME);

    // Handle user-specified filters
    const acceptableWhereStatements = {
      id: `${TABLE_NAME}.id`,
      sentiment: `${TABLE_NAME}.sentiment`,
      user_id: `${TABLE_NAME}.user_id`,
    };
    each(acceptableWhereStatements, (tableFieldName, key) => {
      if (filters[key]) query.where(tableFieldName, filters[key]);
    });

    return query;
  }),
});
