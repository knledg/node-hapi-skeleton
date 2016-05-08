import _ from 'lodash';
import Hapi from 'hapi';
import path from 'path';
import fs from 'fs';
import glob from 'glob';
import Pack from 'package.json';

let server;

function versionRoutes(version, routes) {
  return _.map(routes, (route) => {
    route.path = `/${version}${route.path}`;
    return route;
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
        origin: [ '*' ],
        additionalHeaders: [ 'Range' ],
        additionalExposedHeaders: [ 'Content-Range' ],
      },
      payload: {
        // Max payload of 5MB
        maxBytes: 5242880,
      },
    },
  });

  const swaggerOpts = {
    info: {
      title: process.env.APP_NAME,
      version: Pack.version,
    },
    tags: [{
      'name': 'database',
      'description': 'Database Manipulation',
    }], // tags to group by
  };

  server.register([
    // require('hapi-require-https'),
    require('inert'),
    require('vision'),
    {
      'register': require('hapi-swagger'),
      'options': swaggerOpts,
    },
  ], function(err) {
    if (err) {
      throw err;
    }
  });

  let plugins = fs.readdirSync(path.join(__dirname, 'plugins'));
  plugins.forEach(function(plugin) {
    require(path.join(__dirname, 'plugins', plugin))(server);
  });

  server.route(require(path.join(__dirname, 'routes/index.js')));

  let folders = [];
  folders.push(...glob.sync(path.join(__dirname, 'routes/v*')));
  folders.forEach((folder) => {
    const version = folder.split('/').pop();
    let files = [];

    files.push(...glob.sync(path.join(folder, '*.js')));
    files.forEach((file) => {
      let routes = require(file);
      server.route(versionRoutes(version, routes));
    });
  });

  return server;
}

export default {instance};
