import Heretic from 'heretic';
import {knex} from 'server/lib/knex';

export default new Heretic(process.env.AMQP_URL, knex, {
  socketOptions: {
    clientProperties: {
      Application: 'Workers',
    },
  },
});
