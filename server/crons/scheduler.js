// import _ from 'lodash';
// import {CronJob} from 'cron';

// Lib
import hapi from 'lib/hapi';

const server = hapi.instance();

// use server.initialize() instead of start so we don't try to bind to a port
/* eslint-disable max-statements */
server.initialize(() => {
  server.log([ 'info' ], server.info);

  // new CronJob({
  //   cronTime: '0 15 23 * * *', // 11:15 pm AZ time
  //   timeZone: 'America/Phoenix',
  //   onTick: handler,
  //   start: true,
  // });
});
/* eslint-enable max-statements */
