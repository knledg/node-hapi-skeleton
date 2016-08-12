import {GraphQLString, GraphQLInt, GraphQLID} from 'graphql';

export function createdAt() {
  return {
    type: GraphQLString,
    description:
      'The ISO 8601 date format of the time that this resource was created.',
  };
}

export function updatedAt() {
  return {
    type: GraphQLString,
    description:
      'The ISO 8601 date format of the time that this resource was edited.',
  };
}

export function limit() {
  return {
    type: GraphQLInt,
    description:
      'Limit the resultset of a collection query',
  };
}

export function id() {
  return {
    type: GraphQLID,
    description: 'Unique ID of the record',
  };
}


export function offset() {
  return {
    type: GraphQLInt,
    description:
      'Offset the resultset of a collection query',
  };
}

/**
 * [collectionArgs - Default allowed args when searching for a collection of records]
 * @return {object}
 */
export function collectionArgs() {
  return {
    id: id(),
    offset: offset(),
    limit: limit(),
  };
}

/**
 * [recordArgs - Default allowed args when fetching a single record]
 * @return {object}
 */
export function recordArgs() {
  return {
    id: {
      type: GraphQLID,
    },
  };
}
