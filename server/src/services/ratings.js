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

  app.use('/ratings/createOrUpdateBatch', {
    create(data, params) {
      const { ratings } = data;
      const evaluatorId = params.user.id;

      let questionMarks = "";
      let values = [];
      const rows = ratings.map((item) => ({ ...item, evaluatorId }));

      rows.forEach(function(value, index){
        questionMarks += "(";
        Object.keys(value).forEach(function(x){
          questionMarks += "?, ";
          values.push(value[x]);
        });
        questionMarks = questionMarks.substr(0, questionMarks.length - 2);
        questionMarks += "), ";
      });
      questionMarks = questionMarks.substr(0, questionMarks.length - 2); //cut off last unneeded comma and space

      return db.raw("INSERT INTO tablename (`value`, `evaluatorId`, `problemId`) VALUES " + questionMarks + " ON DUPLICATE KEY UPDATE value = VALUES(`value`)", values);
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
