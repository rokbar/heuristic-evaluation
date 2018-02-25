const usersService = require('./users');
const companiesService = require('./companies');
const teamsService = require('./teams');

module.exports = function (app) {
  usersService(app);
  companiesService(app);
  teamsService(app);
};
