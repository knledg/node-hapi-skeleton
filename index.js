#!/usr/bin/env node
/* eslint-disable no-console, strict, no-process-exit */
'use strict';

require('babel/register')({stage: 0});

try {
  require('assert-env')([ 'NODE_PATH', 'NODE_ENV', 'DATABASE_URL', 'APP_NAME' ]);
} catch (err) {
  console.error(err.message.substr(0, err.message.length - 1));
  process.exit(1);
}

require('server')();
