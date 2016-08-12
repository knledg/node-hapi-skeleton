import Boom from 'boom';

export function onlyOnDevelop(request, reply) {
  if (process.env.NODE_ENV !== 'development') {
    return reply(Boom.notFound());
  }
  return reply();
}
