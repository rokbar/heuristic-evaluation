const knex = require('feathers-knex');

const db = require('../database');
const { teamState } = require('../utils/enums');

module.exports = function (app) {
  app.use('/teams', knex({
    Model: db,
    name: 'team',
    id: 'id',
  }));

  app.use('/teams/:teamId/users', {
    find(params) {
      const teamId = params.route.teamId;
      return db.select('user.id', 'name', 'email', 'lastLogon', 'companyId', 'systemAdminId', 'role').from('user')
        .innerJoin('evaluatorteam', 'user.id', '=', 'evaluatorteam.evaluatorId')
        .where('evaluatorteam.teamId', teamId)
        .then(response => {
          return response;
        });
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/teams/:teamId/startEvaluation', knex({
    Model: db,
    name: 'heuristic',
    id: 'id',
  }));

  app.use('/teams/:teamId/startGeneralization', {
    create(data, params) {
      const teamId = params.route.teamId;
      return new Promise((resolve, reject) => {
        app.service('teams').patch(
          teamId,
          { state: teamState.generalization },
        )
          .then(response => {
            return resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    setup(app) {
      this.app = app;
    }
  });
};
