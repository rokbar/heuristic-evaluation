const authHooks = require('feathers-authentication-hooks');

module.exports = function ({auth}) {
  return function (app) {
    app.service('companies').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ],
        find: [
          authHooks.restrictToRoles({
            roles: ['systemadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        create: [
          authHooks.restrictToRoles({
            roles: ['systemadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ]
      },
    });
  }
};
