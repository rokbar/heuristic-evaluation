const authHooks = require('feathers-authentication-hooks');

module.exports = function ({ auth }) {
  return function (app) {
    app.service('evaluatorproblems/:teamId').hooks({
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
        get: [
          () => { throw new Error('Not implemented') }
        ],
        create: [
          () => { throw new Error('Not implemented') }
        ],
        update: [
          () => { throw new Error('Not implemented') }
        ],
        patch: [
          () => { throw new Error('Not implemented') }
        ],
        remove: [
          () => { throw new Error('Not implemented') }
        ],
      }
    })
  }
};
