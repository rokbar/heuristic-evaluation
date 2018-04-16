const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/ratings', knex({
    Model: db,
    name: 'rating',
    id: 'id',
  }));
};
