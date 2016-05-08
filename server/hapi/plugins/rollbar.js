import {errorHandler} from 'server/lib/error-handler';

export default function register(server) {
  if (! process.env.ROLLBAR_TOKEN) {
    return;
  }

  server.on('log', function(event, tags) {
    if (! tags.error) {
      return;
    }
    errorHandler.hapiError(event.data);
  });

  server.on('request', function(request, event, tags) {
    if (! tags.error) {
      return;
    }
    errorHandler.hapiRequest(request, event.data, tags);
  });

  server.ext('onPreResponse', function(request, reply) {
    errorHandler.hapiPreResponse(request, reply);
    reply.continue();
  });
}
