import {Base, register} from 'server/models/base';

export const AuditLog = Base.extend({
  tableName: 'audit_log',
  displayName: 'Audit Log',

  searchHandler(filters, forCount = false) {

  },
}, {});

register('AuditLog', AuditLog);
