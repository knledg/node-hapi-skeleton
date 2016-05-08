import path from 'path';
import glob from 'glob';

require('server/lib/bookshelf');

// Include all models so they get registered properly
let models = glob.sync(path.join(__dirname, '..', 'models', '**', '*.js'));
models.forEach(function(model) {
  require(model);
});
