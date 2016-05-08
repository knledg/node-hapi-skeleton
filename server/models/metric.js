import {Base, register} from 'server/models/base';

export const Metric = Base.extend({
  tableName: 'metrics',
  displayName: 'Metrics',

  searchHandler(filters, forCount = false) {

  },
}, {});

register('Metric', Metric);
