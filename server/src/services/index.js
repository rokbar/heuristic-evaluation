const usersService = require('./users');
const companiesService = require('./companies');
const teamsService = require('./teams');
const teamStatesService = require('./teamstates');
const evaluatorTeamService = require('./evaluatorteam');
const heuristicService = require('./heuristics');

module.exports = function (app) {
  usersService(app);
  companiesService(app);
  teamsService(app);
  teamStatesService(app);
  evaluatorTeamService(app);
  heuristicService(app);
};
