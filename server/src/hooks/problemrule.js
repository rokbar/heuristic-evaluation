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
  }
};
