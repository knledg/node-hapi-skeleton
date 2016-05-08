import {property} from 'lodash';
import Boom from 'boom';

/**
 * Upsert a record.
 * NOTE: Cannot update with an `id` field
 *
 * @param  {string} - This is the Model definition for the object you want to create/update
 * @param  {string} - This is the location of your payload inside the Hapi request object
 * @return {object} - Bookshelf record
 *
 * Sample Usage From Route Definition:
 *
 *  server.route({
 *    path : '/your-post-put-endpoint',
 *    method : [ 'POST', 'PUT' ],
 *     handler : function(request, reply) {
 *       return reply(request.pre.result);
 *     },
 *     config : {
 *      validate : {
 *        payload : Joi.object().keys({
 *          id: 1, // optional
 *          ...
 *        })
 *      },
 *      pre : [
 *        { method : upsertFactory(), assign : 'result' },
 *      ],
 *     }
 *   });
 */
export const upsertFactory = function upsertFactory(Model, getPayload = property('payload')) {
  return function(request, reply) {
    const payload = getPayload(request);
    let promise;

    if (payload.id) {
      promise = new Model({id: payload.id})
        .fetch({require: true})
        .then((record) => {
          return record
            .set(payload)
            .save(null, {method: 'update'});
        });
    }

    promise = new Model(payload)
      .save();

    return promise
      .catch((err) => {
        if (err.message.indexOf('duplicate') !== -1) {
          throw Boom.conflict();
        }

        throw err; // let the error fall through
      })
      .nodeify(reply);
  };
};
