/* Script to start your Hapi server */

/* eslint-disable no-console */

// Call Bootstrap functions before we load hapi
require('server/bootstrap');

import hapi from 'server/hapi';
import chalk from 'chalk';

export default async function initListener() {
  const server = hapi.instance();
  server.start(() => {
    console.log(chalk.bold.blue(`Server: ${server.info.uri}`));
  });
};

/* eslint-enable no-console */
