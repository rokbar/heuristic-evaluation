const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/teams', knex({
    Model: db,
    name: 'team',
    id: 'id',
  }));
};
