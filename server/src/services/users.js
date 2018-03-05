const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/users', knex({
    Model: db,
    name: 'user',
    id: 'id',
  }));

  app.use('/users/:userId/teams', {
    find(params) {
      const userId = params.route.userId;
      return db.select(
        'team.id',
        'team.name',
        'team.systemName',
        'team.systemUrl',
        'team.systemContacts',
        'team.state',
        'team.leader_id',
        'user.email as leaderEmail',
        'user.name as leaderName',
        'team.heuristic_id'
      )
        .from('team', 'user')
        .leftJoin('user', 'user.id', '=', 'team.leader_id')
        .innerJoin('evaluatorteam', 'team.id', '=', 'evaluatorteam.team_id')
        .where('evaluatorteam.evaluator_id', userId)
        .then(response => {
          return response;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    setup(app) {
      this.app = app;
    }
  });
};
