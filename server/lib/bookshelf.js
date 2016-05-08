/* Create a singleton instance of Bookshelf, an ORM for your database */
import bookshelf from 'bookshelf';

// Lib
import {knex} from 'server/lib/knex';

const bookshelfInstance = bookshelf(knex);
bookshelfInstance.plugin('registry');

export default bookshelfInstance;
