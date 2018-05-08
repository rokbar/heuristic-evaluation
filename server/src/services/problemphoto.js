const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/problemphotos/createBatch', {
    create(data, params) {
      const host = params.headers.host;
      const proto = params.headers['x-forwarded-proto'] || 'http';

      return new Promise((resolve, reject) => {
        const { problemphotos, problemId } = data;
        const rowsToInsert = problemphotos.map((item) => {
          return { path: item.id || item, problemId }
        });

        db.transacting(params.transaction.trx)
          .insert([...rowsToInsert]).into('problemphoto')
          .then(response => {
            resolve(rowsToInsert.map(item => `${proto}://${host}/${item.path}`));
          })
          .catch();
      })
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/problemphotos', knex({
    Model: db,
    name: 'problemphoto',
    id: 'id',
  }));
};
