export default function(server) {
  let events = {
    log: '*',
    response: '*',
    error: '*',
    request: '*',
  };

  if (process.env.OPS_DISABLED !== 'true') {
    events.ops = '*';
  }

  let reporters = [{
    reporter: require('good-console'),
    events,
  }];

  if (process.env.LOGENTRIES_TOKEN) {
    reporters.push({
      reporter: require('good-logentries'),
      events: {
        log: '*',
        response: '*',
        error: '*',
        ops: '*',
        request: '*',
      },
      config: {
        token: process.env.LOGENTRIES_TOKEN,
      },
    });
  }

  return server.register({
    register: require('good'),
    options: {
      opsInterval: 30000,
      reporters: reporters,
      requestHeaders: true,
      requestPayload: true,
      filter: {
        password: 'remove',
        token: 'remove',
      },
    },
  }, function(err) {
    if (err) {
      throw err;
    }
  });
}
