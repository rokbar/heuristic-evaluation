const authHooks = require('feathers-authentication-hooks');

module.exports = function ({ auth }) {
  return function (app) {
    app.service('evaluatorratings/:teamId').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ],
        find: [
          authHooks.restrictToRoles({
            roles: ['evaluator'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        get: [() => { throw new Error('Not implemented') }],
        create: [() => { throw new Error('Not implemented') }],
        update: [() => { throw new Error('Not implemented') }],
        patch: [() => { throw new Error('Not implemented') }],
        remove: [() => { throw new Error('Not implemented') }],
      }
    });

    // TODO - check if user belong to team and if teamstatus is rating
    app.service('ratings/createOrUpdateBatch').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ],
        create: [
          (hook) => {
            return new Promise((resolve, reject) => {
              resolve(hook);
            })
          }
        ]
      }
    });

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
