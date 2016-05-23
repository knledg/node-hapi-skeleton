/* eslint-disable strict, no-process-exit, no-console */
'use strict';

require('babel-register');

try {
  require('assert-env')([
    'PORT', 'NODE_ENV', 'NODE_PATH', 'AMQP_URL', 'DATABASE_URL',
    'GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_USE_SECURE_CONNECTION',
    'GOOGLE_SERVER_KEY', 'CLOUDINARY_URL',
  ]);
} catch (err) {
  console.error(err.message.substr(0, err.message.length - 1));
  process.exit(1);
}

require('server/bootstrap');

const heretic = require('server/lib/heretic').default;

// heretic.process('your-worker', 1, require('server/workers/your-worker'));

// the 'jobError' event happens when a job message is published in RabbitMQ that
// can never be handled correctly (malformed JSON, job id doesn't exist in the
// database, etc.). The message will be dead-lettered for later inspection (by you)
heretic.on('jobError', (err) => console.error('Error with job!', err.attempt_logs));

// the 'jobFailed' event happens when a job fails, but in a recoverable way. it
// will be automatically retried up to the maximum number of retries.
heretic.on('jobFailed', (err) => console.error('Job execution failed!', err.attempt_logs));

heretic.start()
  .then(() => console.log('Initialized workers'));


