/*
  This file is for seeding your database with a seed.sql file in the root of the project.
  This may not be desired for every project. If this isn't needed, delete it.
*/

import Boom from 'boom';
import fs from 'fs';
import path from 'path';

// Lib
import {knex} from 'server/lib/knex';

// Pre
import {onlyOnDevelop} from 'server/hapi/pre/only-on-develop';

export default [
  {
    path: '/database/seed',
    method: 'GET',
    handler(request, reply) {
      try {
        const pathToSeed = path.join(__dirname, '../../../../', 'seed.sql');
        const seedSql = fs.readFileSync(pathToSeed).toString('utf8');

        return knex.raw(seedSql)
          .then(() => reply('Seed records inserted'))
          .catch(err => {
            knex.raw('ROLLBACK');
            return reply(err);
          });
      } catch (err) {
        return reply(Boom.badImplementation('Unable to find seed file'));
      }
    },
    config: {
      pre: [ onlyOnDevelop ],
      description: 'Seed Database',
      notes: 'Seed your database with sample data',
      tags: ['api', 'database'],
    },
  },
];
