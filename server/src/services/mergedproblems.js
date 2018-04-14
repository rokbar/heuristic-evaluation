const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/mergedProblems/createBatch', {
    create(data, params) {
      return new Promise((resolve, reject) => {
        const { problemsToCreate } = data;
        const rowsToInsert = problemsToCreate.map((item) => {
          const { description, location } = item;
          return { description, location };
        });

        db.transacting(params.transaction.trx)
          .insert([...rowsToInsert]).into('mergedproblem')
          .then(response => {
            resolve(response);
          })
          .catch();
      })
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/mergedproblems/edit/:problemId', knex({
    Model: db,
    name: 'evaluatorproblem',
    id: 'id',
  }));

  app.use('/mergedproblems/remove/:problemId', knex({
    Model: db,
    name: 'evaluatorproblem',
    id: 'id',
  }));

  // TODO - adjust role access and limit REST options
  app.use('/mergedproblems', knex({
    Model: db,
    name: 'mergedproblem',
    id: 'id',
  }));
};
