const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/evaluatorratings/:teamId', {
    find(params) {
      const teamId = params.route.teamId;
      const userId = params.user.id;

      return db.select(
        'rating.id',
        'rating.value',
        'rating.problemId',
        'rating.evaluatorId',
      )
        .from('rating')
        .leftJoin('problem', 'problem.id', '=', 'rating.problemId')
        .where('problem.teamId', teamId)
        .andWhere('rating.evaluatorId', userId)
        .andWhere('problem.isCombined', true)
        .then(response => {
          return response;
        });
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/ratings', knex({
    Model: db,
    name: 'rating',
    id: 'id',
  }));
};
