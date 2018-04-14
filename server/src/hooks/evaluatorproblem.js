const { disallow } = require('feathers-hooks-common');

module.exports = function () {
  return function (app) {
    app.service('evaluatorproblem/createBatch').hooks({
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

    app.service('evaluatorproblem').hooks({
      before: {
        all: [
          disallow('external'),
        ]
      },
    });
  }
};
