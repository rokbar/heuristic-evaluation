const authHooks = require('feathers-authentication-hooks');
const {hooks: knexHooks} = require('feathers-knex');
const {disallow} = require('feathers-hooks-common');

const {transaction} = knexHooks;

// TODO - all these services are available to team leader, modify access logic
module.exports = function ({auth}) {
  return function (app) {
    app.service('mergedproblems').hooks({
      before: {
        all: [
          disallow('external'),
        ]
      },
    });

    // TODO - check if user belongs to team
    // unlike create problem service,this service can create multiple merged problems
    app.service('mergedproblems/create').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        create: [
          (hook) => {
            const { problemsToCreate } = hook.data;
            const {description, location, problemId} = hook.data;
            let mergedProblemId;

            return new Promise((resolve, reject) => {
              return hook.app.service('mergedproblems/createBatch').create(
                {problemsToCreate},
                {transaction: hook.params.transaction},
              )
                .then(result => {
                  hook.result = result;
                  mergedProblemId = result.id;
                  return hook.app.service('problems').patch(
                    problemId,
                    {mergedProblemId: result.id, isCombined: true},
                    {transaction: hook.params.transaction},
                  )
                })
                .then(result => {
                  hook.result.problemId = problemId;
                  resolve(hook);
                })
                .catch(reject);
            })
          }
        ],
        find: [() => {
          throw new Error('Not implemented')
        }],
        get: [() => {
          throw new Error('Not implemented')
        }],
        update: [() => {
          throw new Error('Not implemented')
        }],
        patch: [() => {
          throw new Error('Not implemented')
        }],
        remove: [() => {
          throw new Error('Not implemented')
        }],
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


    app.service('mergedproblems/createBatch').hooks({
      before: {
        all: [
          disallow('external'),
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

    // TODO - check if user belongs to team, restrictToOwner does not work
    app.service('mergedproblems/edit/:mergedProblemId').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        patch: [
          (hook) => {
            const {mergedProblemId} = hook.params.route;
            const {description, location} = hook.data;
            hook.result = {};
            // this service is meant to update one property per query,
            // so we check which property's data we got
            let propertyToUpdate;
            if (description) {
              propertyToUpdate = {description};
            } else if (location) {
              propertyToUpdate = {location};
            }

            return new Promise((resolve, reject) => {
              return hook.app.service('problems').patch(
                mergedProblemId,
                {propertyToUpdate},
                {transaction: hook.params.transaction},
              )
                .then(result => {
                  const hookResult = Object.assign(hook.result, result);  // mutates hook.result
                  resolve(hook);
                })
                .catch(reject);
            })
          }
        ],
        find: [() => {
          throw new Error('Not implemented')
        }],
        get: [() => {
          throw new Error('Not implemented')
        }],
        update: [() => {
          throw new Error('Not implemented')
        }],
        remove: [() => {
          throw new Error('Not implemented')
        }],
        create: [() => {
          throw new Error('Not implemented')
        }],
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
    app.service('mergedproblems/remove/:mergedProblemId').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        remove: [
          (hook) => {
            const {mergedProblemId} = hook.params.route;

            return new Promise((resolve, reject) => {
              return hook.app.service('problems').patch(
                { mergedProblem: null },
                {
                  query: { mergedProblemId: mergedProblemId },
                  transaction: hook.params.transaction,
                },
              )
                .then((result) => {
                  return hook.app.service('mergedproblems').remove(
                    mergedProblemId,
                    {transaction: hook.params.transaction},
                  )
                })
                .then(result => {
                  hook.result = result;
                  resolve(hook);
                })
                .then(result => {

                })
                .catch(reject);
            })
          }
        ],
        find: [() => {
          throw new Error('Not implemented')
        }],
        get: [() => {
          throw new Error('Not implemented')
        }],
        update: [() => {
          throw new Error('Not implemented')
        }],
        patch: [() => {
          throw new Error('Not implemented')
        }],
        create: [() => {
          throw new Error('Not implemented')
        }],
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
