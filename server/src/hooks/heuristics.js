const { disallow } = require('feathers-hooks-common');

module.exports = function ({ auth }) {
  return function (app) {
    app.service('heuristics/all').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ]
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
