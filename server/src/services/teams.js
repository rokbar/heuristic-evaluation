const knex = require('feathers-knex');

const db = require('../database');

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
};
