const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/evaluatorteam', knex({
    Model: db,
    name: 'evaluatorteam',
    id: 'id',
  }));
};
