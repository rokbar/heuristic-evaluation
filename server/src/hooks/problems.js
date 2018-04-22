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

    // TODO - check if leader of a team
    app.service('teamproblems/:teamId').hooks({
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
            const { description, location, photos, solution, rules, teamId } = hook.data;
            const userId = hook.params.user.id;
            let problemId;

            return new Promise((resolve, reject) => {
              hook.app.service('problems').create(
                { description, location, teamId, solution },
                { transaction: hook.params.transaction },
              )
                .then(result => {
                  hook.result = result;
                  problemId = result.id;
                  return hook.app.service('imageupload/createBatch').create(
                    { photos, problemId },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  return hook.app.service('problemphotos/createBatch').create(
                    { problemphotos: result, problemId: problemId },
                    { transaction: hook.params.transaction, headers: hook.params.headers },
                  );
                })
                .then(result => {
                  hook.result.photos = result;
                  return hook.app.service('problemrule/createBatch').create(
                    { problemId: problemId, rules },
                    { transaction: hook.params.transaction },
                  );
                })
                .then(result => {
                  hook.result.rules = rules;
                  return hook.app.service('evaluatorproblem').create(
                    { problemId, evaluatorId: userId },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
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
          (hook) => {
            const { problemId } = hook.params.route;
            const evaluatorId = hook.params.user.id;
            const { description, location, solution, photos, rules } = hook.data;
            hook.result = {};
            const photosToRemove = photos && photos.length && photos.filter(item => item.removed);
            const photosToRemoveIds = photosToRemove && photosToRemove.length && photosToRemove.map(item => item.id);
            const photosToInsert = photos && photos.filter(item => (!item.removed && !item.id));
            const photosToRemain = photos && photos.length && photos.filter(item => (!item.removed && item.id));

            return new Promise((resolve, reject) => {
                hook.app.service('problemrule').remove(
                  null,
                  {
                    query: { problemId: problemId },
                    transaction: hook.params.transaction
                  },
                )
                .then(result => {
                  return hook.app.service('problemrule/createBatch').create(
                    { problemId, rules },
                    { transaction: hook.params.transaction },
                  );
                })
                .then(result => {
                  hook.result.rules = rules;
                  hook.result.evaluatorId = evaluatorId;
                  return hook.app.service('problems').patch(
                    problemId,
                    { description, location, solution },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  const hookResult = Object.assign(hook.result, result);  // mutates hook.result
                  return photosToRemoveIds.length && hook.app.service('problemphotos').remove(
                    null,
                    {
                      query: {
                        id: {
                          $in: [ ...photosToRemoveIds ],
                        },
                      },
                      transaction: hook.params.transaction
                    },
                  )
                })
                .then(result => {
                  return photosToInsert && hook.app.service('imageupload/createBatch').create(
                    { photos: photosToInsert, problemId },
                    { transaction: hook.params.transaction },
                  )
                })
                .then(result => {
                  return photosToInsert && hook.app.service('problemphotos/createBatch').create(
                    { problemphotos: result, problemId: problemId },
                    { transaction: hook.params.transaction, headers: hook.params.headers },
                  );
                })
                .then(result => {
                  const photosToRemainPaths = photosToRemain ? photosToRemain.map(item => item.path) : [];
                  hook.result.photos = [ ...photosToRemainPaths, ...result ];
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
            // params.route is available when service is called from front-end
            // when service is called from back-end, params is available
            const { problemId } = hook.params.route || hook.params;

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
                  return hook.app.service('mergedproblems').remove(
                    null,
                    {
                      query: { toId: problemId },
                      transaction: hook.params.transaction
                    },
                  );
                })
                .then(result => {
                  return hook.app.service('problemphotos').remove(
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
