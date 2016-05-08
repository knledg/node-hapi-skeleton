/*
  Provides a way to easily log actions occurring on the server and includes sentiment.
*/

/* eslint-disable no-console */
import _ from 'lodash';
import chalk from 'chalk';

// Models
import {AuditLog} from 'server/models/audit-log';

const error = chalk.bold.red;
const info = chalk.bold.blue;
const warning = chalk.bold.yellow;
const success = chalk.bold.green;

export const validateAudit = function(opts) {
  if (! opts.note) {
    throw new TError('Cannot add audit log, note not specified', {opts});
  }
};

export const saveAuditLog = function(opts) {
  return new AuditLog(opts)
    .save();
};

/*
  addWarning({ note, userId, pathname, query });
 */
export const addWarning = function(opts) {
  validateAudit(opts);
  return saveAuditLog(_.assign({}, opts, {sentiment: 'warning'}))
    .tap(() => console.log(warning(opts.note)));
};

/*
  addInfo({ note, userId, pathname, query });
 */
export const addInfo = function(opts) {
  validateAudit(opts);
  return saveAuditLog(_.assign({}, opts, {sentiment: 'info'}))
    .tap(() => console.log(info(opts.note)));
};

/*
  addSuccess({ note, userId, pathname, query });
 */
export const addSuccess = function(opts) {
  validateAudit(opts);
  return saveAuditLog(_.assign({}, opts, {sentiment: 'success'}))
    .tap(() => console.log(success(opts.note)));
};

/*
  addError({ note, userId, pathname, query });
 */
export const addError = function(opts) {
  validateAudit(opts);
  return saveAuditLog(_.assign({}, opts, {sentiment: 'error'}))
    .tap(() => console.log(error(opts.note)));
};
/* eslint-enable no-console */
