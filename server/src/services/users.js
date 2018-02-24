const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/users', knex({
    Model: db,
    name: 'user',
    id: 'id',
  }));
};
