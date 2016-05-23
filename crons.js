#!/usr/bin/env node

/* This initiates crons that will be running at intervals in the background on your server */
/* eslint-disable no-console, strict, no-process-exit */
'use strict';

require('babel-register');

try {
  require('assert-env')([ 'NODE_PATH', 'NODE_ENV', 'DATABASE_URL', 'APP_NAME', 'AMQP_URL' ]);
} catch (err) {
  console.error(err.message.substr(0, err.message.length - 1));
  process.exit(1);
}

require('server/bootstrap');
require('server/crons/scheduler').init();
