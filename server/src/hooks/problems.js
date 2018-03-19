const authHooks = require('feathers-authentication-hooks');
const { hooks: knexHooks } = require('feathers-knex');
const { disallow } = require('feathers-hooks-common');

const { transaction } = knexHooks;

module.exports = function ({ auth }) {
  return function (app) {
    app.service('problems').hooks({
      before: {
        all: [
          disallow('external'),
        ]
      },
    });

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
        get: [() => { throw new Error('Not implemented') }],
        create: [() => { throw new Error('Not implemented') }],
        update: [() => { throw new Error('Not implemented') }],
        patch: [() => { throw new Error('Not implemented') }],
        remove: [() => { throw new Error('Not implemented') }],
      }
    });

    // TODO - check if user belongs to team
    app.service('problems/create').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        create: [
          (hook) => {
            const { description, location, photo, solution, ruleId, teamId } = hook.data;
            const userId = hook.params.user.id;

            return new Promise((resolve, reject) => {
              hook.app.service('problems').create(
                { description, location, photo, teamId },
                { transaction: hook.params.transaction },
              )
                .then(result => {
                  hook.result = result;
                  return hook.app.service('problemrule').create(
                    { problemId: result.id, ruleId },
                    { transaction: hook.params.transaction },
                  );
                })
                .then(result => {
                  hook.result.ruleId = result.ruleId;
                  return hook.app.service('evaluatorproblem').create(
                    { problemId: result.problemId, evaluatorId: userId, solution },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  hook.result.solution = result.solution;
                  hook.result.evaluatorId = result.evaluatorId;
                  resolve(hook);
                })
                .catch(reject);
            })
          }
        ],
        find: [() => { throw new Error('Not implemented') }],
        get: [() => { throw new Error('Not implemented') }],
        update: [() => { throw new Error('Not implemented')}],
        patch: [() => { throw new Error('Not implemented') }],
        remove: [() => { throw new Error('Not implemented') }],
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
  };
};
