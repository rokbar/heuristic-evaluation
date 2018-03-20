const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  // TODO - adjust role access and limit REST options
  app.use('/problemrule', knex({
    Model: db,
    name: 'problemrule',
    id: 'id',
  }));

  app.use('/problemrule/createBatch', {
    create(data, params) {
      return new Promise((resolve, reject) => {
        const { rules, problemId } = data;
        const rowsToInsert = rules && rules.map((item) => {
          return { ruleId: item, problemId }
        });

        db.transacting(params.transaction.trx)
          .insert([...rowsToInsert]).into('problemrule')
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
};
