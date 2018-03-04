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
      return db('user')
        .join('evaluatorteam', 'user.id', '=', 'evaluatorteam.evaluator_id')
        .where('evaluatorteam.team_id', teamId)
        .then(response => {
          console.log(response);
          return response;
        });
    },

    setup(app) {
      this.app = app;
    }
  });
};
