const {hooks: knexHooks} = require('feathers-knex');
const authHooks = require('feathers-authentication-hooks');
const { disallow } = require('feathers-hooks-common');

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

    app.service('/mergedproblems/createBatch').hooks({
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

    // TODO - check if user belongs to team
    app.service('problems/merge').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        create: [
          (hook) => {
            const {description, location, solution, photos, rules, teamId, mergedProblemIds} = hook.data;
            let problemId;

            return new Promise((resolve, reject) => {
              return hook.app.service('problems').create(
                {description, location, solution, isCombined: true, teamId},
                {transaction: hook.params.transaction},
              )
                .then(result => {
                  hook.result = result;
                  problemId = result.id;
                  return hook.app.service('problemphotos/createBatch').create(
                    {problemphotos: photos, problemId: problemId},
                    {transaction: hook.params.transaction, headers: hook.params.headers},
                  );
                })
                .then(result => {
                  hook.result.photos = result;
                  return hook.app.service('problems').patch(
                    null,
                    {isRevised: true},
                    {
                      query: {id: {$in: [...mergedProblemIds]}},
                      transaction: hook.params.transaction
                    },
                  );
                })
                .then(() => {
                  return hook.app.service('problemrule/createBatch').create(
                    {problemId: problemId, rules},
                    {transaction: hook.params.transaction},
                  );
                })
                .then(() => {
                  return hook.app.service('mergedproblems/createBatch').create(
                    {mergedProblemIds, newProblemId: problemId},
                    {transaction: hook.params.transaction},
                  );
                })
                .then(() => {
                  hook.result.rules = rules;
                  hook.result.problemId = problemId;
                  hook.result.mergedProblemsIds = mergedProblemIds;
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

    // TODO - check if leader of a team
    app.service('teammergedproblems/:teamId').hooks({
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
        get: [() => {
          throw new Error('Not implemented')
        }],
        create: [() => {
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
  }
};
