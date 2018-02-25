const usersService = require('./users');
const companiesService = require('./companies');
const teamsService = require('./teams');
const teamStatesService = require('./teamstates');

module.exports = function (app) {
  usersService(app);
  companiesService(app);
  teamsService(app);
  teamStatesService(app);
};
