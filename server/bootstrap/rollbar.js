/* eslint-disable no-console,no-process-exit */
import rollbar from 'rollbar';

import {errorHandler} from 'server/lib/error-handler';

/**
 * [Listen to process log stream for uncaught errors or rejections and notify developers]
 */
if (process.env.ROLLBAR_TOKEN) {
  rollbar.init(process.env.ROLLBAR_TOKEN, {
    environment: process.env.NODE_ENV,
    root: process.cwd(),
    verbose: false,
    codeVersion: process.env.GIT_SHA,
    host: process.env.DYNO || require('os').hostname(),
    scrubHeaders: [
      'Authorization',
      'authorization',
      'Cookie',
      'cookie',
    ],
    scrubFields: [
      'password',
      'token',
    ],
  });

  process.on('uncaughtException', function(err) {
    console.error('[Rollbar] Handling uncaught exception.');
    console.error(err.stack);

    errorHandler.error(err, function(err2) {
      if (err2) {
        console.error('[Rollbar] Encountered an error while handling an uncaught exception.');
        console.error(err.stack);
      }

      process.exit(1);
    });
  });

  process.on('unhandledRejection', function(reason, promise) {
    console.error(reason.stack);
    errorHandler.error(reason);
  });
} else {
  process.on('unhandledRejection', function(reason, promise) {
    console.error(reason.stack);
  });

  process.on('uncaughtException', function(err) {
    console.error('Uncaught exception:');
    console.error(err.stack);
    process.exit(1);
  });
}
