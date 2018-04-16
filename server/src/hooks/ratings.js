const authHooks = require('feathers-authentication-hooks');

module.exports = function ({ auth }) {
  return function (app) {
    app.service('ratings').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ],
        find: [
          authHooks.restrictToOwner({
            idField: 'id',
            ownerField: 'evaluatorId',
          }),
        ],
        get: [
          authHooks.restrictToRoles({
            roles: ['evaluator'],
            fieldName: 'role',
            idField: 'id',
            ownerField: 'evaluatorId',
            owner: true,
          }),
        ],
        create: [
          authHooks.restrictToRoles({
            roles: ['evaluator'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        update: [
          authHooks.restrictToRoles({
            roles: ['evaluator'],
            fieldName: 'role',
            idField: 'id',
            ownerField: 'evaluatorId',
            owner: true,
          }),
        ],
        patch: [
          authHooks.restrictToRoles({
            roles: ['evaluator'],
            fieldName: 'role',
            idField: 'id',
            ownerField: 'evaluatorId',
            owner: true,
          }),
        ],
        remove: [
          authHooks.restrictToRoles({
            roles: ['evaluator'],
            fieldName: 'role',
            idField: 'id',
            ownerField: 'evaluatorId',
            owner: true,
          }),
        ],
      },
    });
  }
};
