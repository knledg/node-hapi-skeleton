export default [
  {
    path: '/',
    method: 'GET',
    handler(request, reply) {
      return reply.redirect('/documentation');
    },
  },
];
