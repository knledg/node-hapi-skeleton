import _ from 'lodash';
import Hapi from 'hapi';
import path from 'path';
import glob from 'glob';
import Pack from 'package.json';

import GraphQL from 'hapi-graphql';
import {schema} from 'server/graphql';

let server;

function versionRoutes(version, routes) {
  return _.map(routes, (route) => {
    route.path = `/${version}${route.path}`;
    return route;
  });
}

function registerPlugins() {
  let plugins = [];
  plugins.push(...glob.sync(path.join(__dirname, 'plugins', '*.js')));
  plugins.forEach((plugin) => {
    require(plugin).default(server);
  });
}

function registerRoutes() {
  server.route(require(path.join(__dirname, 'routes/index.js')).default);

  let folders = [];
  folders.push(...glob.sync(path.join(__dirname, 'routes/v*')));
  folders.forEach((folder) => {
    const version = folder.split('/').pop();
    let files = [];

    files.push(...glob.sync(path.join(folder, '*.js')));
    files.forEach((file) => {
      let routes = require(file).default;
      server.route(versionRoutes(version, routes));
    });
  });
}

function registerAuthStrategy() {
  server.auth.strategy('token', 'jwt', {
    key: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    verifyOptions: {
      algorithms: [ 'HS256' ],
      audience: process.env.AUTH0_CLIENT_ID,
    },
  });
}

/**
 * [instance - return a singleton instance of a Hapi server]
 * @return {object} - Hapi server
 */
function instance() {
  if (server) {
    return server;
  }

  server = new Hapi.Server();

  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT;

  server.connection({
    host,
    port,
    routes: {
      cors: {
        origin: ['*'],
        exposedHeaders: ['Access-Control-Allow-Origin'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'],
      },
      payload: {
        // Max payload of 5MB
        maxBytes: 5242880,
      },
    },
  });

  let hapiPlugins = [
    require('inert'),
    require('vision'),
    require('hapi-auth-jwt'),
    {
      register: GraphQL,
      options: {
        query: {
          schema,
          graphiql: true,
        },
        route: {
          path: '/graphql',
          config: {
          },
        },
      },
    },
  ];

  // Add swagger if not on prod
  if (process.env.NODE_ENV === 'development') {
    hapiPlugins.push({
      'register': require('hapi-swagger'),
      'options': {
        info: {
          title: process.env.APP_NAME,
          version: Pack.version,
        },
        sortEndpoints: 'path',
        sortTags: 'name',
        expanded: 'none',
        pathPrefixSize: 2,
        tags: [{
          'name': 'database',
          'description': 'Database Manipulation',
        }], // tags to group by
      },
    });
  }

  if (process.env.NODE_ENV !== 'development') {
    hapiPlugins.unshift({
      'register': require('hapi-require-https'),
      'options': {},
    });
  }

  server.register(hapiPlugins, function(err) {
    if (err) {
      throw err;
    }

    registerAuthStrategy(server);
    registerPlugins(server);
    registerRoutes(server);
  });

  return server;
}

export default {instance};
