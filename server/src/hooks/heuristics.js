const { disallow } = require('feathers-hooks-common');

const { canUserSeeHeuristics } = require('../validations/heuristics');
const validateHook = require('../utils/validationHookWrapper');

module.exports = function ({ auth }) {
  return function (app) {
    app.service('heuristics/all').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ]
      }
    });

    // TODO - add check whether user belongs to team
    app.service('heuristics/:heuristicId/rules').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
          validateHook(canUserSeeHeuristics, 'Jūs nepriklausote komandai, kurios euristikas bandote peržiūrėti.'),
        ],
      }
    });

    app.service('heuristics').hooks({
      before: {
        all: [
          disallow('external'),
        ]
      },
    });

    app.service('rules/createBatch').hooks({
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

    app.service('rules').hooks({
      before: {
        all: [
          disallow('external'),
        ]
      },
    });
  }
};
