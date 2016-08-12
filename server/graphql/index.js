import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import {toCollection, toRecord} from 'server/graphql/builder';

// import GraphQLObjectTypes here
import {auditLogType} from 'server/graphql/types/audit-log';
import {userType} from 'server/graphql/types/user';

// import GraphQLMutations here
import {createAuditLog} from 'server/graphql/mutations/create-audit-log';

/**
 * RootQuery - Specify Records/Collections that the user can query on here
 */
export const rootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    /* Collections */
    auditLogs: toCollection(auditLogType),
    users: toCollection(userType),

    /* Individual Records */
    auditLog: toRecord(auditLogType),
    user: toRecord(userType),
  }),
});

/**
 * The Root mutation where other mutations can be referenced
 *
 * Add new mutations in the object that gets returns from fields to
 * have them be accessible by the user
 */
const rootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: () => ({
    createAuditLog,
  }),
});

/**
 * [Export schema with the rootType and mutationType]
 * Do not edit
 */
export const schema = new GraphQLSchema({query: rootType, mutation: rootMutation});
