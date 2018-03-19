const usersService = require('./users');
const companiesService = require('./companies');
const teamsService = require('./teams');
const teamStatesService = require('./teamstates');
const evaluatorTeamService = require('./evaluatorteam');
const heuristicsService = require('./heuristics');
const problemsService = require('./problems');

module.exports = function (app) {
  usersService(app);
  companiesService(app);
  teamsService(app);
  teamStatesService(app);
  evaluatorTeamService(app);
  heuristicsService(app);
  problemsService(app);
};
