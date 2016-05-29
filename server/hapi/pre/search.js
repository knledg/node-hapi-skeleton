import {property} from 'lodash';


/**
 * @param  {object} - Model, this is a Model imported from /models
 * @param  {string} - This is the location of your filters.
 *                    It doesn't need to be in request.query, but it does need to be in request.
 * @param  {array} -  Which relationships do you want to load and return with the base records.
 * @return {object} - Object containing search results, usually { records, count }
 *
 * Sample Usage From Route Definition:
 *
 *  server.route({
 *    path : '/your-search-endpoint',
 *    method : 'GET',
 *     handler : function(request, reply) {
 *       return reply({
 *         total: request.pre.result.total,
 *         records : request.pre.result.records,
 *       });
 *     },
 *     config : {
 *      validate : {
 *        query : Joi.object().keys({
 *          ids : Joi.array().items(Joi.number().integer()),
 *        })
 *      },
 *      pre : [ { method : searchFactory(Model), assign : 'result' } ],
 *     }
 *   });
 */
export function searchFactory(Model, getFilters = property('query'), withRelated = []) {
  return function(request, reply) {
    return new Model()
      .search(getFilters(request), withRelated)
      .nodeify(reply);
  };
};
