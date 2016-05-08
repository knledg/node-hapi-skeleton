import {property, includes} from 'lodash';

/**
 * @param  {string} - This is the location of your payload, it doesn't need to be in request.payload,
 *                    but it does need to be somewhere in request.
 * @param  {string} - This is the location of your record instance.
 *                    It doesn't need to be in request.query, but it does need to be in request.
 * @return {object} - Bookshelf record
 *
 * Sample Usage From Route Definition:
 *
 *  server.route({
 *    path : '/your-endpoint/{id}',
 *    method : [ 'Delete' ],
 *     handler : function(request, reply) {
 *       return reply(request.pre.result);
 *     },
 *     config : {
 *      validate : {
 *        params : Joi.object().keys({
 *          id : Joi.number().integer().required(),
 *        }),
 *      },
 *      pre : [
 *        { method : fetchFactory(Model), assign : 'result' }
 *        { method : deleteFactory(Model), assign : 'result' },
 *      ],
 *     }
 *   });
 */
export const deleteFactory = function deleteFactory(Model, getRecord = property('pre.result')) {
  return function(request, reply) {
    const usesSoftDeletes = includes(Model.prototype.hasTimestamps, 'deleted_at');
    const record = getRecord(request);

    if (usesSoftDeletes) {
      return record
        .set('deleted_at', new Date())
        .save(null, {method: 'update'})
        .nodeify(reply); // mark record as deleted using deleted_at TS
    }

    return record.destroy()
      .nodeify(reply); // permanently delete record from DB
  };
};
