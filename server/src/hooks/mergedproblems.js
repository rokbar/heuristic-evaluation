const {hooks: knexHooks} = require('feathers-knex');
const authHooks = require('feathers-authentication-hooks');
const {disallow} = require('feathers-hooks-common');

const {transaction} = knexHooks;

// TODO - all these services are available to team leader, modify access logic
module.exports = function ({auth}) {
  return function (app) {
    app.service('mergedproblems/merge').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        create: [
          (hook) => {
            const {position, description, location, solution, photos, rules, teamId, problemsToMergeIds, originalProblemsIds} = hook.data;
            let problemId;

            return new Promise((resolve, reject) => {
              return hook.app.service('problems').create(
                // position - INT(11)
                {position: position, description, location, solution, isCombined: true, teamId},
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
                .then((result) => {
                  hook.result.photos = result;
                  return new Promise((resolveAll, rejectAll) => {
                    Promise.all(
                      problemsToMergeIds.map(itemId => {
                        return hook.app.service(`/problems/remove/:problemId`).remove(
                          null,
                          {
                            problemId: itemId,
                            transaction: hook.params.transaction
                          },
                        );
                      })
                    )
                      .then(result => {
                        resolveAll(result);
                      })
                      .catch(rejectAll);
                  });
                })
                .then((result) => {
                  return hook.app.service('problems').patch(
                    null,
                    {isRevised: true},
                    {
                      query: {id: {$in: [...problemsToMergeIds]}},
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
                    {problemsToMergeIds: originalProblemsIds, newProblemId: problemId},
                    {transaction: hook.params.transaction},
                  );
                })
                .then(() => {
                  return hook.app.service('mergedproblems/updatePositions').patch(
                    null,
                    {position: position - 1},
                    {
                      transaction: hook.params.transaction,
                    },
                  );
                })
                .then(() => {
                  hook.result.rules = rules;
                  hook.result.problemId = problemId;
                  hook.result.mergedProblemsIds = problemsToMergeIds;
                  hook.result.originalProblemsIds = originalProblemsIds;
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

    app.service('/mergedproblems/updatePositions').hooks({
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
            const {position, description, location, solution, photos, rules, teamId, problemsToMergeIds, originalProblemsIds} = hook.data;
            let problemId;

            return new Promise((resolve, reject) => {
              return hook.app.service('problems').create(
                {position, description, location, solution, isCombined: true, teamId},
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
                      query: {id: {$in: [...problemsToMergeIds]}},
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
                    {problemsToMergeIds, newProblemId: problemId},
                    {transaction: hook.params.transaction},
                  );
                })
                .then(() => {
                  hook.result.rules = rules;
                  hook.result.problemId = problemId;
                  hook.result.mergedProblemsIds = problemsToMergeIds;
                  hook.result.originalProblemsIds = originalProblemsIds;
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
    app.service('mergedproblems/edit/:problemId').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        patch: [
          (hook) => {
            const {problemId} = hook.params.route;
            const evaluatorId = hook.params.user.id;
            const {description, location, solution, photos, rules} = hook.data;
            hook.result = {};
            const photosToRemove = photos && photos.length && photos.filter(item => item.removed);
            const photosToRemoveIds = photosToRemove && photosToRemove.length && photosToRemove.map(item => item.id);
            const photosToInsert = photos && photos.filter(item => (!item.removed && !item.id));
            const photosToRemain = photos && photos.length && photos.filter(item => (!item.removed && item.id));

            return new Promise((resolve, reject) => {
              hook.app.service('problemrule').remove(
                null,
                {
                  query: {problemId: problemId},
                  transaction: hook.params.transaction
                },
              )
                .then(result => {
                  return hook.app.service('problemrule/createBatch').create(
                    {problemId, rules},
                    {transaction: hook.params.transaction},
                  );
                })
                .then(result => {
                  hook.result.rules = rules;
                  hook.result.evaluatorId = evaluatorId;
                  return hook.app.service('problems').patch(
                    problemId,
                    {description, location, solution},
                    {transaction: hook.params.transaction},
                  )
                })
                .then(result => {
                  const hookResult = Object.assign(hook.result, result);  // mutates hook.result
                  return photosToRemoveIds.length && hook.app.service('problemphotos').remove(
                    null,
                    {
                      query: {
                        id: {
                          $in: [...photosToRemoveIds],
                        },
                      },
                      transaction: hook.params.transaction
                    },
                  )
                })
                .then(result => {
                  return photosToInsert && hook.app.service('imageupload/createBatch').create(
                    {photos: photosToInsert, problemId},
                    {transaction: hook.params.transaction},
                  )
                })
                .then(result => {
                  return photosToInsert && hook.app.service('problemphotos/createBatch').create(
                    {problemphotos: result, problemId: problemId},
                    {transaction: hook.params.transaction, headers: hook.params.headers},
                  );
                })
                .then(result => {
                  const photosToRemainPaths = photosToRemain ? photosToRemain.map(item => item.path) : [];
                  hook.result.photos = [...photosToRemainPaths, ...result];
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

    // TODO - check if leader belongs to team
    app.service('mergedproblems/remove/:problemId').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        remove: [
          authHooks.restrictToOwner({idField: 'id', ownerField: 'evaluatorId'}),
          (hook) => {
            // params.route is available when service is called from front-end
            // when service is called from back-end, params is available
            const {problemId} = hook.params.route;
            let position;

            return new Promise((resolve, reject) => {
              hook.app.service('problemrule').remove(
                null,
                {
                  query: {problemId: problemId},
                  transaction: hook.params.transaction
                },
              )
                .then(result => {
                  return hook.app.service('mergedproblems').remove(
                    null,
                    {
                      query: {toId: problemId},
                      transaction: hook.params.transaction
                    },
                  );
                })
                .then(result => {
                  return hook.app.service('problemphotos').remove(
                    null,
                    {
                      query: {problemId: problemId},
                      transaction: hook.params.transaction
                    },
                  );
                })
                .then(result => {
                  return hook.app.service('problems').remove(
                    problemId,
                    {transaction: hook.params.transaction},
                  )
                })
                .then(result => {
                  hook.result = result;
                  position = result.position;
                  return hook.app.service('mergedproblems/updatePositions').patch(
                    null,
                    {position: position - 1},
                    {
                      transaction: hook.params.transaction,
                    },
                  );
                })
                .then(result => {
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

    // TODO - check if leader of a team
    app.service('/mergedproblems/changeProblemPosition').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          transaction.start(),
        ],
        patch: [
          authHooks.restrictToRoles({
            roles: ['evaluator'],
            fieldName: 'role',
            idField: 'id',
          }),
          (hook) => {
            const {problemId, toPosition, wasDraggedUp} = hook.data;
            return new Promise((resolve, reject) => {
              hook.app.service('problems').patch(
                problemId,
                {position: toPosition},
                {transaction: hook.params.transaction},
              )
                .then(result => {
                  return hook.app.service('mergedproblems/updatePositions').patch(
                    null,
                    {position: 1, problemId, wasDraggedUp},
                    {
                      transaction: hook.params.transaction,
                    },
                  );
                })
                .then(result => {
                  hook.result = result;
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
        create: [() => {
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

    app.service('/mergedproblems/ratingsAverage').hooks({
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

    app.service('mergedproblems').hooks({
      before: {
        all: [
          disallow('external'),
        ]
      },
    });
  }
};
