const db = require('../database');

module.exports = function (app) {
  app.use('/evaluatorproblems/:teamId', {
    find(params) {
      console.log(params);
      const teamId = params.route.teamId;
      const userId = params.user.id;
      return db.select(
        'problem.id',
        'problem.description',
        'problem.location',
        'problem.photo',
        'problem.ratingsAverage',
        'problem.isCombined',
        'problem.teamId',
      )
        .from('problem')
        .leftJoin('evaluatorproblem', 'problem.id', '=', 'evaluatorproblem.problemId')
        .leftJoin('problemrule', 'problem.id', '=', 'problemrule.problemId')
        .where('evaluatorproblem.evaluatorId', userId)
        .andWhere('problem.teamId', teamId)
        .then(response => {
          return response;
        });
    },

    setup(app) {
      this.app = app;
    }
  });
};
