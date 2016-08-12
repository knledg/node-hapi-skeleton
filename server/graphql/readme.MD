# GraphQL

## About this implementation

This is a GraphQL implementation that allows the user to access GraphQLObjects and GraphQLLists

**Please note:** This is not a Relay implementation

## Adding a new GraphQL Type

1. Add new GraphQL type to `./types/{file}`
1. In `./index.js`, import the new GraphQL type and define how to fetch/search for records/collections in `typeToGraphQLType()`

### Anatomy of a GraphQLObject

```javascript
export const AuditLogType = new GraphQLObjectType({
  name: 'AuditLog', // Give your GraphQLObject, a unique name
  description: 'An action that occurred on the server', // Give it a human-readable desc. for GraphiQL
  fields: () => ({
    // Which fields the user is allowed to request
    id: {
      type: GraphQLID,
      description: 'ID of the audit log',
    },
    note: {
      type: GraphQLString,
      description: 'Human readable message about the action that occurred on the server',
    },
  }),
  args: () => ({
    // What the user is allowed to use to filter records
    id: {
      type: GraphQLID,
      description: 'ID of the audit log',
    },
  }),
  resolve() => {
    // return a promise that fetches the data from a data store, a 3rd party API, JSON, etc.
  },
});
```

### Migrations

What do I do if I ran a database migration that alters a table?

1. In `types/{file}`, change the GraphQL type to specify the added, removed, or altered columns
1. If any of the mutations would be affected by this migration, be sure to update the mutations

## Adding a new Mutation

1. Add new GraphQL mutation to `mutations/{file}`
1. Add the mutation to the rootMutations object in `./index.js`
