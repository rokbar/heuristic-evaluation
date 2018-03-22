const usersService = require('./users');
const companiesService = require('./companies');
const teamsService = require('./teams');
const teamStatesService = require('./teamstates');
const evaluatorTeamService = require('./evaluatorteam');
const heuristicsService = require('./heuristics');
const problemsService = require('./problems');
const problemRuleService = require('./problemrule');
const evaluatorProblemService = require('./evaluatorproblem');
const problemPhotoService = require('./problemphoto');
const imageUploadService = require('./imageupload');

module.exports = function (app) {
  usersService(app);
  companiesService(app);
  teamsService(app);
  teamStatesService(app);
  evaluatorTeamService(app);
  heuristicsService(app);
  problemsService(app);
  problemRuleService(app);
  evaluatorProblemService(app);
  problemPhotoService(app);
  imageUploadService(app);
};
