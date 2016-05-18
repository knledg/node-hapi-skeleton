import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';

import bookshelf from 'server/lib/bookshelf';

export const Base = bookshelf.Model.extend({
  toJSON(options) {
    return bookshelf.Model.prototype.toJSON.apply(
      this, [ _.assign({}, {omitPivot: true}, options) ]
    );
  },

  /**
   * Transforms a database record's field names from snake_case to camelCase
   *
   * @param  {object} attrs The record to transform
   * @return {object}
   */
  parse(attrs) {
    return _.transform(attrs, (memo, val, key) => {
      memo[ _.camelCase(key) ] = val;
      return memo;
    });
  },

  /**
   * Transforms the record's attributes from camelCase to snake_case
   *
   * @param  {object} attrs The attributes to transform
   * @return {object}
   */
  format(attrs) {
    return _.transform(attrs, (memo, val, key) => {
      // _.snakeCase does not do what we want for string such as associationFee2
      // it would return association_fee_2 whereas we expect association_fee2
      let _key = key.replace(/([A-Z]{1})/g, (upper) => '_' + upper.toLowerCase());


      if (memo[ _key ]) {
        return memo;
      }

      memo[ _key ] = val;
      return memo;
    });
  },

  offset: null,
  limit: null,
  orderBy: null,
  orderByDirection: null,
  filters: null, // if changed to {} it causes unintended results by not reseting queries
  withRelated: [],

  setOffsetLimitOrder(filters) {
    if (filters.offset) {
      this.offset = filters.offset;
    }

    if (filters.limit) {
      this.limit = filters.limit;
    }

    if (filters.orderBy) {
      this.orderBy = filters.orderBy;
    }

    if (filters.orderByDirection) {
      this.orderByDirection = filters.orderByDirection;
    } else if (filters.orderBy && ! filters.orderByDirection) {
      filters.orderByDirection = 'DESC'; // usually want the newest first
    }

    return this;
  },

  setFilters(filters) {
    this.setOffsetLimitOrder(filters);
    if (filters.userId) {
      this.userId = filters.userId;
    }
    this.filters = _.omit(filters, 'offset', 'limit', 'orderBy', 'orderByDirection', 'userId');
    return this;
  },

  search(filters, withRelated = []) {
    this.setFilters(filters);
    if (withRelated.length) {
      this.withRelated = _.union(this.withRelated, withRelated);
    }

    const searchQuery = this.execSearch();
    const countQuery = this.buildCountQuery();

    let queries = {
      records: searchQuery,
      count: countQuery,
    };

    return Promise.props(queries);
  },

  execSearch() {
    this.searchHandler(this.filters);

    if (this.offset) {
      this.query('offset', this.offset);
    }
    if (this.limit) {
      this.query('limit', this.limit);
    }

    return this.fetchAll
      .call(this, {withRelated: this.withRelated})
      .then((collection) => collection.models);
  },

  searchHandler() {
    throw new Error('Model must implement searchHandler function');
  },

  buildCountQuery() {
    this.searchHandler(this.filters, true);
    this.query('count', '*');
    this.query('offset', 0);
    this.query('limit', 0);

    return this.fetch
      .call(this, {columns: []})
      .then((result) => {
        return result ? result.get('count') : 0;
      });
  },

  addDateFilter(field, filterValue) {
    if (_.isString(filterValue)) {
      if (filterValue.match(/^\d{4}-\d{2}$/)) {
        // filtering on a month (YYYY-MM)
        let month = moment.utc(filterValue, 'YYYY-MM');
        this.query('whereBetween', field, [
          month.startOf('month').toISOString(),
          month.endOf('month').toISOString(),
        ]);
      } else {
        this.query('where', field, filterValue);
      }
    } else if (_.isArray(filterValue)) {
      this.query('whereBetween', field, [ filterValue[0], filterValue[1] ]);
    }
  },

  addFilter(field, filterValue) {
    if (_.isArray(filterValue)) {
      this.query('whereIn', field, filterValue);
    } else {
      this.query('where', field, filterValue);
    }
    return this;
  },
});

/**
 * [register - this func allows us to register a function, so we can reference
 *             it by its string nickname when defining relationships between Models.
 *             This also prevents circular dependencies.
 * ]
 * @param  {string} nickname        Name of Bookshelf Model
 * @param  {object} modelDefinition Bookshelf Model
 * @return {null}
 */
export const register = function register(nickname, modelDefinition) {
  bookshelf.model(nickname, modelDefinition);
};
