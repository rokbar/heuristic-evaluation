const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/evaluatorproblem/createBatch', {
    create(data, params) {
      return new Promise((resolve, reject) => {
        const { evaluatorProblems, problemId } = data;
        const rowsToInsert = evaluatorProblems.map((item) => {
          return { solution: item.solution, problemId, evaluatorId: item.evaluatorId }
        });

        db.transacting(params.transaction.trx)
          .insert([...rowsToInsert]).into('evaluatorproblem')
          .then(response => {
            const mergedSolutions = evaluatorProblems.map((item) => item.solution);
            resolve(mergedSolutions.join('\n'));
          })
          .catch();
      })
    },

    setup(app) {
      this.app = app;
    }
  });

  // TODO - adjust role access and limit REST options
  app.use('/evaluatorproblem', knex({
    Model: db,
    name: 'evaluatorproblem',
    id: 'id',
  }));
};
