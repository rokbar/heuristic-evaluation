const { disallow } = require('feathers-hooks-common');

module.exports = function () {
  return function (app) {
    app.service('heuristics').hooks({
      before: {
        all: [
          disallow('external'),
        ]
      },
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
