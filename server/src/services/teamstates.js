const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/teamstates', knex({
    Model: db,
    name: 'teamstate',
    id: 'id',
  }));
};
