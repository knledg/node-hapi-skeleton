import fs from 'fs';
import path from 'path';
import {
  introspectionQuery,
  printSchema,
} from 'graphql/utilities';

import {schema} from 'server/graphql';
import {graphql} from 'graphql';

/**
 * [Write Schema to fs]
 * Do not edit
 */
export const updateSchema = () => {
  return graphql(schema, introspectionQuery)
    .then(result => {
      fs.writeFileSync(
        path.join(__dirname, '../../schema.json'),
        JSON.stringify(result, null, 2)
      );

      // Save user readable type system shorthand of schema
      fs.writeFileSync(
        path.join(__dirname, '../../schema.graphql'),
        printSchema(schema)
      );

      process.exit(0);
    })
    .catch((err) => {
      /* eslint-disable no-console */
      console.error('ERROR introspecting schema: ', err);
      /* eslint-enable no-console */
    });
};
