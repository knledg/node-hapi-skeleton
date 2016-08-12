import {assign, get, isFunction} from 'lodash';
import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';

import {recordArgs} from 'server/graphql/common-fields';


/**
 * [toCollection - specify a custom GraphQLObjectType, build a GraphQLList]
 * @param  {object} graphQLObject           - instance of GraphQLObjectType
 * @param  {func}   injectFiltersFromParent - if the parent requires additional filters
 *                                            to be applied to fetch a specific child record
 *                                            specify it here
 * @param  {object} parentGraphQLObject     - optional parent object to namespace a parent/child collection type
 * @return {object} graphQLList             - GraphQLOutputType {records: [], count: x}
 */
export function toCollection(graphQLObject, injectFiltersFromParent, parentGraphQLObject) {
  return {
    type: new GraphQLObjectType({
      name: (parentGraphQLObject ? parentGraphQLObject.name : '') +
        graphQLObject.name + 'Collection',
      description: `A collection of ${graphQLObject.name} records`,
      fields: () => ({
        count: {
          type: GraphQLInt,
          description: 'Count of all records that match user-specified filters',
        },
        records: {
          type: new GraphQLList(graphQLObject),
          description: 'A list of records matching the user-specified filters',
        },
      }),
    }),
    args: graphQLObject._typeConfig.args, // must return an object
    resolve: (parent, filters) => {
      if (isFunction(injectFiltersFromParent)) {
        filters = injectFiltersFromParent(parent, filters);
      }

      return graphQLObject._typeConfig.resolve(parent, filters);
    },
  };
}

/**
 * [toRecord - specify a custom GraphQLObjectType, build a fetchable record]
 * @param  {object} graphQLObject           - instance of GraphQLObjectType
 * @param  {func}   injectFiltersFromParent - if the parent requires additional filters
 *                                            to be applied to fetch a specific child record
 *                                            specify it here
 * @return {object}                         - GraphQLOutputType (defined by /types/<file>.js)
 */
export function toRecord(graphQLObject, injectFiltersFromParent) {
  return {
    type: graphQLObject,
    args: recordArgs(), // must return an object
    resolve: (parent, filters) => {
      if (isFunction(injectFiltersFromParent)) {
        filters = injectFiltersFromParent(parent, filters);
      }

      return graphQLObject._typeConfig.resolve(parent, assign({}, filters, {limit: 1}))
        .then(records => get(records, '0'));
    },
  };
}
