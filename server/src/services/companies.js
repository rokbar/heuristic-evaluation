const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/companies', knex({
    Model: db,
    name: 'company',
    id: 'id',
  }));
};
