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

  app.use('/users/:userId/editAccount', {
    create(data, params) {
      const userId = params.route.userId;
      const {email, name} = data;
      return new Promise((resolve, reject) => {
        app.service('users').patch(
          userId,
          {email, name},
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

  app.use('/users/:userId/changePassword', {
    create(data, params) {
      const userId = params.route.userId;
      return new Promise((resolve, reject) => {
        const {newPassword} = data;
        app.service('users').patch(
          userId,
          {password: newPassword}
        )
          .then(response => {
            return resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      })
    },

    setup(app) {
      this.app = app;
    }
  });
};
