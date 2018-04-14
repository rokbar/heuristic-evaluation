const {hooks: knexHooks} = require('feathers-knex');

const {transaction} = knexHooks;

// TODO - all these services are available to team leader, modify access logic
module.exports = function ({auth}) {
  return function (app) {
    // TODO - check if user belongs to team
    app.service('mergedproblems/create').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        create: [
          (hook) => {
            const {description, location, photos, rules, evaluatorProblems, teamId, mergedProblemIds} = hook.data;
            let problemId;

            return new Promise((resolve, reject) => {
              return hook.app.service('problems').create(
                {description, location, isCombined: true, teamId},
                {transaction: hook.params.transaction},
              )
                .then(result => {
                  hook.result = result;
                  problemId = result.id;
                  return hook.app.service('problemphotos/createBatch').create(
                    { problemphotos: photos, problemId: problemId },
                    { transaction: hook.params.transaction, headers: hook.params.headers },
                  );
                })
                .then(result => {
                  hook.result.photos = result;
                  return hook.app.service('problems').patch(
                    null,
                    { isRevised: true },
                    {
                      query: { id: { $in: [...mergedProblemIds] } },
                      transaction: hook.params.transaction
                    },
                  );
                })
                .then(result => {
                  return hook.app.service('problemrule/createBatch').create(
                    { problemId: problemId, rules },
                    { transaction: hook.params.transaction },
                  );
                })
                .then(result => {
                  hook.result.rules = rules;
                  return hook.app.service('evaluatorproblem/createBatch').create(
                    { problemId, evaluatorProblems },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  hook.result.problemId = problemId;
                  hook.result.solution = result.solution;
                  hook.result.evaluatorId = result.evaluatorId;
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
