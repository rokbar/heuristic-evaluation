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
            const { description, location, photo, solution, rules, teamId } = hook.data;
            const userId = hook.params.user.id;
            let problemId;

            return new Promise((resolve, reject) => {
              hook.app.service('problems').create(
                { description, location, teamId },
                { transaction: hook.params.transaction },
              )
                .then(result => {
                  hook.result = result;
                  problemId = result.id;
                  return hook.app.service('imageupload').create(
                    { ...photo },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  return hook.app.service('problemphotos').create(
                    { id: result.id, problemId },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  hook.result.photos = result.photos;
                  return hook.app.service('problemrule/createBatch').create(
                    { problemId: problemId, rules },
                    { transaction: hook.params.transaction },
                  );
                })
                .then(result => {
                  hook.result.rules = rules;
                  return hook.app.service('evaluatorproblem').create(
                    { problemId, evaluatorId: userId, solution },
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

    // TODO - check if user belongs to team, refactor to single query
    app.service('problems/get/:problemId').hooks({
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
        get: [() => { throw new Error('Not implemented') }],
        create: [() => { throw new Error('Not implemented') }],
        update: [() => { throw new Error('Not implemented')}],
        patch: [() => { throw new Error('Not implemented') }],
        remove: [() => { throw new Error('Not implemented') }],
      },
    });

    // TODO - check if user belongs to team, restrictToOwner does not work
    app.service('problems/edit/:problemId').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        patch: [
          authHooks.restrictToOwner({ idField: 'id', ownerField: 'evaluatorId'}),
          (hook) => {
            const { problemId } = hook.params.route;
            const { description, location, solution, photo, rules } = hook.data;
            hook.result = {};

            return new Promise((resolve, reject) => {
              hook.app.service('evaluatorproblem').patch(
                null,
                { solution: solution },
                {
                  query: { problemId: problemId },
                  transaction: hook.params.transaction,
                },
              )
                .then(result => {
                  if (result.length) {
                    hook.result.solution = result[0].solution;
                    hook.result.evaluatorId = result[0].evaluatorId;
                  }
                  return hook.app.service('problemrule').remove(
                    null,
                    {
                      query: { problemId: problemId },
                      transaction: hook.params.transaction
                    },
                  );
                })
                .then(result => {
                  return hook.app.service('problemrule/createBatch').create(
                    { problemId, rules },
                    { transaction: hook.params.transaction },
                  );
                })
                .then(result => {
                  hook.result.rules = rules;
                  return hook.app.service('problems').patch(
                    problemId,
                    { description, location },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  const hookResult = Object.assign(hook.result, result);
                  resolve(hook);
                })
                .catch(reject);
            })
          }
        ],
        find: [() => { throw new Error('Not implemented') }],
        get: [() => { throw new Error('Not implemented') }],
        update: [() => { throw new Error('Not implemented')}],
        remove: [() => { throw new Error('Not implemented') }],
        create: [() => { throw new Error('Not implemented') }],
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

    // TODO - check if user belongs to team
    app.service('problems/remove/:problemId').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        remove: [
          authHooks.restrictToOwner({ idField: 'id', ownerField: 'evaluatorId'}),
          (hook) => {
            const { problemId } = hook.params.route;

            return new Promise((resolve, reject) => {
              hook.app.service('evaluatorproblem').remove(
                null,
                {
                  query: { problemId: problemId },
                  transaction: hook.params.transaction,
                },
              )
                .then(result => {
                  return hook.app.service('problemrule').remove(
                    null,
                    {
                      query: { problemId: problemId },
                      transaction: hook.params.transaction
                    },
                  );
                })
                .then(result => {
                  return hook.app.service('problems').remove(
                    problemId,
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  hook.result = result;
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
        create: [() => { throw new Error('Not implemented') }],
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
