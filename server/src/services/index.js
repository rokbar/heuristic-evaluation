const usersService = require('./users');

module.exports = function (app) {
  usersService(app);
};
