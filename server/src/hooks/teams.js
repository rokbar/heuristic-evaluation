const authHooks = require('feathers-authentication-hooks');

// TODO - adjust restriction (separate leaders from evaluators)
module.exports = function ({auth}) {
  return function (app) {
    app.service('teams').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ],
        find: [
          authHooks.restrictToRoles({
            roles: ['companyadmin', 'evaluator'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        get: [
          authHooks.restrictToRoles({
            roles: ['companyadmin', 'evaluator'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        create: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        update: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        patch: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        remove: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
      },
    });
  }
};
