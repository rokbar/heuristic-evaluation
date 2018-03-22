const { disallow } = require('feathers-hooks-common');

module.exports = function () {
  return function (app) {
    app.service('problemphotos/createBatch').hooks({
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

    app.service('problemphotos').hooks({
      before: {
        all: [
          disallow('external'),
        ],
      }
    })
  }
};
