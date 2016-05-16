

export default [
  {
    path: '/private',
    method: 'GET',
    handler(request, reply) {
      return reply({
        message: 'This is a private endpoint - a token is required.',
        credentials: request.auth.credentials,
      });
    },
    config: {
      auth: 'token',
      notes: 'Demonstrate sample private endpoint',
      tags: ['api', 'auth'],
    },
  },

  {
    path: '/public',
    method: 'GET',
    handler(request, reply) {
      return reply({
        message: 'This is a public endpoint.',
        credentials: request.auth.credentials,
      });
    },
    config: {
      auth: false,
      notes: 'Demonstrate sample public endpoint',
      tags: ['api', 'auth'],
    },
  },

];
