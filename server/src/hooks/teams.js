const authHooks = require('feathers-authentication-hooks');
const { hooks: knexHooks } = require('feathers-knex');

const { teamState } = require('../utils/enums');
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
        create: [
          (hook) => {
            const {teamId} = hook.params.route;
            const {heuristicName: name, customHeuristics, plan} = hook.data;
            let { heuristicId } = hook.data;

            return new Promise((resolve, reject) => {
              if (customHeuristics && !heuristicId) {
                hook.app.service('heuristics').create(
                  {name, isUnique: 1},
                  {transaction: hook.params.transaction},
                )
                  .then(result => {
                    hook.result = result;
                    heuristicId = result.id;
                    return hook.app.service('rules/createBatch').create(
                      {rules: customHeuristics, heuristicId},
                      {transaction: hook.params.transaction},
                    );
                  })
                  .then(result => {
                    return hook.app.service('teams').patch(
                      teamId,
                      {heuristicId, state: teamState.evaluationStarted},
                      {transaction: hook.params.transaction},
                    )
                  })
                  .then(result => {
                    resolve(hook);
                  })
                  .catch(err => {
                    console.log('err');
                    console.log(err);
                    reject(err);
                  });
              } else {
                hook.app.service('teams').patch(
                  teamId,
                  {heuristicId, state: teamState.evaluationStarted},
                  {transaction: hook.params.transaction},
                )
                  .then(result => {
                    hook.result = result;
                    resolve(hook)
                  })
                  .catch(reject);
              }
            });
          }
        ]
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
