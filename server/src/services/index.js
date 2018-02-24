const usersService = require('./users');
const companiesService = require('./companies');

module.exports = function (app) {
  usersService(app);
  companiesService(app);
};
