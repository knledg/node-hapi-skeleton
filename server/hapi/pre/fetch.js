import {property} from 'lodash';
import Boom from 'boom';

const DEFAULT_OPTIONS = {
  require: true,
  withRelated: [],
};

/**
 * @param  {object} - Model, this is a Model imported from /models
 * @param  {string} - This is the location of your primary id.
 *                    It doesn't need to be in request.query, but it does need to be in request.
 * @return {object} - Bookshelf record
 *
 * Sample Usage From Route Definition:
 *
 *  server.route({
 *    path : '/your-endpoint/{id}',
 *    method : 'GET',
 *     handler : function(request, reply) {
 *       return reply(request.pre.record);
 *     },
 *     config : {
 *      validate : {
 *        params : Joi.object().keys({
 *          id : Joi.number().integer().required(),
 *        })
 *      },
 *      pre : [ { method : fetchFactory(Model), assign : 'record' } ],
 *     }
 *   });
 */
export function fetchFactory(Model, getId = property('params.id'), fetchOptions = DEFAULT_OPTIONS) {
  return function(request, reply) {
    return new Model({id: getId(request)})
      .fetch(fetchOptions)
      .catch((err) => {
        if (err.message === 'EmptyResponse') {
          throw Boom.notFound();
        }

        throw err; // let the error fall through
      })
      .nodeify(reply);
  };
};

