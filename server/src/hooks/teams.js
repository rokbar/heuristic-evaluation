const authHooks = require('feathers-authentication-hooks');
const { hooks: knexHooks } = require('feathers-knex');

const { transaction } = knexHooks;

// TODO - adjust restriction (separate leaders from evaluators)
module.exports = function ({ auth, local }) {
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

    app.service('teams/:teamId/users').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ],
        find: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
      },
      after: local.hooks.protect('password'),
    });

    // TODO - add restriction, only available to group leader
    app.service('teams/:teamId/startEvaluation').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
      },
      after: {
        all: [
          transaction.end()
        ],
      },
      error: {
        all: [
          transaction.rollback()
        ],
      }
    });
  }
};
