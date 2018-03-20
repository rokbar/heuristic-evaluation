const { disallow } = require('feathers-hooks-common');

module.exports = function () {
  return function (app) {
    app.service('problemrule').hooks({
      before: {
        all: [
          disallow('external'),
        ]
      },
    });

    app.service('problemrule/createBatch').hooks({
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
  }
};
