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
        'team.leaderId',
        'user.email as leaderEmail',
        'user.name as leaderName',
        'team.heuristicId'
      )
        .from('team', 'user')
        .leftJoin('user', 'user.id', '=', 'team.leaderId')
        .innerJoin('evaluatorteam', 'team.id', '=', 'evaluatorteam.teamId')
        .where('evaluatorteam.evaluatorId', userId)
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
